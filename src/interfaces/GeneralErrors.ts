const DEFINED_ERROR_LIST = {
  TEST_ERROR: "TEST error message",
  PKCE_ERROR: "Generate PKCE failed.",
  SESSION_DELETE_ERROR: "Delete session failed.",
  FAIL_SET_LIFECYCLE: "Faile to set bucket life cycle",
  FAIL_GET_OBJECT: "Faile to get Object",
  AUTHENTICATION_FAILED: "You don't have permission to run this API.",
};

export class DefinedError extends Error {
  public message: string;
  public extentions: { code: string; exception: { stacktrace: string[] } };

  constructor(code: string, error?: Error) {
    super(code);
    if (DEFINED_ERROR_LIST[code]) {
      this.message = `${DEFINED_ERROR_LIST[code]}`;
      this.extentions = {
        code: code,
        exception: {
          stacktrace: error ? error.stack.split("\n") : undefined,
        },
      };
    } else {
      this.message = `Undefined Error, please check error list`;
      this.extentions = {
        code: undefined,
        exception: {
          stacktrace: error ? error.stack.split("\n") : undefined,
        },
      };
    }
  }
}
