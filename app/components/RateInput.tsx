import Col from "react-bootstrap/Col";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import TermRate from "@core/entities/TermRate";

interface RateInputProps {
  rate: TermRate
  onChange<K extends keyof TermRate>(key: K, value: TermRate[K]): void
}

export default function RateInput({rate, onChange}: RateInputProps) {
  return (
    <Col sm={4} md={2}>
      <InputGroup>
        <FormControl
          type="text"
          size="sm"
          value={rate.code}
          onChange={evt => onChange('code', evt.target.value)}
          maxLength={2}
        />
        <FormControl
          type="number"
          size="sm"
          onChange={evt => onChange('price', Number(evt.target.value))}
          value={rate.price}
        />
        <FormControl
          type="color"
          size="sm"
          onChange={evt => onChange('color', evt.target.value)}
          value={rate.color}
        />
      </InputGroup>
    </Col>
  );
}
