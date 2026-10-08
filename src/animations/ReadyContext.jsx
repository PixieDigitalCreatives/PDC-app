import { createContext, useContext } from "react";

// True once the preloader has finished, so hero choreography starts on cue.
export const ReadyContext = createContext(true);
export const useReady = () => useContext(ReadyContext);
