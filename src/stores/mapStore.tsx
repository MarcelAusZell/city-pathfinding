import { createContext, useContext, useState, type ReactNode } from "react";

type MapContextValue = {
  map: string;
  setMap: React.Dispatch<React.SetStateAction<string>>;
};

const MapContext = createContext<MapContextValue | undefined>(undefined);

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState("Aachen, Germany.json");
  return (
    <MapContext.Provider value={{ map, setMap }}>
      {children}
    </MapContext.Provider>
  );
}

export function useMap() {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error("useMap must be used within a MapProvider");
  return ctx;
}