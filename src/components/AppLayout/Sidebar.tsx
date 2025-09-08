import ThemeToggler from "./ThemeToggler";

export default function Sidebar(): React.JSX.Element {
  return (
    <>
      <div className="drawer-side font-semibold">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>

        <div className="min-h-full w-full grid place-items-center p-8">
          <ul className="menu h-[100%] w-80 bg-base-200 p-5 text-base-content rounded-2xl border-2 border-base-content/10">
            <li><button className="bg-base-300/70 border-2 mb-3 p-6 border-base-content/10">City 1</button></li>
            <li><button className="bg-base-300/70 border-2 mb-3 p-6 border-base-content/10">City 2</button></li>
            <li><button className="bg-base-300/70 border-2 mb-3 p-6 border-base-content/10">City 3</button></li>
            <div className="flex-1"></div>

         
            <ThemeToggler />
          </ul>
        </div>
      </div>

    </>
  );
}
