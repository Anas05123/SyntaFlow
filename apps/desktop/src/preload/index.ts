import { contextBridge, ipcRenderer } from "electron";
import { healthResponseSchema, type AtlasPreloadApi } from "@atlas/contracts";

const atlasApi: AtlasPreloadApi = {
  app: {
    health: async () => {
      const response: unknown = await ipcRenderer.invoke("app:health");
      return healthResponseSchema.parse(response);
    },
  },
};

contextBridge.exposeInMainWorld("atlas", atlasApi);
