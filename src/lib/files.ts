import type { TreeViewNode } from "reactive-vscode";
import type { UCDStore } from "../composables/useUCDStore";
import { ThemeIcon, TreeItemCollapsibleState } from "vscode";
import { config } from "../config";
import { logger } from "../logger";

export async function getFilesByVersion(store: UCDStore, version: string): Promise<TreeViewNode[]> {
  try {
    // const data = await store.getFilePaths(version);
    // return data.map((entry) => {
    //   return {
    //     treeItem: {
    //       iconPath: entry.children?.length ? new ThemeIcon("folder") : new ThemeIcon("file"),
    //       label: entry.name,
    //       collapsibleState: entry.children?.length ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None,
    //       contextValue: entry.children?.length ? "ucd:explorer-folder" : "ucd:explorer-file",
    //     },
    //     children: entry.children?.map((child) => ({
    //       treeItem: {
    //         label: child.name,
    //       },
    //     })) ?? [],
    //   };
    // });
    return [];
  } catch (err) {
    logger.error(`Error fetching files for version ${version}:`, err);
    return [];
  }
}
