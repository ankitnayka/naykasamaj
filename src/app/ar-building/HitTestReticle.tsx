"use client";

import React, { useRef } from "react";
import { useXRHitTest } from "@react-three/xr";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";

const matrixHelper = new THREE.Matrix4();
const positionHelper = new THREE.Vector3();

interface HitTestReticleProps {
  onUpdate: (matrix: THREE.Matrix4) => void;
  onSelect: () => void;
}

export default function HitTestReticle({ onUpdate, onSelect }: HitTestReticleProps) {
  const reticleRef = useRef<THREE.Mesh>(null);
  const hasHit = useRef(false);

  useXRHitTest(
    (results, getWorldMatrix) => {
      if (results.length === 0) {
        hasHit.current = false;
        return;
      }

      // Get the world matrix of the first hit
      const gotMatrix = getWorldMatrix(matrixHelper, results[0]);
      if (gotMatrix) {
        hasHit.current = true;
        positionHelper.setFromMatrixPosition(matrixHelper);
        onUpdate(matrixHelper.clone());
      }
    },
    "viewer"
  );

  const guideRef = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (reticleRef.current) {
      if (hasHit.current) {
        reticleRef.current.visible = true;
        reticleRef.current.position.copy(positionHelper);
      } else {
        reticleRef.current.visible = false;
      }
    }

    // Always reposition the scanning guide to be explicitly in front of the camera when not hit
    if (guideRef.current) {
      if (!hasHit.current) {
        guideRef.current.visible = true;
        // Position it 1.2 meters directly in front of the camera
        guideRef.current.position.copy(camera.position);
        guideRef.current.position.add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(1.2));
        // Rotate it so it perfectly faces the user
        guideRef.current.quaternion.copy(camera.quaternion);
      } else {
        guideRef.current.visible = false;
      }
    }
  });

  return (
    <>
      <mesh
        ref={reticleRef}
        visible={false}
        rotation-x={-Math.PI / 2}
        onClick={onSelect}
      >
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial
          color="#D4AF37"
          side={THREE.DoubleSide}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* 3D Scanning UI that hovers and instructs the user before a surface is found */}
      <group ref={guideRef} visible={false}>
        <Text
          fontSize={0.06}
          color="#ffffff"
          outlineWidth={0.005}
          outlineColor="#000000"
          anchorX="center"
          anchorY="bottom"
          position={[0, 0, 0]}
        >
          Searching for floor...
        </Text>
        <Text
          fontSize={0.035}
          color="#D4AF37"
          outlineWidth={0.003}
          outlineColor="#000000"
          anchorX="center"
          anchorY="top"
          position={[0, -0.08, 0]}
        >
          Point camera at a textured surface and move slowly
        </Text>
      </group>
    </>
  );
}
