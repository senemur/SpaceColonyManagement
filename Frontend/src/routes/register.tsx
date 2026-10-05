import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "../components/ui/button";
import { Auth } from "./login";
export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Register | Space Colony" },
      {
        name: "description",
        content: "Create a commander profile and establish a new Mars colony.",
      },
      { property: "og:title", content: "Register | Space Colony" },
      { property: "og:description", content: "Establish your Mars colony." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});
function Page() {
  const navigate = useNavigate();
  return (
    <Auth
      title="Establish your colony"
      subtitle="Create a commander profile and name your first settlement."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void navigate({ to: "/" });
        }}
        className="grid gap-4 sm:grid-cols-2"
      >
        <label className="label">
          Username
          <input className="input mt-2" required />
        </label>
        <label className="label">
          Email
          <input className="input mt-2" type="email" required />
        </label>
        <label className="label">
          Password
          <input className="input mt-2" type="password" required />
        </label>
        <label className="label">
          Confirm password
          <input className="input mt-2" type="password" required />
        </label>
        <label className="label sm:col-span-2">
          Colony name
          <input className="input mt-2" defaultValue="New Horizon" required />
        </label>
        <label className="label sm:col-span-2">
          Planet
          <select className="input mt-2" disabled>
            <option>Mars</option>
          </select>
        </label>
        <Button className="sm:col-span-2" type="submit">
          Begin expedition
        </Button>
      </form>
      <p className="mt-5 text-center text-xs text-muted-foreground">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-primary">
          Log in
        </Link>
      </p>
    </Auth>
  );
}
