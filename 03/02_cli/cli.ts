import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

type Input = {
  cpf: string;
  items: Array<{ idProduct: number; quantity: number }>;
  coupon?: string;
  from?: string;
  to?: string;
};

const input: Input = {
  cpf: "",
  items: [],
  coupon: "",
  from: "",
  to: "",
};

process.stdin.on("data", async function (data) {
  const command = data.toString().replace(/\n/g, "");
  if (command.startsWith("set-cpf")) {
    console.log("set-cpf");
    input.cpf = command.replace("set-cpf", "");
    console.log(input);
    return;
  }
  if (command.startsWith("add-item")) {
    console.log("add-item");
    const [idProduct, quantity] = command
      .replace("add-item", "")
      .trim()
      .split(" ");
    console.log({ idProduct, quantity });
    input.items.push({
      idProduct: parseInt(idProduct),
      quantity: parseInt(quantity),
    });
    console.log(input);
    return;
  }
  if (command.startsWith("checkout")) {
    console.log("checkout");
    const connection = pgp()(
      "postgres://gabrielalcantara:postgres@localhost:5432/cccat"
    );
    try {
      if (validateCpf(input.cpf)) {
        const output = {
          total: 0,
          subtotal: 0,
          freight: 0,
        };
        if (input.items) {
          for (const item of input.items) {
            if (item.quantity <= 0) throw new Error("Invalid quantity");
            if (
              input.items.filter((i: any) => i.idProduct === item.idProduct)
                .length > 1
            )
              throw new Error("Duplicated item");
            const [productData] = await connection.query(
              "select * from cccat.product where id_product = $1",
              [item.idProduct]
            );
            if (
              productData.width <= 0 ||
              productData.height <= 0 ||
              productData.length <= 0
            )
              throw new Error("Invalid dimensions");
            if (productData.weight <= 0) throw new Error("Invalid weight");
            const price = parseFloat(productData.price);
            output.subtotal += price * item.quantity;
            if (input.from && input.to) {
              const volume =
                (productData.width / 100) *
                (productData.height / 100) *
                (productData.length / 100);
              const density = parseFloat(productData.weight) / volume;
              let freight = volume * 1000 * (density / 100);
              freight = Math.max(10, freight);
              output.freight += freight * item.quantity;
            }
            output.total = output.subtotal;
          }
        }
        if (input.coupon) {
          const [couponData] = await connection.query(
            "select * from cccat.coupon where code = $1",
            [input.coupon]
          );
          const today = new Date();
          if (
            couponData &&
            couponData.expire_date.getTime() >= today.getTime()
          ) {
            output.total -=
              (output.total * parseFloat(couponData.percentage)) / 100;
          }
        }
        output.total += output.freight;
        console.log(`Total: ${output.total}`);
      } else {
        console.log("Invalid CPF");
      }
    } catch (e: any) {
      console.log(e.message);
    } finally {
      await connection.$pool.end();
    }
    return;
  }
  if (command.startsWith("quit")) {
    console.log("quit");
    process.exit();
  }
  console.log("Invalid command");
});
