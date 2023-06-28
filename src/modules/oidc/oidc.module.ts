import { OidcConfigs } from "@/config/oidc-config.service";
import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import Provider from "oidc-provider";
import { AccessToken, AccessTokenSchema } from "./entity/AccessToken.entity";
import {
  AuthorizationCode,
  AuthorizationCodeSchema,
} from "./entity/AuthorizationCode.entity";
import {
  BackchannelAuthenticationRequest,
  BackchannelAuthenticationRequestSchema,
} from "./entity/BackchannelAuthenticationRequest.entity";
import { Client, ClientSchema } from "./entity/Client.entity";
import {
  ClientCredentials,
  ClientCredentialsSchema,
} from "./entity/ClientCredentials.entity";
import { DeviceCode, DeviceCodeSchema } from "./entity/DeviceCode.entity";
import { Grant, GrantSchema } from "./entity/Grant.entity";
import { Interaction, InteractionSchema } from "./entity/Interaction.entity";
import {
  PushedAuthorizationRequest,
  PushedAuthorizationRequestSchema,
} from "./entity/PushedAuthorizationRequest.entity";
import { RefreshToken, RefreshTokenSchema } from "./entity/RefreshToken.entity";
import {
  RegistrationAccessToken,
  RegistrationAccessTokenSchema,
} from "./entity/RegistrationAccessToken.entity";
import {
  ReplayDetection,
  ReplayDetectionSchema,
} from "./entity/ReplayDetection.entity";
import { Session, SessionSchema } from "./entity/Session.entity";
import { OidcController } from "./oidc.controller";
import { OidcService } from "./oidc.service";
import { AccountService } from "../account/account.service";
import { AccountModule } from "../account/account.module";

@Global()
@Module({
  imports: [
    AccountModule,
    MongooseModule.forFeature([
      {
        name: AccessToken.name,
        schema: AccessTokenSchema,
        collection: "AccessToken",
      },
      {
        name: AuthorizationCode.name,
        schema: AuthorizationCodeSchema,
        collection: "AuthorizationCode",
      },
      {
        name: BackchannelAuthenticationRequest.name,
        schema: BackchannelAuthenticationRequestSchema,
        collection: "BackchannelAuthenticationRequest",
      },
      {
        name: Client.name,
        schema: ClientSchema,
        collection: "Client",
      },
      {
        name: ClientCredentials.name,
        schema: ClientCredentialsSchema,
        collection: "ClientCredentials",
      },
      {
        name: DeviceCode.name,
        schema: DeviceCodeSchema,
        collection: "DeviceCode",
      },
      {
        name: Grant.name,
        schema: GrantSchema,
        collection: "Grant",
      },
      {
        name: Interaction.name,
        schema: InteractionSchema,
        collection: "Interaction",
      },
      {
        name: PushedAuthorizationRequest.name,
        schema: PushedAuthorizationRequestSchema,
        collection: "PushedAuthorizationRequest",
      },
      {
        name: RefreshToken.name,
        schema: RefreshTokenSchema,
        collection: "RefreshToken",
      },
      {
        name: RegistrationAccessToken.name,
        schema: RegistrationAccessTokenSchema,
        collection: "RegistrationAccessToken",
      },
      {
        name: ReplayDetection.name,
        schema: ReplayDetectionSchema,
        collection: "ReplayDetection",
      },
      {
        name: Session.name,
        schema: SessionSchema,
        collection: "Session",
      },
    ]),
  ],
  controllers: [OidcController],
  providers: [
    OidcConfigs,
    {
      provide: "OIDC_PROVIDER",
      inject: [ConfigService, OidcConfigs, AccountService],
      useFactory: async (
        configService: ConfigService,
        oidcConfigs: OidcConfigs,
        accountService: AccountService,
      ) => {
        const adapterFactory = oidcConfigs.createAdapterFactory();
        const provider = new Provider(
          `${configService.get("authURL")}:${configService.get("authPort")}`,
          {
            ...oidcConfigs.getConfigurations(),
            adapter: adapterFactory,
            findAccount: (ctx, sub, token) =>
              accountService.findAccount(ctx, sub, token),
          },
        );
        provider.proxy = true;
        provider.on("userinfo.error", (ctx, error) => {
          console.error(
            `🔥 [UserInfo error] : current-context = ${JSON.stringify(
              ctx,
            )} ${JSON.stringify(error)}`,
          );
        });
        return provider;
      },
    },
    OidcService,
  ],
  exports: [OidcService, "OIDC_PROVIDER"],
})
export class OidcModule {}
