"use client";

import * as React from "react";
import { Suspense } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { Bell, Monitor, Palette, User, Wrench } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { type FontKey, fontOptions } from "@/lib/fonts/registry";
import type { ContentLayout, NavbarStyle, SidebarCollapsible, SidebarVariant } from "@/lib/preferences/layout";
import {
  applyContentLayout,
  applyFont,
  applyNavbarStyle,
  applySidebarCollapsible,
  applySidebarMatchBackground,
  applySidebarVariant,
} from "@/lib/preferences/layout-utils";
import { PREFERENCE_DEFAULTS } from "@/lib/preferences/preferences-config";
import { persistPreference } from "@/lib/preferences/preferences-storage";
import { THEME_PRESET_OPTIONS, type ThemeMode, type ThemePreset } from "@/lib/preferences/theme";
import { applyThemePreset } from "@/lib/preferences/theme-utils";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

// Sub-component to prevent Next.js SSR / static generation issues with useSearchParams
function SettingsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get active tab from URL query params, default to "profile"
  const activeTab = (searchParams.get("tab") || "profile") as
    | "profile"
    | "account"
    | "appearance"
    | "notifications"
    | "display";

  const handleTabChange = (tabName: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabName);
    router.push(`/dashboard/settings?${params.toString()}`);
  };

  // Preference Store bindings for live interactive controls (from Gear Popover)
  const themeMode = usePreferencesStore((s) => s.themeMode);
  const setThemeMode = usePreferencesStore((s) => s.setThemeMode);
  const resolvedThemeMode = usePreferencesStore((s) => s.resolvedThemeMode);
  const themePreset = usePreferencesStore((s) => s.themePreset);
  const setThemePreset = usePreferencesStore((s) => s.setThemePreset);
  const font = usePreferencesStore((s) => s.font);
  const setFont = usePreferencesStore((s) => s.setFont);

  const contentLayout = usePreferencesStore((s) => s.contentLayout);
  const setContentLayout = usePreferencesStore((s) => s.setContentLayout);
  const navbarStyle = usePreferencesStore((s) => s.navbarStyle);
  const setNavbarStyle = usePreferencesStore((s) => s.setNavbarStyle);
  const sidebarVariant = usePreferencesStore((s) => s.sidebarVariant);
  const setSidebarVariant = usePreferencesStore((s) => s.setSidebarVariant);
  const sidebarCollapsible = usePreferencesStore((s) => s.sidebarCollapsible);
  const setSidebarCollapsible = usePreferencesStore((s) => s.setSidebarCollapsible);
  const showQuickCreate = usePreferencesStore((s) => s.showQuickCreate);
  const setShowQuickCreate = usePreferencesStore((s) => s.setShowQuickCreate);
  const showSidebarTrigger = usePreferencesStore((s) => s.showSidebarTrigger);
  const setShowSidebarTrigger = usePreferencesStore((s) => s.setShowSidebarTrigger);
  const sidebarMatchBackground = usePreferencesStore((s) => s.sidebarMatchBackground);
  const setSidebarMatchBackground = usePreferencesStore((s) => s.setSidebarMatchBackground);

  // Preference Handlers (matching layout-controls.tsx style)
  const onThemePresetChange = (preset: ThemePreset) => {
    applyThemePreset(preset);
    setThemePreset(preset);
    void persistPreference("theme_preset", preset);
    toast.success(`Theme preset changed to ${preset}`);
  };

  const onThemeModeChange = (mode: ThemeMode | "") => {
    if (!mode) return;
    setThemeMode(mode);
    void persistPreference("theme_mode", mode);
    toast.success(`Theme mode changed to ${mode}`);
  };

  const onContentLayoutChange = (layout: ContentLayout | "") => {
    if (!layout) return;
    applyContentLayout(layout);
    setContentLayout(layout);
    void persistPreference("content_layout", layout);
    toast.success(`Page layout changed to ${layout}`);
  };

  const onNavbarStyleChange = (style: NavbarStyle | "") => {
    if (!style) return;
    applyNavbarStyle(style);
    setNavbarStyle(style);
    void persistPreference("navbar_style", style);
    toast.success(`Navbar style changed to ${style}`);
  };

  const onSidebarStyleChange = (value: SidebarVariant | "") => {
    if (!value) return;
    setSidebarVariant(value);
    applySidebarVariant(value);
    void persistPreference("sidebar_variant", value);
    toast.success(`Sidebar style changed to ${value}`);
  };

  const onSidebarCollapseModeChange = (value: SidebarCollapsible | "") => {
    if (!value) return;
    setSidebarCollapsible(value);
    applySidebarCollapsible(value);
    void persistPreference("sidebar_collapsible", value);
    toast.success(`Sidebar collapse mode changed to ${value}`);
  };

  const onFontChange = (value: FontKey | "") => {
    if (!value) return;
    applyFont(value);
    setFont(value);
    void persistPreference("font", value);
    toast.success("Typography font updated!");
  };

  const handleRestore = () => {
    onThemePresetChange(PREFERENCE_DEFAULTS.theme_preset);
    onThemeModeChange(PREFERENCE_DEFAULTS.theme_mode);
    onContentLayoutChange(PREFERENCE_DEFAULTS.content_layout);
    onNavbarStyleChange(PREFERENCE_DEFAULTS.navbar_style);
    onSidebarStyleChange(PREFERENCE_DEFAULTS.sidebar_variant);
    onSidebarCollapseModeChange(PREFERENCE_DEFAULTS.sidebar_collapsible);
    onFontChange(PREFERENCE_DEFAULTS.font);
    setShowQuickCreate(true);
    void persistPreference("show_quick_create", "true");
    setShowSidebarTrigger(true);
    void persistPreference("show_sidebar_trigger", "true");
    setSidebarMatchBackground(false);
    applySidebarMatchBackground("false");
    void persistPreference("sidebar_match_background", "false");
    toast.success("All settings restored to defaults!");
  };

  // Form states for non-store fields
  const [username, setUsername] = React.useState("fdrahman");
  const [bio, setBio] = React.useState("Software Engineer at Omniverse. Building modern enterprise solutions.");
  const [selectedEmail, setSelectedEmail] = React.useState("fdrahman@rexcorp.id");

  // Notifications Form States
  const [emailNotif, setEmailNotif] = React.useState(true);
  const [securityNotif, setSecurityNotif] = React.useState(true);
  const [marketingNotif, setMarketingNotif] = React.useState(false);

  // Display Checkbox States (as in the screenshot)
  const [displayItems, setDisplayItems] = React.useState({
    recents: true,
    home: true,
    applications: false,
    desktop: false,
    downloads: false,
    documents: false,
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
  };

  const handleUpdateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Account settings updated successfully!");
  };

  const handleUpdateDisplay = () => {
    toast.success("Display settings updated successfully!");
  };

  // Display Settings Page Content based on tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div key="tab-profile" className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">Profile</h3>
              <p className="text-muted-foreground text-sm">This is how others will see you on the site.</p>
            </div>
            <Separator />
            <form onSubmit={handleUpdateProfile} className="max-w-xl space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                />
                <p className="text-[12px] text-muted-foreground">
                  This is your public display name. It can be your real name or a pseudonym. You can only change this
                  once every 30 days.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Select value={selectedEmail} onValueChange={setSelectedEmail}>
                  <SelectTrigger id="email">
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="fdrahman@rexcorp.id">fdrahman@rexcorp.id</SelectItem>
                      <SelectItem value="hello@rexcorp.id">hello@rexcorp.id</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <p className="text-[12px] text-muted-foreground">
                  You can manage verified email addresses in your email settings.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us a little bit about yourself"
                  className="min-h-[100px]"
                />
                <p className="text-[12px] text-muted-foreground">
                  You can @mention other users and organizations to link to them.
                </p>
              </div>

              <Button type="submit">Update profile</Button>
            </form>
          </div>
        );

      case "account":
        return (
          <div key="tab-account" className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">Account</h3>
              <p className="text-muted-foreground text-sm">
                Update your account settings. Set your preferred language and timezone.
              </p>
            </div>
            <Separator />
            <form onSubmit={handleUpdateAccount} className="max-w-xl space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Fadhlur Rahman" placeholder="Your name" />
                <p className="text-[12px] text-muted-foreground">
                  Your name is used across the platform to identify you.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select defaultValue="id">
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="id">Bahasa Indonesia</SelectItem>
                      <SelectItem value="de">Deutsch</SelectItem>
                      <SelectItem value="ja">日本語</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select defaultValue="gmt7">
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="gmt7">GMT+07:00 (Jakarta, Indonesia)</SelectItem>
                      <SelectItem value="utc">UTC (GMT+00:00)</SelectItem>
                      <SelectItem value="est">EST (GMT-05:00)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit">Update account</Button>
            </form>
          </div>
        );

      case "appearance":
        return (
          <div key="tab-appearance" className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">Appearance</h3>
              <p className="text-muted-foreground text-sm">
                Customize the appearance of the application. Automatically switch between day and night themes.
              </p>
            </div>
            <Separator />
            <div className="max-w-xl space-y-5 **:data-[slot=toggle-group]:w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs">
              {/* Color Preset Selector */}
              <div className="space-y-1">
                <Label className="font-medium text-xs">Theme Preset</Label>
                <Select value={themePreset} onValueChange={onThemePresetChange}>
                  <SelectTrigger size="sm" className="w-full text-xs">
                    <SelectValue placeholder="Preset" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {THEME_PRESET_OPTIONS.map((preset) => (
                        <SelectItem key={preset.value} className="text-xs" value={preset.value}>
                          <span
                            className="mr-2 inline-block size-2.5 rounded-full align-middle"
                            style={{
                              backgroundColor:
                                (resolvedThemeMode ?? "light") === "dark" ? preset.primary.dark : preset.primary.light,
                            }}
                          />
                          <span className="align-middle">{preset.label}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Fonts Selector */}
              <div className="space-y-1">
                <Label className="font-medium text-xs">Fonts</Label>
                <Select value={font} onValueChange={onFontChange}>
                  <SelectTrigger size="sm" className="w-full text-xs">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {fontOptions.map((f) => (
                        <SelectItem key={f.key} className="text-xs" value={f.key}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Theme Mode Toggle */}
              <div className="space-y-1">
                <Label className="font-medium text-xs">Theme Mode</Label>
                <ToggleGroup
                  size="sm"
                  variant="outline"
                  type="single"
                  value={themeMode}
                  onValueChange={onThemeModeChange}
                >
                  <ToggleGroupItem value="light" aria-label="Toggle light">
                    Light
                  </ToggleGroupItem>
                  <ToggleGroupItem value="dark" aria-label="Toggle dark">
                    Dark
                  </ToggleGroupItem>
                  <ToggleGroupItem value="system" aria-label="Toggle system">
                    System
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Page Layout Toggle */}
              <div className="space-y-1">
                <Label className="font-medium text-xs">Page Layout</Label>
                <ToggleGroup
                  size="sm"
                  variant="outline"
                  type="single"
                  value={contentLayout}
                  onValueChange={onContentLayoutChange}
                >
                  <ToggleGroupItem value="centered" aria-label="Toggle centered">
                    Centered
                  </ToggleGroupItem>
                  <ToggleGroupItem value="full-width" aria-label="Toggle full-width">
                    Full Width
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Navbar Behavior Toggle */}
              <div className="space-y-1">
                <Label className="font-medium text-xs">Navbar Behavior</Label>
                <ToggleGroup
                  size="sm"
                  variant="outline"
                  type="single"
                  value={navbarStyle}
                  onValueChange={onNavbarStyleChange}
                >
                  <ToggleGroupItem value="sticky" aria-label="Toggle sticky">
                    Sticky
                  </ToggleGroupItem>
                  <ToggleGroupItem value="scroll" aria-label="Toggle scroll">
                    Scroll
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Sidebar Style Toggle */}
              <div className="space-y-1">
                <Label className="font-medium text-xs">Sidebar Style</Label>
                <ToggleGroup
                  size="sm"
                  variant="outline"
                  type="single"
                  value={sidebarVariant}
                  onValueChange={onSidebarStyleChange}
                >
                  <ToggleGroupItem value="default" aria-label="Toggle default">
                    Default
                  </ToggleGroupItem>
                  <ToggleGroupItem value="inset" aria-label="Toggle inset">
                    Inset
                  </ToggleGroupItem>
                  <ToggleGroupItem value="sidebar" aria-label="Toggle sidebar">
                    Sidebar
                  </ToggleGroupItem>
                  <ToggleGroupItem value="floating" aria-label="Toggle floating">
                    Floating
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Sidebar Collapse Toggle */}
              <div className="space-y-1">
                <Label className="font-medium text-xs">Sidebar Collapse Mode</Label>
                <ToggleGroup
                  size="sm"
                  variant="outline"
                  type="single"
                  value={sidebarCollapsible}
                  onValueChange={onSidebarCollapseModeChange}
                >
                  <ToggleGroupItem value="icon" aria-label="Toggle icon">
                    Icon
                  </ToggleGroupItem>
                  <ToggleGroupItem value="offcanvas" aria-label="Toggle offcanvas">
                    OffCanvas
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>

              {/* Sidebar Toggle Button Switch */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 pr-4">
                  <h5 className="font-medium text-sm">Header Sidebar Toggle</h5>
                  <p className="text-[11px] text-muted-foreground">
                    Show or hide the sidebar toggle button in the header bar.
                  </p>
                </div>
                <Switch
                  checked={showSidebarTrigger}
                  onCheckedChange={(checked) => {
                    setShowSidebarTrigger(checked);
                    void persistPreference("show_sidebar_trigger", checked ? "true" : "false");
                    toast.success(`Sidebar Toggle ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>

              {/* Match Sidebar Background Switch */}
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 pr-4">
                  <h5 className="font-medium text-sm">Match Sidebar Background</h5>
                  <p className="text-[11px] text-muted-foreground">
                    Set sidebar background color to match the primary page background.
                  </p>
                </div>
                <Switch
                  checked={sidebarMatchBackground}
                  onCheckedChange={(checked) => {
                    setSidebarMatchBackground(checked);
                    applySidebarMatchBackground(checked ? "true" : "false");
                    void persistPreference("sidebar_match_background", checked ? "true" : "false");
                    toast.success(`Sidebar Background Match ${checked ? "enabled" : "disabled"}`);
                  }}
                />
              </div>

              <Button type="button" variant="outline" className="w-full text-xs" onClick={handleRestore}>
                Restore Defaults
              </Button>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div key="tab-notifications" className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">Notifications</h3>
              <p className="text-muted-foreground text-sm">Configure how you receive notifications.</p>
            </div>
            <Separator />
            <div className="max-w-xl space-y-5">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 pr-4">
                  <h5 className="font-medium text-sm">Email Notifications</h5>
                  <p className="text-[12px] text-muted-foreground">
                    Receive emails about your account activity and security alerts.
                  </p>
                </div>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 pr-4">
                  <h5 className="font-medium text-sm">Security Notifications</h5>
                  <p className="text-[12px] text-muted-foreground">
                    Receive critical alerts regarding system performance, logins, and settings changes.
                  </p>
                </div>
                <Switch checked={securityNotif} onCheckedChange={setSecurityNotif} />
              </div>

              <div className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5 pr-4">
                  <h5 className="font-medium text-sm">Marketing & Features</h5>
                  <p className="text-[12px] text-muted-foreground">
                    Receive monthly newsletters, tips, and feature release updates.
                  </p>
                </div>
                <Switch checked={marketingNotif} onCheckedChange={setMarketingNotif} />
              </div>

              <Button onClick={() => toast.success("Notification preferences saved!")}>Save notifications</Button>
            </div>
          </div>
        );

      case "display":
        return (
          <div key="tab-display" className="space-y-6">
            <div>
              <h3 className="font-semibold text-lg">Display</h3>
              <p className="text-muted-foreground text-sm">
                Turn items on or off to control what's displayed in the app.
              </p>
            </div>
            <Separator />
            <div className="max-w-xl space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Sidebar</h4>
                <p className="text-muted-foreground text-xs">Select the items you want to display in the sidebar.</p>
                <div className="space-y-3">
                  {[
                    { id: "recents", label: "Recents" },
                    { id: "home", label: "Home" },
                    { id: "applications", label: "Applications" },
                    { id: "desktop", label: "Desktop" },
                    { id: "downloads", label: "Downloads" },
                    { id: "documents", label: "Documents" },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <Checkbox
                        id={item.id}
                        checked={displayItems[item.id as keyof typeof displayItems]}
                        onCheckedChange={(checked) => {
                          setDisplayItems((prev) => ({
                            ...prev,
                            [item.id]: !!checked,
                          }));
                        }}
                      />
                      <Label htmlFor={item.id} className="font-normal text-sm">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h4 className="font-semibold text-sm">Sidebar Elements</h4>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5 pr-4">
                    <h5 className="font-medium text-sm">Quick Actions</h5>
                    <p className="text-[12px] text-muted-foreground">
                      Show or hide the "Quick Create" button and the inbox mail icon next to it in the sidebar.
                    </p>
                  </div>
                  <Switch
                    checked={showQuickCreate}
                    onCheckedChange={(checked) => {
                      setShowQuickCreate(checked);
                      void persistPreference("show_quick_create", checked ? "true" : "false");
                      toast.success(`Quick Actions ${checked ? "enabled" : "disabled"}`);
                    }}
                  />
                </div>
              </div>

              <div className="pt-2">
                <Button onClick={handleUpdateDisplay}>Update display</Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const navItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "account", label: "Account", icon: Wrench },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "display", label: "Display", icon: Monitor },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your account settings and set e-mail preferences.</p>
      </div>
      <Separator />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[200px_1fr] md:gap-10">
        {/* Navigation Sidebar */}
        <aside className="flex flex-col gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabChange(item.id)}
                className={`flex h-9 items-center gap-2.5 rounded-md px-3 text-left text-sm transition-all ${
                  isActive
                    ? "bg-secondary font-semibold text-secondary-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <IconComponent className="size-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </aside>

        {/* Tab Content Panel */}
        <main className="min-w-0 flex-1">{renderTabContent()}</main>
      </div>
    </div>
  );
}

// Wrapper with Suspense block to safely export for Next.js routing
export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[200px] items-center justify-center text-muted-foreground text-sm">
          Loading settings...
        </div>
      }
    >
      <SettingsPageContent />
    </Suspense>
  );
}
