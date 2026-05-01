"use client";

import { searchAtlas } from "@/lib/semanticZoom";
import type { RefObject } from "react";
import { useMemo, useState } from "react";

interface SearchOverlayProps {
  inputRef?: RefObject<HTMLInputElement | null>;
  onSelect?: (nodeId: string) => void;
}

export default function SearchOverlay({
  inputRef,
  onSelect,
}: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    return searchAtlas(query, 8);
  }, [query]);

  return (
    <div className="search">
      <input
        aria-label="Search structures"
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search structure"
        ref={inputRef}
        type="search"
        value={query}
      />
      {results.length > 0 ? (
        <ul className="search-results">
          {results.map((node) => (
            <li key={node.id}>
              <button
                onClick={() => {
                  onSelect?.(node.id);
                  setQuery("");
                }}
                type="button"
              >
                L{node.level} - {node.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
