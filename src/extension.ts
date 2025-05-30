import { defineExtension, ref, useCommands, useLogger, useTreeView } from "reactive-vscode";
import { config } from "./config";
import * as Meta from "./generated/meta";
import { getFilesByVersion, getTreeViewNodes } from "./views/ucd-explorer";

const { activate, deactivate } = defineExtension(async () => {
  const _treeView = useTreeView("ucd.all-files", ref(await getTreeViewNodes(config)), {
    showCollapseAll: true,
  });

  const logger = useLogger("ucd-logger");

  useCommands({
    [Meta.commands.browseUcdFiles]: async () => {
      logger.info("Browsing UCD files...");
      const view = await getFilesByVersion(config, "16.0.0");
      logger.info(`Fetched files for version 16.0.0: ${JSON.stringify(view, null, 2)}`);
    },
    [Meta.commands.visualizeFile]: () => {
      logger.info("Visualizing UCD file...");
    },
  });
});

export { activate, deactivate };
