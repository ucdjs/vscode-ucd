import * as fs from "node:fs";
import * as path from "node:path";
import { config } from "../config";

/**
 * Check if a directory is a valid UCD store directory
 * by looking for the ucdjs.store file
 */
export function isValidStoreDirectory(dirPath: string): boolean {
  if (!dirPath) {
    return false;
  }

  try {
    const storeFilePath = path.join(dirPath, "ucdjs.store");
    return fs.existsSync(storeFilePath) && fs.statSync(storeFilePath).isFile();
  } catch {
    return false;
  }
}

/**
 * Get the configured local store path
 */
export function getLocalStorePath(): string {
  return config.localStorePath || "";
}

/**
 * Check if local store is configured and valid
 */
export function hasValidLocalStore(): boolean {
  const storePath = getLocalStorePath();
  return storePath !== "" && isValidStoreDirectory(storePath);
}

/**
 * Get available versions from local store or API
 */
export async function getAvailableVersions(): Promise<string[]> {
  // First try to get versions from local store if configured
  if (hasValidLocalStore()) {
    return getVersionsFromLocalStore();
  }

  // Fallback to hardcoded versions for now
  // TODO: Replace with actual API call
  return ["16.0.0", "15.1.0", "15.0.0", "14.0.0", "13.0.0"];
}

/**
 * Get versions from local UCD store
 */
function getVersionsFromLocalStore(): string[] {
  const storePath = getLocalStorePath();

  try {
    // TODO: Implement actual parsing of ucdjs.store file or directory structure
    // For now, scan for version-like directories
    const entries = fs.readdirSync(storePath, { withFileTypes: true });
    const versions = entries
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .filter((name) => /^\d+\.\d+\.\d+$/.test(name))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

    return versions;
  } catch {
    return [];
  }
}

/**
 * Get files with comments from local UCD store for a specific version
 */
export function getFilesWithCommentsFromStore(version: string): string[] {
  const storePath = getLocalStorePath();

  if (!isValidStoreDirectory(storePath)) {
    return [];
  }

  try {
    const versionPath = path.join(storePath, version);

    if (!fs.existsSync(versionPath) || !fs.statSync(versionPath).isDirectory()) {
      return [];
    }

    // Get all .txt files in the version directory
    const entries = fs.readdirSync(versionPath, { withFileTypes: true });
    const txtFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith(".txt"))
      .map((entry) => entry.name);

    // Filter to only include files that have corresponding .comments files
    const filesWithComments = txtFiles.filter((file) => {
      const commentsFile = `${file}.comments`;
      const commentsPath = path.join(versionPath, commentsFile);
      return fs.existsSync(commentsPath) && fs.statSync(commentsPath).isFile();
    });

    return filesWithComments.sort();
  } catch {
    return [];
  }
}
