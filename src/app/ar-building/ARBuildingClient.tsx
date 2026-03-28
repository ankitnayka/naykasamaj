"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { createXRStore } from "@react-three/xr";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./ar-building.module.css";

// Dynamically import AR scene to avoid SSR issues with Three.js/WebXR
const ARScene = dynamic(() => import("./ARScene"), { ssr: false });

// Admin config defaults
const DEFAULT_SCALE = 1.0;
const DEFAULT_ROT_X = 0;
const DEFAULT_ROT_Y = 0;
const DEFAULT_ROT_Z = 0;
const DEFAULT_BRIGHTNESS = 1.0;
const DEFAULT_CONTRAST = 1.0;
const DEFAULT_SATURATION = 1.0;

function ARBuildingInner() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [arActive, setArActive] = useState(false);
  
  // Custom XR store built after image bitmap loads
  const [store, setStore] = useState<any>(null);

  // Admin configurable state
  const [configScale, setConfigScale] = useState(DEFAULT_SCALE); // Represents width in M
  const [configRotX, setConfigRotX] = useState(DEFAULT_ROT_X);
  const [configRotY, setConfigRotY] = useState(DEFAULT_ROT_Y);
  const [configRotZ, setConfigRotZ] = useState(DEFAULT_ROT_Z);
  const [configBrightness, setConfigBrightness] = useState(DEFAULT_BRIGHTNESS);
  const [configContrast, setConfigContrast] = useState(DEFAULT_CONTRAST);
  const [configSaturation, setConfigSaturation] = useState(DEFAULT_SATURATION);

  const resetAllSettings = () => {
    setConfigScale(DEFAULT_SCALE);
    setConfigRotX(DEFAULT_ROT_X);
    setConfigRotY(DEFAULT_ROT_Y);
    setConfigRotZ(DEFAULT_ROT_Z);
    setConfigBrightness(DEFAULT_BRIGHTNESS);
    setConfigContrast(DEFAULT_CONTRAST);
    setConfigSaturation(DEFAULT_SATURATION);
  };

  // Helper to send phone browser logs to the PC terminal
  const remoteLog = (msg: string, err?: any) => {
    fetch("/api/log", {
      method: "POST",
      body: JSON.stringify({ message: msg, error: err ? err.toString() : null }),
    }).catch(() => {});
  };

  useEffect(() => {
    remoteLog("Component Mounted, initializing Image Tracking...");

    async function initializeImageTracker() {
      try {
        // Load the target image (the physical hook)
        const img = new Image();
        img.src = "/marker.jpeg"; // The user's target QR/Poster
        await img.decode();
        
        const bitmap = await createImageBitmap(img);

        // Build a store strictly requesting Image Tracking and providing our target bitmap
        const xrTrackerStore = createXRStore({
          customSessionInit: {
            requiredFeatures: ["image-tracking"],
            // @ts-ignore - WebXR draft API types might be missing in older Typescript
            trackedImages: [
              {
                image: bitmap,
                widthInMeters: 0.21, // A4 physical paper width in meters
              },
            ],
          },
        });
        
        setStore(xrTrackerStore);

        // Check if WebXR is supported now that the store is ready
        checkARSupport();
      } catch (err) {
        remoteLog("Failed to embed Image Tracker", err);
      }
    }

    initializeImageTracker();
  }, []);

  async function checkARSupport() {
    if (typeof window === "undefined") return;
    if (!window.isSecureContext) {
      remoteLog("WebXR requires a secure context (HTTPS)");
      setArSupported(false);
      return;
    }
    if (!("xr" in navigator)) {
      remoteLog("navigator.xr not found");
      setArSupported(false);
      return;
    }
    try {
      remoteLog("Calling navigator.xr.isSessionSupported");
      const supported = await Promise.race([
        (navigator as any).xr.isSessionSupported("immersive-ar"),
        new Promise((resolve) => setTimeout(() => resolve("timeout"), 3000)),
      ]);
      remoteLog(`isSessionSupported resolved with: ${supported}`);
      setArSupported(supported === "timeout" || supported === true);
    } catch (e) {
      remoteLog("XR check failed", e);
      setArSupported(false);
    }
  }

  const text = {
    en: {
      title: "Nayaka Samaj Bhavan",
      subtitle: "Experience our community building in augmented reality",
      description:
        "Scan the Nayaka Samaj QR marker using your phone's camera. The building will physically hook to your paper. Walk around it and see it from every angle.",
      startAR: "Start AR Experience",
      howTitle: "How It Works",
      step1: "Tap the button above to start",
      step2: "Point your camera exactly at the printed Marker",
      step3: "Watch the building instantly spawn on top",
      step4: "Walk around to explore from every angle",
      notSupported:
        "AR experience requires an Android device with Google Chrome.",
      exitAR: "Exit AR",
      loading: "Calibrating Tracker...",
    },
    gu: {
      title: "નાયકા સમાજ ભવન",
      subtitle: "ઓગમેન્ટેડ રિયાલિટીમાં અમારું સમાજ ભવન જુઓ",
      description:
        "તમારા ફોનના કૅમેરાનો ઉપયોગ કરીને નાયકા સમાજ માર્કર સ્કેન કરો. ભવન આપોઆપ તેની સાથે જોડાઈ જશે.",
      startAR: "AR અનુભવ શરૂ કરો",
      howTitle: "કેવી રીતે કામ કરે છે",
      step1: "શરૂ કરવા માટે ઉપરનું બટન દબાવો",
      step2: "તમારો કૅમેરો માર્કર તરફ રાખો",
      step3: "ભવનને માર્કર પર જોવો",
      step4: "દરેક ખૂણે જોવા માટે ફરતા ચાલો",
      notSupported: "AR અનુભવ માટે Google Chrome સાથે Android ઉપકરણ જરૂરી છે.",
      exitAR: "AR બંધ કરો",
      loading: "AR માર્કર તૈયાર કરી રહ્યા છીએ...",
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  if (arActive && store) {
    return (
      <div className={styles.arFullscreen}>
        <ARScene
          store={store}
          onExit={() => setArActive(false)}
          configScale={configScale}
          configRotX={configRotX}
          configRotY={configRotY}
          configRotZ={configRotZ}
          configBrightness={configBrightness}
          configContrast={configContrast}
          configSaturation={configSaturation}
        />
        <div className={styles.arOverlay}>
          <button
            className={styles.exitButton}
            onClick={() => setArActive(false)}
          >
            {t.exitAR}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>
      </section>

      <section className={styles.mainSection}>
        <div className="container">
          <p className={styles.description}>{t.description}</p>

          {/* ── Admin Config Panel ── */}
          {isAdmin && (
            <div className={styles.adminPanel}>
              <div className={styles.adminHeader}>
                🔧 AR Tracker Calibration{" "}
                <span className={styles.adminBadge}>ADMIN</span>
              </div>

              <div className={styles.adminRow}>
                <label className={styles.adminLabel}>
                  Model Width (Meters):{" "}
                  <strong>{configScale.toFixed(2)}m</strong>
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={50}
                  step={0.1}
                  value={configScale}
                  onChange={(e) => setConfigScale(parseFloat(e.target.value))}
                  className={styles.adminSlider}
                />
                <span className={styles.adminRange}>0.1m — 50.0m</span>
              </div>
              
              <div className={styles.adminRow}>
                <label className={styles.adminLabel}>
                  Rotation Y (Horizontal):{" "}
                  <strong>{configRotY}°</strong>
                </label>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={configRotY}
                  onChange={(e) => setConfigRotY(parseInt(e.target.value))}
                  className={styles.adminSlider}
                />
              </div>

              <div className={styles.adminRow}>
                <label className={styles.adminLabel}>
                  Rotation X (Pitch):{" "}
                  <strong>{configRotX}°</strong>
                </label>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={configRotX}
                  onChange={(e) => setConfigRotX(parseInt(e.target.value))}
                  className={styles.adminSlider}
                />
              </div>

              <div className={styles.adminRow}>
                <label className={styles.adminLabel}>
                  Rotation Z (Roll):{" "}
                  <strong>{configRotZ}°</strong>
                </label>
                <input
                  type="range"
                  min={-180}
                  max={180}
                  step={1}
                  value={configRotZ}
                  onChange={(e) => setConfigRotZ(parseInt(e.target.value))}
                  className={styles.adminSlider}
                />
              </div>

              <div className={styles.adminRow}>
                <label className={styles.adminLabel}>
                  Brightness:{" "}
                  <strong>{configBrightness.toFixed(2)}</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={0.05}
                  value={configBrightness}
                  onChange={(e) => setConfigBrightness(parseFloat(e.target.value))}
                  className={styles.adminSlider}
                />
              </div>

              <div className={styles.adminRow}>
                <label className={styles.adminLabel}>
                  Contrast:{" "}
                  <strong>{configContrast.toFixed(2)}</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={0.05}
                  value={configContrast}
                  onChange={(e) => setConfigContrast(parseFloat(e.target.value))}
                  className={styles.adminSlider}
                />
              </div>

              <div className={styles.adminRow}>
                <label className={styles.adminLabel}>
                  Saturation:{" "}
                  <strong>{configSaturation.toFixed(2)}</strong>
                </label>
                <input
                  type="range"
                  min={0}
                  max={3}
                  step={0.05}
                  value={configSaturation}
                  onChange={(e) => setConfigSaturation(parseFloat(e.target.value))}
                  className={styles.adminSlider}
                />
              </div>

              <button 
                className={styles.resetSettingsButton}
                onClick={resetAllSettings}
              >
                Reset All Settings
              </button>
            </div>
          )}

          {!store || arSupported === null ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner} />
              <p>{t.loading}</p>
            </div>
          ) : arSupported ? (
            <button
              className={styles.arButton}
              onClick={() => setArActive(true)}
            >
              <i className="bi bi-phone" />
              {t.startAR}
            </button>
          ) : (
            <div className={styles.notSupported}>
              <i className="bi bi-exclamation-triangle" />
              <p>{t.notSupported}</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.howSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>{t.howTitle}</h2>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <p>{t.step1}</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <p>{t.step2}</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <p>{t.step3}</p>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>4</div>
              <p>{t.step4}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function ARBuildingClient() {
  return (
    <Suspense fallback={null}>
      <ARBuildingInner />
    </Suspense>
  );
}
