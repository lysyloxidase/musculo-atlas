"use client";

import { useMemo } from "react";
import { CatmullRomCurve3, Vector3 } from "three";

interface AnatomicalHumanFigureProps {
  onSelectLowerLimb: () => void;
}

type Point = [number, number, number];

const boneColor = "#f4f1ea";
const fasciaColor = "#5fd0c5";
const muscleColor = "#ee7664";
const tendonColor = "#d7b95d";
const skinColor = "#d9b4a7";
const contourColor = "#161412";

function AnatomyCurve({
  color,
  name,
  opacity = 1,
  points,
  radius = 0.006,
}: {
  color: string;
  name: string;
  opacity?: number;
  points: Point[];
  radius?: number;
}) {
  const curve = useMemo(
    () => new CatmullRomCurve3(points.map((point) => new Vector3(...point))),
    [points],
  );

  return (
    <mesh name={name}>
      <tubeGeometry args={[curve, 36, radius, 8, false]} />
      <meshStandardMaterial
        color={color}
        opacity={opacity}
        roughness={0.46}
        transparent={opacity < 1}
      />
    </mesh>
  );
}

function MusclePlate({
  color = muscleColor,
  length,
  name,
  opacity = 0.78,
  position,
  radius,
  rotationZ = 0,
  scaleX = 1,
  striationCount = 4,
}: {
  color?: string;
  length: number;
  name: string;
  opacity?: number;
  position: Point;
  radius: number;
  rotationZ?: number;
  scaleX?: number;
  striationCount?: number;
}) {
  const striations = Array.from({ length: striationCount }, (_, index) => {
    const offset =
      striationCount === 1
        ? 0
        : -length / 2 + (index / (striationCount - 1)) * length;

    return offset;
  });

  return (
    <group name={name} position={position} rotation={[0, 0, rotationZ]}>
      <mesh scale={[scaleX, 1, 0.2]}>
        <capsuleGeometry args={[radius, length, 16, 32]} />
        <meshStandardMaterial
          color={color}
          opacity={opacity}
          roughness={0.82}
          transparent
        />
      </mesh>
      {striations.map((offset) => (
        <mesh
          key={offset}
          position={[0, offset, radius * 0.72]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <boxGeometry args={[radius * 1.65 * scaleX, 0.0035, 0.004]} />
          <meshStandardMaterial
            color="#f4c0aa"
            opacity={0.46}
            roughness={0.42}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

function SkinAndSurfaceContours() {
  return (
    <group name="skin-and-atlas-contours">
      <mesh
        name="transparent-skin-head"
        position={[0, 0.92, -0.015]}
        scale={[0.78, 1, 0.6]}
      >
        <sphereGeometry args={[0.13, 36, 24]} />
        <meshStandardMaterial
          color={skinColor}
          opacity={0.24}
          roughness={0.86}
          transparent
        />
      </mesh>
      <mesh
        name="transparent-thoracoabdominal-skin"
        position={[0, 0.27, -0.025]}
        scale={[1.04, 1.35, 0.35]}
      >
        <capsuleGeometry args={[0.23, 0.56, 18, 40]} />
        <meshStandardMaterial
          color={skinColor}
          opacity={0.14}
          roughness={0.86}
          transparent
        />
      </mesh>
      <AnatomyCurve
        color={contourColor}
        name="left-body-contour"
        opacity={0.62}
        points={[
          [-0.11, 0.99, 0.08],
          [-0.17, 0.78, 0.08],
          [-0.34, 0.58, 0.08],
          [-0.43, 0.22, 0.08],
          [-0.28, -0.12, 0.08],
          [-0.21, -0.53, 0.08],
          [-0.19, -1.2, 0.08],
        ]}
        radius={0.004}
      />
      <AnatomyCurve
        color={contourColor}
        name="right-body-contour"
        opacity={0.62}
        points={[
          [0.11, 0.99, 0.08],
          [0.17, 0.78, 0.08],
          [0.34, 0.58, 0.08],
          [0.43, 0.22, 0.08],
          [0.28, -0.12, 0.08],
          [0.21, -0.53, 0.08],
          [0.19, -1.2, 0.08],
        ]}
        radius={0.004}
      />
    </group>
  );
}

function AxialSkeleton() {
  const vertebrae = Array.from({ length: 18 }, (_, index) => index);
  const ribs = Array.from({ length: 8 }, (_, index) => index);

  return (
    <group
      name="axial-skeleton-atlas"
      userData={{ bones: 80, region: "axial" }}
    >
      <mesh
        name="cranial-vault"
        position={[0, 0.93, 0.015]}
        scale={[0.78, 1, 0.55]}
      >
        <sphereGeometry args={[0.092, 30, 22]} />
        <meshStandardMaterial color={boneColor} roughness={0.52} />
      </mesh>
      <mesh
        name="mandible"
        position={[0, 0.84, 0.035]}
        scale={[1.0, 0.32, 0.4]}
      >
        <torusGeometry args={[0.06, 0.007, 8, 36, Math.PI]} />
        <meshStandardMaterial color={boneColor} roughness={0.54} />
      </mesh>
      <AnatomyCurve
        color={boneColor}
        name="left-clavicle"
        points={[
          [-0.02, 0.64, 0.035],
          [-0.13, 0.62, 0.035],
          [-0.26, 0.58, 0.035],
        ]}
        radius={0.008}
      />
      <AnatomyCurve
        color={boneColor}
        name="right-clavicle"
        points={[
          [0.02, 0.64, 0.035],
          [0.13, 0.62, 0.035],
          [0.26, 0.58, 0.035],
        ]}
        radius={0.008}
      />
      {vertebrae.map((index) => (
        <mesh
          key={index}
          name={`vertebra-${index + 1}`}
          position={[0, 0.62 - index * 0.041, 0.005]}
        >
          <boxGeometry args={[0.026, 0.013, 0.018]} />
          <meshStandardMaterial color={boneColor} roughness={0.58} />
        </mesh>
      ))}
      <mesh name="sternum" position={[0, 0.4, 0.048]}>
        <boxGeometry args={[0.025, 0.33, 0.014]} />
        <meshStandardMaterial color={boneColor} roughness={0.52} />
      </mesh>
      {ribs.map((index) => {
        const y = 0.54 - index * 0.043;
        const width = 0.13 + index * 0.021;

        return (
          <group key={index} name={`rib-pair-${index + 1}`}>
            <AnatomyCurve
              color={boneColor}
              name={`left-rib-${index + 1}`}
              opacity={0.9}
              points={[
                [0, y, 0.02],
                [-width * 0.55, y - 0.01, 0.045],
                [-width, y - 0.045, 0.02],
              ]}
              radius={0.005}
            />
            <AnatomyCurve
              color={boneColor}
              name={`right-rib-${index + 1}`}
              opacity={0.9}
              points={[
                [0, y, 0.02],
                [width * 0.55, y - 0.01, 0.045],
                [width, y - 0.045, 0.02],
              ]}
              radius={0.005}
            />
          </group>
        );
      })}
      <AnatomyCurve
        color={boneColor}
        name="left-iliac-crest"
        points={[
          [0, -0.15, 0.025],
          [-0.13, -0.18, 0.05],
          [-0.25, -0.14, 0.025],
        ]}
        radius={0.012}
      />
      <AnatomyCurve
        color={boneColor}
        name="right-iliac-crest"
        points={[
          [0, -0.15, 0.025],
          [0.13, -0.18, 0.05],
          [0.25, -0.14, 0.025],
        ]}
        radius={0.012}
      />
    </group>
  );
}

function AppendicularSkeleton() {
  const bones = [
    ["left-humerus", -0.36, 0.41, -0.32, 0.22, 0.012],
    ["right-humerus", 0.36, 0.41, 0.32, 0.22, 0.012],
    ["left-radius", -0.47, 0.15, -0.14, 0.27, 0.007],
    ["left-ulna", -0.5, 0.14, -0.1, 0.27, 0.006],
    ["right-radius", 0.47, 0.15, 0.14, 0.27, 0.007],
    ["right-ulna", 0.5, 0.14, 0.1, 0.27, 0.006],
    ["left-femur", -0.15, -0.42, 0.08, 0.46, 0.018],
    ["right-femur", 0.15, -0.42, -0.08, 0.46, 0.018],
    ["left-tibia", -0.16, -0.88, 0.03, 0.42, 0.012],
    ["left-fibula", -0.22, -0.88, 0.02, 0.39, 0.006],
    ["right-tibia", 0.16, -0.88, -0.03, 0.42, 0.012],
    ["right-fibula", 0.22, -0.88, -0.02, 0.39, 0.006],
  ] as const;

  return (
    <group
      name="appendicular-skeleton-atlas"
      userData={{ bones: 126, region: "appendicular" }}
    >
      {bones.map(([name, x, y, rotationZ, length, radius]) => (
        <mesh
          key={name}
          name={name}
          position={[x, y, 0.02]}
          rotation={[0, 0, rotationZ]}
        >
          <capsuleGeometry args={[radius, length, 8, 18]} />
          <meshStandardMaterial color={boneColor} roughness={0.58} />
        </mesh>
      ))}
      {[
        ["left-hand-carpals", -0.54, -0.03],
        ["right-hand-carpals", 0.54, -0.03],
        ["left-patella", -0.15, -0.66],
        ["right-patella", 0.15, -0.66],
        ["left-tarsals", -0.18, -1.12],
        ["right-tarsals", 0.18, -1.12],
      ].map(([name, x, y]) => (
        <mesh
          key={name}
          name={String(name)}
          position={[Number(x), Number(y), 0.045]}
        >
          <sphereGeometry args={[0.025, 18, 12]} />
          <meshStandardMaterial color={tendonColor} roughness={0.46} />
        </mesh>
      ))}
    </group>
  );
}

function SuperficialMuscleAtlas() {
  const plates = [
    ["left-deltoid", -0.31, 0.52, -0.18, 0.18, 0.055, 0.9, muscleColor],
    ["right-deltoid", 0.31, 0.52, 0.18, 0.18, 0.055, 0.9, muscleColor],
    ["left-biceps-brachii", -0.38, 0.31, -0.2, 0.22, 0.034, 0.82, "#d85d50"],
    ["right-biceps-brachii", 0.38, 0.31, 0.2, 0.22, 0.034, 0.82, "#d85d50"],
    ["left-forearm-flexors", -0.49, 0.08, -0.12, 0.24, 0.028, 0.72, "#c95e54"],
    ["right-forearm-flexors", 0.49, 0.08, 0.12, 0.24, 0.028, 0.72, "#c95e54"],
    ["left-rectus-femoris", -0.13, -0.42, 0.06, 0.36, 0.042, 0.84, "#ee7664"],
    ["right-rectus-femoris", 0.13, -0.42, -0.06, 0.36, 0.042, 0.84, "#ee7664"],
    ["left-vastus-lateralis", -0.22, -0.44, 0.02, 0.34, 0.034, 0.7, "#d85d50"],
    ["right-vastus-lateralis", 0.22, -0.44, -0.02, 0.34, 0.034, 0.7, "#d85d50"],
    [
      "left-tibialis-anterior",
      -0.13,
      -0.91,
      0.04,
      0.32,
      0.026,
      0.66,
      "#d85d50",
    ],
    [
      "right-tibialis-anterior",
      0.13,
      -0.91,
      -0.04,
      0.32,
      0.026,
      0.66,
      "#d85d50",
    ],
    [
      "left-gastrocnemius-medial",
      -0.21,
      -0.9,
      -0.04,
      0.28,
      0.03,
      0.7,
      "#9d8df1",
    ],
    [
      "right-gastrocnemius-medial",
      0.21,
      -0.9,
      0.04,
      0.28,
      0.03,
      0.7,
      "#9d8df1",
    ],
  ] as const;
  const abdominalSegments = Array.from({ length: 4 }, (_, index) => index);

  return (
    <group name="superficial-muscle-atlas" userData={{ namedMuscles: 26 }}>
      <MusclePlate
        length={0.21}
        name="left-pectoralis-major-fan"
        position={[-0.12, 0.47, 0.075]}
        radius={0.09}
        rotationZ={1.08}
        scaleX={0.72}
        striationCount={5}
      />
      <MusclePlate
        length={0.21}
        name="right-pectoralis-major-fan"
        position={[0.12, 0.47, 0.075]}
        radius={0.09}
        rotationZ={-1.08}
        scaleX={0.72}
        striationCount={5}
      />
      <MusclePlate
        color="#9d8df1"
        length={0.35}
        name="left-external-oblique"
        opacity={0.56}
        position={[-0.17, 0.17, 0.07]}
        radius={0.045}
        rotationZ={-0.48}
        scaleX={1.05}
        striationCount={5}
      />
      <MusclePlate
        color="#9d8df1"
        length={0.35}
        name="right-external-oblique"
        opacity={0.56}
        position={[0.17, 0.17, 0.07]}
        radius={0.045}
        rotationZ={0.48}
        scaleX={1.05}
        striationCount={5}
      />
      {abdominalSegments.map((index) => (
        <group key={index} name={`rectus-abdominis-pair-${index + 1}`}>
          <mesh
            position={[-0.045, 0.29 - index * 0.08, 0.085]}
            scale={[0.62, 0.42, 0.18]}
          >
            <sphereGeometry args={[0.045, 18, 12]} />
            <meshStandardMaterial
              color="#d85d50"
              opacity={0.72}
              roughness={0.82}
              transparent
            />
          </mesh>
          <mesh
            position={[0.045, 0.29 - index * 0.08, 0.085]}
            scale={[0.62, 0.42, 0.18]}
          >
            <sphereGeometry args={[0.045, 18, 12]} />
            <meshStandardMaterial
              color="#d85d50"
              opacity={0.72}
              roughness={0.82}
              transparent
            />
          </mesh>
        </group>
      ))}
      {plates.map(([name, x, y, rotationZ, length, radius, scaleX, color]) => (
        <MusclePlate
          color={color}
          key={name}
          length={length}
          name={name}
          position={[x, y, 0.075]}
          radius={radius}
          rotationZ={rotationZ}
          scaleX={scaleX}
        />
      ))}
      <AnatomyCurve
        color={fasciaColor}
        name="left-sartorius-visible-band"
        opacity={0.78}
        points={[
          [-0.24, -0.2, 0.11],
          [-0.14, -0.36, 0.12],
          [-0.06, -0.61, 0.11],
        ]}
        radius={0.012}
      />
      <AnatomyCurve
        color={fasciaColor}
        name="right-sartorius-visible-band"
        opacity={0.78}
        points={[
          [0.24, -0.2, 0.11],
          [0.14, -0.36, 0.12],
          [0.06, -0.61, 0.11],
        ]}
        radius={0.012}
      />
    </group>
  );
}

export default function AnatomicalHumanFigure({
  onSelectLowerLimb,
}: AnatomicalHumanFigureProps) {
  return (
    <group
      name="atlas-proportioned-adult-human"
      onClick={(event) => {
        event.stopPropagation();
        onSelectLowerLimb();
      }}
      scale={[1.08, 1.08, 1.08]}
      userData={{
        atlasStyle: "front-view-surface-anatomy-with-skeleton",
        headUnits: 7.5,
        heightM: 1.7,
        selectable: "body-region",
      }}
    >
      <SkinAndSurfaceContours />
      <AxialSkeleton />
      <AppendicularSkeleton />
      <SuperficialMuscleAtlas />
    </group>
  );
}
