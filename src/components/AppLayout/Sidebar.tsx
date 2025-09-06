import ThemeToggler from "./ThemeToggler";

export default function Sidebar(): React.JSX.Element {
  return (
    <>
      <div className="drawer-side font-semibold shadow-md">
        <label htmlFor="my-drawer" className="drawer-overlay"></label>
        <ul className="menu min-h-full w-80 bg-base-200/85 p-4 text-base-content">
          <li>
            TODO (Logo)
          </li>
          <li>
            <details open>
              <summary>TODO (Cities)</summary>
              <ul>
                <li>
                  TODO (Example)
                </li>
                <li>
                  TODO (Example)
                </li>
              </ul>
            </details>
          </li>

          <div className="flex-1"></div>
          <ThemeToggler></ThemeToggler>
        </ul>
      </div>
    </>
  );
}
