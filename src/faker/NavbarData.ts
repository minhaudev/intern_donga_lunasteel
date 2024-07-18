import ChartFill from "@/assets/svgs/chart_fill.svg";
import IconFilleDocAdd from "@/assets/svgs/file_dock_add_fill.svg";
import FileDocFill from "@/assets/svgs/file_dock_fill.svg";
import LineUp from "@/assets/svgs/line_up.svg";
import PaperFill from "@/assets/svgs/paper_fill.svg";
import UserCircle from "@/assets/svgs/user_cicrle.svg";
import Database from "@/assets/svgs/database_fill.svg";
import TagPercent from "@/assets/svgs/offer_Percent.svg";
import FileCheck from "@/assets/svgs/file_Tick.svg";
import Box3d from "@/assets/svgs/3d_box.svg";
import UserAdd from "@/assets/svgs/user_add_alt_fill.svg";
import GroupUser from "@/assets/svgs/manage_user_group.svg";
import ProductUser from "@/assets/svgs/product_User.svg";
import ChevronUp from "@/assets/svgs/expand_up.svg";
import {NavbarProps, NavigationTypeData} from "@/interfaces";

export const navbarData: NavigationTypeData = {
    client: [
        {
            id: 1,
            prefixIcon: IconFilleDocAdd,
            title: "Create Sales Order",
            href: "/home"
        },
        {
            id: 2,
            prefixIcon: FileDocFill,
            title: "Sales Order Management",
            href: "/order",
            subMenu: [
                {
                    id: 2.1,
                    leadingIcon: ChevronUp,
                    title: "Approved Orders",
                    href: "/approve",
                    subMenu: [
                        {
                            id: 2.12,
                            title: "Pending Delivery",
                            href: "/order/approve/delivery"
                        },
                        {
                            id: 2.13,
                            title: "Works in progress",
                            href: "/order/approve/progress"
                        },
                        {
                            id: 2.14,
                            title: "Complete & Denied",
                            href: "/order/approve/denied"
                        }
                    ]
                },
                {id: 2.2, title: "Pending Approvals", href: "/order/pending"},
                {id: 2.3, title: "Drafts", href: "/order/draft"},
                {id: 2.4, title: "Canceled & Denied", href: "/order/denied"}
            ]
        },
        {
            id: 3,
            prefixIcon: GroupUser,
            title: "Customer Management",
            href: "/contact"
        }
    ],
    admin: [
        {
            id: 1,
            prefixIcon: UserCircle,
            title: "Employee Management",
            href: "#"
        },
        {
            id: 2,
            prefixIcon: LineUp,
            title: "Price index & Policy",
            href: "#"
        },
        {
            id: 3,
            prefixIcon: ChartFill,
            title: "Domestic Sales Management",
            href: "#"
        },
        {
            id: 4,
            prefixIcon: PaperFill,
            title: "Debt Management",
            href: "#"
        }
    ],
    manage: [
        {
            id: 1,
            prefixIcon: ProductUser,
            title: "Production Management",
            href: "#"
        },
        {
            id: 2,
            prefixIcon: Box3d,
            title: "Inventory Management    ",
            href: "#"
        },
        {
            id: 3,
            prefixIcon: UserAdd,
            title: "Other Department Management",
            href: "#"
        },
        {
            id: 4,
            prefixIcon: FileCheck,
            title: "Order Approvals",
            href: "#"
        },
        {
            id: 5,
            prefixIcon: Database,
            title: "Data Configuration",
            href: "#"
        },
        {
            id: 6,
            prefixIcon: TagPercent,
            title: "Discount Management",
            href: "#"
        }
    ]
};
