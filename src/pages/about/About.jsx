import React from "react";
import "./About.css";
import cover from "../../img/cover.jpg";
import me from "../../img/me.jpeg";
import guitar from "../../img/guitar.jpg";

/* --------------------------
   VFX
--------------------------- */

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
  // soft edge fade (not a blur)
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

export const About = () => {
  const rootRef = React.useRef(null);
  const vfxRef = React.useRef(null);
  const observerRef = React.useRef(null);

  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let cancelled = false;

    // Hard override: any canvas the lib creates will be normalized
    const normalizeCanvas = (node) => {
      if (!node || node.tagName !== "CANVAS") return;
      // Only do this once per canvas
      if (node.dataset.vfxManaged) return;
      node.dataset.vfxManaged = "1";

      Object.assign(node.style, {
        position: "fixed",
        left: "0",
        right: "0",
        top: "var(--header-h)",      // exclude header area
        bottom: "var(--footer-h)",   // exclude footer area
        zIndex: "-1",                // BEHIND all site content
        pointerEvents: "none",
        mixBlendMode: "normal",
      });
    };

    // Normalize any existing canvases (in case the lib injected early)
    document.querySelectorAll("canvas").forEach(normalizeCanvas);

    // Watch for future canvases added anywhere in the doc
    const obs = new MutationObserver((muts) => {
      for (const m of muts) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === 1) {
            if (n.tagName === "CANVAS") normalizeCanvas(n);
            // also catch canvases nested inside wrappers
            n.querySelectorAll?.("canvas").forEach(normalizeCanvas);
          }
        });
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    observerRef.current = obs;

    (async () => {
      try {
        const { VFX } = await import("https://esm.sh/@vfx-js/core@0.8.0");
        if (cancelled) return;

        const vfx = new VFX({ scrollPadding: false });
        vfxRef.current = vfx;


        const layer =
          vfx.root || vfx.el || vfx.canvas || vfx.dom?.canvas || vfx.dom?.root;
        if (layer && layer.tagName === "CANVAS") normalizeCanvas(layer);

        // Attach per-element shader to elements INSIDE this page only
        const targets = root.querySelectorAll("img,h1,h2,p");
        let i = 0;
        for (const el of targets) {
          const zAttr = el.getAttribute("data-z");
          vfx.add(el, {
            shader: ELEM_SHADER,
            uniforms: { id: i++, strength: 0.30 },
            zIndex: zAttr ? parseInt(zAttr, 10) : 0,
          });
        }
      } catch (err) {
        console.error("VFX init failed:", err);
      }
    })();

    return () => {
      cancelled = true;
      observerRef.current?.disconnect?.();
      observerRef.current = null;
      vfxRef.current?.destroy?.();
      vfxRef.current = null;
    };
  }, []);

  return (
    <main className="about" ref={rootRef}>
      <section>
        <h1>The desire...</h1>
        <img
          src="https://picsum.photos/id/737/800/600"
          alt="Static Tides"
          loading="lazy"
        />
        <p>
          Static Tides is an attmept to create contemporary music using the tools of the past -
          machines that hum, click, and drift slightly out of tune. Their imperfections
          breathing life into modern soundscapes. Each synth hiss and tape flutter,
          an echo from an ealier time.
          This is my dialogue with the past - a conversation between human hands and
          circuitry born before I was.
        </p>
      </section>

      <section>
        <div className="right">
          <h2 className="display">to be...</h2>
        </div>
        <div className="col">
          <img
            src={me}
            alt="soft light across folded textures"
            loading="lazy"
          />
          <p>
            Somewhere between the folds, something breathes. Not a presence, but the memory of having been watched. Syntax curls back on itself, a serpent swallowing not its tail, but its own shadow. Read again. You missed it the first time. You always do.
          </p>
        </div>
      </section>

      <section>
        <h2 className="display">forever...</h2>
        <div className="col reverse">
          <p>
            And if the soul remains, so too does its intent — not always clear, not always benevolent. What was the writer thinking? Or worse — what was it trying not to think? Language is a veil, but veils are thin when backlit by desire, or fear, or guilt. Read carefully. Something watches back when you stare too long into a sentence.
          </p>
          <img
            src={guitar}
            alt="contrasting planes with sharp shadow edge"
            loading="lazy"
          />
        </div>
      </section>

      <section className="last">
        <img
          src="https://picsum.photos/id/972/800/600"
          alt="blurred abstract shapes fading into darkness"
          loading="lazy"
        />
        <h2 data-z="1">burning bright.</h2>
      </section>
    </main>
  );
};
