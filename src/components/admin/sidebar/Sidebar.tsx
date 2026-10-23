import NavList from "./NavList";
import "./sidebar.scss";

/** Desktop only. On phones the same menu opens from the top-left button. */
const Sidebar = () => (
  <aside className="admin-sidebar">
    <NavList />
  </aside>
);

export default Sidebar;
