import { ClientMetadata } from "oidc-provider";

const TestClients: ClientMetadata[] = [
  // TODO: test
  {
    client_id: "auth_test",
    client_secret: "123",
    application_type: "web",
    redirect_uris: [
      "http://*.*.*.*:3001/auth",
      "http://localhost:3001/auth",
      "http://localhost:3000/auth",
    ],
    response_types: ["code"],
    grant_types: ["refresh_token", "authorization_code"],
    pkceMethods: ["S256"],
    post_logout_redirect_uris: [
      "http://localhost:3000/logout",
      "http://localhost:3001/logout",
      "http://localhost:3002/logout",
    ],
    scope: "openid profile hospitalInfo",
    token_endpoint_auth_method: "client_secret_basic",
    backchannel_logout_uri: "http://localhost:3001/backchannel_logout",
  },
  // TODO: client_credentail test
  {
    client_id: "rkdwn",
    client_secret: "rkdwn",
    application_type: "web",
    redirect_uris: [],
    response_types: [],
    grant_types: ["client_credentials"],
    pkceMethods: [],
    post_logout_redirect_uris: [],
  },
];

export default TestClients;
