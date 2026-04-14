"use client";

import { useState, useEffect } from "react";
import { Bell, User, Settings, LogOut, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getOrganizationName, setOrganizationName, CURRENCIES, getCurrentCurrency, setCurrency, type CurrencyCode } from "@/lib/utils";
import { toast } from "sonner";

export function Header() {
  const [orgName, setOrgName] = useState("StockOptima");
  const [currency, setCurrencyState] = useState<CurrencyCode>("KES");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempOrgName, setTempOrgName] = useState("");
  const [notificationCount] = useState(3); // Mock notification count

  useEffect(() => {
    // Load organization name and currency
    setOrgName(getOrganizationName());
    setCurrencyState(getCurrentCurrency());
    setTempOrgName(getOrganizationName());

    // Listen for organization name changes
    const handleOrgChange = () => {
      setOrgName(getOrganizationName());
    };
    window.addEventListener("organizationNameChanged", handleOrgChange);
    return () => window.removeEventListener("organizationNameChanged", handleOrgChange);
  }, []);

  const handleSaveSettings = () => {
    if (tempOrgName.trim()) {
      setOrganizationName(tempOrgName.trim());
      setOrgName(tempOrgName.trim());
      toast.success("Settings saved successfully");
      setSettingsOpen(false);
    } else {
      toast.error("Organization name cannot be empty");
    }
  };

  const handleCurrencyChange = (newCurrency: CurrencyCode) => {
    setCurrency(newCurrency);
    setCurrencyState(newCurrency);
    toast.success(`Currency changed to ${CURRENCIES[newCurrency].name}`);
    // Reload page to update all currency displays
    window.location.reload();
  };

  return (
    <>
      <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Building2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">{orgName}</h2>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Currency Selector */}
          <Select value={currency} onValueChange={handleCurrencyChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(CURRENCIES).map(([code, config]) => (
                <SelectItem key={code} value={code}>
                  {config.symbol} {config.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-medium text-white flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-3 hover:bg-accent cursor-pointer border-b">
                  <p className="text-sm font-medium">Low Stock Alert</p>
                  <p className="text-xs text-muted-foreground">
                    Mechanical Keyboard is running low (8 units left)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                </div>
                <div className="p-3 hover:bg-accent cursor-pointer border-b">
                  <p className="text-sm font-medium">Low Stock Alert</p>
                  <p className="text-xs text-muted-foreground">
                    27&quot; Monitor needs restocking (5 units left)
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                </div>
                <div className="p-3 hover:bg-accent cursor-pointer">
                  <p className="text-sm font-medium">Stock Updated</p>
                  <p className="text-xs text-muted-foreground">
                    USB-C Cable stock increased by 100 units
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="ghost" className="w-full text-xs">
                  View All Notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">{orgName}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Settings Dialog */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Preferences</DialogTitle>
            <DialogDescription>
              Customize your StockOptima experience
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                value={tempOrgName}
                onChange={(e) => setTempOrgName(e.target.value)}
                placeholder="Enter your organization name"
              />
              <p className="text-xs text-muted-foreground">
                This name will appear throughout the application
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Preferred Currency</Label>
              <Select value={currency} onValueChange={(value) => setCurrencyState(value as CurrencyCode)}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CURRENCIES).map(([code, config]) => (
                    <SelectItem key={code} value={code}>
                      {config.symbol} {config.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                All prices will be displayed in this currency
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSettingsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSettings}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
