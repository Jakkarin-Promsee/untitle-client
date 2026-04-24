import { useState } from "react";
import { useAuthStore } from "@/stores/auth.store";

const AdminManageAccount = () => {
  const { createTrainer, isLoading, error, user } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(null);

    try {
      await createTrainer(name, email, password);
      setSuccess("Trainer account created successfully.");
      setName("");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      const message =
        err.response?.data?.message || "Failed to create trainer account";
      useAuthStore.setState({ error: message, isLoading: false });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-xl rounded-lg border border-border bg-card p-6">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Admin Manage Account
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as {user?.email}. Create trainer accounts here.
        </p>

        <form onSubmit={handleCreateTrainer} className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="trainer-name" className="block text-sm text-secondary-foreground">
              Trainer Name
            </label>
            <input
              id="trainer-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Coach Alex"
              className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="trainer-email" className="block text-sm text-secondary-foreground">
              Trainer Email
            </label>
            <input
              id="trainer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trainer@example.com"
              className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="trainer-password" className="block text-sm text-secondary-foreground">
              Temporary Password
            </label>
            <input
              id="trainer-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create temporary password"
              className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {isLoading ? "Creating..." : "Create Trainer Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminManageAccount;
