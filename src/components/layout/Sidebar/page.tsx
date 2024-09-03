import {
  LucideProps,
  ChartNoAxesColumn,
  Hammer,
  ShoppingBag,
  UserRound,
  LogOut,
  House,
} from "lucide-react";
import styles from "./sidebar.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ForwardRefExoticComponent, RefAttributes } from "react";
import { Avatar } from "@chakra-ui/react";
import clsx from "clsx";

const sideItems = [
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
    route: "Reports",
    link: "/reports",
    icon: ChartNoAxesColumn,
    id: "reports",
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
  alignment: "top" | "left";
  title: string;
}

const Sidebar: FC<Iproperties> = ({
  sideNavitems = sideItems,
  title,
  alignment,
}) => {
  const pathname = usePathname();
  const currentPath = pathname?.split("/")[3];
  console.log(pathname);

  const showAvatar: boolean = title.toUpperCase() === "TACHET";

  // Determine the alignment-specific class
  const alignmentClass = alignment === "left" ? styles.leftAlignment : "";

  return (
    <div className={clsx(alignmentClass, styles.sidebarMain)}>
      <p className={styles.title}>{title}</p>
      <section className={clsx(alignmentClass, styles.sidebarList)}>
        {sideNavitems.map((item, index) => (
          <div key={index}>
            <Link href={item.link} className={styles.linkRoutes}>
              <item.icon className={styles.linkIcon} size={30} />
              <span className={styles.route}>{item.route}</span>
            </Link>
          </div>
        ))}
        {showAvatar && <Avatar size="sm" name="Jane Ahone" />}
        {/* link avatar to profile management */}
      </section>
    </div>
  );
};

export default Sidebar;
