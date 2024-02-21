import { RenderProps } from "../../interfaces";
import {
  All,
  Controller,
  Get,
  Inject,
  Next,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import Provider, { InteractionResults, errors } from "oidc-provider";
import {
  AccountService,
  isCheckAccountRetType,
} from "../account/account.service";
import { InteractionService } from "./interaction.service";

@Controller()
export class InteractionController {
  constructor(
    private readonly interactionService: InteractionService,
    private readonly accountService: AccountService,
    @Inject("OIDC_PROVIDER")
    private provider: Provider,
  ) {}

  @Get("/:uid")
  public async uid(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const { uid, prompt, params, session } =
        await this.provider.interactionDetails(req, res);

      const client = await this.provider.Client.find(
        typeof params.client_id === "string" ? params.client_id : "",
      );

      switch (prompt.name) {
        case "login": {
          const _loginProps: RenderProps.Login = {
            client,
            uid,
            errorField: "",
            details: prompt.details,
            params,
            flash: null,
          };
          return res.render("login", _loginProps);
        }
        case "consent": {
          const _interactionProps: RenderProps.Interaction = {
            client,
            uid,
            details: prompt.details,
            params,
          };
          return res.render("interaction", _interactionProps);
        }
      }
    } catch (err) {
      console.error(err);
      if (err instanceof errors.SessionNotFound) {
        return res.render("error", {});
      }
      next(err);
    }
  }

  @Post("/:uid/login")
  public async login(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const { uid, prompt, params } = await this.provider.interactionDetails(
        req,
        res,
      );
      const client = await this.provider.Client.find(
        typeof params.client_id === "string" ? params.client_id : "",
      );

      // LOGIN CHECK
      const account = await this.accountService.checkAccount(
        req.body.userId,
        req.body.password,
      );
      console.log(typeof account);

      if (!isCheckAccountRetType(account)) {
        const result: InteractionResults = {
          login: {
            accountId: account.id.toString(),
          },
        };
        await this.provider.interactionFinished(req, res, result, {
          mergeWithLastSubmission: false,
        });
        return;
      }

      if (account.isError) {
        const _loginProps: RenderProps.Login = {
          client,
          uid,
          errorField: account.errorField,
          details: prompt.details,
          params,
          flash: account.message,
        };
        return res.render("login", _loginProps);
      }
    } catch (err) {
      next(err);
    }
  }

  @Post("/:uid/confirm")
  public async confirm(
    @Req() req: Request,
    @Res() res: Response,
    @Next() next: NextFunction,
  ) {
    try {
      const interactionDetails = await this.provider.interactionDetails(
        req,
        res,
      );
      const {
        prompt: { name, details },
        params,
        session: { accountId },
      } = interactionDetails;

      let { grantId } = interactionDetails;
      let grant: InstanceType<Provider["Grant"]>;

      if (grantId) {
        // we'll be modifying existing grant in existing session
        grant = await this.provider.Grant.find(grantId);
      } else {
        // we're establishing a new grant
        grant = new this.provider.Grant({
          accountId,
          clientId:
            typeof params.client_id === "string" ? params.client_id : null,
        });
      }

      if (Array.isArray(details.missingOIDCScope)) {
        grant.addOIDCScope(details.missingOIDCScope.join(" "));
      }

      if (Array.isArray(details.missingOIDCClaims)) {
        grant.addOIDCClaims(details.missingOIDCClaims);
      }

      if (details.missingResourceScopes) {
        for (const [indicator, scopes] of Object.entries(
          details.missingResourceScopes,
        )) {
          grant.addResourceScope(indicator, scopes.join(" "));
        }
      }

      grantId = await grant.save();

      let consent: { grantId?: string | undefined } = {};
      if (!interactionDetails.grantId) {
        consent.grantId = grantId;
      }
      const result = { consent };
      await this.provider.interactionFinished(req, res, result, {
        mergeWithLastSubmission: true,
      });
    } catch (err) {
      next(err);
    }
  }

  @All("*")
  public async hi() {
    return "hi";
  }
}
