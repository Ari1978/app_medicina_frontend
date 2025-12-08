
"use client";

import { useState } from "react";

export function useTurnoWizard() {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => Math.min(s + 1, 5));
  const back = () => setStep((s) => Math.max(s - 1, 1));
  const goTo = (n) => setStep(n);
  const reset = () => setStep(1);

  return {
    step,
    next,
    back,
    goTo,
    reset,
  };
}
