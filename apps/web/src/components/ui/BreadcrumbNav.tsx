import { getBreadcrumbItems } from "@/lib/semanticZoom";

interface BreadcrumbNavProps {
  nodeId: string;
  onNavigate?: (nodeId: string) => void;
}

export default function BreadcrumbNav({
  nodeId,
  onNavigate,
}: BreadcrumbNavProps) {
  const breadcrumb = getBreadcrumbItems(nodeId);

  return (
    <nav aria-label="Anatomy breadcrumb" className="breadcrumb">
      {breadcrumb.map((item, index) => (
        <span key={`${item.nodeId}-${item.label}`}>
          {index > 0 ? ">" : ""}
          <button onClick={() => onNavigate?.(item.nodeId)} type="button">
            {item.label}
          </button>
        </span>
      ))}
    </nav>
  );
}
