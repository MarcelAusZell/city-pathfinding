import Sidebar from "./components/AppLayout/Sidebar";
import Navbar from "./components/AppLayout/Navbar";
import GraphVisualizer from "./components/GraphVisualizer/GraphVisualizer";

export default function App() {
  return (
    <>
      <div className="drawer lg:drawer-open">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col justify-center items-center">
          <Navbar />

          <main className="p-4">
            <GraphVisualizer />
          </main>
        </div>
        <Sidebar />
      </div>
    </>
  );
}
