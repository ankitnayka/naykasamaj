"use client";

import React, { useEffect, useState } from "react";

interface ARSceneAframeProps {
  scale: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  brightness: number;
  contrast: number;
  saturation: number;
  onExit: () => void;
}

export default function ARSceneAframe({
  scale,
  rotX,
  rotY,
  rotZ,
  brightness,
  contrast,
  saturation,
  onExit,
}: ARSceneAframeProps) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Dynamically load A-Frame and MindAR only when in the browser to prevent NextSSR crashes
    if (typeof window !== "undefined") {
      require("aframe");
      require("mind-ar/dist/mindar-image-aframe.prod.js");

      const AFRAME = (window as any).AFRAME;

      // Ensure we don't double register if react re-renders
      if (AFRAME && !AFRAME.components["color-grading"]) {
        AFRAME.registerComponent("color-grading", {
          schema: {
            brightness: { type: "number", default: 1.0 },
            contrast: { type: "number", default: 1.0 },
            saturation: { type: "number", default: 1.0 },
          },
          init: function () {
            this.el.addEventListener("model-loaded", () => {
              const obj = this.el.getObject3D("mesh");
              if (obj) {
                const THREE = AFRAME.THREE;
                
                // --- 1 Meter Baseline Engine ---
                // Calculate physical width of the 3D model
                const box = new THREE.Box3().setFromObject(obj);
                const size = new THREE.Vector3();
                box.getSize(size);
                if (size.x > 0) {
                  this.el.baseMultiplier = 1 / size.x;
                } else {
                  this.el.baseMultiplier = 1;
                }

                // Inject a custom function to update scale on-demand
                this.el.updateCalculatedScale = function(userScale: number) {
                  const s = userScale * (this.baseMultiplier || 1);
                  this.setAttribute('scale', `${s} ${s} ${s}`);
                };
                
                // Bootstrapper for initial scale
                if (this.el.queuedScale) {
                  this.el.updateCalculatedScale(this.el.queuedScale);
                }

                // Deep clone materials
                obj.traverse((child: any) => {
                  if (child.isMesh && child.material) {
                    child.material = child.material.clone();
                    if (child.material.color) {
                      child.material.userData.originalColor = child.material.color.clone();
                    }
                  }
                });

                this.update();
              }
            });
          },
          update: function () {
            const obj = this.el.getObject3D("mesh");
            if (!obj) return;

            const { brightness, contrast, saturation } = this.data;
            const THREE = AFRAME.THREE;

            obj.traverse((child: any) => {
              if (child.isMesh && child.material && child.material.userData.originalColor) {
                const mat = child.material;
                const orig = child.material.userData.originalColor;
                const hsl = { h: 0, s: 0, l: 0 };
                orig.getHSL(hsl);

                hsl.s *= saturation;
                hsl.l *= brightness;
                mat.color.setHSL(
                  hsl.h,
                  THREE.MathUtils.clamp(hsl.s, 0, 1),
                  THREE.MathUtils.clamp(hsl.l, 0, 1)
                );

                mat.color.r = THREE.MathUtils.clamp((mat.color.r - 0.5) * contrast + 0.5, 0, 1);
                mat.color.g = THREE.MathUtils.clamp((mat.color.g - 0.5) * contrast + 0.5, 0, 1);
                mat.color.b = THREE.MathUtils.clamp((mat.color.b - 0.5) * contrast + 0.5, 0, 1);

                mat.needsUpdate = true;
              }
            });
          },
        });

        // Helper component to trigger the scale update function we bound to the element
        AFRAME.registerComponent("admin-scale", {
          schema: { mult: { type: "number", default: 1 } },
          update: function () {
            if (this.el.updateCalculatedScale) {
              this.el.updateCalculatedScale(this.data.mult);
            } else {
              // Cache it if the model hasn't finished loading yet!
              this.el.queuedScale = this.data.mult;
            }
          }
        });
      }

      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <div style={{ position: "fixed", top:0, left:0, width:"100vw", height:"100vh", backgroundColor: "black", color: "white", display: "flex", justifyContent: "center", alignItems: "center" }}>
         Loading MindAR Engine...
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 10 }}>
      {/* 
        React createElement is used to safely render Custom Elements (A-Frame HTML tags) 
        without TypeScript JSX errors.
      */}
      {React.createElement(
        "a-scene" as any,
        {
          "mindar-image": "imageTargetSrc: /targets.mind; filterMinCF:0.0001; filterBeta: 0.001;",
          "color-space": "sRGB",
          renderer: "colorManagement: true, physicallyCorrectLights",
          "vr-mode-ui": "enabled: false",
          "device-orientation-permission-ui": "enabled: false",
        },
        React.createElement("a-assets" as any, null,
          React.createElement("a-asset-item" as any, {
            id: "bhavanModel",
            src: "/models/building.glb",
          })
        ),
        React.createElement("a-camera" as any, {
          position: "0 0 0",
          "look-controls": "enabled: false",
        }),
        React.createElement("a-entity" as any, {
          "mindar-image-target": "targetIndex: 0",
        },
          React.createElement("a-gltf-model" as any, {
            src: "#bhavanModel",
            rotation: `${rotX} ${rotY} ${rotZ}`,
            "admin-scale": `mult: ${scale}`,
            "color-grading": `brightness: ${brightness}; contrast: ${contrast}; saturation: ${saturation};`,
          })
        )
      )}

      <button
        onClick={onExit}
        style={{
          position: "absolute",
          bottom: "30px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          padding: "16px 32px",
          borderRadius: "12px",
          border: "none",
          background: "linear-gradient(135deg, #800020, #a50029)",
          color: "white",
          fontSize: "16px",
          fontWeight: "bold",
        }}
      >
        Exit AR
      </button>
    </div>
  );
}
