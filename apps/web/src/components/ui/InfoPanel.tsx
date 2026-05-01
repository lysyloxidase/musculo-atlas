import {
  ANTERIOR_THIGH_REGION,
  BODY_COMPOSITION,
  GROSS_LAYERS,
  type GrossLayer,
  getMuscleDetail,
  hasCompleteMuscleMetadata,
} from "@/lib/grossAnatomy";
import { getNode } from "@/lib/hierarchy";
import {
  DEFAULT_FASCICLE_CONFIG,
  type FiberType,
  SARCOLEMMA_THICKNESS_NM,
  T_TUBULE_LUMEN_NM,
  T_TUBULE_SPACING_UM,
  getFiberOrganelleCounts,
  getFiberTypeProfile,
} from "@/lib/microAnatomy";
import {
  type MolecularRenderMode,
  type TroponinState,
  getAtomsForDomain,
  getDomainStructure,
  getProteinStructure,
  getTroponinShiftNm,
  getTroponinStateLabel,
  isDomainId,
  isProteinId,
} from "@/lib/molecular";
import {
  calculateBandGeometry,
  getCrossBridgeStep,
  getLengthTensionForce,
} from "@/lib/sarcomere";
import MolstarEmbed from "../shared/MolstarEmbed";

interface InfoPanelProps {
  activeLayer: GrossLayer;
  crossBridgeStep: number;
  fiberType: FiberType;
  molecularRenderMode: MolecularRenderMode;
  muscleId: string;
  nodeId: string;
  sarcomereLengthUm: number;
  selectedAtomId: string | null;
  troponinState: TroponinState;
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
  crossBridgeStep,
  fiberType,
  molecularRenderMode,
  muscleId,
  nodeId,
  sarcomereLengthUm,
  selectedAtomId,
  troponinState,
}: InfoPanelProps) {
  const muscle = getMuscleDetail(muscleId);
  const layer = GROSS_LAYERS.find((item) => item.id === activeLayer);
  const isFascicleView = nodeId.endsWith("_fascicle");
  const isFiberView = nodeId.endsWith("_fiber");
  const isMyofibrilView = nodeId.endsWith("_myofibril");
  const isSarcomereView = nodeId.endsWith("_sarcomere");
  const isProteinView = isProteinId(nodeId);
  const isDomainView = isDomainId(nodeId);
  const isMuscleView = nodeId === muscleId;

  if (isFascicleView) {
    return (
      <section className="panel info-grid" aria-labelledby="info-panel-heading">
        <h2 id="info-panel-heading">{muscle.name} fascicle</h2>
        <p>
          Fascicle cross-section with perimysium, endomysium, capillaries, and
          instanced muscle fibers.
        </p>
        <dl>
          <div>
            <dt>Diameter</dt>
            <dd>{DEFAULT_FASCICLE_CONFIG.diameter_um} um</dd>
          </div>
          <div>
            <dt>Fibers</dt>
            <dd>
              {DEFAULT_FASCICLE_CONFIG.fiberCount} visible of a 10-100
              biological range
            </dd>
          </div>
          <div>
            <dt>Perimysium</dt>
            <dd>2-layer crossed wavy collagen sheath</dd>
          </div>
          <div>
            <dt>Endomysium</dt>
            <dd>Thin membranes between individual fibers</dd>
          </div>
          <div>
            <dt>Vasculature</dt>
            <dd>Capillaries between fibers and vessels in the perimysium</dd>
          </div>
        </dl>
      </section>
    );
  }

  if (isFiberView) {
    const profile = getFiberTypeProfile(fiberType);
    const organelles = getFiberOrganelleCounts(fiberType);

    return (
      <section className="panel info-grid" aria-labelledby="info-panel-heading">
        <h2 id="info-panel-heading">{profile.label} muscle fiber</h2>
        <p>{profile.description}</p>
        <dl>
          <div>
            <dt>Myosin gene</dt>
            <dd>{profile.myosinGene}</dd>
          </div>
          <div>
            <dt>Diameter and length</dt>
            <dd>
              {profile.diameter_um} um diameter, {profile.length_cm} cm length
            </dd>
          </div>
          <div>
            <dt>Nuclei</dt>
            <dd>
              {profile.nucleiCount} peripheral nuclei, {organelles.nuclei}{" "}
              rendered
            </dd>
          </div>
          <div>
            <dt>Myofibrils</dt>
            <dd>
              {profile.myofibrilCount} estimated, {organelles.myofibrils}{" "}
              nearest rendered
            </dd>
          </div>
          <div>
            <dt>T-tubules</dt>
            <dd>
              {T_TUBULE_SPACING_UM} um spacing, {T_TUBULE_LUMEN_NM[0]}-
              {T_TUBULE_LUMEN_NM[1]} nm lumen
            </dd>
          </div>
          <div>
            <dt>Mitochondria</dt>
            <dd>
              {profile.mitochondriaVolumePct}% volume, {organelles.mitochondria}{" "}
              rendered
            </dd>
          </div>
          <div>
            <dt>Sarcolemma</dt>
            <dd>{SARCOLEMMA_THICKNESS_NM} nm conceptual membrane shell</dd>
          </div>
          <div>
            <dt>Satellite cells</dt>
            <dd>Pax7+ stem cells under basal lamina for regeneration</dd>
          </div>
        </dl>
      </section>
    );
  }

  if (isMyofibrilView) {
    return (
      <section className="panel info-grid" aria-labelledby="info-panel-heading">
        <h2 id="info-panel-heading">Myofibril</h2>
        <p>
          Banded contractile cylinder packed with serial sarcomeres, ready for
          Level 7 detail.
        </p>
        <dl>
          <div>
            <dt>Diameter</dt>
            <dd>1-2 um</dd>
          </div>
          <div>
            <dt>Banding</dt>
            <dd>Repeating I-band and A-band pattern</dd>
          </div>
        </dl>
      </section>
    );
  }

  if (isSarcomereView) {
    const bands = calculateBandGeometry(sarcomereLengthUm, fiberType);
    const bridgeStep = getCrossBridgeStep(crossBridgeStep);
    const force = getLengthTensionForce(sarcomereLengthUm);

    return (
      <section className="panel info-grid" aria-labelledby="info-panel-heading">
        <h2 id="info-panel-heading">Sarcomere</h2>
        <p>
          Z-disc to Z-disc contractile unit with thick, thin, and titin
          filaments.
        </p>
        <dl>
          <div>
            <dt>Sarcomere length</dt>
            <dd>{bands.sarcomereLengthUm.toFixed(2)} um</dd>
          </div>
          <div>
            <dt>A-band</dt>
            <dd>
              {bands.aBandWidthUm.toFixed(2)} um fixed thick-filament length
            </dd>
          </div>
          <div>
            <dt>I-band</dt>
            <dd>{bands.iBandWidthUm.toFixed(2)} um total light band</dd>
          </div>
          <div>
            <dt>H-zone</dt>
            <dd>{bands.hZoneWidthUm.toFixed(2)} um thick-only zone</dd>
          </div>
          <div>
            <dt>Titin stretch</dt>
            <dd>{bands.titinExtensionUm.toFixed(2)} um Z-disc to M-line</dd>
          </div>
          <div>
            <dt>Length tension</dt>
            <dd>{Math.round(force * 100)}% relative active force</dd>
          </div>
          <div>
            <dt>Cross-bridge</dt>
            <dd>{bridgeStep.label}</dd>
          </div>
        </dl>
      </section>
    );
  }

  if (isProteinView) {
    const protein = getProteinStructure(nodeId);
    const troponinShift = getTroponinShiftNm(troponinState);

    return (
      <section className="panel info-grid" aria-labelledby="info-panel-heading">
        <h2 id="info-panel-heading">{protein.displayName}</h2>
        <p>{protein.description}</p>
        <dl>
          <div>
            <dt>Primary PDB</dt>
            <dd>{protein.primaryPdbId}</dd>
          </div>
          <div>
            <dt>Canonical structures</dt>
            <dd>{protein.pdbIds.join(", ")}</dd>
          </div>
          <div>
            <dt>Components</dt>
            <dd>{protein.components.join("; ")}</dd>
          </div>
          <div>
            <dt>Scale</dt>
            <dd>
              {protein.scaleNm[0]}-{protein.scaleNm[1]} nm
            </dd>
          </div>
          <div>
            <dt>Render mode</dt>
            <dd>{molecularRenderMode.replaceAll("_", " ")}</dd>
          </div>
          {protein.id === "actin" || protein.id === "troponin" ? (
            <div>
              <dt>Troponin state</dt>
              <dd>
                {getTroponinStateLabel(troponinState)}; tropomyosin shift{" "}
                {troponinShift.toFixed(1)} nm
              </dd>
            </div>
          ) : null}
        </dl>
        {molecularRenderMode === "molstar" ? (
          <MolstarEmbed height={220} pdbId={protein.primaryPdbId} />
        ) : null}
      </section>
    );
  }

  if (isDomainView) {
    const domain = getDomainStructure(nodeId);
    const selectedAtom = selectedAtomId
      ? getAtomsForDomain(nodeId).find((atom) => atom.id === selectedAtomId)
      : null;

    return (
      <section className="panel info-grid" aria-labelledby="info-panel-heading">
        <h2 id="info-panel-heading">{domain.displayName}</h2>
        <p>{domain.description}</p>
        <dl>
          <div>
            <dt>PDB</dt>
            <dd>{domain.pdbId}</dd>
          </div>
          <div>
            <dt>Fold</dt>
            <dd>{domain.fold}</dd>
          </div>
          <div>
            <dt>Residues</dt>
            <dd>{domain.residues}</dd>
          </div>
          <div>
            <dt>Secondary structure</dt>
            <dd>{domain.secondaryStructure.join(", ")}</dd>
          </div>
          <div>
            <dt>Highlights</dt>
            <dd>{domain.highlights.join("; ")}</dd>
          </div>
          <div>
            <dt>Atom pick</dt>
            <dd>
              {selectedAtom
                ? `${selectedAtom.element} in ${selectedAtom.residue}${selectedAtom.residueIndex} at (${selectedAtom.x.toFixed(1)}, ${selectedAtom.y.toFixed(1)}, ${selectedAtom.z.toFixed(1)})`
                : "Click an atom for element, residue, and coordinates"}
            </dd>
          </div>
        </dl>
        {molecularRenderMode === "molstar" ? (
          <MolstarEmbed height={220} pdbId={domain.pdbId} />
        ) : null}
      </section>
    );
  }

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
