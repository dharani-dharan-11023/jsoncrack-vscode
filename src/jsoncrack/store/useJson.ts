import { create } from "zustand";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";
import { FILE_SIZE_LIMIT_BYTES } from "../constants";

interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  clear: () => void;
  setOverNodeLimit: (value: boolean) => void;
}

const initialStates = {
  json: "",
  loading: true,
  overSizeLimit: false,
  overNodeLimit: false,
};

export type JsonStates = typeof initialStates;

const useJson = create<JsonStates & JsonActions>()((set, get) => ({
  ...initialStates,
  getJson: () => get().json,
  setJson: json => {
    const overLimit = json.length > FILE_SIZE_LIMIT_BYTES;

    set({ json, loading: false, overSizeLimit: overLimit, overNodeLimit: false });

    if (overLimit) {
      useGraph.getState().clearGraph();
      return;
    }

    const parse = () => useGraph.getState().setGraph(json);

    if (typeof (window as any).requestIdleCallback === "function") {
      (window as any).requestIdleCallback(parse);
    } else {
      setTimeout(parse, 0);
    }
  },
  clear: () => {
    set({ json: "", loading: false, overSizeLimit: false, overNodeLimit: false });
    useGraph.getState().clearGraph();
  },
  setOverNodeLimit: value => set({ overNodeLimit: value }),
}));

export default useJson;
