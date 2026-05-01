"use client";

import { getCameraDistance, getZoomLevel } from "@/lib/zoom";
import { useFrame, useThree } from "@react-three/fiber";

interface ZoomControllerProps {
  zoomValue: number;
}

export default function ZoomController({ zoomValue }: ZoomControllerProps) {
  const { camera } = useThree();
  const level = getZoomLevel(zoomValue);
  const targetDistance =
    level >= 9
      ? Math.max(2.4, getCameraDistance(zoomValue))
      : getCameraDistance(zoomValue);

  useFrame(() => {
    camera.position.z += (targetDistance - camera.position.z) * 0.08;
    camera.lookAt(0, 0, 0);
  });

  return null;
}
