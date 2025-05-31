import type { TreeViewNode } from "reactive-vscode";
import { ThemeIcon, TreeItemCollapsibleState } from "vscode";
import { config } from "../config";
import { logger } from "../logger";

export async function getFilesByVersion(version: string): Promise<TreeViewNode[]> {
  try {
    const res = await fetch(new URL(`/api/v1/unicode-files/${version}`, config["data-files-api"]));

    if (!res.ok) {
      throw new Error(`Failed to fetch files for version ${version}: ${res.statusText}`);
    }

    interface Entry {
      name: string;
      children?: Entry[];
    }

    const data = (await res.json()) as Entry[];

    return data.map((entry) => {
      return {
        treeItem: {
          iconPath: entry.children?.length ? new ThemeIcon("folder") : new ThemeIcon("file"),
          label: entry.name,
          collapsibleState: entry.children?.length ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None,
          contextValue: entry.children?.length ? "ucd:explorer-folder" : "ucd:explorer-file",
        },
        children: entry.children?.map((child) => ({
          treeItem: {
            label: child.name,
          },
        })) ?? [],
      };
    });
  } catch (err) {
    logger.error(`Error fetching files for version ${version}:`, err);
    return [];
  }
}
