import Provider, { UnknownObject } from "oidc-provider";

declare namespace RenderProps {
  export type Default = {
    client: InstanceType<Provider["Client"]>;
    uid: string;
    errorField: string;
    details: UnknownObject;
    params: UnknownObject;
    flash: string | null;
  };

  export type Login = Omit<Default, "employee" | "employeeId" | "hospital">;
  export type Interaction = Omit<
    Default,
    "errorField" | "flash" | "employee" | "employeeId" | "hospital"
  >;
  export type ChangePassword = Omit<
    Default,
    "client" | "errorField" | "details" | "params"
  >;
  export type Reset = Pick<Default, "uid" | "flash">;
}

export { RenderProps };
