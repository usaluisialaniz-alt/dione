// DIONE — main app

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#F0E6D6", "#A07346", "#2A2118"],
  "displayFont": "Cormorant Garamond",
  "bodyFont": "Outfit",
  "displayScale": 100,
  "bodySize": 15,
  "tracking": 22,
  "displayWeight": 400,
  "showMeander": true,
  "archHero": true
}/*EDITMODE-END*/;

const PALETTES = [
  ["#F0E6D6", "#A07346", "#2A2118"], // crema · bronce · tinta (default)
  ["#EFE8DC", "#7B5E3F", "#1F1812"], // bone · café · ébano
  ["#F4ECDB", "#C28457", "#3B2A1C"], // marfil · ámbar · cacao
  ["#EADFCD", "#8B6A3F", "#27201A"], // arena · oliva · noche
];

const DISPLAY_FONTS = ["Cormorant Garamond", "Bodoni Moda", "Playfair Display", "DM Serif Display"];
const BODY_FONTS = ["Outfit", "Inter", "Manrope", "Jost"];

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to CSS vars
  useEffect(() => {
    const [cream, bronze, ink] = t.palette;
    const root = document.documentElement;
    root.style.setProperty("--cream", cream);
    root.style.setProperty("--bronze", bronze);
    root.style.setProperty("--bronze-deep", shade(bronze, -0.18));
    root.style.setProperty("--bone", shade(cream, -0.05));
    root.style.setProperty("--whisper", shade(cream, 0.06));
    root.style.setProperty("--ink", ink);
    root.style.setProperty("--ink-soft", shade(ink, 0.35));
    root.style.setProperty("--line", hexToRgba(ink, 0.14));
    root.style.setProperty("--line-soft", hexToRgba(ink, 0.07));
    root.style.setProperty("--display", `"${t.displayFont}", "Cormorant Garamond", serif`);
    root.style.setProperty("--body", `"${t.bodyFont}", "Inter", system-ui, sans-serif`);
    root.style.setProperty("--display-scale", t.displayScale / 100);
    root.style.setProperty("--tracking", (t.tracking / 1000) + "em");
    root.style.setProperty("--display-weight", String(t.displayWeight));
    document.body.style.fontSize = t.bodySize + "px";
  }, [t.palette, t.displayFont, t.bodyFont, t.displayScale, t.bodySize, t.tracking, t.displayWeight]);

  // Cart state
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quick, setQuick] = useState(null);
  const [toast, setToast] = useState("");
  const [active, setActive] = useState("home");
  const shopRef = useRef(null);

  const addToCart = (product, size, qty = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(it => it.product.id === product.id && it.size === size);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { product, size, qty }];
    });
    setToast(`${product.name.replace(/^[^ ]+ /, "")} agregado`);
    setTimeout(() => setToast(""), 2200);
  };
  const changeQty = (i, qty) => setCart(prev => prev.map((it, idx) => idx === i ? { ...it, qty } : it));
  const removeItem = (i) => setCart(prev => prev.filter((_, idx) => idx !== i));
  const cartCount = cart.reduce((n, it) => n + it.qty, 0);

  const scrollTo = (id) => {
    setActive(id);
    if (id === "shop" && shopRef.current) {
      shopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Hide meander divider via tweak
  useEffect(() => {
    document.querySelectorAll(".meander").forEach(m => {
      m.style.display = t.showMeander ? "" : "none";
    });
  }, [t.showMeander]);

  return (
    <React.Fragment>
      <Announcement />
      <Header
        cartCount={cartCount}
        onCartOpen={() => setCartOpen(true)}
        onNav={scrollTo}
        active={active}
      />
      <main style={{ fontSize: t.bodySize + "px" }}>
        <Hero onShop={() => scrollTo("shop")} archHero={t.archHero} />
        <div className="meander" style={{ margin: "20px 0" }}></div>
        <Catalog onQuickView={setQuick} onAdd={addToCart} scrollRef={shopRef} />
        <Lookbook />
        <About />
        <Newsletter />
      </main>
      <Footer />

      <QuickView product={quick} onClose={() => setQuick(null)} onAdd={addToCart} />
      <CartDrawer
        open={cartOpen}
        items={cart}
        onClose={() => setCartOpen(false)}
        onChange={changeQty}
        onRemove={removeItem}
      />
      <Toast msg={toast} />

      <TweaksPanel title="DIONE · Tweaks">
        <TweakSection label="Paleta" />
        <TweakColor
          label="Paleta cálida"
          value={t.palette}
          options={PALETTES}
          onChange={v => setTweak("palette", v)}
        />

        <TweakSection label="Tipografía" />
        <TweakSelect
          label="Display (titulares)"
          value={t.displayFont}
          options={DISPLAY_FONTS}
          onChange={v => setTweak("displayFont", v)}
        />
        <TweakSelect
          label="Body (UI / cuerpo)"
          value={t.bodyFont}
          options={BODY_FONTS}
          onChange={v => setTweak("bodyFont", v)}
        />
        <TweakSlider
          label="Escala de titulares"
          value={t.displayScale}
          min={70} max={130} step={5} unit="%"
          onChange={v => setTweak("displayScale", v)}
        />
        <TweakSlider
          label="Tamaño del texto"
          value={t.bodySize}
          min={12} max={19} step={1} unit="px"
          onChange={v => setTweak("bodySize", v)}
        />
        <TweakSlider
          label="Letter-spacing"
          value={t.tracking}
          min={4} max={40} step={2} unit="‰"
          onChange={v => setTweak("tracking", v)}
        />
        <TweakRadio
          label="Peso titulares"
          value={t.displayWeight}
          options={[300, 400, 500, 600]}
          onChange={v => setTweak("displayWeight", v)}
        />

        <TweakSection label="Detalles" />
        <TweakToggle
          label="Meandro griego"
          value={t.showMeander}
          onChange={v => setTweak("showMeander", v)}
        />
        <TweakToggle
          label="Marcos en arco"
          value={t.archHero}
          onChange={v => setTweak("archHero", v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

// ────────────────────────────────────────────────────────────
// Color helpers (lighten/darken + alpha)
function hexToRgb(hex) {
  const h = hex.replace("#", "");
  const v = parseInt(h.length === 3 ? h.split("").map(x => x + x).join("") : h, 16);
  return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
}
function shade(hex, amt) {
  // amt: -1..+1 (negative darkens, positive lightens)
  const { r, g, b } = hexToRgb(hex);
  const mix = (c) => Math.max(0, Math.min(255, Math.round(c + (amt > 0 ? (255 - c) : c) * amt)));
  const rr = mix(r), gg = mix(g), bb = mix(b);
  return "#" + [rr, gg, bb].map(x => x.toString(16).padStart(2, "0")).join("");
}
function hexToRgba(hex, a) {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r},${g},${b},${a})`;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
