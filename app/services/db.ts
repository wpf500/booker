import { NextApiRequest, NextApiResponse } from 'next';
import 'reflect-metadata';
import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import Child from '../entities/Child';
import Register from '../entities/Register';
import Term from '../entities/Term';

export async function open(): Promise<void> {
  const connectionOptions = await getConnectionOptions();
  const options = {
    ...connectionOptions,
    entities: [
      Child,
      Register,
      Term
    ],
    synchronize: true,
    logging: true
  };

  try {
    await getConnection().close();
    await createConnection(options);
  } catch (err) {
    await createConnection(options);
  }
}

export const connect = (handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>) => async (req: NextApiRequest, res: NextApiResponse) => {
  await open();
  await handler(req, res);
}


export const s = o => JSON.parse(JSON.stringify(o));
