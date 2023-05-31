import axios from "axios";
import Checkout from "./Checkout";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import ProductRepository from "./ProductRepository";
import CouponRepository from "./CouponRepository";

axios.defaults.validateStatus = function () {
  return true;
};

let checkout: Checkout;

beforeEach(() => {
  const products: any = {
    1: {
      idProduct: 1,
      description: "A",
      price: 1000,
      width: 100,
      height: 30,
      length: 10,
      weight: 3,
    },
    2: {
      idProduct: 2,
      description: "B",
      price: 5000,
      width: 50,
      height: 50,
      length: 50,
      weight: 22,
    },
    3: {
      idProduct: 3,
      description: "C",
      price: 30,
      width: 10,
      height: 10,
      length: 10,
      weight: 0.9,
    },
    4: {
      idProduct: 4,
      description: "D",
      price: 30,
      width: -10,
      height: 10,
      length: 10,
      weight: 1,
    },
    5: {
      idProduct: 4,
      description: "E",
      price: 30,
      width: 10,
      height: 10,
      length: 10,
      weight: -1,
    },
  };
  const productRepository: ProductRepository = {
    async get(idProduct: number): Promise<any> {
      return products[idProduct];
    },
  };
  const coupons: any = {
    VALE10: {
      percentage: 10,
      expire_date: new Date("2022-01-01T00:00:00"),
    },
    VALE20: {
      percentage: 20,
      expire_date: new Date("2100-01-01T00:00:00"),
    },
  };
  const couponRepository: CouponRepository = {
    async get(code: string): Promise<any> {
      return coupons[code];
    },
  };
  checkout = new Checkout(productRepository, couponRepository);
});

test("Não deve criar pedido com cpf inválido", async function () {
  const input = {
    cpf: "123.123.123-12",
    items: [],
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid CPF")
  );
});

test("Deve criar um pedido com 3 itens", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [
      { idProduct: 1, quantity: 1 },
      { idProduct: 2, quantity: 1 },
      { idProduct: 3, quantity: 3 },
    ],
    email: "juninho@gmail.com",
  };
  const output = await checkout.execute(input);
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
  const output = await checkout.execute(input);
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
  const output = await checkout.execute(input);
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
  const output = await checkout.execute(input);
  expect(output.total).toBe(6090);
});

test("Não deve criar um pedido com quantidade negativa de item", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [{ idProduct: 1, quantity: -1 }],
    coupon: "VALE30",
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid quantity")
  );
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
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Duplicated item")
  );
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
  const output = await checkout.execute(input);
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
  const output = await checkout.execute(input);
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
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid dimensions")
  );
});

test("Não deve criar um pedido se o produto tiver peso negativo", async function () {
  const input = {
    cpf: "927.099.350-74",
    items: [{ idProduct: 5, quantity: 1 }],
    coupon: "VALE10",
  };
  expect(() => checkout.execute(input)).rejects.toThrow(
    new Error("Invalid weight")
  );
});
