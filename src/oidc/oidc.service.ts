import { Injectable } from "@nestjs/common";

@Injectable()
export class OidcService {
  getHello(): string {
    return "Hello World!";
  }
}
