import { Injectable } from "@nestjs/common";

@Injectable()
export class InteractionService {
  constructor() {}
  async getHello(): Promise<string> {
    return "hello";
  }
}
