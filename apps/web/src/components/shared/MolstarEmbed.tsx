interface MolstarEmbedProps {
  pdbId: string;
}

export default function MolstarEmbed({ pdbId }: MolstarEmbedProps) {
  return (
    <iframe
      src={`https://www.rcsb.org/3d-view/${pdbId}`}
      title={`PDB ${pdbId} structure`}
      width="100%"
      height="420"
    />
  );
}
