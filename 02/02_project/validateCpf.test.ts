import { validateCpf } from "./validateCpf";

test.each(["407.302.170-27", "684.053.160-00", "746.971.314-01"])(
  "Deve testar um CPF válido %s",
  function (cpf: string) {
    const isValid = validateCpf(cpf);
    expect(isValid).toBeTruthy();
  }
);

test.each(["406.302.170-27", "406.302.170", "406.302"])(
  "Deve testar um CPF inválido %s",
  function (cpf: string) {
    const isValid = validateCpf(cpf);
    expect(isValid).toBeFalsy();
  }
);

test.each(["111.111.111-11", "222.222.222-22", "333.333.333-33"])(
  "Deve testar um CPF com dígitos iguais %s",
  function (cpf: string) {
    const isValid = validateCpf(cpf);
    expect(isValid).toBeFalsy();
  }
);
