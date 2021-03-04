import { createQueryBuilder, getRepository, In, Not } from "typeorm";
import Register from "@core/entities/Register";
import * as db from "@core/services/db";
import Child from "@core/entities/Child";
import Term from "@core/entities/Term";

export default db.connect(async (req, res) => {
  const term = await getRepository(Term).findOne({
    where: {id: req.query.id as string},
    relations: ['rates']
  });

  if (term) {
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
    res.send({term, register, otherChildren});
  } else {
    res.status(404).send({error: 'Not found'});
  }
});
