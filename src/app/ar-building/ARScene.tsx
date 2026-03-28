"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { XR, createXRStore } from "@react-three/xr";
import * as THREE from "three";
import BuildingModel from "./BuildingModel";

interface ARSceneProps {
  onExit: () => void;
  configScale: number;
  configDistance: number;
  configRotX: number;
  configRotY: number;
  configRotZ: number;
  configBrightness: number;
  configContrast: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
}

const store = createXRStore({});

// ── Force placement inner component ─────────────────────────────────────────
// Runs inside the Canvas/XR context so we have access to the R3F camera.
function ForcePlacer({
  distance,
  onPlace,
}: {
  distance: number;
  onPlace: (matrix: THREE.Matrix4) => void;
}) {
  const { camera } = useThree();
  const placed = useRef(false);

  useEffect(() => {
    if (placed.current) return;
    placed.current = true;

    // Build a matrix that is `distance` metres directly in front of the camera
    // and 1.5 m below eye level (approximate ground level).
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    dir.y = 0;
    dir.normalize();

    const pos = camera.position.clone().addScaledVector(dir, distance);
    pos.y -= 1.5; // bring to approximate floor

    const matrix = new THREE.Matrix4();
    matrix.setPosition(pos);
    onPlace(matrix);
  }, [camera, distance, onPlace]);

  return null;
}

// ── Main scene ───────────────────────────────────────────────────────────────
export default function ARScene({
  onExit,
  configScale,
  configDistance,
  configRotX,
  configRotY,
  configRotZ,
  configBrightness,
  configContrast,
  offsetX,
  offsetY,
  offsetZ,
}: ARSceneProps) {
  const [placed, setPlaced] = useState(false);
  const [buildingMatrix, setBuildingMatrix] = useState<THREE.Matrix4 | null>(
    null
  );
  const reticleMatrixRef = useRef<THREE.Matrix4>(new THREE.Matrix4());

  const handlePlace = useCallback(() => {
    if (placed) return;
    setBuildingMatrix(reticleMatrixRef.current.clone());
    setPlaced(true);
  }, [placed]);

  const handleReticleUpdate = useCallback((matrix: THREE.Matrix4) => {
    reticleMatrixRef.current.copy(matrix);
  }, []);

  const handleForcePlace = useCallback((matrix: THREE.Matrix4) => {
    setBuildingMatrix(matrix);
    setPlaced(true);
  }, []);

  return (
    <>
      <button
        onClick={() => store.enterAR()}
        style={{
          position: "fixed",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 1000,
          padding: "16px 32px",
          fontSize: "18px",
          fontWeight: 700,
          background: "linear-gradient(135deg, #800020, #a50029)",
          color: "white",
          border: "none",
          borderRadius: "12px",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(128, 0, 32, 0.4)",
        }}
      >
        Enter AR
      </button>

      <Canvas
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <XR store={store}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />

          {/* New Mode: Always auto-place at configDistance without surface tracking */}
          {!placed && (
            <ForcePlacer distance={configDistance} onPlace={handleForcePlace} />
          )}

          {/* Building model — rendered once placed */}
          {placed && buildingMatrix && (
            <BuildingModel 
              matrix={buildingMatrix} 
              scale={configScale}
              rotX={configRotX}
              rotY={configRotY}
              rotZ={configRotZ}
              brightness={configBrightness}
              contrast={configContrast}
              offsetX={offsetX}
              offsetY={offsetY}
              offsetZ={offsetZ}
            />
          )}
        </XR>
      </Canvas>
    </>
  );
}
