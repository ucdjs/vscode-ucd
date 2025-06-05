import { useCommand } from "reactive-vscode";
import { useUCDExplorer } from "../composables/useUCDExplorer";
import * as Meta from "../generated/meta";
import { logger } from "../logger";

export function useRefreshExplorerCommand() {
  useCommand(Meta.commands.refreshExplorer, async () => {
    logger.info("Refreshing UCD Explorer...");

    useUCDExplorer().refresh();

    logger.info("UCD Explorer refreshed.");
  });
}
