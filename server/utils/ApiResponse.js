export class ApiResponse {
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode;
    this.success = statusCode >= 200 && statusCode < 300;
    this.message = message;
    this.data = data;
  }

  static success(res, data = {}, message = 'Operation successful', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'An error occurred', statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    const responsePayload = {
      success: false,
      message,
      error: {
        code,
        ...(details && { details })
      }
    };
    return res.status(statusCode).json(responsePayload);
  }
}
