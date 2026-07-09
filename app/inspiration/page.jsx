import ComingSoon from "@/components/ComingSoon";

export const metadata = {
  title: "Inspiration — Shayan Poigai",
  description: "Things that inspire Shayan Poigai. Coming soon.",
};

export default function InspirationPage() {
  return (
    <main className="page">
      <ComingSoon
        eyebrow={"// inspiration"}
        title="Inspiration"
        note="A collection of the people, projects, and ideas I orbit. Landing here soon."
      />
    </main>
  );
}
