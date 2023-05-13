import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/version.json")
  public version() {
    return {
      version: "test",
    };
  }

  @Get("/test")
  public getHello(): string {
    return this.appService.getHello();
  }
}
