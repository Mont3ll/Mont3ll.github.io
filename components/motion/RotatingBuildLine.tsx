"use client";

import { useEffect, useMemo, useState } from "react";

const WORDS = [
  "product.",
  "system.",
  "platform.",
  "dashboard.",
  "workflow.",
  "idea.",
];

export function RotatingBuildLine() {
  const words = useMemo(() => WORDS, []);
  const [wordIndex, setWordIndex] = useState(0);
  const [visibleText, setVisibleText] = useState("");
  const [phase, setPhase] = useState<"typing" | "deleting">("typing");

  useEffect(() => {
    const currentWord = words[wordIndex];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let timer: any;

    if (phase === "typing") {
      if (visibleText.length < currentWord.length) {
        timer = window.setTimeout(() => {
          setVisibleText(currentWord.slice(0, visibleText.length + 1));
        }, 82);
      } else {
        timer = window.setTimeout(() => setPhase("deleting"), 1120);
      }
    }

    if (phase === "deleting") {
      if (visibleText.length > 0) {
        timer = window.setTimeout(() => {
          setVisibleText(currentWord.slice(0, visibleText.length - 1));
        }, 44);
      } else {
        setWordIndex((v) => (v + 1) % words.length);
        setPhase("typing");
      }
    }

    return () => window.clearTimeout(timer);
  }, [phase, visibleText, wordIndex, words]);

  return (
    <span className="rotating-build-line">
      <span>Let&apos;s build your</span>
      <span className="typewriter-shell" aria-live="polite">
        <span className="typewriter-word">{visibleText || "\u00a0"}</span>
        <span className="typewriter-cursor" aria-hidden="true" />
      </span>
    </span>
  );
}
