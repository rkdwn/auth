import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import url from "url";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TestMiddleware } from "./common/testMiddleware";
import configuration from "./config/configuration";
import { InteractionModule } from "./modules/interaction/interaction.module";
import { OidcModule } from "./modules/oidc/oidc.module";

@Module({
  imports: [
    InteractionModule,
    OidcModule,
    RouterModule.register([
      {
        path: "/interaction",
        module: InteractionModule,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
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
