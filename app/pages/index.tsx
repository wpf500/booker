import { GetServerSideProps } from "next";
import Link from 'next/link';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { getRepository } from "typeorm";

import Layout from "@core/components/layout";
import Term from "@core/entities/Term";

import * as db from '@core/services/db';

interface HomePageProps {
  terms: Term[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async context => {
  await db.open();
  const terms = await getRepository(Term).find();
  return {
    props: db.s({terms})
  }
}

export default function HomePage({terms}: HomePageProps) {
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
