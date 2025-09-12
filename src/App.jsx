import Sidebar from "./components/AppLayout/Sidebar";
import GraphVisualizer from "./components/GraphVisualizer/GraphVisualizer";

export default function App() {
  return (
    <>
      <div className="flex">

        <Sidebar />

        <main className="flex-grow flex justify-center items-center">
          <GraphVisualizer />
        </main>
      </div>
    </>
  );
}