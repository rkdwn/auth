import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";
import { MongooseModule } from "@nestjs/mongoose";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TestMiddleware } from "./common/middleware/testMiddleware";
import configuration from "./config/configuration";
import { mongooseConfig } from "./config/mongoose.config";
import { InteractionModule } from "./modules/interaction/interaction.module";
import { OidcModule } from "./modules/oidc/oidc.module";

@Module({
  imports: [
    MongooseModule.forRootAsync(mongooseConfig),
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
