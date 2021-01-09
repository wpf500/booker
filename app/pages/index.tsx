import { GetServerSideProps } from "next";
import Link from 'next/link';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getRepository } from "typeorm";

import Layout from "@core/components/layout";
import Child from "@core/entities/Child";
import Term from "@core/entities/Term";

import * as db from '@core/services/db';

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
      <h1>Overview</h1>
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
    </Layout>
  )
}
