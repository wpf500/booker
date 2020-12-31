import { NextApiRequest, NextApiResponse } from 'next';
import { getRepository } from 'typeorm';
import Term from '../../entities/Term';

export default async (_: NextApiRequest, res: NextApiResponse) => {
  const terms = await getRepository(Term).find();
  res.status(200).send({'error': false, terms});
}
