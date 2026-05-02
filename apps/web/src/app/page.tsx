import { LEVEL_NAMES } from "@/lib/dimensions";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const levels = Object.entries(LEVEL_NAMES);

export default function HomePage() {
  return (
    <main className="entry-shell">
      <section className="entry-panel">
        <div>
          <p className="eyebrow">10-level anatomy atlas</p>
          <h1>MusculoAtlas</h1>
          <p className="entry-copy">
            Zoom from a human body to a single atom across gross anatomy, muscle
            microstructure, sarcomeres, proteins, and domain-level coordinates.
          </p>
        </div>
        <Link className="primary-link" href="/atlas">
          Enter atlas
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </section>
      <ol className="level-strip" aria-label="Atlas zoom levels">
        {levels.map(([level, name]) => (
          <li key={level}>
            <span>{level}</span>
            {name}
          </li>
        ))}
      </ol>
    </main>
  );
}
