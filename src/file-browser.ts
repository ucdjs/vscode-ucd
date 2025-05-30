import * as vscode from "vscode";
import { openFileWithComments, openMultipleFilesWithComments, selectFile, selectMultipleFiles } from "./lib/files";
import { selectVersion } from "./lib/version";

/**
 * Browse a single file with comments
 */
export async function browseFileWithComments(): Promise<void> {
  try {
    // Step 1: Pick a version
    const selectedVersion = await selectVersion();
    if (!selectedVersion) {
      return;
    }

    // Step 2: Pick a file that has corresponding .comments file
    const selectedFile = await selectFile(selectedVersion);
    if (!selectedFile) {
      return;
    }

    // Step 3: Open the file
    await openFileWithComments(selectedFile, selectedVersion);
  } catch (error) {
    vscode.window.showErrorMessage(`Error browsing file with comments: ${error}`);
  }
}

/**
 * Browse multiple files with comments
 */
export async function browseMultipleFilesWithComments(): Promise<void> {
  try {
    // Step 1: Pick a version
    const selectedVersion = await selectVersion();
    if (!selectedVersion) {
      return;
    }

    // Step 2: Pick multiple files that have corresponding .comments files
    const selectedFiles = await selectMultipleFiles(selectedVersion);
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    // Step 3: Open the files
    await openMultipleFilesWithComments(selectedFiles, selectedVersion);
  } catch (error) {
    vscode.window.showErrorMessage(`Error browsing multiple files with comments: ${error}`);
  }
}
