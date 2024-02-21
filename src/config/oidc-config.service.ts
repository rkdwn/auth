import Provider, {
  Adapter,
  AdapterFactory,
  Configuration,
  ErrorOut,
  errors,
  KoaContextWithOIDC,
} from "oidc-provider";

import { clients } from "./clients";
import { privatekey } from "./privatekey";
import { Injectable } from "@nestjs/common";
import { CustomAdapter } from "../adapter/adapter";
import { InjectModel } from "@nestjs/mongoose";
import { BaseAdapterEntityDocument } from "../common/base.adapter.entity";
import { Model } from "mongoose";

@Injectable()
export class OidcConfigs {
  constructor(
    @InjectModel("AccessToken")
    private AccessTokenModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("AuthorizationCode")
    private AuthorizationCodeModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("BackchannelAuthenticationRequest")
    private BackchannelAuthenticationRequestModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("Client")
    private ClientModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("ClientCredentials")
    private ClientCredentialsModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("DeviceCode")
    private DeviceCodeModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("Grant")
    private GrantModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("Interaction")
    private InteractionModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("PushedAuthorizationRequest")
    private PushedAuthorizationRequestModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("RefreshToken")
    private RefreshTokenModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("RegistrationAccessToken")
    private RegistrationAccessTokenModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("ReplayDetection")
    private ReplayDetectionModel: Model<BaseAdapterEntityDocument>,
    @InjectModel("Session")
    private SessionModel: Model<BaseAdapterEntityDocument>,
  ) {}

  private getModel(name: string): Model<BaseAdapterEntityDocument> {
    switch (name) {
      case "AccessToken":
        return this.AccessTokenModel;
      case "AuthorizationCode":
        return this.AuthorizationCodeModel;
      case "BackchannelAuthenticationRequest":
        return this.BackchannelAuthenticationRequestModel;
      case "Client":
        return this.ClientModel;
      case "ClientCredentials":
        return this.ClientCredentialsModel;
      case "DeviceCode":
        return this.DeviceCodeModel;
      case "Grant":
        return this.GrantModel;
      case "Interaction":
        return this.InteractionModel;
      case "PushedAuthorizationRequest":
        return this.PushedAuthorizationRequestModel;
      case "RefreshToken":
        return this.RefreshTokenModel;
      case "RegistrationAccessToken":
        return this.RegistrationAccessTokenModel;
      case "ReplayDetection":
        return this.ReplayDetectionModel;
      case "Session":
        return this.SessionModel;
    }
  }

  createAdapterFactory(): AdapterFactory {
    return (moduleName: string): Adapter => {
      return new CustomAdapter(moduleName, this.getModel(moduleName));
    };
  }

  getConfigurations(): Configuration {
    return {
      clients: clients,
      jwks: privatekey,
      clientDefaults: {
        id_token_signed_response_alg: "RS256",
        token_endpoint_auth_method: "client_secret_basic",
      },
      scopes: ["openid", "offline_access", "profile", "test"],
      // Allow omitting the redirect_uri parameter when only a single one is registered for a client.
      allowOmittingSingleRegisteredRedirectUri: true,
      claims: {
        acr: null,
        auth_time: null,
        iss: null,
        openid: ["sub"],
        sid: null,
        profile: ["id", "name", "age", "loginId", "email", "phone"],
      },
      // ID_token에 커스텀 항목 포함시키는 옵션.
      conformIdTokenClaims: false,
      cookies: {
        names: {
          session: "_auth_session",
          interaction: "_interaction",
          resume: "_interaction_resume",
        },
        long: {
          // for OP session
          httpOnly: true,
          overwrite: true,
          sameSite: "none",
        },
        short: {
          // for interaction
          httpOnly: true,
          overwrite: true,
          sameSite: "lax",
        },
        keys: ["2fOabOO6iiddVovAcEYq", "bRjFhWrXN3qlKD5CwFEk"],
      },
      renderError: customErrorPage,
      interactions: {
        url(ctx: KoaContextWithOIDC, interaction) {
          return `/interaction/${interaction.uid}`;
        },
      },
      pkce: {
        methods: ["S256"],
        required: pkceRequired,
      },
      ttl: {
        AccessToken: function AccessTokenTTL(
          ctx: KoaContextWithOIDC,
          token: InstanceType<Provider["AccessToken"]>,
          client: InstanceType<Provider["Client"]>,
        ) {
          if (token.resourceServer) {
            return token.resourceServer.accessTokenTTL || 12 * 60 * 60;
          }
          return 10 * 60; /* 10 min in seconds */
        },
        AuthorizationCode: 600 /* 10 minutes in seconds */,
        ClientCredentials: function ClientCredentialsTTL(
          ctx: KoaContextWithOIDC,
          token: InstanceType<Provider["ClientCredentials"]>,
          client: InstanceType<Provider["Client"]>,
        ) {
          if (token.resourceServer) {
            return token.resourceServer.accessTokenTTL || 12 * 60 * 60;
          }

          // test
          if (client.clientId === "rkdwn") {
            return 24 * 60 * 60; /* 24 hours */
          }

          // default TTL
          return 1 * 60 * 60; /* 1 hour in seconds */
        },
        RefreshToken: function RefreshTokenTTL(
          ctx: KoaContextWithOIDC,
          token: InstanceType<Provider["RefreshToken"]>,
          client: InstanceType<Provider["Client"]>,
        ) {
          if (
            ctx &&
            ctx.oidc.entities.RotatedRefreshToken &&
            client.applicationType === "web" &&
            client.tokenEndpointAuthMethod === "none" &&
            !token.isSenderConstrained()
          ) {
            // Non-Sender Constrained SPA RefreshTokens do not have infinite expiration through rotation
            return ctx.oidc.entities.RotatedRefreshToken.remainingTTL;
          }

          return 12 * 60 * 60; // 12 hours in seconds
        },
        DeviceCode: 600 /* 10 minutes in seconds */,
        Grant: 1 * 60 * 60 /* 1 hour in seconds */,
        IdToken: 24 * 60 * 60 /* 24 hour in seconds */,
        Session: 1 * 60 * 60 /* for OP session 1 hour in seconds */,
        Interaction: 600 /* for Interaction 10 minutes in seconds */,
      },
      routes: {
        authorization: "/auth",
        backchannel_authentication: "/backchannel",
        code_verification: "/device",
        device_authorization: "/device/auth",
        end_session: "/session/end",
        introspection: "/token/introspection",
        jwks: "/jwks",
        pushed_authorization_request: "/request",
        registration: "/reg",
        revocation: "/token/revocation",
        token: "/token",
        userinfo: "/me",
      },

      features: {
        backchannelLogout: {
          enabled: true,
        },
        devInteractions: { enabled: false },
        encryption: { enabled: true },
        introspection: {
          enabled: true,
          allowedPolicy: introspectionAllowedPolicy,
        },
        userinfo: {
          enabled: true,
        },
        registration: {
          enabled: true,
          initialAccessToken: "fUikTTyBjh0rl7vZtODJm",
        },
        registrationManagement: {
          // https://www.rfc-editor.org/rfc/rfc7592.html
          enabled: true,
          rotateRegistrationAccessToken: false,
        },
        revocation: { enabled: true },
        clientCredentials: { enabled: true },
        rpInitiatedLogout: {
          enabled: true,
          logoutSource: customLogoutSource,
        },
      },
      expiresWithSession: expiresWithSession,
      issueRefreshToken: issueRefreshToken,
      rotateRefreshToken: rotateRefreshToken,
      extraTokenClaims: extraTokenClaims,
    };

    function customErrorPage(
      ctx: KoaContextWithOIDC,
      out: ErrorOut,
      error: errors.OIDCProviderError | Error,
    ) {
      ctx.body = `<!DOCTYPE html>
        <head>
          <title>oops! something went wrong</title>
          <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
          <style>
            @import url(https://fonts.googleapis.com/css?family=Roboto:400,100);h1{font-weight:100;text-align:center;font-size:2.3em}body{font-family:Roboto,sans-serif;margin-top:25px;margin-bottom:25px}.container{padding:0 40px 10px;width:274px;background-color:#F7F7F7;margin:0 auto 10px;border-radius:2px;box-shadow:0 2px 2px rgba(0,0,0,.3);overflow:hidden}pre{white-space:pre-wrap;white-space:-moz-pre-wrap;white-space:-pre-wrap;white-space:-o-pre-wrap;word-wrap:break-word;margin:0 0 0 1em;text-indent:-1em}
          </style>
        </head>
        <body>
          <div>
            <h1>oops! something went wrong</h1>
            ${Object.entries(out)
              .map(
                ([key, value]) =>
                  `<pre><strong>${key}</strong>: ${value}</pre>`,
              )
              .join("")}
            <pre>${error}</pre>
          </div>
        </body>
        </html>`;
    }

    function pkceRequired(
      ctx: KoaContextWithOIDC,
      client: InstanceType<Provider["Client"]>,
    ) {
      // Apply pkce logic
      return true;
    }

    async function introspectionAllowedPolicy(
      ctx: KoaContextWithOIDC,
      client: InstanceType<Provider["Client"]>,
      token:
        | InstanceType<Provider["AccessToken"]>
        | InstanceType<Provider["ClientCredentials"]>
        | InstanceType<Provider["RefreshToken"]>,
    ) {
      if (
        client.introspectionEndpointAuthMethod === "none" &&
        token.clientId !== ctx.oidc.client.clientId
      ) {
        return false;
      }
      return true;
    }

    async function expiresWithSession(
      ctx: KoaContextWithOIDC,
      token:
        | InstanceType<Provider["AuthorizationCode"]>
        | InstanceType<Provider["DeviceCode"]>
        | InstanceType<Provider["AccessToken"]>,
    ) {
      return !token.scopes.has("offline_access");
    }

    async function issueRefreshToken(
      ctx: KoaContextWithOIDC,
      client: InstanceType<Provider["Client"]>,
      code:
        | InstanceType<Provider["DeviceCode"]>
        | InstanceType<Provider["AuthorizationCode"]>
        | InstanceType<Provider["BackchannelAuthenticationRequest"]>,
    ) {
      if (!client.grantTypeAllowed("refresh_token")) {
        return false;
      } else {
        return true;
      }
    }

    // TODO: refresh_token 검증
    function rotateRefreshToken(ctx: KoaContextWithOIDC) {
      const { RefreshToken, Client } = ctx.oidc.entities;
      // cap the maximum amount of time a refresh token can be
      // rotated for up to 1 year, afterwards its TTL is final
      if (RefreshToken.totalLifetime() >= 365.25 * 24 * 60 * 60) {
        return false;
      }
      // rotate non sender-constrained public client refresh tokens
      if (
        Client.tokenEndpointAuthMethod === "none" &&
        !RefreshToken.isSenderConstrained()
      ) {
        return true;
      }
      // rotate if the token is nearing expiration (it's beyond 70% of its lifetime)
      return RefreshToken.ttlPercentagePassed() >= 70;
    }

    // https://github.com/panva/node-oidc-provider/blob/main/docs/README.md#extratokenclaims
    async function extraTokenClaims(
      ctx: any,
      token:
        | InstanceType<Provider["AccessToken"]>
        | InstanceType<Provider["ClientCredentials"]>,
    ) {
      if (token.kind === "ClientCredentials") {
        // rkdwn Test
        if (token.clientId === "rkdwn") {
          return {
            verifier: "test",
            test: "testClaim",
          };
        }
      }
    }

    // 세션 로그아웃 시 확인버튼 자동 클릭 커스텀 로그아웃 소스.
    async function customLogoutSource(
      ctx: KoaContextWithOIDC,
      form: string,
    ): Promise<void> {
      ctx.body = `<!DOCTYPE html>
                    <head>
                      <title>Logout</title>
                    </head>
                      <body>
                        <script>
                          window.onload = function logout() {
                            var form = document.forms[0];
                            var input = document.createElement('input');
                            input.type = 'hidden';
                            input.name = 'logout';
                            input.value = 'yes';
                            form.appendChild(input);
                            form.submit();
                          }
                        </script>
                        ${form}
                      </body>
                    </html>`;
      return;
    }
  }
}
