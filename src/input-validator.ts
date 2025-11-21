import { getInput } from "@actions/core";
import type { ActionInputs, GitConfig, SSHConfig } from "./types";
import { validateEmail, validateGitUsername, validateOrigin, validatePort, validateSSHKey } from "./utils";

export class InputValidator {
  public getAndValidateInputs(): ActionInputs {
    const inputs: ActionInputs = {
      NAME: getInput("NAME") || undefined,
      PORT: getInput("PORT") || undefined,
      USER: getInput("USER") || undefined,
      ORIGIN: getInput("ORIGIN") || "github.com",
      SSHKEY: getInput("SSHKEY"),
      GIT_USERNAME: getInput("GIT_USERNAME") || undefined,
      GIT_EMAIL: getInput("GIT_EMAIL") || undefined
    };

    this.validateInputs(inputs);
    return inputs;
  }

  private validateInputs(inputs: ActionInputs): void {
    if (!inputs.SSHKEY) {
      throw new Error("SSHKEY input is required");
    }

    validateSSHKey(inputs.SSHKEY);
    validatePort(inputs.PORT);
    validateOrigin(inputs.ORIGIN);
    validateEmail(inputs.GIT_EMAIL);
    validateGitUsername(inputs.GIT_USERNAME);

    if (inputs.NAME && inputs.NAME.length > 255) {
      throw new Error("NAME must be 255 characters or less");
    }

    if (inputs.USER && inputs.USER.length > 32) {
      throw new Error("USER must be 32 characters or less");
    }
  }

  public inputsToSSHConfig(inputs: ActionInputs): SSHConfig {
    return {
      name: inputs.NAME,
      port: inputs.PORT,
      user: inputs.USER,
      origin: inputs.ORIGIN || "github.com",
      sshKey: inputs.SSHKEY
    };
  }

  public inputsToGitConfig(inputs: ActionInputs): GitConfig {
    return {
      userName: inputs.GIT_USERNAME,
      userEmail: inputs.GIT_EMAIL
    };
  }
}
