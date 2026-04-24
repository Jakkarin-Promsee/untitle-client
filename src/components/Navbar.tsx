import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
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
      <div className="container flex h-16 items-center justify-between">
        <Link to={role === "admin" ? "/admin-manage-account" : "/"} className="flex items-center gap-2">
          <Dumbbell className="h-6 w-6 text-primary" />
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            APEX<span className="text-primary">.</span>FIT
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.path !== "/" && location.pathname.startsWith(`${item.path}/`));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </Link>
            );
          })}

          {role === "guest" ? (
            <Link
              to="/login/user"
              className="ml-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Login
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="ml-2 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
