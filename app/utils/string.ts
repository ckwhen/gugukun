export function createTextEcho(input: any): { type: 'text'; text: string } {
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
