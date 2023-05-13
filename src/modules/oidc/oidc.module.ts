import providerConfigs from "@/config/oidc-config";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Provider from "oidc-provider";
import { OidcController } from "./oidc.controller";
import { OidcService } from "./oidc.service";

@Module({
  imports: [],
  exports: [OidcService],
  controllers: [OidcController],
  providers: [
    {
      provide: "OIDC_PROVIDER",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const provider = new Provider(
          `${configService.get("authURL")}:${configService.get("authPort")}`,
          {
            ...providerConfigs,
          },
        );
        provider.proxy = true;
        provider.on("userinfo.error", (ctx, error) => {
          console.error(
            `🔥 [UserInfo error] : current-context = ${JSON.stringify(
              ctx,
            )} ${JSON.stringify(error)}`,
          );
        });
        return provider;
      },
    },
    OidcService,
  ],
})
export class OidcModule {}
