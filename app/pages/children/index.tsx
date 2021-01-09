import { GetServerSideProps } from 'next';
import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getRepository } from 'typeorm';

import Layout from "@core/components/layout";
import Child from '@core/entities/Child';
import * as db from '@core/services/db';

interface ChildrenPageProps {
  children: Child[]
}

export const getServerSideProps: GetServerSideProps<ChildrenPageProps> = async context => {
  await db.open();
  const children = await getRepository(Child).find();
  return {
    props: db.s({children})
  }
}

export default function ChildrenPage({children}: ChildrenPageProps) {
  return (
    <Layout>
      <Row>
        <Col md="6">
          <h5>Add new child</h5>
          <Form>
            <Form.Group controlId="firstName">
              <Form.Label>First name</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control type="text" required />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save
            </Button>
          </Form>
        </Col>
      </Row>
      <h4 className="mt-4">All children</h4>
      <Table striped>
        <thead>
          <tr>
            <th>First name</th>
            <th>Last name</th>
          </tr>
        </thead>
        <tbody>
          {children.map(child => (
            <tr key={child.id}>
              <td>{child.firstName}</td>
              <td>{child.lastName}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Layout>
  )
}
