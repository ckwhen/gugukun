class BaseError extends Error {
  public cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = new.target.name;
    this.cause = cause;
  }
}

export class RepositoryError extends BaseError {}
export class ServiceError extends BaseError {}