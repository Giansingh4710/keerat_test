import { createContext, useContext } from 'react';

export const TrackDataContext = createContext(undefined);

export function useTrackContext() {
  const trackObj = useContext(TrackDataContext);
  if (user === undefined) {
    throw new Error('useTrackContext must be used');
  }
  return trackObj;
}
