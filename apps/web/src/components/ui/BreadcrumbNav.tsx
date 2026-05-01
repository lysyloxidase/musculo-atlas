import { getGrossBreadcrumbLabels } from "@/lib/grossAnatomy";

interface BreadcrumbNavProps {
  nodeId: string;
}

export default function BreadcrumbNav({ nodeId }: BreadcrumbNavProps) {
  const breadcrumb = getGrossBreadcrumbLabels(nodeId);

  return (
    <nav aria-label="Anatomy breadcrumb" className="breadcrumb">
      {breadcrumb.map((label, index) => (
        <span key={label}>
          {index > 0 ? ">" : ""}
          {label}
        </span>
      ))}
    </nav>
  );
}
