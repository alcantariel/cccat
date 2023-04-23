import FareCalculatorHandler from "./FareCalculatorHandler";
import Segment from "./Segment";

export default class SundayFareCalculatorHandler
  implements FareCalculatorHandler
{
  FARE: number = 2.9;

  constructor(readonly next?: FareCalculatorHandler) {}

  calculate(segment: Segment): number {
    if (!segment.isOvernight() && segment.isSunday()) {
      return segment.distance * this.FARE;
    }
    if (!this.next) {
      throw new Error("End of chain");
    }
    return this.next?.calculate(segment);
  }
}
