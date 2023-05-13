import { All, Controller, Get, Inject, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import Provider from "oidc-provider";

@Controller()
export class OidcController {
  constructor(
    @Inject("OIDC_PROVIDER")
    private readonly provider: Provider,
  ) {}

  @Get("/test")
  public getTest() {
    return "test";
  }

  @All("*")
  public mountOidc(
    @Req()
    req: Request,
    @Res()
    res: Response,
  ): Promise<void> {
    const callback = this.provider.callback();
    return callback(req, res);
  }
}
