import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import url from "url";
import { AppModule } from "./app.module";
import { OIDCExceptionFilter } from "./errors/OIDC-exception.filter";
import * as path from "path";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  app.set("trust proxy", true);
  app.setViewEngine("ejs");
  app.setBaseViewsDir(`${path.join(__dirname, "./views")}`);
  app.useStaticAssets(`${path.join(__dirname, "./static")}`);

  app.use(
    cors({
      origin: "*",
      credentials: true,
      methods: ["GET", "POST", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  );
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(express.static(`${path.join(__dirname, "../static")}`));

  // inforce HTTPS on prod level
  const isProd = Boolean(configService.get("NODE_ENV") !== "development");
  if (isProd) {
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
  app.useGlobalFilters(new OIDCExceptionFilter());
  await app.listen(configService.get("AUTH_PORT"));
}
bootstrap();
