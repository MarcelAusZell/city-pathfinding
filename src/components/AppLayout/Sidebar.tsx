import ThemeToggler from "./ThemeToggler";
import { useMap } from "../../stores/mapStore";


export default function Sidebar(): React.JSX.Element {
  const { map, setMap } = useMap()

  return (
    <>
      <div className="min-h-screen grid place-items-center p-8 font-semibold">
        <ul className="menu h-[100%] w-80 bg-base-200 p-5 text-base-content rounded-2xl border-2 border-base-content/10">
          <li><button className="bg-base-300/70 rounded-2xl border-2 mb-3 p-6 border-base-content/10" onClick={() => setMap("Aachen, Germany.json")}>Aachen, Germany</button></li>
          <li><button className="bg-base-300/70 rounded-2xl border-2 mb-3 p-6 border-base-content/10" onClick={() => setMap("Cologne, Germany.json")}>Cologne, Germany</button></li>
          <li><button className="bg-base-300/70 rounded-2xl border-2 mb-3 p-6 border-base-content/10" onClick={() => setMap("Los Angeles, USA.json")}>Los Angeles, USA</button></li>
          <li><button className="bg-base-300/70 rounded-2xl border-2 mb-3 p-6 border-base-content/10" onClick={() => setMap("New York, USA.json")}>New York, USA</button></li>
          <div className="flex-1"></div>
          <ThemeToggler />
        </ul>
      </div>
    </>
  );
}