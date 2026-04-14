"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn, getOrganizationName } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings,
  BarChart3,
  Building2
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    label: "Inventory",
    icon: Package,
    href: "/inventory",
    color: "text-violet-500",
  },
  {
    label: "Suppliers",
    icon: Users,
    href: "/suppliers",
    color: "text-pink-700",
  },
  {
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    color: "text-orange-700",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
    color: "text-gray-500",
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [orgName, setOrgName] = useState("StockOptima");

  useEffect(() => {
    // Load organization name
    setOrgName(getOrganizationName());

    // Listen for organization name changes
    const handleOrgChange = () => {
      setOrgName(getOrganizationName());
    };
    window.addEventListener("organizationNameChanged", handleOrgChange);
    return () => window.removeEventListener("organizationNameChanged", handleOrgChange);
  }, []);

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-card border-r">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center gap-2 pl-3 mb-8">
          <Building2 className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              {orgName}
            </h1>
            <p className="text-xs text-muted-foreground">Inventory System</p>
          </div>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-accent hover:text-accent-foreground rounded-lg transition",
                pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
