import { GetServerSideProps } from "next";
import useSWR from 'swr';

import ChildrenSection from "@core/components/ChildrenSection";
import Layout from "@core/components/layout";
import RegisterSection from "@core/components/RegisterSection";

import Child from "@core/entities/Child";
import Register from "@core/entities/Register";
import Term from "@core/entities/Term";

import { fetchApi } from "@core/services/api";

interface TermProps {
  term: Term;
  register: Register[];
  otherChildren: Child[];
}

export const getServerSideProps: GetServerSideProps<TermProps> = async (
  context
) => {
  const data = await fetchApi('/get-term/' + context.query.id);
  return data ? {props: data} : {notFound: true};
};

export default function TermPage(props: TermProps) {
  const {data, mutate} = useSWR('/get-term/' + props.term.id, fetchApi);
  const {term, register, otherChildren}: TermProps = data || props;

  return (
    <Layout>
      <h1>{term.name}</h1>
      <p>Number of weeks: {term.weeks}</p>
      <hr />
      <h3>Children</h3>
      <ChildrenSection
        onChange={mutate}
        term={term}
        initialEnrolledChildren={register.map(e => e.child)}
        initialOtherChildren={otherChildren}
      />
      <hr />
      <h3>Finance register</h3>
      <RegisterSection term={term} initialRegister={register} />
    </Layout>
  );
}
