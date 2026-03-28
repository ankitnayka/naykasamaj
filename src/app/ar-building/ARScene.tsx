"use client";

import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { XR } from "@react-three/xr";
import * as THREE from "three";
import BuildingModel from "./BuildingModel";

interface ARSceneProps {
  store: any;
  onExit: () => void;
  configScale: number;
  configRotX: number;
  configRotY: number;
  configRotZ: number;
  configBrightness: number;
  configContrast: number;
  configSaturation: number;
}

// ── Native WebXR Image Tracker ──────────────────────────────────────────────
function ImageTracker({ onTrack }: { onTrack: (matrix: THREE.Matrix4) => void }) {
  useFrame((state) => {
    // Access the raw WebXR frame from React Three Fiber
    const frame = state.gl.xr.getFrame();
    if (!frame) return;

    // Use native WebXR Image Tracking API
    // @ts-ignore - getImageTrackingResults might be missing from older TypeScript DOM types
    const results = frame.getImageTrackingResults ? frame.getImageTrackingResults() : [];

    for (const result of results) {
      if (result.trackingState === "tracked") {
        const referenceSpace = state.gl.xr.getReferenceSpace();
        if (referenceSpace) {
          const pose = frame.getPose(result.imageSpace, referenceSpace);
          if (pose) {
            const matrix = new THREE.Matrix4().fromArray(pose.transform.matrix);
            onTrack(matrix);
          }
        }
      }
    }
  });

  return null;
}

// ── Main scene ───────────────────────────────────────────────────────────────
export default function ARScene({
  store,
  onExit,
  configScale,
  configRotX,
  configRotY,
  configRotZ,
  configBrightness,
  configContrast,
  configSaturation,
}: ARSceneProps) {
  const [trackedMatrix, setTrackedMatrix] = useState<THREE.Matrix4 | null>(null);

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

          <ImageTracker onTrack={(matrix) => setTrackedMatrix(matrix.clone())} />

          {/* Render building only when tracked by the marker */}
          {trackedMatrix && (
            <BuildingModel 
              matrix={trackedMatrix} 
              scale={configScale}
              rotX={configRotX}
              rotY={configRotY}
              rotZ={configRotZ}
              brightness={configBrightness}
              contrast={configContrast}
              saturation={configSaturation}
            />
          )}
        </XR>
      </Canvas>
    </>
  );
}
