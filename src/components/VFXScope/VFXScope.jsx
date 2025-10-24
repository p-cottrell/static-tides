import React from "react";

/* ============================================================
   ADJUSTABLE CONSTANTS
   ------------------------------------------------------------
   Notes:
   - Pixel-like values (e.g. jitter) are applied in UV space by
     dividing by resolution.x so they stay resolution-independent.
   - Thresholds are probabilities between 0..1 (closer to 1 = rarer).
============================================================ */
const DEFAULTS = {
  // Intensity scaling
  strengthDesktop: 0.40,
  strengthPhone:   0.30,

  // Chromatic aberration split (in pixels)
  chromaDesktop:   0.8,
  chromaPhone:     0.5,

  // Major “glitch” step: max horizontal jump (in *pixels* before scaling)
  jitterMajorPx:   0.015 * 1920,
  // Minor sine wobble amplitude (in *pixels* before scaling)
  jitterMinorPx:   0.008 * 1920,

  // How often glitches happen (0..1). Higher = rarer.
  jitterThreshMajor: 0.97,  // occasional
  jitterThreshMinor: 0.985, // rarer than sine wobble

  // Sine wobble horizontal frequency
  sineFreq: 6.0,

  // Responsive scaling clamp
  scaleRefPx:   1080.0, // reference “design” size in px (used to scale intensity)
  scaleMin:     0.60,   // don’t let scale drop below this on small screens
  scaleMax:     1.00,   // don’t exceed this on big screens

  // Selector list to target
  selectors: "img,h1,h2,p",

  // Layout mode
  mode: "auto", // "auto" | "fixed" | "scoped"
};

/* ============================================================
   Per-element shader WITH chromatic aberration + adjustable knobs
   All tunables come through uniforms so you can change them live.
============================================================ */
const ELEM_SHADER = `
precision highp float;
uniform sampler2D src;
uniform vec2 offset;
uniform vec2 resolution;
uniform float time;
uniform float id;

// intensity & aberration
uniform float strength;      // 0..1
uniform float chromaPx;      // split in pixels

// jitter controls (pixels converted to UV inside)
uniform float jitterMajorPx; // major jump magnitude in pixels
uniform float jitterMinorPx; // minor sine wobble magnitude in pixels
uniform float jitterThreshMajor; // 0..1, higher => rarer
uniform float jitterThreshMinor; // 0..1, higher => rarer
uniform float sineFreq;          // horizontal sine frequency

// responsive scaling
uniform float scaleRefPx;    // reference px (e.g. 1080)
uniform float scaleMin;      // min multiplier
uniform float scaleMax;      // max multiplier

out vec4 outColor;

vec4 readTex(vec2 uv) {
  vec4 c = texture(src, uv);
  // soft edge fade (not a blur)
  c.a *= smoothstep(.5, .499, abs(uv.x - .5)) * smoothstep(.5, .499, abs(uv.y - .5));
  return c;
}
float rand(vec2 p){ return fract(sin(dot(p, vec2(829.,483.))) * 394.); }

void main() {
  vec2 uv = (gl_FragCoord.xy - offset) / resolution;

  /* ---------- responsive intensity scaling ---------- */
  float minSide = min(resolution.x, resolution.y);
  float scale   = clamp(minSide / scaleRefPx, scaleMin, scaleMax);
  float s = strength * scale;

  /* ---------- random triggers (rare, tiny horizontal shifts) ---------- */
  float r  = rand(vec2(floor(time * 37.), id));
  float r2 = rand(vec2(floor(time * 29.), id + 10.));

  // convert pixel magnitudes -> UV; also scale by intensity
  float majorUV = (jitterMajorPx / resolution.x) * s;
  float minorUV = (jitterMinorPx / resolution.x) * s;

  if (r > jitterThreshMajor) {
    // random step at random scanlines
    float f = (rand(vec2(floor(uv.y * 120.0), floor(time * 5.0) + id)) * 2.0 - 1.0);
    uv.x += f * majorUV;
  }
  if (r2 > jitterThreshMinor) {
    // gentle sine-based wobble
    uv.x += sin(uv.y * sineFreq + time + id) * (minorUV);
  }

  /* ---------- Chromatic aberration (RGB split) ---------- */
  float split = (chromaPx / resolution.x) * (0.75 + 0.25 * s); // small link to intensity

  vec2 uvr = uv; uvr.x += split;   // red sample shifted +X
  vec2 uvg = uv;                   // green center
  vec2 uvb = uv; uvb.x -= split;   // blue shifted -X

  vec4 cr = readTex(uvr);
  vec4 cg = readTex(uvg);
  vec4 cb = readTex(uvb);

  // Combine channels (preserve alpha similarly to your original style)
  outColor = vec4(cr.r, cg.g, cb.b, (cr.a + cg.a + cb.a) / 1.0);
}
`;

/**
 * VFXScope
 * - Wraps children and applies VFX-JS to elements inside, with per-element aberration and adjustable constants.
 *
 * Props (all optional; defaults pulled from DEFAULTS):
 * - selectors: CSS selector(s) to target (default: DEFAULTS.selectors)
 * - mode: "auto" | "fixed" | "scoped"
 * - strengthDesktop, strengthPhone: 0..1
 * - chromaDesktop, chromaPhone: pixels of RGB split per element
 * - jitterMajorPx, jitterMinorPx: pixel magnitudes for jumps/wobble
 * - jitterThreshMajor, jitterThreshMinor: 0..1 probabilities; higher => rarer
 * - sineFreq: horizontal sine frequency (6.0 is subtle/nice)
 * - scaleRefPx, scaleMin, scaleMax: responsive scaling controls
 * - className / style: passed to wrapper div
 */
export default function VFXScope({
  children,

  // selection + layout
  selectors = DEFAULTS.selectors,
  mode      = DEFAULTS.mode,

  // intensity
  strengthDesktop = DEFAULTS.strengthDesktop,
  strengthPhone   = DEFAULTS.strengthPhone,

  // aberration
  chromaDesktop   = DEFAULTS.chromaDesktop,
  chromaPhone     = DEFAULTS.chromaPhone,

  // jitter controls
  jitterMajorPx     = DEFAULTS.jitterMajorPx,
  jitterMinorPx     = DEFAULTS.jitterMinorPx,
  jitterThreshMajor = DEFAULTS.jitterThreshMajor,
  jitterThreshMinor = DEFAULTS.jitterThreshMinor,
  sineFreq          = DEFAULTS.sineFreq,

  // responsive scaling
  scaleRefPx = DEFAULTS.scaleRefPx,
  scaleMin   = DEFAULTS.scaleMin,
  scaleMax   = DEFAULTS.scaleMax,

  className,
  style,
}) {
  const rootRef = React.useRef(null);
  const vfxRef = React.useRef(null);
  const obsRef = React.useRef(null);
  const roRef = React.useRef(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const isPhone = window.matchMedia("(max-width: 767px), (hover: none) and (pointer: coarse)").matches;

    const resolvedMode =
      mode === "fixed" ? "fixed" :
      mode === "scoped" ? "scoped" :
      isPhone ? "scoped" : "fixed";

    const styleCanvasFixedViewport = (node) => {
      Object.assign(node.style, {
        position: "fixed",
        left: "0",
        right: "0",
        top: "var(--header-h)",
        bottom: "var(--footer-h)",
        zIndex: "-1",
        pointerEvents: "none",
        background: "transparent",
        backgroundColor: "transparent",
        mixBlendMode: "normal",
        willChange: "transform",
      });
      node.setAttribute("aria-hidden", "true");
    };

    const styleCanvasScopedSection = (node) => {
      Object.assign(node.style, {
        position: "absolute",
        inset: "0",
        zIndex: "-1",
        pointerEvents: "none",
        background: "transparent",
        backgroundColor: "transparent",
        mixBlendMode: "normal",
        width: "100%",
        height: "100%",
      });
      node.setAttribute("aria-hidden", "true");
    };

    const normalizeCanvas = (node) => {
      if (!node || node.tagName !== "CANVAS") return;
      if (!root.contains(node)) return;
      if (node.dataset.vfxManaged) return;
      node.dataset.vfxManaged = "1";
      if (resolvedMode === "scoped") styleCanvasScopedSection(node);
      else styleCanvasFixedViewport(node);

      node.addEventListener?.("webglcontextlost", (e) => e.preventDefault(), { passive: false });
      node.addEventListener?.("webglcontextrestored", () => {
        try {
          vfxRef.current?.resume?.();
          vfxRef.current?.play?.();
          vfxRef.current?.render?.();
        } catch {}
      }, { passive: true });
    };

    // Observe canvases only within this wrapper
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) {
            if (n.tagName === "CANVAS") normalizeCanvas(n);
            n.querySelectorAll?.("canvas").forEach(normalizeCanvas);
          }
        });
      }
    });
    obs.observe(root, { childList: true, subtree: true });
    obsRef.current = obs;

    // Keep scoped canvas sized to wrapper
    if (resolvedMode === "scoped") {
      const ro = new ResizeObserver(() => {
        const c = root.querySelector("canvas");
        if (c) styleCanvasScopedSection(c);
      });
      ro.observe(root);
      roRef.current = ro;
    }

    let cancelled = false;

    (async () => {
      try {
        const { VFX } = await import("https://esm.sh/@vfx-js/core@0.8.0");
        if (cancelled) return;

        const vfx = new VFX({
          scrollPadding: false,
          autoPause: false,
          pauseWhenHidden: false,
          inViewportOnly: false,
          contextAttributes: { alpha: true, premultipliedAlpha: true },
        });
        vfxRef.current = vfx;

        const layer =
          vfx.root || vfx.el || vfx.canvas || vfx.dom?.canvas || vfx.dom?.root;
        if (layer && layer.tagName === "CANVAS") normalizeCanvas(layer);

        const strength = isPhone ? strengthPhone : strengthDesktop;
        const chromaPx = isPhone ? chromaPhone : chromaDesktop;

        let i = 0;
        root.querySelectorAll(selectors).forEach((el) => {
          const z = el.getAttribute("data-z");
          vfx.add(el, {
            shader: ELEM_SHADER,
            uniforms: {
              id: i++,
              strength,
              chromaPx,
              jitterMajorPx,
              jitterMinorPx,
              jitterThreshMajor,
              jitterThreshMinor,
              sineFreq,
              scaleRefPx,
              scaleMin,
              scaleMax,
            },
            zIndex: z ? parseInt(z, 10) : 0,
          });
        });

        // Light “resume” hooks for mobile
        const resume = () => {
          try {
            vfx.resume?.();
            vfx.play?.();
            vfx.render?.();
          } catch {}
        };
        const opts = { passive: true };
        document.addEventListener("visibilitychange", resume, opts);
        window.addEventListener("pageshow", resume, opts);

        // store remover so we can cleanly tear down
        vfx._removeResume = () => {
          document.removeEventListener("visibilitychange", resume, opts);
          window.removeEventListener("pageshow", resume, opts);
        };

        // kick first frame
        resume();
      } catch (err) {
        console.error("VFX init failed:", err);
      }
    })();

    return () => {
      cancelled = true;

      try { obsRef.current?.disconnect?.(); } catch {}
      obsRef.current = null;

      try { roRef.current?.disconnect?.(); } catch {}
      roRef.current = null;

      try { vfxRef.current?._removeResume?.(); } catch {}
      try { vfxRef.current?.destroy?.(); } catch {}
      vfxRef.current = null;
    };
  }, [
    selectors, mode,
    strengthDesktop, strengthPhone,
    chromaDesktop, chromaPhone,
    jitterMajorPx, jitterMinorPx, jitterThreshMajor, jitterThreshMinor,
    sineFreq, scaleRefPx, scaleMin, scaleMax
  ]);


  const needsScopedStyling = mode === "scoped" || mode === "auto";
  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        ...(needsScopedStyling ? { position: "relative", isolation: "isolate" } : null),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
