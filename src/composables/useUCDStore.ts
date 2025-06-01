import { createUCDStore } from "@ucdjs/ucd-store";
import { createSingletonComposable, ref, watch } from "reactive-vscode";
import { config } from "../config";

export const useUCDStore = createSingletonComposable(() => {
  const store = ref<Awaited<ReturnType<typeof createUCDStore>> | null>(null);

  const createStoreFromConfig = async (localDataFilesStore: string | null) => {
    if (localDataFilesStore == null) {
      return await createUCDStore("remote", {
        filters: config["store-filters"],
      });
    } else {
      return await createUCDStore("local", {
        basePath: localDataFilesStore,
        filters: config["store-filters"],
      });
    }
  };

  watch(
    () => config["local-store-path"],
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
