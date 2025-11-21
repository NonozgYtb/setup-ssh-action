import { error as coreError, info, warning } from "@actions/core";
import { execSync } from "child_process";
import type { Platform } from "./types";

export function executeCommand(command: string): string {
  try {
    info(`Executing: ${command}`);
    const result = execSync(command, { encoding: "utf-8" });
    info(`Command completed successfully`);
    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    coreError(`Command failed: ${command}. Error: ${errorMessage}`);
    throw new Error(`Command execution failed: ${errorMessage}`);
  }
}

export function getPlatform(): Platform {
  const platform = process.platform;
  return {
    isWindows: platform === "win32",
    isMacOS: platform === "darwin",
    isLinux: platform === "linux"
  };
}

export function validateSSHKey(sshKey: string): boolean {
  if (!sshKey || sshKey.trim().length === 0) {
    throw new Error("SSH key is required and cannot be empty");
  }

  const validKeyPatterns = [
    /^-----BEGIN [A-Z ]+-----/,
    /^ssh-rsa /,
    /^ssh-ed25519 /,
    /^ssh-dss /,
    /^ecdsa-sha2-/
  ];

  const isValid = validKeyPatterns.some(pattern => pattern.test(sshKey.trim()));

  if (!isValid) {
    throw new Error("Invalid SSH key format. Please provide a valid SSH private key or public key.");
  }

  return true;
}

export function validatePort(port?: string): boolean {
  if (!port) return true; // Port is optional

  const portNumber = parseInt(port, 10);
  if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
    throw new Error("Port must be a valid number between 1 and 65535");
  }

  return true;
}

export function validateOrigin(origin?: string): boolean {
  if (!origin) return true; // Will use default

  const validOriginPattern = /^[a-zA-Z0-9][a-zA-Z0-9-._]*[a-zA-Z0-9]$|^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;

  if (!validOriginPattern.test(origin)) {
    warning(`Origin "${origin}" may not be a valid hostname or IP address`);
  }

  return true;
}

export function validateEmail(email?: string): boolean {
  if (!email) return true; // Email is optional

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple email regex, not 100%  RFC compliant

  if (!emailPattern.test(email)) {
    throw new Error("Invalid email format");
  }

  if (email.length > 255) {
    throw new Error("Email must be 255 characters or less");
  }

  return true;
}

export const validateGitUsername = (username?: string): boolean => {
  if (!username) return true; // Username is optional

  const gitUsernamePattern = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

  if (!gitUsernamePattern.test(username)) {
    throw new Error("Invalid git username format");
  }

  return true;
}
