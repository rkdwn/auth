import Provider, { UnknownObject } from "oidc-provider";
import { DefinedError } from "./GeneralErrors";

declare namespace RenderProps {
  export type Default = {
    client: InstanceType<Provider["Client"]>;
    uid: string;
    errorField: string;
    details: UnknownObject;
    params: UnknownObject;
    flash: string | null;
  };

  export type Login = Default;
  export type Interaction = Omit<Default, "errorField" | "flash">;
  export type ChangePassword = Omit<
    Default,
    "client" | "errorField" | "details" | "params"
  >;
  export type Reset = Pick<Default, "uid" | "flash">;
}

export { RenderProps, DefinedError };
