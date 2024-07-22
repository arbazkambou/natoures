export function AppError(errorMessage, errorStatusCode, err) {
  const error = new Error(errorMessage);
  error.status = `${errorStatusCode}`.startsWith("4") ? "fail" : "error";
  error.statusCode = errorStatusCode;
  error.isOperational = true;
  error.completeError = err;
  return error;
}
