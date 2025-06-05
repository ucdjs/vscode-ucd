import type { TreeViewNode } from "reactive-vscode";
import type { UCDTreeItem } from "../composables/useUCDExplorer";
import { hasUCDFolderPath } from "@luxass/unicode-utils";
import { executeCommand, useCommand } from "reactive-vscode";
import { Uri, window } from "vscode";
import * as Meta from "../generated/meta";
import { logger } from "../logger";

export function useOpenEntryCommand() {
  useCommand(Meta.commands.openEntry, async (versionOrTreeView: string | TreeViewNode, filePath?: string) => {
    if (versionOrTreeView == null) {
      logger.error("No entry provided to openEntry command.");
      return;
    }

    if (typeof versionOrTreeView === "object" && "treeItem" in versionOrTreeView) {
      const treeView = versionOrTreeView;

      if (!treeView.treeItem || !(treeView.treeItem as UCDTreeItem).__ucd) {
        logger.error("Invalid entry provided to openEntry command.");
        return;
      }

      const ucdItem = (treeView.treeItem as UCDTreeItem).__ucd;
      if (!ucdItem) {
        logger.error("UCD item is undefined or null.");
        return;
      }

      if (!ucdItem?.ucdUrl) {
        logger.error("UCD item does not have a valid URL.");
        return;
      }

      executeCommand("vscode.open", Uri.parse(ucdItem.ucdUrl));
      return;
    }

    const version = versionOrTreeView;
    if (!filePath) {
      logger.error("File path is required when version is provided as string.");
      return;
    }

    await window.showTextDocument(Uri.parse(`ucd:${version}/${hasUCDFolderPath(version) ? "ucd/" : ""}${filePath}`));
  });
}
