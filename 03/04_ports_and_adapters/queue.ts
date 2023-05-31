import { connect } from "amqplib";
import Checkout from "./Checkout";

async function main() {
  const connection = await connect("amqp://localhost");
  const channel = await connection.createChannel();
  await channel.assertQueue("checkout", { durable: true });
  channel.consume("checkout", async function (msg: any) {
    const input = JSON.parse(msg.content.toString());
    const checkout = new Checkout();
    try {
      const output = await checkout.execute(input);
      console.log(output);
    } catch (e: any) {
      console.log(e.message);
    }
  });
}

main();
