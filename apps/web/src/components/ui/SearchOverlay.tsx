"use client";

import { HIERARCHY_NODES } from "@/lib/hierarchy";
import { useMemo, useState } from "react";

interface SearchOverlayProps {
  onSelect?: (nodeId: string) => void;
}

export default function SearchOverlay({ onSelect }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (normalized.length < 2) {
      return [];
    }

    return HIERARCHY_NODES.filter((node) =>
      node.name.toLowerCase().includes(normalized),
    ).slice(0, 6);
  }, [query]);

  return (
    <div className="search">
      <input
        aria-label="Search structures"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search structure"
        type="search"
        value={query}
      />
      {results.length > 0 ? (
        <ul className="search-results">
          {results.map((node) => (
            <li key={node.id}>
              <button onClick={() => onSelect?.(node.id)} type="button">
                L{node.level} - {node.name}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
