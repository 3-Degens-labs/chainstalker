function isErrorMessageObject(value: unknown): value is { message: string } {
  return Boolean(value && "message" in (value as { message?: string }));
}

function fromMessageObject(value: { message: string }) {
  const error = new Error(value.message);
  return error;
}

export function getError(value: Error | unknown): Error {
  return value instanceof Error
    ? value
    : isErrorMessageObject(value)
    ? fromMessageObject(value)
    : new Error("Unknown Error");
}
