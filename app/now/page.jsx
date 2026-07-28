import Writing from "@/components/Writing";
import { pageMeta } from "@/lib/site";

export const metadata = pageMeta({
  title: "Now",
  description:
    "What Shayan Poigai is working on right now — backend AI features, agentic systems and the Model Context Protocol, and an e-commerce platform launch.",
  path: "/now",
});

export default function NowPage() {
  return (
    <main className="page">
      <Writing />
    </main>
  );
}
