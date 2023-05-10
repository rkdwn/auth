import providerConfigs from "@/config/oidc-config";
import { Controller, All, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
import Provider, { Adapter } from "oidc-provider";

@Controller("oidc")
export class OidcController {
  private readonly provider: Provider;
  constructor() {
    // private readonly adapter: Adapter
    this.provider = new Provider("http://localhost:8888", {
      ...providerConfigs,
    });
    this.provider.proxy = true;
    this.provider.on("userinfo.error", (ctx, error) => {
      console.error(
        `🔥 [UserInfo error] : current-context = ${JSON.stringify(
          ctx,
        )} ${JSON.stringify(error)}`,
      );
    });
  }

  @All("/*")
  public mountedOidc(@Req() req: Request, @Res() res: Response): Promise<void> {
    req.url = req.originalUrl.replace("/oidc", "");
    const callback = this.provider.callback();
    return callback(req, res);
  }
}
