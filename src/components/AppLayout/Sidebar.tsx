import ThemeToggler from "./ThemeToggler";
import { useMap } from "../../stores/mapStore";

export default function Sidebar(): React.JSX.Element {
  const { map, setMap } = useMap();

  const cities = [
    "Aachen, Germany.json",
    "Cologne, Germany.json",
    "Los Angeles, USA.json",
    "New York, USA.json",
  ];

  return (
    <div className="min-h-screen grid place-items-center p-8 font-semibold">
      <ul className="menu h-[100%] w-80 bg-base-200 p-5 text-base-content rounded-2xl border-2 border-base-content/10">
        {cities.map((city) => (
          <li key={city}>
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
        <ThemeToggler />
      </ul>
    </div>
  );
}
