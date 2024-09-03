"use client";
import {
  Box,
  House,
  List,
  LucideProps,
  Mail,
  Settings,
  TabletSmartphone,
  Users,
  ChartNoAxesColumn,
  Hammer,
  ShoppingBag,
  UserRound,
  LogOut,
} from "lucide-react";
import styles from "./sidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import Image from "next/image";

const sideItems = [
  {
    route: "Dashboard",
    link: "/",
    icon: House,
    id: "dashboard",
  },
  {
    route: "Reports",
    link: "/reports",
    icon: ChartNoAxesColumn,
    id: "reports",
  },
  {
    route: "Production",
    link: "/production",
    icon: Hammer,
    id: "production",
  },
  {
    route: "Purchasing",
    link: "/purchasing",
    icon: ShoppingBag,
    id: "purchasing",
  },
  {
    route: "Profile",
    link: "/profile",
    icon: UserRound,
    id: "profile",
  },
  {
    route: "Sign Out",
    link: "/logout",
    icon: LogOut,
    id: "logout",
  },
];

interface Iproperties {
  sideNavitems?: {
    route: string;
    link: string;
    icon: ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
    >;
    id: string;
  }[];
  currenPathName?: string;
}

const Sidebar: FC<Iproperties> = ({ sideNavitems = sideItems }) => {
  const pathname = usePathname();
  const currentPath = pathname?.split("/")[3];
  console.log(pathname);

  return (
    <div className={styles.sidebarMain}>
      <Image
        className={styles.logo}
        src="/assets/tachet-logo 2.svg"
        alt="logo"
        width={150}
        height={100}
      ></Image>
      {/* <span>TACHET</span> */}
      <section className={styles.sidebarList}>
        {sideNavitems.map((item, index) => (
          <div key={index}>
            {/* Render 'Account Pages' only before the 'Profile' route */}
            {item.route === "Profile" && (
              <p className={styles.heading}>ACCOUNT PAGES</p>
            )}
            <Link href={item.link} className={styles.linkRoutes}>
              <item.icon className={styles.linkIcon} size={30} />
              <span className={styles.route}>{item.route}</span>
            </Link>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Sidebar;
