import { BODY_COMPOSITION } from "@/lib/grossAnatomy";
import { getGrossMesh, selectBodyLod } from "@/lib/meshManifest";
import AnatomicalHumanFigure from "../shared/AnatomicalHumanFigure";
import MeshAsset from "../shared/MeshAsset";
import type { GrossLevelProps } from "../viewer/LevelRenderer";

export default function L1Body({ dispatch, state }: GrossLevelProps) {
  const mesh = getGrossMesh("body");
  const lod = selectBodyLod(state.zoomValue);

  return (
    <MeshAsset lod={lod} name={mesh.semantic}>
      <group
        name="L1 body"
        userData={{
          bones: BODY_COMPOSITION.bones,
          fidelity: "adult-proportioned-transparent-anatomical-atlas",
          lod: lod.label,
          muscles: BODY_COMPOSITION.muscles,
          triangles: lod.triangles,
        }}
      >
        <AnatomicalHumanFigure
          onSelectLowerLimb={() =>
            dispatch({ regionId: "lower_limb", type: "select_body_region" })
          }
        />
      </group>
    </MeshAsset>
  );
}
