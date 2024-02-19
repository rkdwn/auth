import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { errors } from "oidc-provider";
import { DefinedError } from "../interfaces";

@Catch()
export class OIDCExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof errors.SessionNotFound) {
      response.render("error", {});
    }
    if (exception instanceof errors.OIDCProviderError) {
      response.render("error", {});
    }

    if (exception instanceof DefinedError) {
      response
        .status(400)
        .send({ message: exception.message, extentions: exception.extentions });
    }
  }
}
