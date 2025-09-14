import GermanyLogo from "./assets/germany_logo";
import Sidebar from "./components/AppLayout/Sidebar";
import GraphVisualizer from "./components/GraphVisualizer/GraphVisualizer";

export default function App() {
  return (
    <>
      <div className="flex">
    <GermanyLogo/>
        <Sidebar />

        <main className="flex-grow flex justify-center items-center">
          <GraphVisualizer />
        </main>
      </div>
    </>
  );
}