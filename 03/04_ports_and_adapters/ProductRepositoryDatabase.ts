import pgp from "pg-promise";
import ProductRepository from "./ProductRepository";

export default class ProductRepositoryDatabase implements ProductRepository {
  async get(idProduct: number) {
    const connection = pgp()(
      "postgres://gabrielalcantara:postgres@localhost:5432/cccat"
    );
    const [productData] = await connection.query(
      "select * from cccat.product where id_product = $1",
      [idProduct]
    );
    await connection.$pool.end();
    return productData;
  }
}
