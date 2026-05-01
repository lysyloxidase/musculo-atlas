import { getNode } from "@/lib/hierarchy";

interface InfoPanelProps {
  nodeId: string;
}

export default function InfoPanel({ nodeId }: InfoPanelProps) {
  const node = getNode(nodeId);

  return (
    <section className="panel" aria-labelledby="info-panel-heading">
      <h2 id="info-panel-heading">{node.name}</h2>
      <p>{node.description}</p>
      <p>
        Scale: {node.dimensions.scale_meters.toExponential(2)} m - Source:{" "}
        {node.dimensions.source}
      </p>
    </section>
  );
}
