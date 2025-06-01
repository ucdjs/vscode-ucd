import type { TreeViewNode } from "reactive-vscode";
import type { UCDTreeItem } from "./views/ucd-explorer";
import { defineExtension, executeCommand, useCommand } from "reactive-vscode";
import { Uri } from "vscode";
import { useUCDStore } from "./composables/useUCDStore";
import * as Meta from "./generated/meta";
import { getFilesByVersion } from "./lib/files";
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

  useCommand(Meta.commands.openExplorerEntry, async (entry: TreeViewNode) => {
    logger.info(`Opening UCD Explorer entry: ${JSON.stringify(entry, null, 2)}`);
    if (!entry.treeItem || !(entry.treeItem as UCDTreeItem).__ucd) {
      logger.error("invalid entry provided to openExplorerEntry command.");
      return;
    }

    const ucdItem = (entry.treeItem as UCDTreeItem).__ucd;
    if (!ucdItem) {
      logger.error("UCD item is undefined or null.");
      return;
    }

    if (!ucdItem?.ucdUrl) {
      logger.error("UCD item does not have a valid URL.");
      return;
    }

    executeCommand("vscode.open", Uri.parse(ucdItem.ucdUrl));
  });

  useUCDExplorer();
});

export { activate, deactivate };
