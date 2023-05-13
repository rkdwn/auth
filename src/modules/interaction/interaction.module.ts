import { Module } from "@nestjs/common";
import { InteractionService } from "./interaction.service";
import { InteractionController } from "./interaction.controller";

// TODO: inject oidc module here
@Module({
  imports: [],
  providers: [InteractionService],
  exports: [InteractionService],
  controllers: [InteractionController],
})
export class InteractionModule {}
