//to create a standard error format using Node JS!
//standard class so we can copy paste it in any projects now YAY!
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something Went Wrong!",
    errors = [],
    stack = "",
  ) {
    super(message); //supper is the constructor of "Error" Class i.e the parent class
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      //if stack exist already
      this.stack = stack;
    } else Error.captureStackTrace(this, this.constructor); //else take from parent class!
  }
}

export { ApiError };
