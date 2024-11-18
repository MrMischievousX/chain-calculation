export const validateExpression = (expr: string) => {
  const validPattern = /^\d*x?([-+*/^]\d+x?)*$/i;
  return validPattern.test(expr);
};
