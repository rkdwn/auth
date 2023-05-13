// We need this in order to use @Decorators in import statements
import moduleAlias from "module-alias";
moduleAlias.addAlias("@", __dirname);
import "reflect-metadata";

/**
 * Main Loop here.
 */
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import url from "url";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  app.set("trust proxy", true);
  app.set("view engine", configService.get("viewEngine"));
  app.set("views", configService.get("viewPath"));

  app.use(cors(configService.get("corsOptions")));
  // app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(configService.get("staticPath")));

  // inforce HTTPS on prod level
  if (configService.get("isProd")) {
    app.use((req: Request, res: Response, next: NextFunction) => {
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

  await app.listen(8888);
}
bootstrap();
