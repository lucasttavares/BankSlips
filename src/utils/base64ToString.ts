function base64ToString(base64: string): string {
  return Buffer.from(base64, 'base64').toString();
}

export { base64ToString };
