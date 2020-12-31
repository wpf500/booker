import 'reflect-metadata';
import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import Term from '../entities/Term';

export async function init() {
  const connectionOptions = await getConnectionOptions();
  const options = {
    ...connectionOptions,
    entities: [
      Term
    ],
    synchronise: true
  };

  return await createConnection(options);
}

export async function close() {
  await getConnection().close();
}
