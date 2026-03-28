"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";
import styles from "./ar-building.module.css";

// Dynamically import the MindAR A-Frame scene (A-Frame breaks during SSR)
const ARSceneAframe = dynamic(() => import("./ARSceneAframe"), { ssr: false });

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

  const [arActive, setArActive] = useState(false);

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

  const text = {
    en: {
      title: "Nayaka Samaj Bhavan",
      subtitle: "Experience our community building in augmented reality",
      description:
        "Scan the printed tracking marker using your phone's camera. The building will physically hook to your paper. Walk around it and see it from every angle.",
      startAR: "Start AR Experience",
      howTitle: "How It Works",
      step1: "Tap the button above to start",
      step2: "Grant camera permissions if asked",
      step3: "Point your camera specifically at the printed Marker",
      step4: "Walk around to explore from every angle",
      exitAR: "Exit AR",
    },
    gu: {
      title: "નાયકા સમાજ ભવન",
      subtitle: "ઓગમેન્ટેડ રિયાલિટીમાં અમારું સમાજ ભવન જુઓ",
      description:
        "તમારા ફોનના કૅમેરાનો ઉપયોગ કરીને માર્કર સ્કેન કરો. ભવન આપોઆપ તેની સાથે જોડાઈ જશે.",
      startAR: "AR અનુભવ શરૂ કરો",
      howTitle: "કેવી રીતે કામ કરે છે",
      step1: "શરૂ કરવા માટે ઉપરનું બટન દબાવો",
      step2: "કૅમેરાની પરવાનગી આપો",
      step3: "તમારો કૅમેરો માર્કર તરફ રાખો",
      step4: "દરેક ખૂણે જોવા માટે ફરતા ચાલો",
      exitAR: "AR બંધ કરો",
    },
  };

  const t = text[language as keyof typeof text] || text.en;

  if (arActive) {
    return (
      <div className={styles.arFullscreen}>
        <ARSceneAframe
          scale={configScale}
          rotX={configRotX}
          rotY={configRotY}
          rotZ={configRotZ}
          brightness={configBrightness}
          contrast={configContrast}
          saturation={configSaturation}
          onExit={() => setArActive(false)}
        />
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
                🔧 MindAR Calibration{" "}
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

          <button
            className={styles.arButton}
            onClick={() => setArActive(true)}
          >
            <i className="bi bi-camera-video" />
            {t.startAR}
          </button>
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
    <ARBuildingInner />
  );
}
