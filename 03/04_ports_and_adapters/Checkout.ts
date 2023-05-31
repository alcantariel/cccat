import { validateCpf } from "./validateCpf";
import ProductRepository from "./ProductRepository";
import CouponRepository from "./CouponRepository";
import ProductRepositoryDatabase from "./ProductRepositoryDatabase";
import CouponRepositoryDatabase from "./CouponRepositoryDatabase";
import EmailGateway from "./EmailGateway";
import EmailGatewayConsole from "./EmailGatewayConsole";

type Input = {
  cpf: string;
  items: Array<{ idProduct: number; quantity: number }>;
  coupon?: string;
  email?: string;
  from?: string;
  to?: string;
};

type Output = {
  total: number;
  subtotal: number;
  freight: number;
};

export default class Checkout {
  constructor(
    readonly productRepository: ProductRepository = new ProductRepositoryDatabase(),
    readonly couponRepository: CouponRepository = new CouponRepositoryDatabase(),
    readonly emailGateway: EmailGateway = new EmailGatewayConsole()
  ) {}

  async execute(input: Input): Promise<Output> {
    const output = {
      total: 0,
      subtotal: 0,
      freight: 0,
    };
    if (validateCpf(input.cpf)) {
      if (input.items) {
        for (const item of input.items) {
          if (item.quantity <= 0) throw new Error("Invalid quantity");
          if (
            input.items.filter((i: any) => i.idProduct === item.idProduct)
              .length > 1
          )
            throw new Error("Duplicated item");
          const productData = await this.productRepository.get(item.idProduct);
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
        const couponData = await this.couponRepository.get(input.coupon);
        const today = new Date();
        if (couponData && couponData.expire_date.getTime() >= today.getTime()) {
          output.total -=
            (output.total * parseFloat(couponData.percentage)) / 100;
        }
      }
      output.total += output.freight;
      if (input.email) {
        await this.emailGateway.send(
          "Purchase",
          "...",
          "test@gmail.com",
          input.email
        );
      }
      return output;
    } else {
      throw new Error("Invalid CPF");
    }
  }
}
