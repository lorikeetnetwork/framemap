"use client";

import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Search as SearchIcon,
  Dashboard,
  Folder,
  Settings as SettingsIcon,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  AddLarge,
  View,
  Template,
  Document,
  Grid,
  TreeViewAlt,
  UserAdmin,
  Logout,
  Home,
  DataVis_1,
} from "@carbon/icons-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";

const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

function LogoIcon() {
  return (
    <div className="size-7 flex items-center justify-center">
      <DataVis_1 size={24} className="text-foreground" />
    </div>
  );
}

function AvatarCircle() {
  return (
    <div className="relative rounded-full shrink-0 size-8 bg-muted">
      <div className="flex items-center justify-center size-8">
        <UserIcon size={16} className="text-foreground" />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-border pointer-events-none"
      />
    </div>
  );
}

function SearchContainer({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`bg-secondary h-10 relative flex items-center transition-all duration-500 ${
          isCollapsed ? "w-10 min-w-10 justify-center" : "w-full"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div
          className={`flex items-center justify-center shrink-0 transition-all duration-500 ${
            isCollapsed ? "p-1" : "px-1"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="size-8 flex items-center justify-center">
            <SearchIcon size={16} className="text-foreground" />
          </div>
        </div>

        <div
          className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="flex flex-col justify-center size-full">
            <div className="flex flex-col gap-2 items-start justify-center pr-2 py-1 w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground leading-5"
                tabIndex={isCollapsed ? -1 : 0}
              />
            </div>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-0 border border-border pointer-events-none"
        />
      </div>
    </div>
  );
}

interface MenuItemT {
  icon?: React.ReactNode;
  label: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  children?: MenuItemT[];
  onClick?: () => void;
  path?: string;
}

interface MenuSectionT {
  title: string;
  items: MenuItemT[];
}

function IconNavButton({
  children,
  isActive = false,
  onClick,
  title,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      title={title}
      className={`flex items-center justify-center size-10 min-w-10 transition-colors duration-500
        ${isActive ? "bg-accent text-foreground" : "hover:bg-accent text-muted-foreground hover:text-foreground"}`}
      style={{ transitionTimingFunction: softSpringEasing }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function IconNavigation({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (section: string) => void;
}) {
  const { isAdmin } = useIsAdmin();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { id: "home", icon: <Home size={16} />, label: "Home", path: "/" },
    { id: "frameworks", icon: <Folder size={16} />, label: "Frameworks", path: "/frameworks" },
    { id: "canvas", icon: <Grid size={16} />, label: "Canvas", path: "/canvas" },
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    onSectionChange(item.id);
    if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <aside className="bg-card flex flex-col gap-2 items-center p-4 w-16 min-h-screen border-r border-border">
      {/* Logo */}
      <div className="mb-2 size-10 flex items-center justify-center">
        <LogoIcon />
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-2 w-full items-center">
        {navItems.map((item) => (
          <IconNavButton
            key={item.id}
            isActive={activeSection === item.id}
            onClick={() => handleNavClick(item)}
            title={item.label}
          >
            {item.icon}
          </IconNavButton>
        ))}
      </div>

      <div className="flex-1" />

      {/* Bottom section */}
      <div className="flex flex-col gap-2 w-full items-center">
        {isAdmin && (
          <IconNavButton 
            isActive={activeSection === "admin"} 
            onClick={() => {
              onSectionChange("admin");
              navigate("/admin");
            }}
            title="Admin"
          >
            <UserAdmin size={16} />
          </IconNavButton>
        )}
        <IconNavButton 
          isActive={activeSection === "settings"} 
          onClick={() => onSectionChange("settings")}
          title="Settings"
        >
          <SettingsIcon size={16} />
        </IconNavButton>
        <IconNavButton
          onClick={() => signOut()}
          title="Sign Out"
        >
          <Logout size={16} />
        </IconNavButton>
        <div className="size-8">
          <AvatarCircle />
        </div>
      </div>
    </aside>
  );
}

function SectionTitle({
  title,
  onToggleCollapse,
  isCollapsed,
}: {
  title: string;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}) {
  if (isCollapsed) {
    return (
      <div className="w-full flex justify-center transition-all duration-500" style={{ transitionTimingFunction: softSpringEasing }}>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center justify-center size-10 min-w-10 transition-all duration-500 hover:bg-accent text-muted-foreground hover:text-foreground"
          style={{ transitionTimingFunction: softSpringEasing }}
          aria-label="Expand sidebar"
        >
          <span className="inline-block rotate-180">
            <ChevronDownIcon size={16} />
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden transition-all duration-500" style={{ transitionTimingFunction: softSpringEasing }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center h-10">
          <div className="px-2 py-1">
            <div className="text-lg font-semibold text-foreground leading-7">
              {title}
            </div>
          </div>
        </div>
        <div className="pr-1">
          <button
            type="button"
            onClick={onToggleCollapse}
            className="flex items-center justify-center size-10 min-w-10 transition-all duration-500 hover:bg-accent text-muted-foreground hover:text-foreground"
            style={{ transitionTimingFunction: softSpringEasing }}
            aria-label="Collapse sidebar"
          >
            <ChevronDownIcon size={16} className="-rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  item,
  isExpanded,
  onToggle,
  onItemClick,
  isCollapsed,
}: {
  item: MenuItemT;
  isExpanded?: boolean;
  onToggle?: () => void;
  onItemClick?: () => void;
  isCollapsed?: boolean;
}) {
  const handleClick = () => {
    if (item.hasDropdown && onToggle) onToggle();
    else if (item.onClick) item.onClick();
    else onItemClick?.();
  };

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`cursor-pointer transition-all duration-500 flex items-center relative ${
          item.isActive ? "bg-accent" : "hover:bg-accent"
        } ${isCollapsed ? "w-10 min-w-10 h-10 justify-center p-4" : "w-full h-10 px-4 py-2"}`}
        style={{ transitionTimingFunction: softSpringEasing }}
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
      >
        <div className="flex items-center justify-center shrink-0">{item.icon}</div>

        <div
          className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-3"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="text-sm text-foreground leading-5 truncate">
            {item.label}
          </div>
        </div>

        {item.hasDropdown && (
          <div
            className={`flex items-center justify-center shrink-0 transition-opacity duration-500 ${
              isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-2"
            }`}
            style={{ transitionTimingFunction: softSpringEasing }}
          >
            <ChevronDownIcon
              size={16}
              className="text-foreground transition-transform duration-500"
              style={{
                transitionTimingFunction: softSpringEasing,
                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SubMenuItem({ item, onItemClick }: { item: MenuItemT; onItemClick?: () => void }) {
  return (
    <div className="w-full pl-9 pr-1 py-[1px]">
      <div
        className="h-10 w-full cursor-pointer transition-colors hover:bg-accent flex items-center px-3 py-1"
        onClick={() => item.onClick ? item.onClick() : onItemClick?.()}
      >
        <div className="flex-1 min-w-0">
          <div className="text-sm text-muted-foreground leading-5 truncate">
            {item.label}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuSection({
  section,
  expandedItems,
  onToggleExpanded,
  isCollapsed,
}: {
  section: MenuSectionT;
  expandedItems: Set<string>;
  onToggleExpanded: (itemKey: string) => void;
  isCollapsed?: boolean;
}) {
  return (
    <div className="flex flex-col w-full">
      <div
        className={`relative shrink-0 w-full transition-all duration-500 overflow-hidden ${
          isCollapsed ? "h-0 opacity-0" : "h-10 opacity-100"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div className="flex items-center h-10 px-4">
          <div className="text-sm text-muted-foreground">
            {section.title}
          </div>
        </div>
      </div>

      {section.items.map((item, index) => {
        const itemKey = `${section.title}-${index}`;
        const isExpanded = expandedItems.has(itemKey);
        return (
          <div key={itemKey} className="w-full flex flex-col">
            <MenuItem
              item={item}
              isExpanded={isExpanded}
              onToggle={() => onToggleExpanded(itemKey)}
              onItemClick={() => console.log(`Clicked ${item.label}`)}
              isCollapsed={isCollapsed}
            />
            {isExpanded && item.children && !isCollapsed && (
              <div className="flex flex-col gap-1 mb-2">
                {item.children.map((child, childIndex) => (
                  <SubMenuItem
                    key={`${itemKey}-${childIndex}`}
                    item={child}
                    onItemClick={() => console.log(`Clicked ${child.label}`)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function DetailSidebar({ 
  activeSection, 
  onCreateNew, 
  onImport, 
  onBrowseTemplates 
}: { 
  activeSection: string;
  onCreateNew?: () => void;
  onImport?: () => void;
  onBrowseTemplates?: () => void;
}) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const toggleExpanded = (itemKey: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  };

  const toggleCollapse = () => setIsCollapsed((s) => !s);

  const getSections = (): { title: string; sections: MenuSectionT[] } => {
    switch (activeSection) {
      case "home":
        return {
          title: "Home",
          sections: [
            {
              title: "Overview",
              items: [
                { icon: <View size={16} className="text-foreground" />, label: "Dashboard", isActive: true, onClick: () => navigate("/") },
                { icon: <Folder size={16} className="text-foreground" />, label: "My Frameworks", onClick: () => navigate("/frameworks") },
              ],
            },
            {
              title: "Quick Actions",
              items: [
                { icon: <AddLarge size={16} className="text-foreground" />, label: "New Framework", onClick: onCreateNew },
                { icon: <Template size={16} className="text-foreground" />, label: "Browse Templates", onClick: onBrowseTemplates },
                { icon: <Document size={16} className="text-foreground" />, label: "Import JSON", onClick: onImport },
              ],
            },
          ],
        };
      case "frameworks":
        return {
          title: "Frameworks",
          sections: [
            {
              title: "Quick Actions",
              items: [
                { icon: <AddLarge size={16} className="text-foreground" />, label: "New Framework", onClick: onCreateNew },
                { icon: <Document size={16} className="text-foreground" />, label: "Import JSON", onClick: onImport },
              ],
            },
            {
              title: "Templates",
              items: [
                { icon: <Template size={16} className="text-foreground" />, label: "Browse Templates", onClick: onBrowseTemplates },
              ],
            },
            {
              title: "Views",
              items: [
                { icon: <TreeViewAlt size={16} className="text-foreground" />, label: "Tree View", onClick: () => navigate("/frameworks") },
                { icon: <Grid size={16} className="text-foreground" />, label: "Canvas View", onClick: () => navigate("/canvas") },
              ],
            },
          ],
        };
      case "canvas":
        return {
          title: "Canvas",
          sections: [
            {
              title: "Canvas Tools",
              items: [
                { icon: <Grid size={16} className="text-foreground" />, label: "Open Canvas", isActive: true, onClick: () => navigate("/canvas") },
              ],
            },
          ],
        };
      case "admin":
        return {
          title: "Admin",
          sections: [
            {
              title: "User Management",
              items: [
                { icon: <UserAdmin size={16} className="text-foreground" />, label: "Manage Users", isActive: true, onClick: () => navigate("/admin") },
              ],
            },
          ],
        };
      case "settings":
        return {
          title: "Settings",
          sections: [
            {
              title: "Account",
              items: [
                { icon: <UserIcon size={16} className="text-foreground" />, label: "Profile" },
              ],
            },
          ],
        };
      default:
        return { title: "Dashboard", sections: [] };
    }
  };

  const content = getSections();

  return (
    <aside
      className={`bg-card flex flex-col gap-4 items-start p-4 transition-all duration-500 min-h-screen border-r border-border ${
        isCollapsed ? "w-16 min-w-16 !px-0 justify-start" : "w-72"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      {!isCollapsed && (
        <div className="relative shrink-0 w-full">
          <div className="flex items-center p-1 w-full">
            <div className="h-10 w-8 flex items-center justify-center pl-2">
              <LogoIcon />
            </div>
            <div className="px-2 py-1">
              <div className="text-base font-semibold text-foreground">
                Framework Builder
              </div>
            </div>
          </div>
        </div>
      )}

      <SectionTitle title={content.title} onToggleCollapse={toggleCollapse} isCollapsed={isCollapsed} />
      <SearchContainer isCollapsed={isCollapsed} />

      <div
        className={`flex flex-col w-full overflow-y-auto transition-all duration-500 ${
          isCollapsed ? "gap-2 items-center" : "gap-4 items-start"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        {content.sections.map((section, index) => (
          <MenuSection
            key={`${activeSection}-${index}`}
            section={section}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {!isCollapsed && user && (
        <div className="w-full mt-auto pt-2 border-t border-border">
          <div className="flex items-center gap-2 px-2 py-2">
            <AvatarCircle />
            <div className="text-sm text-foreground truncate flex-1">
              {user.email}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

interface DashboardSidebarProps {
  children?: React.ReactNode;
  onCreateNew?: () => void;
  onImport?: () => void;
  onBrowseTemplates?: () => void;
}

export function DashboardSidebar({ 
  children, 
  onCreateNew, 
  onImport, 
  onBrowseTemplates 
}: DashboardSidebarProps) {
  const location = useLocation();
  
  const getActiveSection = () => {
    if (location.pathname === "/") return "home";
    if (location.pathname.startsWith("/frameworks")) return "frameworks";
    if (location.pathname === "/canvas") return "canvas";
    if (location.pathname === "/admin") return "admin";
    return "home";
  };

  const [activeSection, setActiveSection] = useState(getActiveSection());

  return (
    <div className="bg-background min-h-screen flex w-full">
      <IconNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <DetailSidebar 
        activeSection={activeSection} 
        onCreateNew={onCreateNew}
        onImport={onImport}
        onBrowseTemplates={onBrowseTemplates}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default DashboardSidebar;
