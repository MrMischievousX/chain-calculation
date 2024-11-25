import { Func } from '../types';

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

const constructSvg = (fromRect: DOMRect, toRect: DOMRect): SVGPathElement => {
  const fromX = fromRect.left + fromRect.width / 2;
  const fromY = fromRect.top + fromRect.height / 2;
  const toX = toRect.left + toRect.width / 2;
  const toY = toRect.top + toRect.height / 2;

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute(
    'd',
    `
     M ${fromX} ${fromY} 
     C ${fromX + 10} ${fromY - 10}, ${toX - 10} ${toY + 10}, ${toX} ${toY}
     `
  );
  path.setAttribute('stroke', '#0066FF4F');
  path.setAttribute('fill', 'none');
  path.setAttribute('stroke-width', '6');
  return path;
};

export const drawConnections = (
  svg: SVGSVGElement | null,
  functions: Func[]
) => {
  if (!svg) return;

  svg.innerHTML = '';

  const fromEl = document.getElementById(`start-0`);
  const toEl = document.getElementById(`input-1`);

  if (!fromEl || !toEl) return;

  const fromRect = fromEl?.getBoundingClientRect();
  const toRect = toEl?.getBoundingClientRect();

  const path = constructSvg(fromRect, toRect);

  svg.appendChild(path);

  functions.forEach(({ id, nextId }) => {
    if (nextId === -1) {
      return
    }

    const fromEl = document.getElementById(`output-${id}`);
    if (!fromEl) return;

    const toEl = document.getElementById(`input-${nextId}`) ? document.getElementById(`input-${nextId}`)
      : document.getElementById(`end-0`);
    if (!toEl) return;

    const fromRect = fromEl?.getBoundingClientRect();
    const toRect = toEl?.getBoundingClientRect();

    const path = constructSvg(fromRect, toRect);

    svg.appendChild(path);
  });
};
