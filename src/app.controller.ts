import { All, Controller, Get, Inject, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import Provider from "oidc-provider";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject("OIDC_PROVIDER")
    private readonly provider: Provider,
  ) {}

  @Get("/version.json")
  public version() {
    return {
      version: "test",
    };
  }

  // @All("/*")
  // public mountOidc(
  //   @Req()
  //   req: Request,
  //   @Res()
  //   res: Response,
  // ): Promise<void> {
  //   const callback = this.provider.callback();
  //   return callback(req, res);
  // }
}
