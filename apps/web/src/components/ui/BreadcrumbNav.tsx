import { getBreadcrumb } from "@/lib/hierarchy";

interface BreadcrumbNavProps {
  nodeId: string;
}

export default function BreadcrumbNav({ nodeId }: BreadcrumbNavProps) {
  const breadcrumb = getBreadcrumb(nodeId);

  return (
    <nav aria-label="Anatomy breadcrumb" className="breadcrumb">
      {breadcrumb.map((node, index) => (
        <span key={node.id}>
          {index > 0 ? ">" : ""}
          {node.name}
        </span>
      ))}
    </nav>
  );
}
