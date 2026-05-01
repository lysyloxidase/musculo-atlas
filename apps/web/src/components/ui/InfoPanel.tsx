import {
  ANTERIOR_THIGH_REGION,
  BODY_COMPOSITION,
  GROSS_LAYERS,
  type GrossLayer,
  getMuscleDetail,
  hasCompleteMuscleMetadata,
} from "@/lib/grossAnatomy";
import { getNode } from "@/lib/hierarchy";

interface InfoPanelProps {
  activeLayer: GrossLayer;
  muscleId: string;
  nodeId: string;
}

function formatFiberTypes(muscleId: string): string {
  const composition = getMuscleDetail(muscleId).fiber_type_pct;

  if (!composition) {
    return "Pending sampled composition";
  }

  return `Type I ${composition.I}% / IIa ${composition.IIa}% / IIx ${composition.IIx}%`;
}

export default function InfoPanel({
  activeLayer,
  muscleId,
  nodeId,
}: InfoPanelProps) {
  const muscle = getMuscleDetail(muscleId);
  const layer = GROSS_LAYERS.find((item) => item.id === activeLayer);
  const isMuscleView = nodeId === muscleId || nodeId.endsWith("_fascicle");
  const node = isMuscleView ? null : getNode(nodeId);

  if (isMuscleView) {
    return (
      <section className="panel info-grid" aria-labelledby="info-panel-heading">
        <h2 id="info-panel-heading">{muscle.name}</h2>
        <p>{muscle.clinical}</p>
        <dl>
          <div>
            <dt>Origin</dt>
            <dd>{muscle.origin}</dd>
          </div>
          <div>
            <dt>Insertion</dt>
            <dd>{muscle.insertion}</dd>
          </div>
          <div>
            <dt>Innervation</dt>
            <dd>{muscle.innervation}</dd>
          </div>
          <div>
            <dt>Blood supply</dt>
            <dd>{muscle.blood_supply}</dd>
          </div>
          <div>
            <dt>Action</dt>
            <dd>{muscle.action}</dd>
          </div>
          <div>
            <dt>Architecture</dt>
            <dd>
              {muscle.fiber_length_cm} cm fibers, {muscle.pennation_deg} deg
              pennation, {muscle.pcsa_cm2} cm2 PCSA
            </dd>
          </div>
          <div>
            <dt>Fiber types</dt>
            <dd>{formatFiberTypes(muscle.id)}</dd>
          </div>
          <div>
            <dt>OpenSim</dt>
            <dd>
              {muscle.opensim
                ? `${muscle.opensim.max_iso_force_N} N max force, ${muscle.opensim.opt_fiber_length_m} m optimal fiber, ${muscle.opensim.tendon_slack_m} m tendon slack`
                : "Pending OpenSim parameterization"}
            </dd>
          </div>
          <div>
            <dt>Metadata status</dt>
            <dd>
              {hasCompleteMuscleMetadata(muscle) ? "Complete" : "Baseline"}
            </dd>
          </div>
        </dl>
      </section>
    );
  }

  return (
    <section className="panel" aria-labelledby="info-panel-heading">
      <h2 id="info-panel-heading">{node?.name}</h2>
      <p>{node?.description}</p>
      {nodeId === "body" ? (
        <p>
          {BODY_COMPOSITION.bones} bones, {BODY_COMPOSITION.muscles}+ muscles,
          skeletal muscle mass about {BODY_COMPOSITION.muscleMassPctMale}% male
          and {BODY_COMPOSITION.muscleMassPctFemale}% female.
        </p>
      ) : null}
      {nodeId === "musculoskeletal_system" && layer ? (
        <p>
          Active layer: {layer.label}. {layer.description}
        </p>
      ) : null}
      {nodeId === ANTERIOR_THIGH_REGION.id ? (
        <p>
          {ANTERIOR_THIGH_REGION.name}: {ANTERIOR_THIGH_REGION.muscles.length}{" "}
          muscles, {ANTERIOR_THIGH_REGION.bones.join(" and ")},{" "}
          {ANTERIOR_THIGH_REGION.nerves.join(", ")},{" "}
          {ANTERIOR_THIGH_REGION.vessels.join(", ")}.{" "}
          {ANTERIOR_THIGH_REGION.compartment}
        </p>
      ) : null}
      <p>
        Scale: {node?.dimensions.scale_meters.toExponential(2)} m - Source:{" "}
        {node?.dimensions.source}
      </p>
    </section>
  );
}
