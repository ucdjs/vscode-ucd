import { createUCDStore } from "@ucdjs/ucd-store";
import { createSingletonComposable, ref, watch } from "reactive-vscode";
import { config } from "../config";

export const useUCDStore = createSingletonComposable(() => {
  const store = ref<Awaited<ReturnType<typeof createUCDStore>> | null>(null);

  const createStoreFromConfig = async (localDataFilesStore: string | null) => {
    if (localDataFilesStore == null) {
      return await createUCDStore("remote");
    } else {
      return await createUCDStore("local", {
        basePath: localDataFilesStore,
      });
    }
  };

  watch(
    () => config["local-data-files-store"],
    async (newVal, oldVal) => {
      if (newVal === oldVal) {
        return;
      }

      try {
        store.value = await createStoreFromConfig(newVal);
      } catch (error) {
        console.error("Failed to create UCD store:", error);
        store.value = null;
      }
    },
    { immediate: true },
  );

  return store;
});
