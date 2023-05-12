import { All, Controller, Get, Req, Res } from "@nestjs/common";
import { InteractionService } from "./interaction.service";
import { Request, Response } from "express";

@Controller()
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Get("/:uid")
  public async uid(@Req() req: Request, @Res() res: Response) {
    return this.interactionService.getHello();
  }

  @All("/*")
  public async hi() {
    return "hi";
  }
}
