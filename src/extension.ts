import { defineExtension, useCommands, useLogger } from "reactive-vscode";
import * as Meta from "./generated/meta";

const { activate, deactivate } = defineExtension(async () => {
  const logger = useLogger("ucd-logger");

  useCommands({
    [Meta.commands.browseUcdFiles]: async () => {
      logger.info("Browsing UCD files...");
    },
    [Meta.commands.visualizeFile]: () => {
      logger.info("Visualizing UCD file...");
    },
  });
});

export { activate, deactivate };
