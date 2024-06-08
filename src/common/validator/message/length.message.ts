import { ValidationArguments } from 'class-validator';

export const lenghthValidationMessage = (args: ValidationArguments) => {
  const constraints = args.constraints;
  if (constraints.length === 2) {
    return `${args.property}은 ${constraints[0]}~${constraints[1]}자 사이로 입력해야합니다. `;
  }

  return `${args.property}은 ${constraints[0]}자 이하여야합니다. `;
};
