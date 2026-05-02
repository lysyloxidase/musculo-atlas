"use client";

import type { AtlasAction, AtlasState } from "@/lib/atlasState";
import {
  CROSS_BRIDGE_BIOCHEMISTRY,
  ECC_STEPS,
  FIBER_TYPE_COMPARISON,
  getCrossBridgeBiochemistryStep,
  getEccStep,
  getLengthTensionPoint,
} from "@/lib/physiology";
import { getZoomLevel } from "@/lib/zoom";
import type { Dispatch } from "react";

interface PhysiologyOverlayProps {
  dispatch: Dispatch<AtlasAction>;
  state: AtlasState;
}

export default function PhysiologyOverlay({
  dispatch,
  state,
}: PhysiologyOverlayProps) {
  const level = getZoomLevel(state.zoomValue);

  if (level !== 6 && level !== 8) {
    return null;
  }

  const eccStep = getEccStep(state.eccStepIndex);
  const bridgeStep = getCrossBridgeBiochemistryStep(state.crossBridgeStep);
  const lengthTension = getLengthTensionPoint(state.sarcomereLengthUm);

  return (
    <section
      className="panel physiology-panel"
      aria-labelledby="physiology-heading"
    >
      <h3 id="physiology-heading">Physiology</h3>
      {level === 6 ? (
        <>
          <div className="panel-toolbar" aria-label="ECC step controls">
            <button
              onClick={() => dispatch({ type: "previous_ecc_step" })}
              type="button"
            >
              Prev
            </button>
            <button
              onClick={() => dispatch({ type: "next_ecc_step" })}
              type="button"
            >
              Next
            </button>
            <button
              aria-pressed={state.fiberComparisonMode}
              onClick={() => dispatch({ type: "toggle_fiber_comparison" })}
              type="button"
            >
              Compare
            </button>
          </div>
          <div className="ecc-step-card">
            <span className="step-index">
              {eccStep.index}/{ECC_STEPS.length}
            </span>
            <strong>{eccStep.label}</strong>
            <p>{eccStep.biochemistry}</p>
            <dl>
              <div>
                <dt>Target</dt>
                <dd>{eccStep.structureTarget}</dd>
              </div>
              <div>
                <dt>Flow</dt>
                <dd>{eccStep.ionFlow}</dd>
              </div>
            </dl>
          </div>
          <div className="ecc-stepper" aria-label="ECC sequence">
            {ECC_STEPS.map((step, index) => (
              <button
                aria-pressed={eccStep.id === step.id}
                key={step.id}
                onClick={() => dispatch({ step: index, type: "set_ecc_step" })}
                title={step.label}
                type="button"
              >
                {step.index}
              </button>
            ))}
          </div>
          {state.fiberComparisonMode ? <FiberComparison /> : null}
        </>
      ) : null}
      {level === 8 ? (
        <>
          <div className="panel-toolbar" aria-label="Physiology overlay modes">
            <button
              aria-pressed={state.physiologyOverlay === "cross_bridge"}
              onClick={() =>
                dispatch({
                  overlay: "cross_bridge",
                  type: "set_physiology_overlay",
                })
              }
              type="button"
            >
              Bridge
            </button>
            <button
              aria-pressed={state.physiologyOverlay === "length_tension"}
              onClick={() =>
                dispatch({
                  overlay: "length_tension",
                  type: "set_physiology_overlay",
                })
              }
              type="button"
            >
              Tension
            </button>
          </div>
          <div className="biochem-card">
            <strong>{bridgeStep.chemistryLabel}</strong>
            <p>{bridgeStep.description}</p>
            <span>{bridgeStep.nucleotideState}</span>
          </div>
          <div className="biochem-rail" aria-label="Cross-bridge chemistry">
            {CROSS_BRIDGE_BIOCHEMISTRY.map((step, index) => (
              <button
                aria-pressed={bridgeStep.id === step.id}
                key={step.id}
                onClick={() =>
                  dispatch({ step: index, type: "set_cross_bridge_step" })
                }
                title={step.chemistryLabel}
                type="button"
              >
                {step.stepNumber}
              </button>
            ))}
          </div>
          <div
            className="length-tension-card"
            aria-label="Length tension relationship"
          >
            <svg
              aria-hidden="true"
              className="length-tension-chart"
              viewBox="0 0 260 130"
            >
              <path
                d="M12 112 C45 108 58 25 78 25 L106 25 C145 28 190 80 248 112"
                fill="none"
                stroke="var(--teal)"
                strokeWidth="4"
              />
              <path
                d="M150 110 C178 102 214 74 248 42"
                fill="none"
                stroke="var(--gold)"
                strokeDasharray="5 5"
                strokeWidth="3"
              />
              <circle
                cx={12 + (lengthTension.xPct / 100) * 236}
                cy={12 + (lengthTension.yPct / 100) * 100}
                fill="var(--coral)"
                r="6"
              />
            </svg>
            <p>
              {state.sarcomereLengthUm.toFixed(2)} um,{" "}
              {Math.round(lengthTension.activeForce * 100)}% active force,{" "}
              {lengthTension.limb} limb.
            </p>
            <span>{lengthTension.annotation}</span>
          </div>
        </>
      ) : null}
    </section>
  );
}

function FiberComparison() {
  return (
    <div className="fiber-comparison" aria-label="Fiber type comparison">
      {FIBER_TYPE_COMPARISON.map((profile) => (
        <article key={profile.id}>
          <span className="swatch" style={{ background: profile.color }} />
          <strong>{profile.label}</strong>
          <p>{profile.organelleSummary}</p>
          <dl>
            <div>
              <dt>MyHC</dt>
              <dd>{profile.myosinGene}</dd>
            </div>
            <div>
              <dt>Mito</dt>
              <dd>{profile.mitochondriaVolumePct}%</dd>
            </div>
            <div>
              <dt>Speed</dt>
              <dd>{profile.contractionSpeed.replaceAll("_", " ")}</dd>
            </div>
            <div>
              <dt>Titin</dt>
              <dd>{profile.titinIsoform}</dd>
            </div>
          </dl>
        </article>
      ))}
    </div>
  );
}
