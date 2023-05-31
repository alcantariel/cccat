import pgp from "pg-promise";
import CouponRepository from "./CouponRepository";

export default class CouponRepositoryDatabase implements CouponRepository {
  async get(code: string) {
    const connection = pgp()(
      "postgres://gabrielalcantara:postgres@localhost:5432/cccat"
    );
    const [couponData] = await connection.query(
      "select * from cccat.coupon where code = $1",
      [code]
    );
    await connection.$pool.end();
    return couponData;
  }
}
