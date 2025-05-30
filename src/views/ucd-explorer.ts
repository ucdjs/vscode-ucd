import type { TreeViewNode } from "reactive-vscode";
import type { Config } from "../config";
import { UNICODE_VERSIONS_WITH_UCD } from "@luxass/unicode-utils";

export async function getTreeViewNodes(config: Config): Promise<TreeViewNode[]> {
  const entries = await Promise.all(UNICODE_VERSIONS_WITH_UCD.map(async ({ version }) => getFilesByVersion(config, version)));

  return entries.flat();
}

export async function getFilesByVersion(config: Config, version: string): Promise<TreeViewNode> {
  const res = await fetch(new URL(`/api/v1/unicode-files/${version}`, config["data-files-api"]));

  if (!res.ok) {
    throw new Error(`Failed to fetch files for version ${version}: ${res.statusText}`);
  }

  interface Entry {
    name: string;
    children?: Entry[];
  }

  const data = (await res.json()) as Entry[];

  return {
    treeItem: {
      label: version,
      collapsibleState: 1,
      contextValue: "ucd:version-folder",
    },
    children: data.map((entry) => {
      return {
        treeItem: {
          label: entry.name,
          collapsibleState: entry.children?.length ? 2 : 0,
          contextValue: entry.children?.length ? "ucd:version-folder" : "ucd:version-file",
        },
        children: entry.children?.map((child) => ({
          treeItem: {
            label: child.name,
          },
        })) ?? [],
      };
    }),
  };
}
