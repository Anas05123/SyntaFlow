import { contextBridge, ipcRenderer } from "electron";
import {
  healthResponseSchema,
  jobsResponseSchema,
  settingsSchema,
  settingsUpdateSchema,
  type AtlasPreloadApi,
  type SafeSettings,
} from "@atlas/contracts";

const atlasApi: AtlasPreloadApi = {
  app: {
    health: async () => {
      const response: unknown = await ipcRenderer.invoke("app:health");
      return healthResponseSchema.parse(response);
    },
  },
  settings: {
    read: async () => {
      const response: unknown = await ipcRenderer.invoke("settings:read");
      return settingsSchema.parse(response);
    },
    update: async (patch: Partial<SafeSettings>) => {
      const response: unknown = await ipcRenderer.invoke(
        "settings:update",
        settingsUpdateSchema.parse(patch),
      );
      return settingsSchema.parse(response);
    },
  },
  jobs: {
    list: async () => {
      const response: unknown = await ipcRenderer.invoke("jobs:list");
      return jobsResponseSchema.parse(response);
    },
  },
};

contextBridge.exposeInMainWorld("atlas", atlasApi);
