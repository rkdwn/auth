import { Injectable } from "@nestjs/common";

@Injectable()
export class OidcService {
  constructor() {
    //
  }
  getHello(): string {
    return "Hello World!";
  }
}
