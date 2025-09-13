import ThemeToggler from "./ThemeToggler";
import { useMap } from "../../stores/mapStore";
import { useToolMode } from "../../stores/toolMode";

export default function Sidebar(): React.JSX.Element {
  const { map, setMap } = useMap();
  const { mode, setMode } = useToolMode();

  const cities = [
    "Aachen, Germany.json",
    "Cologne, Germany.json",
    "Los Angeles, USA.json",
    "New York, USA.json",
    "Barcelona, Spain.json",
    "Moscow, Russia.json",
  ];

  return (
    <div className="min-h-screen grid place-items-center p-8 font-semibold">
      <ul className="menu h-[95%] w-80 bg-base-200 p-5 text-base-content rounded-3xl border-2 border-base-content/10">
        {cities.map((city) => (
          <li key={city} >
            <button
              className={`rounded-2xl border-2 mb-3 p-6 border-base-content/10 text-md ${map === city ? "bg-base-content/20 text-primary" : "bg-base-300/70"
                }`}
              onClick={() => setMap(city)}
            >
              {city.replace(".json", "")}
            </button>
          </li>
        ))}
        <div className="flex-1" />

        <div className="join flex justify-center">
          <button className={`btn join-item border-2 border-base-content/10 bg-base-200 ${mode == "addSource" ? "bg-base-content/20 text-primary" : "bg-base-300/70"}`} onClick={() => setMode("addSource")}>Add Source
            <svg viewBox="0 0 10 10" width={10}>
              <circle cx="5" cy="5" r={5} fill="red" />
            </svg>
          </button>
          <button className={`btn join-item border-2 border-base-content/10 bg-base-200 ${mode == "addSink" ? "bg-base-content/20 text-primary" : "bg-base-300/70"}`} onClick={() => setMode("addSink")}>Add Sink
            <svg viewBox="0 0 10 10" width={10}>
              <circle cx="5" cy="5" r={5} fill="green" />
            </svg>
          </button>
        </div>


        <ThemeToggler />
      </ul>
    </div>
  );
}
