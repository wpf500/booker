import { FormEvent, RefObject, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Child from "@core/entities/Child";
import Term from "@core/entities/Term";

import { fetchApi } from "@core/services/api";

interface ChildrenSectionProps {
  term: Term;
  initialEnrolledChildren: Child[];
  initialOtherChildren: Child[];
  onChange(): void
}

function sortByName(a: Child, b: Child) {
  return a.firstName + a.lastName < b.firstName + b.lastName ? -1 : 1;
}

export default function ChildrenSection({
  term,
  initialEnrolledChildren,
  initialOtherChildren,
  onChange
}: ChildrenSectionProps) {
  const [enrolledChildren, setEnrolledChildren] = useState(
    initialEnrolledChildren.map((a) => a).sort(sortByName)
  );
  const [otherChildren, setOtherChildren] = useState(
    initialOtherChildren.map((a) => a).sort(sortByName)
  );
  const [isSaving, setIsSaving] = useState(false);

  const enrolledChildrenRef = useRef<HTMLSelectElement>(null);
  const otherChildrenRef = useRef<HTMLSelectElement>(null);

  function moveTo(
    fromRef: RefObject<HTMLSelectElement>,
    fromList: Child[],
    toList: Child[]
  ) {
    const selectedChildrenIds = Array.from(fromRef.current!.selectedOptions).map(
      (o) => o.value
    );
    const selectedChildren = selectedChildrenIds.map((id) =>
      fromList.find((c) => c.id === id) as Child
    );
    const newFromList = fromList
      .filter((c) => selectedChildrenIds.indexOf(c.id) === -1)
      .sort(sortByName);
    const newToList = [...toList, ...selectedChildren].sort(sortByName);

    return [newFromList, newToList];
  }

  function moveToOther() {
    const [newEnrolledChildren, newOtherChildren] = moveTo(
      enrolledChildrenRef,
      enrolledChildren,
      otherChildren
    );
    setEnrolledChildren(newEnrolledChildren);
    setOtherChildren(newOtherChildren);
  }

  function moveToEnrolled() {
    const [newOtherChildren, newEnrolledChildren] = moveTo(
      otherChildrenRef,
      otherChildren,
      enrolledChildren
    );
    setEnrolledChildren(newEnrolledChildren);
    setOtherChildren(newOtherChildren);
  }

  async function handleSubmit(evt: FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setIsSaving(true);
    try {
      await fetchApi("/enroll-children", {
        term: term.id,
        children: enrolledChildren.map((c) => c.id),
      });
      onChange();
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Group controlId="enrolledChildren">
            <Form.Label>
              Enrolled children ({enrolledChildren.length})
            </Form.Label>
            <Form.Control
              ref={enrolledChildrenRef}
              as="select"
              name="enrolledChildren"
              multiple
              htmlSize={10}
            >
              {enrolledChildren.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
        <Col xs="auto" className="text-center align-self-center">
          <Button type="button" className="mb-1" onClick={moveToEnrolled}>
            ←
          </Button>
          <br />
          <Button type="button" onClick={moveToOther}>
            →
          </Button>
        </Col>
        <Col>
          <Form.Group controlId="otherChildren">
            <Form.Label>Other children ({otherChildren.length})</Form.Label>
            <Form.Control
              ref={otherChildrenRef}
              as="select"
              multiple
              htmlSize={10}
            >
              {otherChildren.map((child) => (
                <option key={child.id} value={child.id}>
                  {child.firstName} {child.lastName}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
      <Button variant="success" type="submit" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save"}
      </Button>
    </Form>
  );
}
