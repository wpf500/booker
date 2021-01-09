import { createQueryBuilder, getRepository, In, Not } from "typeorm";
import Register from "@core/entities/Register";
import * as db from "@core/services/db";

interface EnrollChildren {
  term: string;
  children: string[];
}

export default db.connect(async (req, res) => {
  const data = req.body as EnrollChildren;

  const insertResult = await createQueryBuilder()
    .insert()
    .into(Register)
    .values(
      data.children.map((child) => ({
        term: { id: data.term },
        child: { id: child },
      }))
    )
    .orIgnore()
    .execute();

  const deleteResult = await getRepository(Register).delete({
    term: { id: data.term },
    child: { id: Not(In(data.children)) },
  });

  res.send({ insertResult, deleteResult });
});
