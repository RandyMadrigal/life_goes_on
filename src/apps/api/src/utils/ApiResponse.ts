export class ApiResponse<T> {
  public readonly success: boolean;
  public readonly message: string;
  public readonly data: T | null;

  private constructor(success: boolean, message: string, data: T | null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static ok<T>(message: string, data: T): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  static created<T>(message: string, data: T): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }
}
