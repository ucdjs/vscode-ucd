import { defineExtension, useCommands, useLogger } from "reactive-vscode";
import { browseFileWithComments, browseMultipleFilesWithComments } from "./file-browser";
import * as Meta from "./generated/meta";
import { validateLocalStore } from "./store-validator";

const { activate, deactivate } = defineExtension(async () => {
  const logger = useLogger("ucd-logger");

  useCommands({
    [Meta.commands.browseUcdFiles]: async () => {
      logger.info("Browsing UCD files...");
    },
    [Meta.commands.visualizeFile]: () => {
      logger.info("Visualizing UCD file...");
    },
    [Meta.commands.browseFileWithComments]: async () => {
      logger.info("Browse file with comments...");
      await browseFileWithComments();
    },
    [Meta.commands.browseMultipleFilesWithComments]: async () => {
      logger.info("Browse multiple files with comments...");
      await browseMultipleFilesWithComments();
    },
    [Meta.commands.validateLocalStore]: async () => {
      logger.info("Validating local store...");
      await validateLocalStore();
    },
  });
});

export { activate, deactivate };
