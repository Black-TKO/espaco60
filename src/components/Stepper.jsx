import React from "react";
import { Icons } from "./Icons/Icons";

const STEPS = [
  { icon: Icons.Calendar, label: "Data" },
  { icon: Icons.Clock, label: "Horário" },
  { icon: Icons.Cart, label: "Pagamento" },
  { icon: Icons.Clip, label: "Comprovan." },
];

export default function Stepper({ step, goToStep }) {
  if (step >= 5) return null;
  return (
    <nav className="stepper">
      <div className="stepper__track">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <React.Fragment key={`step-${i}`}>
              <div
                className={`stepper__step${step === i + 1 ? " stepper__step--active" : ""}${step > i + 1 ? " stepper__step--done" : ""}`}
                onClick={() => (step > i + 1 ? goToStep(i + 1) : null)}
              >
                <div className="stepper__circle">
                  {step > i + 1 ? (
                    <span className="stepper__check">✓</span>
                  ) : (
                    <span className="stepper__icon" style={{ display:"flex", alignItems:"center", justifyContent:"center"}}>
                      <Icon style={{ fontSize:"1.5rem" }} />
                    </span>
                  )}
                </div>
                <span className="stepper__label">{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`stepper__line${step > i + 1 ? " stepper__line--done" : ""}`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
}
