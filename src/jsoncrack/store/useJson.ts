import { create } from "zustand";
import useGraph from "../features/editor/views/GraphView/stores/useGraph";

interface JsonActions {
  setJson: (json: string) => void;
  getJson: () => string;
  clear: () => void;
}

const initialStates = {
  json: "",
  loading: true,
  overSizeLimit: false,
};

export type JsonStates = typeof initialStates;

const useJson = create<JsonStates & JsonActions>()((set, get) => ({
  ...initialStates,
  getJson: () => get().json,
  setJson: json => {
    const SIZE_LIMIT =
      (+(process.env.NEXT_PUBLIC_FILE_SIZE_LIMIT_MB as string) || 5) *
      1024 * 1024;
    const overLimit = json.length > SIZE_LIMIT;

    set({ json, loading: false, overSizeLimit: overLimit });

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
    set({ json: "", loading: false, overSizeLimit: false });
    useGraph.getState().clearGraph();
  },
}));

export default useJson;
