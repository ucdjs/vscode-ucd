import * as vscode from "vscode";
import { getFilesWithCommentsFromStore, hasValidLocalStore } from "./store";

/**
 * Get files for a version that have corresponding .comments files
 */
export async function getFilesWithComments(version: string): Promise<string[]> {
  // First try to get files from local store if configured
  if (hasValidLocalStore()) {
    return getFilesWithCommentsFromStore(version);
  }

  // Fallback to hardcoded files for now
  // TODO: Replace with actual API implementation
  const allFiles = [
    "UnicodeData.txt",
    "PropList.txt",
    "ScriptExtensions.txt",
    "Blocks.txt",
    "CaseFolding.txt",
  ];

  // Filter to only include files that have corresponding .comments files
  const filesWithComments = allFiles.filter((_file) => {
    // In a real implementation, you'd check if `${file}.comments` exists
    return true; // For now, assume all files have comments
  });

  return filesWithComments;
}

/**
 * Show file picker for single file selection
 */
export async function selectFile(version: string): Promise<string | undefined> {
  const filesWithComments = await getFilesWithComments(version);
  return vscode.window.showQuickPick(filesWithComments, {
    placeHolder: "Select a file to browse with comments",
  });
}

/**
 * Show file picker for multiple file selection
 */
export async function selectMultipleFiles(version: string): Promise<string[] | undefined> {
  const filesWithComments = await getFilesWithComments(version);
  return vscode.window.showQuickPick(filesWithComments, {
    placeHolder: "Select files to browse with comments",
    canPickMany: true,
  });
}

/**
 * Open a single file with comments
 */
export async function openFileWithComments(file: string, version: string): Promise<void> {
  // TODO: Implement actual file opening logic
  vscode.window.showInformationMessage(`Opening ${file} (version ${version}) with comments`);
}

/**
 * Open multiple files with comments
 */
export async function openMultipleFilesWithComments(files: string[], version: string): Promise<void> {
  // TODO: Implement actual file opening logic
  vscode.window.showInformationMessage(
    `Opening ${files.length} files (version ${version}) with comments: ${files.join(", ")}`,
  );
}
