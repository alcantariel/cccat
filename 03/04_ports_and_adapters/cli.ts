import Checkout from "./Checkout";

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
    input.items.push({
      idProduct: parseInt(idProduct),
      quantity: parseInt(quantity),
    });
    console.log(input);
    return;
  }
  if (command.startsWith("checkout")) {
    console.log("checkout");
    const checkout = new Checkout();
    try {
      const output = await checkout.execute(input);
      console.log(output);
    } catch (e: any) {
      console.log(e.message);
    }
    return;
  }
  if (command.startsWith("quit")) {
    console.log("quit");
    process.exit();
  }
  console.log("Invalid command");
});
