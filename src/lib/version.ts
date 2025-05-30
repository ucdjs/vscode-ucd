import * as vscode from "vscode";
import { getAvailableVersions as getVersionsFromStore } from "./store";

/**
 * Get available Unicode versions
 */
export async function getAvailableVersions(): Promise<string[]> {
  return getVersionsFromStore();
}

/**
 * Show version picker to user
 */
export async function selectVersion(): Promise<string | undefined> {
  const versions = await getAvailableVersions();
  return vscode.window.showQuickPick(versions, {
    placeHolder: "Select a Unicode version",
  });
}
