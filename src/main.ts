import moduleAlias from "module-alias";
moduleAlias.addAlias("@", __dirname);

import "reflect-metadata";

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(8888);
}
bootstrap();
