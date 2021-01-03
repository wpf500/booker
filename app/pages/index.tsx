import { GetServerSideProps } from "next";
import Link from 'next/link';
import Table from "react-bootstrap/Table";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getRepository } from "typeorm";

import Layout from "../components/layout";
import Child from "../entities/Child";
import Term from "../entities/Term";

import * as db from '../services/db';

interface HomePageProps {
  terms: Term[]
  children: Child[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async context => {
  await db.open();
  const terms = await getRepository(Term).find();
  const children = await getRepository(Child).find();
  return {
    props: db.s({terms, children})
  }
}

export default function HomePage({children, terms}: HomePageProps) {
  return (
    <Layout home>
      <h1>Booker</h1>
      <h2>Overview</h2>
      <hr />
      <h3>Terms</h3>
      <Row>
        <Col xs="auto">
          Income
        </Col>
        {terms.map(term => (
          <Col key={term.id}>
            <Link href={'/term/' + term.id}>
              <a>{term.name}</a>
            </Link>
          </Col>
        ))}
      </Row>
      <hr />
      <h3>Children</h3>
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
      <h4 className="mt-4">Existing children</h4>
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
