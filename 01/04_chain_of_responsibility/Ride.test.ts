import NormalFareCalculatorHandler from "./NormalFareCalculatorHandler";
import OvernightFareCalculatorHandler from "./OvernightFareCalculatorHandler";
import OvernightSundayFareCalculatorHandler from "./OvernightSundayFareCalculatorHandler";
import Ride from "./Ride";
import SundayFareCalculatorHandler from "./SundayFareCalculatorHandler";

let ride: Ride;

beforeEach(function () {
  const overnightSundayFareCalculatorHandler =
    new OvernightSundayFareCalculatorHandler();
  const overnightFareCalculatorHandler = new OvernightFareCalculatorHandler(
    overnightSundayFareCalculatorHandler
  );
  const sundayFareCalculatorHandler = new SundayFareCalculatorHandler(
    overnightFareCalculatorHandler
  );
  const normalFareCalculatorHandler = new NormalFareCalculatorHandler(
    sundayFareCalculatorHandler
  );
  ride = new Ride(normalFareCalculatorHandler);
});

test("Deve calcular a tarifa de uma corrida em um dia normal", function () {
  ride.addSegment(10, new Date("2021-03-01T10:00:00"));
  const fare = ride.calculateFare();
  expect(fare).toBe(21);
});

test("Deve calcular a tarifa de uma corrida de noite", function () {
  ride.addSegment(10, new Date("2021-03-01T23:00:00"));
  const fare = ride.calculateFare();
  expect(fare).toBe(39);
});

test("Deve calcular a tarifa de uma corrida domingo", function () {
  ride.addSegment(10, new Date("2021-03-07T10:00:00"));
  const fare = ride.calculateFare();
  expect(fare).toBe(29);
});

test("Deve calcular a tarifa de uma corrida domingo de noite", function () {
  ride.addSegment(10, new Date("2021-03-07T23:00:00"));
  const fare = ride.calculateFare();
  expect(fare).toBe(50);
});

test("Deve retornar -1 se a distância for inválida", function () {
  expect(() => ride.addSegment(-10, new Date("2021-03-07T23:00:00"))).toThrow(
    new Error("Invalid Distance")
  );
});

test("Deve calcular a tarifa de uma corrida mínima", function () {
  ride.addSegment(2, new Date("2021-03-01T10:00:00"));
  const fare = ride.calculateFare();
  expect(fare).toBe(10);
});

test("Deve calcular a tarifa de duas corridas em um dia normal", function () {
  ride.addSegment(10, new Date("2021-03-01T10:00:00"));
  ride.addSegment(10, new Date("2021-03-01T10:30:00"));

  const fare = ride.calculateFare();
  expect(fare).toBe(42);
});
