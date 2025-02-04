class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Maintain proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ErrorResponse);
    }

    // Needed for instanceof checks to work properly with ES6 classes
    Object.setPrototypeOf(this, ErrorResponse.prototype);
  }
}

export default ErrorResponse;
