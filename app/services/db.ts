import { NextApiRequest, NextApiResponse } from "next";
import "reflect-metadata";
import { createConnection, getConnection, getConnectionOptions } from "typeorm";

import Child from "@core/entities/Child";
import Register from "@core/entities/Register";
import Term from "@core/entities/Term";
import TermRate from "@core/entities/TermRate";

export async function open(): Promise<void> {
  const connectionOptions = await getConnectionOptions();
  const options = {
    ...connectionOptions,
    entities: [Child, Register, Term, TermRate],
    synchronize: true,
    logging: true,
  };

  try {
    await getConnection().close();
    await createConnection(options);
  } catch (err) {
    await createConnection(options);
  }
}

export const connect = (
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>
) => async (req: NextApiRequest, res: NextApiResponse) => {
  await open();
  await handler(req, res);
};

export const s = (o: any) => JSON.parse(JSON.stringify(o));
