import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import { Session } from "@core/entities/Register";
import TermRate from "@core/entities/TermRate";

interface SessionInputProps {
  rates: TermRate[];
  session?: Session;
  onChange<K extends keyof Session>(s: K, value: Session[K]): void;
}

export default function SessionInput({ rates, session, onChange }: SessionInputProps) {

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
