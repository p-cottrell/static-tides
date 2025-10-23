import React from "react";

/** Your original per-element shader, unchanged */
const ELEM_SHADER = `
precision highp float;
uniform sampler2D src;
uniform vec2 offset;
uniform vec2 resolution;
uniform float time;
uniform float id;
uniform float strength;
out vec4 outColor;

vec4 readTex(vec2 uv) {
  vec4 c = texture(src, uv);
  c.a *= smoothstep(.5, .499, abs(uv.x - .5)) * smoothstep(.5, .499, abs(uv.y - .5));
  return c;
}
float rand(vec2 p){ return fract(sin(dot(p, vec2(829.,483.))) * 394.); }

void main() {
  vec2 uv = (gl_FragCoord.xy - offset) / resolution;

  // responsive intensity
  float minSide = min(resolution.x, resolution.y);
  float scale   = clamp(minSide / 1080.0, 0.6, 1.0);
  float s = strength * scale;

  // rare, tiny horizontal micro-shifts (NO BLUR)
  float r  = rand(vec2(floor(time * 37.), id));
  float r2 = rand(vec2(floor(time * 29.), id + 10.));

  if (r > mix(0.997, 0.90, s)) {
    float f = (rand(vec2(floor(uv.y * 120.0), floor(time * 5.0) + id)) * 2. - 1.);
    uv.x += f * (0.015 * s);
  }
  if (r2 > mix(0.998, 0.92, s)) {
    uv.x += sin(uv.y * 6. + time + id) * (0.008 * s);
  }

  outColor = readTex(uv);
}
`;

/**
 * VFXScope
 * - Wraps children and applies VFX-JS to elements inside.
 *
 * Props:
 * - selectors: CSS selector(s) to target (default: "img,h1,h2,p")
 * - strengthDesktop: number (0–1), default 0.40
 * - strengthPhone:   number (0–1), default 0.30
 * - mode: "auto" | "fixed" | "scoped"
 *      auto   = fixed on desktop, scoped on phone (default)
 *      fixed  = fixed, between header/footer
 *      scoped = absolute inside wrapper only
 * - className / style: passed to wrapper div
 */
export default function VFXScope({
  children,
  selectors = "img,h1,h2,p",
  strengthDesktop = 0.40,
  strengthPhone = 0.30,
  mode = "auto",
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

        let i = 0;
        root.querySelectorAll(selectors).forEach((el) => {
          const z = el.getAttribute("data-z");
          vfx.add(el, {
            shader: ELEM_SHADER,
            uniforms: { id: i++, strength },
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
  }, [selectors, strengthDesktop, strengthPhone, mode]);


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
