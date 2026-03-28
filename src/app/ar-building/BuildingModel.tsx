"use client";

import React, { useRef, useEffect, useMemo, useState } from "react";
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
  saturation?: number;
}

export default function BuildingModel({
  matrix,
  scale = 1.0,
  rotX = 0,
  rotY = 0,
  rotZ = 0,
  brightness = 1.0,
  contrast = 1.0,
  saturation = 1.0,
}: BuildingModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/building.glb");
  const [baseMultiplier, setBaseMultiplier] = useState(1.0);

  // Deep clone the scene and its materials so we don't mutate the global useGLTF cache
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Automatically calculate bounding box to force exactly 1 meter physical width
    const box = new THREE.Box3().setFromObject(clone);
    const size = new THREE.Vector3();
    box.getSize(size);
    
    if (size.x > 0) {
      // If the model is 50 units wide, 1 / 50 = 0.02 base scale
      setBaseMultiplier(1 / size.x); 
    }

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

  // Handle positioning and rotation relative to the physical tracking marker
  useEffect(() => {
    if (groupRef.current && matrix) {
      const position = new THREE.Vector3();
      const quaternion = new THREE.Quaternion();
      const scaleVec = new THREE.Vector3();
      matrix.decompose(position, quaternion, scaleVec);

      // Snap exactly to the detected paper marker
      groupRef.current.position.copy(position);
      groupRef.current.quaternion.copy(quaternion);

      // Apply the user-defined rotation offsets locally
      groupRef.current.rotateX(THREE.MathUtils.degToRad(rotX));
      groupRef.current.rotateY(THREE.MathUtils.degToRad(rotY));
      groupRef.current.rotateZ(THREE.MathUtils.degToRad(rotZ));

      // Admin-configurable scale multiplier * base 1-meter multiplier
      const finalScale = scale * baseMultiplier;
      groupRef.current.scale.set(finalScale, finalScale, finalScale);
    }
  }, [matrix, scale, rotX, rotY, rotZ, baseMultiplier]);

  // Handle material tuning (Brightness, Contrast, Saturation)
  useEffect(() => {
    if (!clonedScene) return;

    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material) {
        const mat = child.material;
        const origColor = mat.userData.originalColor as THREE.Color;

        if (origColor) {
           const hsl = { h: 0, s: 0, l: 0 };
           origColor.getHSL(hsl);

           // Apply Saturation and Brightness (Lightness)
           hsl.s *= saturation;
           hsl.l *= brightness;
           
           mat.color.setHSL(
             hsl.h, 
             THREE.MathUtils.clamp(hsl.s, 0, 1), 
             THREE.MathUtils.clamp(hsl.l, 0, 1)
           );

           // Apply pseudo-Contrast (manipulating RGB after HSL transformation)
           mat.color.r = (mat.color.r - 0.5) * contrast + 0.5;
           mat.color.g = (mat.color.g - 0.5) * contrast + 0.5;
           mat.color.b = (mat.color.b - 0.5) * contrast + 0.5;

           // Clamp final values
           mat.color.r = THREE.MathUtils.clamp(mat.color.r, 0, 1);
           mat.color.g = THREE.MathUtils.clamp(mat.color.g, 0, 1);
           mat.color.b = THREE.MathUtils.clamp(mat.color.b, 0, 1);
          
           mat.needsUpdate = true;
        }
      }
    });
  }, [clonedScene, brightness, contrast, saturation]);

  return (
    <group ref={groupRef}>
      <primitive object={clonedScene} />
    </group>
  );
}

// Preload the model for faster loading
useGLTF.preload("/models/building.glb");
