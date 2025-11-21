import { info, setFailed } from "@actions/core";
import { GitManager } from "./git-manager";
import { InputValidator } from "./input-validator";
import { SSHManager } from "./ssh-manager";

async function run(): Promise<void> {
  try {
    info("Starting SSH Action setup");

    const validator = new InputValidator();
    const sshManager = new SSHManager();
    const gitManager = new GitManager();

    // Get and validate inputs
    const inputs = validator.getAndValidateInputs();
    const sshConfig = validator.inputsToSSHConfig(inputs);
    const gitConfig = validator.inputsToGitConfig(inputs);

    // Setup SSH
    await sshManager.setupSSH(sshConfig);

    // Configure Git
    await gitManager.configureGit(gitConfig);

    info("SSH Action setup completed successfully");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    setFailed(errorMessage);
  }
}

// Run the action
run();
