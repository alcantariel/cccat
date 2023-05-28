import express, { Request, Response } from "express";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

const app = express();
app.use(express.json());

app.post("/checkout", async function (req: Request, res: Response) {
  if (validateCpf(req.body.cpf)) {
    const connection = pgp()(
      "postgres://gabrielalcantara:postgres@localhost:5432/cccat"
    );
    const output = {
      total: 0,
    };
    if (req.body.items) {
      for (const item of req.body.items) {
        const [productData] = await connection.query(
          "select * from cccat.product where id_product = $1",
          [item.idProduct]
        );
        const price = parseFloat(productData.price);
        output.total += price * item.quantity;
      }
    }
    if (req.body.coupon) {
      const [couponData] = await connection.query(
        "select * from cccat.coupon where code = $1",
        [req.body.coupon]
      );
      output.total -= (output.total * parseFloat(couponData.percentage)) / 100;
    }
    res.json(output);
  } else {
    res.json({ message: "Invalid CPF" });
  }
});

app.listen(3000);
