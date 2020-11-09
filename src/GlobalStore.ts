import create from 'zustand';
import { CanvasData } from './Canvas/CanvasUtils';

type State = {
  canvasSize: { width: number, height: number },
  setCanvasSize: (width: number, height: number) => void,
  canvasData: CanvasData,
  setCanvasData: (canvasData: CanvasData) => void,
  mode: "rectangle"|"line"|"pen",
  setMode: (mode: "rectangle"|"line"|"pen") => void,
};

const useStore = create<State>(set => ({
  canvasSize: { width: 500, height: 300 },
  setCanvasSize: (width: number, height: number) => set({ canvasSize: { width, height } }),
  canvasData: { operationPointer: -1, operations: [] },
  setCanvasData: (canvasData: CanvasData) => set({ canvasData }),
  mode: "rectangle",
  setMode: (mode: "rectangle"|"line"|"pen") => set({ mode })
}));

export default useStore;