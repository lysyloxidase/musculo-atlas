import { MOLSTAR_LOAD_TARGET_MS, getMolstarUrl } from "@/lib/molecular";

interface MolstarEmbedProps {
  height?: number;
  pdbId: string;
}

export default function MolstarEmbed({
  height = 260,
  pdbId,
}: MolstarEmbedProps) {
  return (
    <div className="molstar-frame">
      <iframe
        data-load-target-ms={MOLSTAR_LOAD_TARGET_MS}
        height={height}
        loading="eager"
        src={getMolstarUrl(pdbId)}
        title={`Molstar PDB ${pdbId} structure`}
        width="100%"
      />
    </div>
  );
}
