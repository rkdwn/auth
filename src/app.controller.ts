import { Controller, Get, Header } from "@nestjs/common";
import { AppService } from "./app.service";
import { ConfigService } from "@nestjs/config";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly nestConfigService: ConfigService,
  ) {}

  @Get("/version.json")
  @Header("Access-Control-Allow-Origin", "*")
  public version() {
    return {
      version: this.nestConfigService.get("APP_VER"),
      hash: this.nestConfigService.get("APP_COMMIT_HASH"),
      date: this.nestConfigService.get("APP_COMMIT_DATE"),
    };
  }

  @Get("/test")
  public getHello(): string {
    return this.appService.getHello();
  }
}
