import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CalendarClock,
  CreditCard,
  Dumbbell,
  LayoutDashboard,
  MoreHorizontal,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth.store";

type Role = "guest" | "user" | "trainer" | "admin";

const navByRole: Record<Role, { label: string; path: string }[]> = {
  guest: [
    { label: "Home", path: "/" },
    { label: "Plans", path: "/plans" },
    { label: "Booking", path: "/booking" },
  ],
  user: [
    { label: "Home", path: "/" },
    { label: "Plans", path: "/plans" },
    { label: "Booking", path: "/booking" },
    { label: "Payment", path: "/payment" },
    { label: "Dashboard", path: "/dashboard" },
  ],
  trainer: [
    { label: "Trainer Panel", path: "/dashboard" },
    { label: "Booking", path: "/booking" },
    { label: "Status", path: "/status" },
  ],
  admin: [{ label: "Manage Accounts", path: "/admin-manage-account" }],
};

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const role: Role = user?.role || "guest";
  const navItems = navByRole[role];
  const primaryOrder = ["/dashboard", "/booking", "/plans", "/payment"];
  const primaryItems = primaryOrder
    .map((path) => navItems.find((item) => item.path === path))
    .filter((item): item is { label: string; path: string } => Boolean(item));
  const moreItems = navItems.filter(
    (item) => !primaryItems.some((primary) => primary.path === item.path),
  );

  const handleLogout = () => {
    logout();
    navigate("/login/user");
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
    >
      <div className="container py-1.5">
        <div className="flex h-10 items-center justify-between">
          <Link
            to={role === "admin" ? "/admin-manage-account" : "/"}
            className="flex items-center gap-1.5"
          >
            <Dumbbell className="h-5 w-5 text-primary" />
            <span className="font-display text-base font-bold tracking-tight text-foreground">
              APEX<span className="text-primary">.</span>FIT
            </span>
          </Link>

          {role === "guest" ? (
            <Link
              to="/login/user"
              className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Login
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-[10px] font-semibold text-primary">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
              <span className="max-w-20 truncate">
                {user?.name || "Profile"}
              </span>
            </button>
          )}
        </div>

        {role !== "guest" && (
          <div className="mt-1.5 grid w-full grid-cols-5 gap-1 pb-0.5">
            {primaryItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path !== "/" &&
                  location.pathname.startsWith(`${item.path}/`));
              const icon =
                item.path === "/dashboard" ? (
                  <LayoutDashboard className="h-4 w-4" />
                ) : item.path === "/booking" ? (
                  <CalendarClock className="h-4 w-4" />
                ) : item.path === "/plans" ? (
                  <Dumbbell className="h-4 w-4" />
                ) : (
                  <CreditCard className="h-4 w-4" />
                );

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative flex w-full items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors sm:justify-start ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {icon}
                  <span className="hidden sm:inline">
                    {item.label === "Plans" ? "Plan" : item.label}
                  </span>
                </Link>
              );
            })}

            <details className="relative w-full">
              <summary className="flex w-full cursor-pointer list-none items-center justify-center gap-1 rounded-md px-2.5 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:justify-start">
                <MoreHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">More</span>
              </summary>
              <div className="absolute right-0 mt-2 w-44 rounded-md border border-border bg-background p-1 shadow-lg">
                {moreItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block rounded-sm px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-sm px-3 py-2 text-left text-sm text-muted-foreground transition-colors hover:bg-primary/10 hover:text-foreground"
                >
                  Logout
                </button>
              </div>
            </details>
          </div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
