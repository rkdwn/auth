import { ClientMetadata } from "oidc-provider";
import TestClients from "./test-clients";

export const clients: ClientMetadata[] = [...TestClients];

export const clientLength: Number = clients.length;
