import React from "react";

/* ============================================================
   ADJUSTABLE CONSTANTS
============================================================ */
const DEFAULTS = {
  // Intensity scaling
  strengthDesktop: 0.40,
  strengthPhone:   0.30,

  // Chromatic aberration split (in pixels)
  chromaDesktop:   0.8,
  chromaPhone:     0.5,

  // Major/Minor jitter magnitudes (in pixels @ 1920 baseline)
  jitterMajorPx:   0.015 * 1920,
  jitterMinorPx:   0.008 * 1920,

  // How often glitches happen (0..1). Higher = rarer.
  jitterThreshMajor: 0.97,
  jitterThreshMinor: 0.985,

  // Sine wobble frequency
  sineFreq: 6.0,

  // Responsive scaling clamp
  scaleRefPx:   1080.0,
  scaleMin:     0.60,
  scaleMax:     1.00,

  // Selector list to target
  selectors: "img,h1,h2,p",

  // Layout mode
  mode: "auto", // "auto" | "fixed" | "scoped"

  // NEW: Rounded corners mask (in CSS pixels)
  borderRadiusPx: 16,
  // NEW: Soft edge feather around the rounded corners (in pixels)
  edgeFeatherPx:  1.5,
};

/* ============================================================
   Per-element shader WITH chromatic aberration + rounded mask
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
uniform float jitterMajorPx;
uniform float jitterMinorPx;
uniform float jitterThreshMajor;
uniform float jitterThreshMinor;
uniform float sineFreq;

// responsive scaling
uniform float scaleRefPx;
uniform float scaleMin;
uniform float scaleMax;

// NEW: rounded-corner mask (pixels)
uniform float borderRadiusPx;
uniform float edgeFeatherPx;

out vec4 outColor;

vec4 readTex(vec2 uv) {
  return texture(src, uv);
}

float rand(vec2 p){ return fract(sin(dot(p, vec2(829.,483.))) * 394.); }

/* Signed distance to rounded rectangle centered at 0 with half-size b and radius r.
   p: point in [-.5..+.5] space (we'll map uv -> p)
   b: half-size AFTER subtracting r (so b ~ vec2(.5-r))
   r: corner radius in same units as p (normalized) */
float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - offset) / resolution;

  /* ---------- responsive intensity scaling ---------- */
  float minSide = min(resolution.x, resolution.y);
  float scale   = clamp(minSide / scaleRefPx, scaleMin, scaleMax);
  float s = strength * scale;

  /* ---------- random triggers (rare, tiny horizontal shifts) ---------- */
  float r  = rand(vec2(floor(time * 37.0), id));
  float r2 = rand(vec2(floor(time * 29.0), id + 10.0));

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
  float split = (chromaPx / resolution.x) * (0.75 + 0.25 * s);

  vec2 uvr = uv; uvr.x += split;   // red sample shifted +X
  vec2 uvg = uv;                   // green center
  vec2 uvb = uv; uvb.x -= split;   // blue shifted -X

  vec4 cr = readTex(uvr);
  vec4 cg = readTex(uvg);
  vec4 cb = readTex(uvb);

  // Base (unmasked) color/alpha
  vec3 rgb = vec3(cr.r, cg.g, cb.b);
  float a0 = (cr.a + cg.a + cb.a) / 1.0;

  /* ---------- Rounded-corner alpha mask ---------- */
  // Convert CSS pixel radius -> normalized radius in "p space"
  // Map uv [0..1] -> p [-0.5..+0.5]
  vec2 p = uv - 0.5;

  // Normalize radius in each axis based on resolution
  float rNormX = borderRadiusPx / resolution.x;
  float rNormY = borderRadiusPx / resolution.y;
  // Use the smaller axis to keep corners circular visually
  float rNorm  = min(rNormX, rNormY);

  // Half-size of the box minus radius (box is 1x1 in uv -> .5 halves)
  vec2 b = vec2(0.5 - rNorm);

  // Signed distance to rounded box (negative = inside)
  float d = sdRoundBox(p, b, rNorm);

  // Feather in normalized units (convert px -> uv using min axis)
  float feather = edgeFeatherPx / min(resolution.x, resolution.y);

  // Mask: 1 inside, 0 outside, smooth edge
  float mask = 1.0 - smoothstep(0.0, feather, d);

  // Final alpha with mask; premultiply for clean edges
  float a = a0 * mask;
  outColor = vec4(rgb * a, a);
}
`;

/**
 * VFXScope
 * - Wraps children and applies VFX-JS to elements inside.
 * - Now supports rounded corners via shader mask.
 *
 * Extra props:
 * - borderRadiusPx: number (CSS px for rounded corners; default 16)
 * - edgeFeatherPx:  number (soft edge width in px; default 1.5)
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

  // NEW: rounded-corner mask controls
  borderRadiusPx = DEFAULTS.borderRadiusPx,
  edgeFeatherPx  = DEFAULTS.edgeFeatherPx,

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
              // NEW: rounded mask controls
              borderRadiusPx,
              edgeFeatherPx,
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
    sineFreq, scaleRefPx, scaleMin, scaleMax,
    borderRadiusPx, edgeFeatherPx,
  ]);

  const needsScopedStyling = mode === "scoped" || mode === "auto";
  const roundedStyle =
    borderRadiusPx > 0 && needsScopedStyling
      ? { borderRadius: borderRadiusPx, overflow: "hidden" }
      : null;

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        ...(needsScopedStyling ? { position: "relative", isolation: "isolate" } : null),
        ...roundedStyle, // helps clip the canvas in scoped mode; shader still handles both modes
        ...style,
      }}
    >
      {children}
    </div>
  );
}
