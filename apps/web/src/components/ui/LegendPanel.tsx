const legendItems = [
  { color: "#ee7664", label: "Contractile tissue" },
  { color: "#5fd0c5", label: "Connective tissue" },
  { color: "#d7b95d", label: "Regulatory proteins" },
  { color: "#9d8df1", label: "Elastic domains" },
];

export default function LegendPanel() {
  return (
    <section className="panel" aria-labelledby="legend-heading">
      <h3 id="legend-heading">Legend</h3>
      <ul className="legend-list">
        {legendItems.map((item) => (
          <li key={item.label}>
            <span className="swatch" style={{ background: item.color }} />
            {item.label}
          </li>
        ))}
      </ul>
    </section>
  );
}
