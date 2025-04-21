export function createTextEcho(input: string): { type: 'text'; text: string };
export function createTextEcho(input: string[]): { type: 'text'; text: string };
export function createTextEcho(input: string | string[]): { type: 'text'; text: string } {
  let result: string;

  if (Array.isArray(input)) {
    result = input.join('\n');
  } else {
    result = input ?? '';
  }

  return {
    type: 'text',
    text: result,
  };
}
