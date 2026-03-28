"use client";

import React, { useRef, useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

interface BuildingModelProps {
  matrix: THREE.Matrix4;
  scale?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  brightness?: number;
  contrast?: number;
  offsetX?: number;
  offsetY?: number;
  offsetZ?: number;
}

export default function BuildingModel({
  matrix,
  scale = 1.0,
  rotX = 0,
  rotY = 0,
  rotZ = 0,
  brightness = 1.0,
  contrast = 1.0,
  offsetX = 0,
  offsetY = 0,
  offsetZ = 0,
}: BuildingModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/building.glb");

  // Deep clone the scene and its materials so we don't mutate the global useGLTF cache
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        // Clone material to avoid global state cross-contamination
        child.material = child.material.clone();
        // Save the baseline color for brightness/contrast math
        if (child.material.color) {
          child.material.userData.originalColor = child.material.color.clone();
        }
      }
    });
    return clone;
  }, [scene]);

  // Handle positioning and rotation
  useEffect(() => {
    if (groupRef.current && matrix) {
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const scaleVec = new THREE.Vector3();
      matrix.decompose(position, quaternion, scaleVec);

      // Set baseline hit-test position and rotation
      groupRef.current.position.set(
        position.x + offsetX,
        position.y + offsetY,
        position.z + offsetZ
      );
      groupRef.current.quaternion.copy(quaternion);

      // Apply the user-defined rotation offsets locally
      groupRef.current.rotateX(THREE.MathUtils.degToRad(rotX));
      groupRef.current.rotateY(THREE.MathUtils.degToRad(rotY));
      groupRef.current.rotateZ(THREE.MathUtils.degToRad(rotZ));

      // Admin-configurable scale multiplier
      groupRef.current.scale.set(scale, scale, scale);
    }
  }, [matrix, scale, rotX, rotY, rotZ, offsetX, offsetY, offsetZ]);

  // Handle material tuning (Brightness & Contrast)
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material;
        const origColor = mat.userData.originalColor as THREE.Color;

        if (origColor) {
          // Reset to original before recalculating
          mat.color.copy(origColor);

          // Apply Brightness (Scalar multiplication)
          mat.color.multiplyScalar(brightness);

          // Apply pseudo-Contrast
          mat.color.r = (mat.color.r - 0.5) * contrast + 0.5;
          mat.color.g = (mat.color.g - 0.5) * contrast + 0.5;
          mat.color.b = (mat.color.b - 0.5) * contrast + 0.5;

          // Clamp values
          mat.color.r = THREE.MathUtils.clamp(mat.color.r, 0, 1);
          mat.color.g = THREE.MathUtils.clamp(mat.color.g, 0, 1);
          mat.color.b = THREE.MathUtils.clamp(mat.color.b, 0, 1);
          
          mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene, brightness, contrast]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload the model for faster loading
useGLTF.preload("/models/building.glb");
