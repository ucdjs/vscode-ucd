import * as vscode from "vscode";
import { getLocalStorePath, hasValidLocalStore, isValidStoreDirectory } from "./lib/store";

/**
 * Validate the configured local store
 */
export async function validateLocalStore(): Promise<void> {
  try {
    const storePath = getLocalStorePath();

    if (!storePath) {
      vscode.window.showWarningMessage(
        "No local store path configured. Please set 'ucd.local-store-path' in settings.",
        "Open Settings",
      ).then((selection) => {
        if (selection === "Open Settings") {
          vscode.commands.executeCommand("workbench.action.openSettings", "ucd.local-store-path");
        }
      });
      return;
    }

    if (!isValidStoreDirectory(storePath)) {
      vscode.window.showErrorMessage(
        `Invalid store directory: ${storePath}\n\nThe directory must contain a 'ucdjs.store' file.`,
        "Open Settings",
      ).then((selection) => {
        if (selection === "Open Settings") {
          vscode.commands.executeCommand("workbench.action.openSettings", "ucd.local-store-path");
        }
      });
      return;
    }

    if (hasValidLocalStore()) {
      vscode.window.showInformationMessage(
        `✅ Local store is valid: ${storePath}\n\nFound ucdjs.store file successfully.`,
      );
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Error validating local store: ${error}`);
  }
}
