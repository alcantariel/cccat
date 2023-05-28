import axios from "axios";

test("Não deve criar pedido com cpf inválido", async function () {
  const input = {
    cpf: "123.123.123-12",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.message).toBe("Invalid CPF");
});

test("Deve criar um pedido com 3 itens", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

test("Deve criar um pedido com 3 itens com cupom de desconto", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: "VALE20",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.total).toBe(4872);
});
