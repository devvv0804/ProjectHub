//basically we use this to make out response standard!
//op actually!
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; //above 400 is usually treated as an error!
  }
}

export { ApiResponse };
