import type { UCDStore, UnicodeVersionFile } from "@ucdjs/ucd-store";
import type { TreeViewNode } from "reactive-vscode";
import type { UCDTreeItem } from "../composables/useUCDExplorer";
import { hasUCDFolderPath } from "@luxass/unicode-utils";
import { ThemeIcon, TreeItemCollapsibleState } from "vscode";
import * as Meta from "../generated/meta";
import { logger } from "../logger";

function mapEntryToTreeNode(version: string, entry: UnicodeVersionFile, parentPath?: string): TreeViewNode {
  const hasChildren = entry.children && entry.children.length > 0;
  const currentPath = parentPath ? `${parentPath}/${entry.name}` : entry.name;
  const filePathForCommand = parentPath ? currentPath : entry.name;

  return {
    treeItem: {
      iconPath: hasChildren ? new ThemeIcon("folder") : new ThemeIcon("file"),
      label: entry.name,
      collapsibleState: hasChildren ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None,
      contextValue: hasChildren ? "ucd:explorer-folder" : "ucd:explorer-file",
      ...(!hasChildren
        ? {
            command: {
              command: Meta.commands.openEntry,
              title: "Open UCD Data File",
              arguments: [
                version,
                filePathForCommand,
              ],
              tooltip: "Open UCD data file for this version",
            },
          }
        : {}),
      __ucd: {
        version,
        ucdUrl: `https://unicode.org/Public/${version}/${hasUCDFolderPath(version) ? "ucd/" : ""}${filePathForCommand}`,
      },
    } as UCDTreeItem,
    children: hasChildren ? entry.children?.map((child) => mapEntryToTreeNode(version, child, currentPath)) : [],
  };
}

export async function getFilesByVersion(store: UCDStore, version: string): Promise<TreeViewNode[]> {
  try {
    const data = await store.getFileTree(version);
    return data.map((entry) => mapEntryToTreeNode(version, entry));
  } catch (err) {
    logger.error(`Error fetching files for version ${version}:`, err);
    return [];
  }
}
