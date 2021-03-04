import { FormEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";

import Register, { Session, SessionName } from "@core/entities/Register";
import Term from "@core/entities/Term";
import TermRate from "@core/entities/TermRate";

import { fetchApi } from "@core/services/api";

interface RegisterSectionProps {
  term: Term
  initialRegister: Register[];
}

interface SessionInputProps {
  rates: TermRate[];
  session?: Session;
  onChange<K extends keyof Session>(s: K, value: Session[K]): void;
}

function SessionInput({ rates, session, onChange }: SessionInputProps) {

  const weeks = session?.weeks || '';
  const rate = session?.rate || '';

  const termRate = rate ? rates.find(r => r.code === rate) : null;

  return (
    <InputGroup>
      <FormControl
        type="text"
        size="sm"
        value={weeks}
        onChange={evt => onChange("weeks", Number(evt.target.value))}
        style={{ backgroundColor: weeks ? "#eee" : "" }}
      />
      <FormControl
        type="text"
        size="sm"
        value={rate}
        onChange={evt => onChange("rate", evt.target.value)}
        style={{
          backgroundColor: rate === null || rate === "" ? "" :
            termRate?.color || (isNaN(Number(rate)) ? "red" : "#ccc")
        }}
      />
    </InputGroup>
  );
}

const sessionNames = [
  SessionName.Tue,
  SessionName.Wed,
  SessionName.ThuY,
  SessionName.ThuO,
];

export default function RegisterSection({term, initialRegister}: RegisterSectionProps) {
  const [register, setRegister] = useState(initialRegister);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!unsavedChanges) {
      setRegister(initialRegister);
    }
  }, [initialRegister])

  function setSessionValue<Key extends keyof Session>(entryNo: number, sessionName: SessionName) {
    return (sessionKey: Key, value: Session[Key]) => {
      let session = register[entryNo].sessions[sessionName] || {rate: '', weeks: 0};
      session[sessionKey] = value;

      register[entryNo].sessions[sessionName] = session;
      setRegister(register.map((a) => a));
      setUnsavedChanges(true);
    };
  }

  function calcExpectedIncome(sessions: Partial<Record<string, Session>>): string {
    const income = sessionNames
      .map((name) => {
        const session = sessions[name];
        return session ?
          session.weeks * (term.rates.find(r => r.code === session.rate)?.price || Number(session.rate)) :
          0;
      })
      .reduce((a, b) => a + b, 0);

    return isNaN(income) ? "?" : income.toLocaleString();
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsSaving(true);
    try {
      await fetchApi("/save-register", {register});
      setUnsavedChanges(false);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <Table striped>
        <thead>
          <tr>
            <th>Child</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu/y</th>
            <th>Thu/o</th>
            <th>Expected</th>
            <th>Actual</th>
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
                    rates={term.rates}
                    onChange={setSessionValue(entryNo, sessionName)}
                    session={entry.sessions[sessionName]}
                  />
                </td>
              ))}
              <td className="align-middle">
                £{calcExpectedIncome(entry.sessions)}
              </td>
              <td className="align-middle">-</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button variant="success" type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </Form>
  );
}
