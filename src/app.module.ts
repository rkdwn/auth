import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TestMiddleware } from "./common/testMiddleware";
import configuration from "./config/configuration";
import { InteractionModule } from "./modules/interaction/interaction.module";
import { OidcModule } from "./modules/oidc/oidc.module";

@Module({
  imports: [
    InteractionModule,
    OidcModule,
    RouterModule.register([
      {
        path: "/interaction",
        module: InteractionModule,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TestMiddleware).forRoutes("*");
  }
}
