import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
};

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

test("Deve criar um pedido com 3 itens com cupom de desconto válido", async function () {
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

test("Deve criar um pedido com 3 itens com cupom de desconto expirado", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: "VALE10",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

test("Deve criar um pedido com 3 itens com cupom de desconto que não existe", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    coupon: "VALE30",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.total).toBe(6090);
});

test("Não deve criar um pedido com quantidade negativa de item", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [{ idProduct: 1, quantity: -1 }],
    coupon: "VALE30",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid quantity");
});

test("Não deve criar um pedido item duplicado", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 1, quantity: 1 },
    ],
    coupon: "VALE30",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Duplicated item");
});

test("Deve criar um pedido com 3 itens calculando o frete com preço mínimo", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    from: "86690000",
    to: "87005150",
    coupon: "VALE30",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.subtotal).toBe(6090);
  expect(output.freight).toBe(280);
  expect(output.total).toBe(6370);
});

test("Deve criar um pedido com 3 itens calculando o frete", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
    ],
    from: "86690000",
    to: "87005150",
    coupon: "VALE30",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(output.subtotal).toBe(6000);
  expect(output.freight).toBe(250);
  expect(output.total).toBe(6250);
});

test("Não deve criar um pedido se o produto tiver dimensões negativas", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [{ idProduct: 4, quantity: 1 }],
    coupon: "VALE10",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid dimensions");
});

test("Não deve criar um pedido se o produto tiver peso negativo", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [{ idProduct: 5, quantity: 1 }],
    coupon: "VALE10",
  };
  const response = await axios.post("http://localhost:3000/checkout", input);
  const output = response.data;
  expect(response.status).toBe(422);
  expect(output.message).toBe("Invalid weight");
});
