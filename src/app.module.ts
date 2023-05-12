import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import Provider from "oidc-provider";
import url from "url";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TestMiddleware } from "./common/testMiddleware";
import configuration from "./config/configuration";
import providerConfigs from "./config/oidc-config";
import { RouterModule } from "@nestjs/core";
import { InteractionModule } from "./modules/interaction/interaction.module";

@Module({
  imports: [
    // OidcModule,
    RouterModule.register([
      {
        path: "interaction",
        module: InteractionModule,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [
    {
      provide: "OIDC_PROVIDER",
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const provider = new Provider(configService.get("authURL"), {
          ...providerConfigs,
        });
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
    AppService,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {}
  configure(consumer: MiddlewareConsumer) {
    const corsOptions = this.configService.get("corsOptions");
    const staticPath = this.configService.get("staticPath");
    const isProd = this.configService.get("isProd");

    consumer.apply(TestMiddleware).forRoutes("*");
    consumer.apply(
      express.static(staticPath),
      cors(corsOptions),
      helmet({ frameguard: false }),
      express.urlencoded({ extended: true }),
      express.json(),
    );

    // inforce HTTPS on prod level
    if (isProd) {
      consumer.apply((req: Request, res: Response, next: NextFunction) => {
        if (req.secure) {
          next();
        } else if (req.method === "GET" || req.method === "HEAD") {
          res.redirect(
            url.format({
              protocol: "https",
              host: req.get("host"),
              pathname: req.originalUrl,
            }),
          );
        } else {
          res.status(400).json({
            error: "invalid_request",
            error_description: "do yourself a favor and only use https",
          });
        }
      });
    }
  }
}
