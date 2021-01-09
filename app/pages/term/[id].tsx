import { GetServerSideProps } from "next";
import { createQueryBuilder, getRepository, In, Not } from "typeorm";

import ChildrenSection from "@core/components/children-section";
import Layout from "@core/components/layout";
import RegisterSection from "@core/components/register-section";

import Child from "@core/entities/Child";
import Register from "@core/entities/Register";
import Term from "@core/entities/Term";

import * as db from "@core/services/db";

interface TermProps {
  term: Term;
  register: Register[];
  otherChildren: Child[];
}

export const getServerSideProps: GetServerSideProps<TermProps> = async (
  context
) => {
  await db.open();

  const term = await getRepository(Term).findOne(context.params.id as string);
  const register = await createQueryBuilder(Register, "r")
    .leftJoinAndSelect("r.child", "c")
    .where("r.term = :termId", { termId: term.id })
    .orderBy({
      "c.firstName": "ASC",
      "c.lastName": "ASC",
    })
    .getMany();
  const otherChildren = await getRepository(Child).find({
    where: { id: Not(In(register.map((e) => e.child.id))) },
  });

  return {
    props: db.s({ term, register, otherChildren }),
  };
};

export default function TermPage({ term, register, otherChildren }: TermProps) {
  return (
    <Layout>
      <h1>{term.name}</h1>
      <p>Number of weeks: {term.weeks}</p>
      <hr />
      <h3>Children</h3>
      <ChildrenSection
        termId={term.id}
        initialEnrolledChildren={register.map((e) => e.child)}
        initialOtherChildren={otherChildren}
      />
      <hr />
      <h3>Finance register</h3>
      <RegisterSection initialRegister={register} />
    </Layout>
  );
}
