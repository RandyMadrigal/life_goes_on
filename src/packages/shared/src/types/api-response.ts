/** Standard envelope every API JSON response should conform to. */
export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T | null;
}
