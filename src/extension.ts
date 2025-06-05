import type { TreeViewNode } from "reactive-vscode";
import type { UCDTreeItem } from "./views/ucd-explorer";
import { hasUCDFolderPath } from "@luxass/unicode-utils";
import { defineExtension, executeCommand, useCommand } from "reactive-vscode";
import { Uri, window } from "vscode";
import { useUCDContentProvider } from "./composables/useUCDContentProvider";
import { useUCDStore } from "./composables/useUCDStore";
import * as Meta from "./generated/meta";
import { logger } from "./logger";
import { useUCDExplorer } from "./views/ucd-explorer";

const { activate, deactivate } = defineExtension(async () => {
  useCommand(Meta.commands.browseUcdFiles, async () => {
    logger.info("Browsing UCD files...");
    const store = useUCDStore();
    const data = await store.value?.getFilePaths("16.0.0");
    logger.info(`Fetched files for version 16.0.0: ${JSON.stringify(data, null, 2)}`);
  });

  useCommand(Meta.commands.visualizeFile, () => {
    logger.info("Visualizing UCD file...");
  });

  useCommand(Meta.commands.refreshExplorer, async () => {
    logger.info("Refreshing UCD Explorer...");
    logger.info("UCD Explorer refreshed.");
  });

  useCommand(Meta.commands.openExplorerEntry, async (versionOrTreeView: string | TreeViewNode, filePath?: string) => {
    if (versionOrTreeView == null) {
      logger.error("No entry provided to openExplorerEntry command.");
      return;
    }

    if (typeof versionOrTreeView === "object" && "treeItem" in versionOrTreeView) {
      const treeView = versionOrTreeView;

      if (!treeView.treeItem || !(treeView.treeItem as UCDTreeItem).__ucd) {
        logger.error("Invalid entry provided to openExplorerEntry command.");
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

  useUCDExplorer();

  useUCDContentProvider();
});

export { activate, deactivate };
