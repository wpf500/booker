import Register from "@core/entities/Register";
import * as db from "@core/services/db";
import { getRepository } from "typeorm";

interface SaveRegister {
  register: Register[]
}

export default db.connect(async (req, res) => {
  const data = req.body as SaveRegister;

  for (const register of data.register) {
    await getRepository(Register).update(register.id, register);
  }

  res.send({ status: 'Done'});
});
