import { ChangeEvent, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";
import Table from "react-bootstrap/Table";

import Register, { Session, SessionName } from "../entities/Register";

interface RegisterSectionProps {
  initialRegister: Register[]
}

interface SessionInputProps {
  session: Session,
  onChange: (s: keyof Session) => (evt: ChangeEvent<HTMLInputElement>) => void
}

function SessionInput({session, onChange}: SessionInputProps) {
  const colors = {
    S: '#6d9eeb',
    C: '#b4a7d6',
    E: '#a4c2f4'
  };

  const weeks = session && session.weeks || '';
  const rate = session && session.rate || '';

  return (
    <InputGroup>
      <FormControl type="text" size="sm" value={weeks}
        onChange={onChange('weeks')} style={{backgroundColor: weeks ? '#eee' : ''}} />
      <FormControl type="text" size="sm" value={rate}
        onChange={onChange('rate')} style={{backgroundColor: rate ? colors[rate] || (isNaN(Number(rate)) ? 'red' : '#ccc') : ''}} />
    </InputGroup>
  );
}

const sessionNames = [SessionName.Tue, SessionName.Wed, SessionName.ThuY, SessionName.ThuO];

export default function RegisterSection({initialRegister}: RegisterSectionProps) {
  const [register, setRegister] = useState(initialRegister);

  const rates = {
    S: 25,
    E: 22,
    C: 20
  };

  const setSessionValue = (entryNo: number, sessionName: SessionName) => (sessionKey: keyof Session) => (evt: ChangeEvent<HTMLInputElement>) => {
    if (!register[entryNo].sessions[sessionName]) {
      register[entryNo].sessions[sessionName] = {weeks: 0, rate: ''};
    }
    register[entryNo].sessions[sessionName][sessionKey] = sessionKey === 'weeks' ? Number(evt.target.value) : evt.target.value;
    setRegister(register.map(a => a));
  }

  function calcExpectedIncome(sessions: Record<string, Session>): string {
    const income = sessionNames.map(name => {
      const session = sessions[name];
      return session && session.rate && session.weeks ?
        (rates[session.rate] || session.rate) * session.weeks : 0;
    }).reduce((a, b) => a + b, 0);

    return isNaN(income) ? '?' : income.toLocaleString();
  }

  return (
    <Form>
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
              <td className="align-middle">{entry.child.firstName} {entry.child.lastName}</td>
              {sessionNames.map(sessionName => (
                <td key={sessionName} width={120}>
                  <SessionInput onChange={setSessionValue(entryNo, sessionName)} session={entry.sessions[sessionName]} />
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
      <Button variant="success">Save</Button>
    </Form>
  )
}
