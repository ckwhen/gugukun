import { isArray } from './check.js';

export function createTextEcho(input = '') {
  let result = input;

  if (isArray(input)) {
    result = input.join('\n');
  }

  return {
    type: 'text',
    text: result,
  };
}