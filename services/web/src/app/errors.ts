import { CoopsError } from "@coops/error";

interface FrontErrorOptions {
  pageError: boolean;
  withToast: boolean;
}
export class FrontError extends CoopsError {
  options: FrontErrorOptions;
  constructor(message: string, options?: Partial<FrontErrorOptions>) {
    super(message);
    this.options = {
      pageError: options?.pageError ?? false,
      withToast: options?.withToast ?? true,
    };
  }
}
