"use client";

import React, { useRef, useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface BuildingModelProps {
  matrix: THREE.Matrix4;
  scale?: number; // Configurable from admin panel (default 1.0)
}

export default function BuildingModel({ matrix, scale = 1.0 }: BuildingModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/building.glb");

  useEffect(() => {
    if (groupRef.current && matrix) {
      // Decompose the hit test matrix to get position and rotation
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const scaleVec = new THREE.Vector3();
      matrix.decompose(position, quaternion, scaleVec);

      // Set position from hit test
      groupRef.current.position.copy(position);
      groupRef.current.quaternion.copy(quaternion);

      // Admin-configurable scale multiplier
      groupRef.current.scale.set(scale, scale, scale);
    }
  }, [matrix, scale]);

  return (
    <group ref={groupRef}>
      <primitive object={scene.clone()} />
    </group>
  );
}

// Preload the model for faster loading
useGLTF.preload("/models/building.glb");
