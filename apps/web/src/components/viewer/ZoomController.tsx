"use client";

import { getCameraDistance } from "@/lib/zoom";
import { useFrame, useThree } from "@react-three/fiber";

interface ZoomControllerProps {
  zoomValue: number;
}

export default function ZoomController({ zoomValue }: ZoomControllerProps) {
  const { camera } = useThree();
  const targetDistance = getCameraDistance(zoomValue);

  useFrame(() => {
    camera.position.z += (targetDistance - camera.position.z) * 0.08;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
