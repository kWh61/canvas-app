import create from 'zustand';
import { useRef } from 'react';
import { CanvasData } from './Canvas/CanvasUtils';

type State = {
  canvasData: CanvasData,
  setCanvasData: (canvasData: CanvasData) => void,
  mode: "rectangle"|"line"|"pen",
  setMode: (mode: "rectangle"|"line"|"pen") => void,
};

const useStore = create<State>(set => ({
  canvasData: { operationPointer: -1, operations: [] },
  setCanvasData: (canvasData: CanvasData) => set({ canvasData }),
  mode: "rectangle",
  setMode: (mode: "rectangle"|"line"|"pen") => set({ mode })
}));

export default useStore;