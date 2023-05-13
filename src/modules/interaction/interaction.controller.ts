import { All, Controller, Get, Next, Req, Res } from "@nestjs/common";
import { InteractionService } from "./interaction.service";
import { NextFunction, Request, Response } from "express";

@Controller()
export class InteractionController {
  constructor(private readonly interactionService: InteractionService) {}

  @Get("/:uid")
  public async uid(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    console.log("here?");
    res.json({ result: this.interactionService.getHello() });
  }

  @All("*")
  public async hi() {
    return "hi";
  }
}
