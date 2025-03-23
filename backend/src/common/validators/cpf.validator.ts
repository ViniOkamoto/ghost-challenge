import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsCpf(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isCpf',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          const cpf = value.replace(/[^\d]+/g, '');

          if (cpf.length !== 11) return false;

          // Verifica CPFs com dígitos repetidos (ex: 11111111111)
          if (/^(\d)\1{10}$/.test(cpf)) return false;

          // Algoritmo de validação do primeiro dígito verificador
          let sum = 0;
          for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
          }

          let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
          if (result !== parseInt(cpf.charAt(9))) return false;

          // Algoritmo de validação do segundo dígito verificador
          sum = 0;
          for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
          }

          result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
          if (result !== parseInt(cpf.charAt(10))) return false;

          return true;
        },
        defaultMessage() {
          return 'CPF inválido';
        },
      },
    });
  };
}
