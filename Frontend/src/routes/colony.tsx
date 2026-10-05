import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { VanillaMarsGame } from "../game-vanilla/VanillaMarsGame";

export const Route = createFileRoute("/colony")({
  head: () => ({
    meta: [
      { title: "Play New Horizon | Space Colony" },
      {
        name: "description",
        content:
          "Walk through New Horizon, meet colonists, enter habitats, and manage the living Mars settlement.",
      },
      { property: "og:title", content: "Play New Horizon | Space Colony" },
      {
        property: "og:description",
        content: "Explore a living, animated Mars colony in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ColonyGame,
});

function ColonyGame() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-space">
      <ClientOnly
        fallback={
          <div className="grid h-full place-items-center text-sm text-muted-foreground">
            Preparing New Horizon…
          </div>
        }
      >
        <VanillaMarsGame />
      </ClientOnly>
    </div>
  );
}
