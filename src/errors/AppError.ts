export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;

    // 🚀 Add this line to fix 'instanceof' in TypeScript/ES5+
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// export class AppError extends Error {
//   statusCode: number;

//   constructor(statusCode: number, message: string) {
//     super(message);
//     this.statusCode = statusCode;
//   }
// }
