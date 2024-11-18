export const validateExpression = (expr: string) => {
  const validPattern = /^\d*x?([-+*/^]\d+x?)*$/i;
  return validPattern.test(expr);
};

const parsePowerExpression = (expression: string) => {
  const numberString = expression.split('^');
  const numbers = numberString.map((numStr) => +numStr);
  const initialValue = numbers[0];
  return numbers.slice(1).reduce((acc, no) => Math.pow(acc, no), initialValue);
};

const parseMultiplyExpression = (expression: string) => {
  const numberString = expression.split('*');
  const numbers = numberString.map((numStr) => parsePowerExpression(numStr));
  const initialValue = numbers[0];
  return numbers.slice(1).reduce((acc, no) => acc * no, initialValue);
};

const parseDivisionExpression = (expression: string) => {
  const numberString = expression.split('/');
  const numbers = numberString.map((numStr) => parseMultiplyExpression(numStr));
  const initialValue = numbers[0];
  return numbers.slice(1).reduce((acc, no) => acc / no, initialValue);
};

const parseSubtractionExpression = (expression: string) => {
  const numberString = expression.split('-');
  const numbers = numberString.map((numStr) => parseDivisionExpression(numStr));
  const initialValue = numbers[0];
  return numbers.slice(1).reduce((acc, no) => acc - no, initialValue);
};

const parseAdditionExpression = (expression: string) => {
  const numberString = expression.split('+');
  const numbers = numberString.map((numStr) =>
    parseSubtractionExpression(numStr)
  );
  const initialValue = numbers[0];
  return numbers.slice(1).reduce((acc, no) => acc + no, initialValue);
};

export const calculateFunction = (input: string, expression: string) => {
  const sanitizedExpr = expression
    .toLowerCase()
    .replace(/(\d*)x/g, (_, coeff) => (coeff ? `${coeff}*${input}` : input));

  try {
    return parseAdditionExpression(sanitizedExpr);
  } catch (error) {
    return NaN;
  }
};
