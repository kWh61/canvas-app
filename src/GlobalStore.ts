import create from 'zustand';

type State = {
  mode: "rectangle"|"line"|"pen",
  setMode: (mode: "rectangle"|"line"|"pen") => void
};

const useStore = create<State>(set => ({
  mode: "rectangle",
  setMode: (mode: "rectangle"|"line"|"pen") => set({ mode })
}));

export default useStore;