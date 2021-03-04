import { FormEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";

import RateInput from "@core/components/RateInput";
import SessionInput from "@core/components/SessionInput";

import Register, { Session, SessionName } from "@core/entities/Register";
import Term from "@core/entities/Term";
import TermRate from "@core/entities/TermRate";

import { fetchApi } from "@core/services/api";

interface RegisterSectionProps {
  term: Term
  initialRegister: Register[];
}

const sessionNames = [
  SessionName.Tue,
  SessionName.Wed,
  SessionName.ThuY,
  SessionName.ThuO,
];

function showAmount(amount: number) {
  return isNaN(amount) ? '?' : '£' + amount.toLocaleString();
}

export default function RegisterSection({term, initialRegister}: RegisterSectionProps) {
  const [register, setRegister] = useState(initialRegister);
  const [rates, setRates] = useState(term.rates);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!unsavedChanges) {
      setRegister(initialRegister);
    }
  }, [initialRegister]);

  function setSessionValue<Key extends keyof Session>(entryNo: number, sessionName: SessionName) {
    return (sessionKey: Key, value: Session[Key]) => {
      let session = register[entryNo].sessions[sessionName] || {rate: '', weeks: 0};
      session[sessionKey] = value;

      register[entryNo].sessions[sessionName] = session;
      setRegister(register.map((a) => a));
      setUnsavedChanges(true);
    };
  }

  function setRateValue<K extends keyof TermRate>(rateNo: number) {
    return (key: K, value: TermRate[K]) => {
      rates[rateNo]![key] = value;
      setRates(rates.map(a => a));
      setUnsavedChanges(true);
    };
  }

  function addNewRate() {
    rates.push({term, price: 0, code: '', color: '#dddddd'});
    setRates(rates.map(a => a));
    setUnsavedChanges(true);
  }

  function calcIncome({sessions}: Register): number {
    return sessionNames
      .map((name) => {
        const session = sessions[name];
        return session ?
          session.weeks * (rates.find(r => r.code === session.rate)?.price || Number(session.rate)) :
          0;
      })
      .reduce((a, b) => a + b, 0);
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsSaving(true);
    try {
      await fetchApi("/save-register", {register, rates});
      setUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  }

  const totalIncome = register.map(calcIncome).reduce((a, b) => a + b, 0);

  return (
    <div>
      <h5>Rates</h5>
      <Form.Group>
        <Form.Row>
          {rates.map((rate, rateNo) => (
            <RateInput key={rateNo} rate={rate} onChange={setRateValue(rateNo)} />
          ))}
          <Col>
            <Button size="sm" variant="primary" onClick={addNewRate}>Add rate</Button>
          </Col>
        </Form.Row>
      </Form.Group>

      <p>Total expected income: {showAmount(totalIncome)}</p>

      <Form method="POST" onSubmit={handleSubmit}>
        <Table striped borderless size="sm">
          <thead>
            <tr>
              <th>Child</th>
              <th>Tue</th>
              <th>Wed</th>
              <th>Thu/y</th>
              <th>Thu/o</th>
              <th className="text-right">Expected</th>
              <th className="text-right">Actual</th>
            </tr>
          </thead>
          <tbody>
            {register.map((entry, entryNo) => (
              <tr key={entry.id}>
                <td className="align-middle">
                  {entry.child.firstName} {entry.child.lastName}
                </td>
                {sessionNames.map((sessionName) => (
                  <td key={sessionName} width={120}>
                    <SessionInput
                      rates={rates}
                      onChange={setSessionValue(entryNo, sessionName)}
                      session={entry.sessions[sessionName]}
                    />
                  </td>
                ))}
                <td className="align-middle text-right" width={90}>
                  {showAmount(calcIncome(entry))}
                </td>
                <td className="align-middle text-right" width={90}>-</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <Button variant="success" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </Form>
    </div>
  );
}
