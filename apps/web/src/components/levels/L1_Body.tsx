import { BODY_COMPOSITION } from "@/lib/grossAnatomy";
import { getGrossMesh, selectBodyLod } from "@/lib/meshManifest";
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
          lod: lod.label,
          muscles: BODY_COMPOSITION.muscles,
          triangles: lod.triangles,
        }}
      >
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            dispatch({ regionId: "lower_limb", type: "select_body_region" });
          }}
          position={[0, 0.75, 0]}
          userData={{ selectable: "body-region" }}
        >
          <sphereGeometry args={[0.22, 32, 32]} />
          <meshStandardMaterial
            color="#d7b95d"
            roughness={0.72}
            transparent
            opacity={0.56}
          />
        </mesh>
        <mesh
          onClick={(event) => {
            event.stopPropagation();
            dispatch({ regionId: "lower_limb", type: "select_body_region" });
          }}
          position={[0, 0.2, 0]}
          userData={{ selectable: "body-region" }}
        >
          <cylinderGeometry args={[0.22, 0.34, 0.9, 32]} />
          <meshStandardMaterial
            color="#ee7664"
            roughness={0.8}
            transparent
            opacity={0.7}
          />
        </mesh>
        <mesh position={[-0.28, -0.55, 0]} rotation={[0.12, 0, 0.08]}>
          <cylinderGeometry args={[0.08, 0.1, 1.05, 24]} />
          <meshStandardMaterial
            color="#5fd0c5"
            roughness={0.75}
            transparent
            opacity={0.72}
          />
        </mesh>
        <mesh position={[0.28, -0.55, 0]} rotation={[0.12, 0, -0.08]}>
          <cylinderGeometry args={[0.08, 0.1, 1.05, 24]} />
          <meshStandardMaterial
            color="#5fd0c5"
            roughness={0.75}
            transparent
            opacity={0.72}
          />
        </mesh>
        <mesh position={[-0.44, 0.2, 0]} rotation={[0, 0, -0.72]}>
          <cylinderGeometry args={[0.055, 0.075, 0.9, 24]} />
          <meshStandardMaterial
            color="#9d8df1"
            roughness={0.75}
            transparent
            opacity={0.72}
          />
        </mesh>
        <mesh position={[0.44, 0.2, 0]} rotation={[0, 0, 0.72]}>
          <cylinderGeometry args={[0.055, 0.075, 0.9, 24]} />
          <meshStandardMaterial
            color="#9d8df1"
            roughness={0.75}
            transparent
            opacity={0.72}
          />
        </mesh>
      </group>
    </MeshAsset>
  );
}
