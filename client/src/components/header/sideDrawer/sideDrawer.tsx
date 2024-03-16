import { Sidebar } from "flowbite-react";
import { HiChartPie, HiFolder, HiCurrencyDollar } from "react-icons/hi";
import { Link } from "react-router-dom";

export function SideDrawer({ displaySideDrawer }: any) {
  return (
    <Sidebar
      aria-label="Default sidebar example"
      className={`fixed top-0  mt-24 z-40
    
      transition-all
      max-md:-translate-x-full
      ${displaySideDrawer && "max-md:translate-x-0"}`}
    >
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to={"/reports"}>
            {" "}
            <Sidebar.Item icon={HiChartPie}>Reports</Sidebar.Item>
          </Link>
          <Link to={"/expenses"}>
            {" "}
            <Sidebar.Item href="#" icon={HiCurrencyDollar}>
              Expenses
            </Sidebar.Item>{" "}
          </Link>
          <Link to={"/categories"}>
            {" "}
            <Sidebar.Item href="#" icon={HiFolder}>
              Categories
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}
