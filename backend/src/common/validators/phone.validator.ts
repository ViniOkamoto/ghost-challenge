import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isPhoneNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;

          // Remove any non-digit characters
          const phone = value.replace(/[^\d]+/g, '');

          // Check if the phone number has a valid length (10 or 11 digits)
          if (phone.length !== 10 && phone.length !== 11) return false;

          // Area code should be between 11 and 99
          const areaCode = parseInt(phone.substring(0, 2));
          if (areaCode < 11 || areaCode > 99) return false;

          return true;
        },
        defaultMessage() {
          return 'Número de telefone inválido';
        },
      },
    });
  };
}
