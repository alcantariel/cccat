export default class Segment {
  OVERNIGHT_START = 22;
  OVERNIGHT_END = 6;

  constructor(readonly distance: number, readonly date: Date) {
    if (!this.isValidDistance(distance)) throw new Error("Invalid Distance");
  }

  isValidDistance(distance: number) {
    return distance > 0;
  }

  isOvernight() {
    return (
      this.date.getHours() >= this.OVERNIGHT_START ||
      this.date.getHours() <= this.OVERNIGHT_END
    );
  }

  isSunday() {
    return this.date.getDay() === 0;
  }
}
