"use client";

import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./ar-building.module.css";

// Dynamically import AR scene to avoid SSR issues with Three.js/WebXR
const ARScene = dynamic(() => import("./ARScene"), { ssr: false });

// Admin config defaults
const DEFAULT_SCALE = 1.0;
const DEFAULT_DISTANCE = 15; // metres

function ARBuildingInner() {
  const { language } = useLanguage();
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  const [arSupported, setArSupported] = useState<boolean | null>(null);
  const [arActive, setArActive] = useState(false);

  // Admin configurable state
  const [configScale, setConfigScale] = useState(DEFAULT_SCALE);
  const [configDistance, setConfigDistance] = useState(DEFAULT_DISTANCE);
  const [forcePlacement, setForcePlacement] = useState(false);

  // Helper to send phone browser logs to the PC terminal
  const remoteLog = (msg: string, err?: any) => {
    fetch("/api/log", {
      method: "POST",
      body: JSON.stringify({ message: msg, error: err ? err.toString() : null }),
    }).catch(() => {});
  };

  useEffect(() => {
    remoteLog("Component Mounted");
    let isMounted = true;

    const failsafe = setTimeout(() => {
      if (isMounted) {
        remoteLog("Hard failsafe triggered. Forcing AR button to appear.");
        setArSupported((prev) => (prev === null ? true : prev));
      }
    }, 4000);

    remoteLog("Starting checkARSupport");
    checkARSupport()
      .then(() => remoteLog("checkARSupport finished"))
      .catch((e) => remoteLog("checkARSupport threw error", e))
      .finally(() => clearTimeout(failsafe));

    return () => {
      isMounted = false;
      clearTimeout(failsafe);
    };
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
        new Promise((resolve) => {
          setTimeout(() => {
            remoteLog("XR check timed out after 3s");
            resolve("timeout");
          }, 3000);
        }),
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
        "Place the Nayaka Samaj Bhavan right in your surroundings using your phone's camera. Walk around it, see it from every angle, and experience the building as if it were truly there.",
      startAR: "Start AR Experience",
      howTitle: "How It Works",
      step1: "Tap the button above to start",
      step2: "Point your camera at a flat surface",
      step3: "Tap the screen to place the building",
      step4: "Walk around to explore from every angle",
      notSupported:
        "AR experience requires an Android device with Google Chrome. Please open this page on an Android phone to use the AR feature.",
      exitAR: "Exit AR",
      loading: "Preparing AR...",
    },
    gu: {
      title: "નાયકા સમાજ ભવન",
      subtitle: "ઓગમેન્ટેડ રિયાલિટીમાં અમારું સમાજ ભવન જુઓ",
      description:
        "તમારા ફોનના કૅમેરાનો ઉપયોગ કરીને નાયકા સમાજ ભવનને તમારી આસપાસ મૂકો. તેની આસપાસ ચાલો, દરેક ખૂણેથી જુઓ, અને ભવનનો અનુભવ કરો.",
      startAR: "AR અનુભવ શરૂ કરો",
      howTitle: "કેવી રીતે કામ કરે છે",
      step1: "શરૂ કરવા માટે ઉપરનું બટન દબાવો",
      step2: "તમારો કૅમેરો સપાટ સપાટી તરફ રાખો",
      step3: "ભવન મૂકવા માટે સ્ક્રીન પર ટૅપ કરો",
      step4: "દરેક ખૂણે જોવા માટે ફરતા ચાલો",
      notSupported:
        "AR અનુભવ માટે Google Chrome સાથે Android ઉપકરણ જરૂરી છે. AR સુવિધા વાપરવા માટે કૃપા કરીને આ પેજ Android ફોન પર ખોલો.",
      exitAR: "AR બંધ કરો",
      loading: "AR તૈયાર કરી રહ્યા છીએ...",
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  // If AR is active, show full-screen AR scene
  if (arActive) {
    return (
      <div className={styles.arFullscreen}>
        <ARScene
          onExit={() => setArActive(false)}
          configScale={configScale}
          configDistance={configDistance}
          forcePlacement={forcePlacement}
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
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>{t.title}</h1>
          <p className={styles.subtitle}>{t.subtitle}</p>
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainSection}>
        <div className="container">
          <p className={styles.description}>{t.description}</p>

          {/* ── Admin Config Panel (only visible with ?admin=true) ── */}
          {isAdmin && (
            <div className={styles.adminPanel}>
              <div className={styles.adminHeader}>
                🔧 AR Calibration Settings{" "}
                <span className={styles.adminBadge}>ADMIN</span>
              </div>

              <div className={styles.adminRow}>
                <label className={styles.adminLabel}>
                  Model Scale:{" "}
                  <strong>{configScale.toFixed(1)}×</strong>
                </label>
                <input
                  type="range"
                  min={0.1}
                  max={10}
                  step={0.1}
                  value={configScale}
                  onChange={(e) => setConfigScale(parseFloat(e.target.value))}
                  className={styles.adminSlider}
                />
                <span className={styles.adminRange}>0.1× — 10×</span>
              </div>

              <div className={styles.adminRow}>
                <label className={styles.adminLabel}>
                  <input
                    type="checkbox"
                    checked={forcePlacement}
                    onChange={(e) => setForcePlacement(e.target.checked)}
                    className={styles.adminCheck}
                  />
                  &nbsp;Force Placement (Skip Surface Detection)
                </label>
              </div>

              {forcePlacement && (
                <div className={styles.adminRow}>
                  <label className={styles.adminLabel}>
                    Forward Distance:{" "}
                    <strong>{configDistance}m</strong>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={50}
                    step={1}
                    value={configDistance}
                    onChange={(e) =>
                      setConfigDistance(parseInt(e.target.value))
                    }
                    className={styles.adminSlider}
                  />
                  <span className={styles.adminRange}>1m — 50m</span>
                </div>
              )}
            </div>
          )}

          {/* AR Button or Not Supported Message */}
          {arSupported === null ? (
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

      {/* How It Works */}
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

// Wrap in Suspense boundary so useSearchParams works in Next.js App Router
export default function ARBuildingClient() {
  return (
    <Suspense fallback={null}>
      <ARBuildingInner />
    </Suspense>
  );
}
