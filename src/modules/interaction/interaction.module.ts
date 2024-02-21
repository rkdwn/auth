import { SetNoCacheMiddleware } from "../../common/middleware/setNoCacheMiddleware";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AccountModule } from "../account/account.module";
import { OidcModule } from "../oidc/oidc.module";
import { InteractionController } from "./interaction.controller";
import { InteractionService } from "./interaction.service";

// TODO: inject oidc module here
@Module({
  imports: [OidcModule, AccountModule],
  providers: [InteractionService],
  exports: [InteractionService],
  controllers: [InteractionController],
})
export class InteractionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SetNoCacheMiddleware).forRoutes("/:uid");
  }
}
