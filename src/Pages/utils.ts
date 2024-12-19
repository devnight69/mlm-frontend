import {
  CreditCard,
  HelpCircle,
  Key,
  LayoutDashboard,
  Settings,
  User,
  UserPlus2,
  Users,
  Wallet,
} from "lucide-react";

export const menuItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    route: "/dashboard",
  },
  {
    icon: User,
    label: "Profile",
    route: "/profile",
  },
  {
    icon: Users,
    label: "Referral Network",
    route: "/referral-network",
  },
  {
    icon: Wallet,
    label: "Earnings",
    route: "/earnings",
  },
  {
    icon: CreditCard,
    label: "Withdraw Earnings",
    route: "/withdraw-earnings",
  },
  {
    icon: CreditCard,
    label: "Withdrawl Requests",
    route: "/withdraw-requests",
  },
  {
    icon: Key,
    label: "Pin Management",
    route: "/pin-management",
  },
  {
    icon: UserPlus2,
    label: "Register",
    route: "/register",
  },
  {
    icon: Settings,
    label: "Settings",
    route: "",
  },
  {
    icon: HelpCircle,
    label: "Support",
    route: "",
  },
];
