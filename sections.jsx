// DIONE — sections (header, hero, featured, catalog, lookbook, about, newsletter, footer)

const { useState, useEffect, useRef, useMemo } = React;

// ────────────────────────────────────────────────────────────
// Announcement marquee
function Announcement() {
  const items = [
    "ENVÍO GRATIS desde $200.000",
    "★",
    "Pago en cuotas sin interés",
    "★",
    "Nueva colección disponible",
    "★",
    "Devoluciones sin complicaciones",
    "★",
    "Escríbenos por WhatsApp",
    "★",
  ];
  const row = (
    <div className="mq-track" style={{ paddingRight: 56 }}>
      {items.map((t, i) => (
        <span key={i} style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--whisper)" }}>
          {t}
        </span>
      ))}
    </div>
  );
  return (
    <div style={{
      background: "var(--ink)", color: "var(--whisper)",
      padding: "10px 0", overflow: "hidden", whiteSpace: "nowrap",
    }}>
      <div style={{ display: "flex" }}>{row}{row}</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Header
function Header({ cartCount, onCartOpen, onNav, active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = [
    { id: "shop",     label: "Tienda" },
    { id: "lookbook", label: "Lookbook" },
    { id: "atelier",  label: "Atelier" },
    { id: "diario",   label: "Diario" },
  ];

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50,
      background: scrolled ? "rgba(240,230,214,0.92)" : "var(--cream)",
      backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
      transition: "background .25s ease, border-color .25s ease",
    }}>
      <div className="shell dione-header-grid" style={{
        display: "grid",
        gridTemplateColumns: "1fr auto 1fr",
        alignItems: "center",
        height: 72,
      }}>
        <nav className="dione-nav" style={{ display: "flex", gap: 30 }}>
          {nav.map(n => (
            <span
              key={n.id}
              className="link-u eyebrow"
              onClick={() => onNav(n.id)}
              style={{ color: active === n.id ? "var(--ink)" : "var(--ink-soft)", cursor: "pointer" }}
            >
              {n.label}
            </span>
          ))}
        </nav>

        <div style={{ justifySelf: "center" }} onClick={() => onNav("home")}>
          <Logo size={26} />
        </div>

        <div className="dione-header-actions" style={{ display: "flex", gap: 22, justifyContent: "flex-end", alignItems: "center", color: "var(--ink)" }}>
          <button aria-label="Buscar" className="hide-mobile" style={iconBtn}>{Icon.search()}</button>
          <button aria-label="Cuenta" className="hide-mobile" style={iconBtn}>{Icon.user()}</button>
          <button aria-label="Favoritos" className="hide-mobile" style={iconBtn}>{Icon.heart()}</button>
          <button aria-label="Bolsa" style={{ ...iconBtn, position: "relative" }} onClick={onCartOpen}>
            {Icon.bag()}
            {cartCount > 0 && (
              <span style={{
                position: "absolute", top: -4, right: -6,
                background: "var(--bronze)", color: "var(--whisper)",
                fontSize: 9.5, letterSpacing: 0, fontFamily: "var(--body)",
                width: 16, height: 16, borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 600,
              }}>{cartCount}</span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
const iconBtn = {
  background: "transparent", border: 0, padding: 6, color: "inherit",
  cursor: "pointer", display: "inline-flex", alignItems: "center",
};

// ────────────────────────────────────────────────────────────
// Hero — editorial
function Hero({ onShop }) {
  return (
    <section style={{ position: "relative", paddingTop: 24, paddingBottom: 48 }}>
      <div className="shell dione-hero-grid" style={{
        display: "grid",
        gridTemplateColumns: "1.05fr 0.95fr",
        gap: 36,
        alignItems: "end",
        minHeight: "78vh",
      }}>
        {/* Left — type */}
        <div className="fade-up dione-hero-text" style={{ paddingBottom: 12, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
            <span className="eyebrow">Colección · Aestiva MMXXVI</span>
            <span style={{ height: 1, width: 56, background: "var(--line)" }}></span>
            <span className="roman" style={{ fontSize: 16 }}>n.º I</span>
          </div>

          <h1 className="display" style={{
            fontSize: "clamp(64px, 11vw, 168px)",
            margin: 0,
            color: "var(--ink)",
          }}>
            Vestir
            <br />
            <span className="display-it" style={{ color: "var(--bronze-deep)" }}>
              como diosa
            </span>
          </h1>

          <p style={{
            maxWidth: 380, marginTop: 32, color: "var(--ink-soft)",
            fontSize: 15, lineHeight: 1.65,
          }}>
            Ropa casual femenina pensada para cada momento de tu día.
            Cómoda, con estilo y hecha para la mujer que sabe lo que quiere.
          </p>

          <div style={{ display: "flex", gap: 14, marginTop: 34 }}>
            <button className="btn" onClick={onShop}>Ver Catálogo {Icon.arrow()}</button>
            <button className="btn btn--ghost" onClick={() => window.open("https://wa.me/5492644116585", "_blank")}>Pedir por WhatsApp</button>
          </div>

          {/* Editorial caption bottom */}
          <div className="dione-hero-caption" style={{
            marginTop: 56,
            display: "flex", alignItems: "center", gap: 24,
            color: "var(--ink-soft)", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
          }}>
            <span>Edición n.º 04</span>
            <span style={{ flex: "0 0 40px", height: 1, background: "var(--line)" }}></span>
            <span>32 piezas</span>
            <span style={{ flex: "0 0 40px", height: 1, background: "var(--line)" }}></span>
            <span>Hecho en Bogotá</span>
          </div>
        </div>

        {/* Right — image stack */}
        <div className="fade-up d2 dione-hero-image" style={{ position: "relative", height: "78vh", minHeight: 560 }}>
          <Placeholder
            tag="EDITORIAL · DIOSA EN MÁRMOL"
            variant="ph arch"
            style={{
              position: "absolute", inset: "0 0 0 12%",
              borderTopLeftRadius: 999, borderTopRightRadius: 999,
            }}
          />
          {/* Floating card */}
          <div className="dione-floating-card" style={{
            position: "absolute", left: -22, bottom: 48, width: 200,
            background: "var(--whisper)", padding: 18,
            border: "1px solid var(--line)",
            transform: "rotate(-2deg)",
            boxShadow: "0 24px 60px rgba(42,33,24,0.12)",
          }}>
            <Placeholder tag="VESTIDO ATHENA" variant="ph--rose" style={{ aspectRatio: "3/4" }} />
            <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "var(--display)", fontSize: 16 }}>Athena</span>
              <span className="eyebrow">{formatCOP(189000)}</span>
            </div>
          </div>

          {/* Roman index tag */}
          <div className="dione-vertical-tag" style={{
            position: "absolute", right: 16, top: 28,
            writingMode: "vertical-rl",
            fontFamily: "var(--display)",
            fontStyle: "italic",
            fontSize: 14,
            letterSpacing: "0.3em",
            color: "var(--ink-soft)",
          }}>
            Cap. I · La túnica
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// Section header w/ roman index
function SectionHead({ idx, eyebrow, title, sub }) {
  return (
    <div className="dione-section-head" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 28, alignItems: "end", padding: "8px 0 36px" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14 }}>
        <span className="roman" style={{ fontSize: 22, color: "var(--bronze-deep)" }}>{idx}</span>
        <div>
          <div className="eyebrow" style={{ marginBottom: 8 }}>{eyebrow}</div>
          <h2 className="display" style={{ fontSize: "clamp(40px, 5.5vw, 76px)", margin: 0 }}>{title}</h2>
        </div>
      </div>
      <div style={{ height: 1, background: "var(--line)", alignSelf: "end", marginBottom: 16 }}></div>
      {sub && <div className="display-it" style={{ fontSize: 18, color: "var(--ink-soft)", maxWidth: 220, textAlign: "right" }}>{sub}</div>}
    </div>
  );
}

// ────────────────────────────────────────────────────────────
// Catalog (filters + grid)
function Catalog({ onQuickView, onAdd, scrollRef }) {
  const [active, setActive] = useState("all");
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    let list = active === "all" ? [...PRODUCTS] : PRODUCTS.filter(p => p.cat === active);
    if (sort === "low") list.sort((a, b) => a.price - b.price);
    else if (sort === "high") list.sort((a, b) => b.price - a.price);
    return list;
  }, [active, sort]);

  return (
    <section ref={scrollRef} style={{ padding: "64px 0 96px" }}>
      <div className="shell">
        <SectionHead
          idx="II"
          eyebrow="Tienda"
          title="La colección"
          sub="Doce piezas escogidas para vestir cada hora del día."
        />

        {/* Filters */}
        <div className="dione-filter-bar" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16, marginBottom: 36,
        }}>
          <div className="no-scrollbar" style={{ display: "flex", gap: 6, overflowX: "auto" }}>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                style={{
                  background: active === c.id ? "var(--ink)" : "transparent",
                  color: active === c.id ? "var(--whisper)" : "var(--ink)",
                  border: "1px solid " + (active === c.id ? "var(--ink)" : "var(--line)"),
                  padding: "10px 16px",
                  fontSize: 11,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "var(--body)",
                  fontWeight: 500,
                  borderRadius: 0,
                  transition: "all .2s ease",
                  whiteSpace: "nowrap",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="eyebrow">Ordenar</span>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                background: "transparent", border: "1px solid var(--line)",
                padding: "10px 14px", fontFamily: "var(--body)", fontSize: 12,
                color: "var(--ink)", textTransform: "uppercase", letterSpacing: "0.14em",
                cursor: "pointer", borderRadius: 0,
              }}
            >
              <option value="featured">Destacados</option>
              <option value="low">Precio: menor a mayor</option>
              <option value="high">Precio: mayor a menor</option>
            </select>
          </div>
        </div>

        {/* Grid */}
        <div className="dione-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "44px 24px",
        }}>
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onQuickView={onQuickView} onAdd={onAdd} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 80, color: "var(--ink-soft)" }}>
            <p className="display-it" style={{ fontSize: 28 }}>Pronto en este templo…</p>
          </div>
        )}
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// Product card with hover swap
function ProductCard({ product, index, onQuickView, onAdd }) {
  const [hover, setHover] = useState(false);
  const num = String(index + 1).padStart(2, "0");
  return (
    <article
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ position: "relative", cursor: "pointer" }}
    >
      <div
        onClick={() => onQuickView(product)}
        style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}
      >
        <Placeholder
          tag={product.img}
          variant={product.swatch}
          style={{
            position: "absolute", inset: 0,
            opacity: hover ? 0 : 1,
            transition: "opacity .55s ease",
          }}
        />
        <Placeholder
          tag={product.img2}
          variant={product.swatchAlt}
          style={{
            position: "absolute", inset: 0,
            opacity: hover ? 1 : 0,
            transition: "opacity .55s ease",
          }}
        />

        {/* Index */}
        <span style={{
          position: "absolute", top: 12, left: 12,
          fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
          color: "var(--ink)", background: "rgba(250,246,238,0.85)",
          padding: "3px 7px",
        }}>n.º {num}</span>

        {product.tag && (
          <span style={{
            position: "absolute", top: 12, right: 12,
            fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase",
            background: product.tag.startsWith("−") ? "var(--bronze)" : "var(--ink)",
            color: "var(--whisper)",
            padding: "4px 9px",
            fontWeight: 500,
          }}>{product.tag}</span>
        )}

        {/* Hover overlay action */}
        <div style={{
          position: "absolute", left: 12, right: 12, bottom: 12,
          display: "flex", gap: 8,
          transform: hover ? "translateY(0)" : "translateY(8px)",
          opacity: hover ? 1 : 0,
          transition: "all .35s ease",
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); onQuickView(product); }}
            style={{
              flex: 1, height: 38, background: "var(--whisper)", border: 0,
              fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
              fontFamily: "var(--body)", fontWeight: 500, cursor: "pointer",
            }}
          >
            Vista rápida
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onAdd(product, product.sizes[1] || product.sizes[0]); }}
            aria-label="Agregar"
            style={{
              width: 38, height: 38, background: "var(--ink)", color: "var(--whisper)", border: 0,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
          >
            {Icon.plus()}
          </button>
        </div>
      </div>

      {/* Caption */}
      <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <div>
          <h3 className="display" style={{ fontSize: 22, margin: 0, fontWeight: 500 }}>{product.name.replace(/^[^ ]+ /, "")}</h3>
          <div style={{ fontSize: 11, color: "var(--ink-soft)", marginTop: 4, letterSpacing: "0.06em" }}>
            {product.color}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontFamily: "var(--display)", fontSize: 18 }}>{formatCOP(product.price)}</div>
          {product.was && (
            <div style={{ fontSize: 11, color: "var(--ink-soft)", textDecoration: "line-through", marginTop: 2 }}>
              {formatCOP(product.was)}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// ────────────────────────────────────────────────────────────
// Lookbook editorial spread
function Lookbook() {
  return (
    <section style={{ padding: "80px 0", background: "var(--whisper)", borderTop: "1px solid var(--line-soft)", borderBottom: "1px solid var(--line-soft)" }}>
      <div className="shell">
        <SectionHead
          idx="III"
          eyebrow="Lookbook"
          title="Capítulo Aestiva"
          sub="Tres miradas. Una mujer. El sol como escenografía."
        />

        <div className="dione-lookbook-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr 1fr",
          gridTemplateRows: "240px 360px",
          gap: 16,
        }}>
          <Placeholder tag="LOOK 01 · MARFIL EN ATRIO" variant="ph" style={{ gridRow: "1 / span 2" }} />
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 16 }}>
            <Placeholder tag="LOOK 02 · VIENTO DEL EGEO" variant="ph--rose" />
            <Placeholder tag="LOOK 03 · ORO PÁLIDO" variant="ph--dark" />
          </div>
          <div className="dione-lookbook-card" style={{
            gridRow: "1 / span 2",
            background: "var(--ink)", color: "var(--whisper)",
            padding: 36,
            display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div>
              <span className="eyebrow" style={{ color: "rgba(250,246,238,0.65)" }}>n.º 04 · MMXXVI</span>
              <h3 className="display" style={{ fontSize: 48, margin: "18px 0 0", lineHeight: 1 }}>
                Para vestirte
                <br /><span className="display-it" style={{ color: "var(--bronze)" }}>todos los días</span>
              </h3>
            </div>
            <div>
              <p style={{ color: "rgba(250,246,238,0.78)", fontSize: 14, lineHeight: 1.7 }}>
                Nuestra colección nace de la mujer real: activa, auténtica y con estilo propio.
                Cada pieza fue pensada para adaptarse a tu ritmo de vida.
              </p>
              <button className="btn btn--bronze" style={{ marginTop: 22 }}>
                Leer la historia {Icon.arrow()}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// About / Atelier
function About() {
  const stats = [
    { n: "12", l: "Piezas únicas" },
    { n: "100%", l: "Diseño propio" },
    { n: "XII", l: "Capítulos publicados" },
    { n: "MMXXII", l: "Año de fundación" },
  ];
  return (
    <section style={{ padding: "96px 0" }}>
      <div className="shell dione-about-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
        <div>
          <span className="eyebrow">Nuestra historia</span>
          <h2 className="display" style={{ fontSize: "clamp(48px, 6.5vw, 96px)", margin: "20px 0 28px", lineHeight: 0.95 }}>
            Ropa casual
            <br /><span className="display-it">para mujeres</span>
            <br />que se atreven.
          </h2>
          <p style={{ color: "var(--ink-soft)", fontSize: 15.5, lineHeight: 1.8, maxWidth: 460 }}>
            DIONE nació con una idea simple: que la ropa casual puede ser bonita, cómoda y tuya.
            Diseñamos prendas femeninas que se adaptan a tu día a día — para el café, el trabajo
            o el fin de semana. Porque cada mujer merece sentirse bien con lo que se pone.
          </p>

          <div style={{
            display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "28px 32px",
            marginTop: 44, paddingTop: 32, borderTop: "1px solid var(--line)",
          }}>
            {stats.map(s => (
              <div key={s.l}>
                <div className="display" style={{ fontSize: 36, color: "var(--bronze-deep)" }}>{s.n}</div>
                <div className="eyebrow" style={{ marginTop: 6 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="dione-about-image" style={{ position: "relative", height: 580 }}>
          <Placeholder tag="ATELIER · MANOS" variant="ph--dark"
            style={{ position: "absolute", left: 0, top: 0, width: "65%", height: "70%" }} />
          <Placeholder tag="TELA · LINO 03" variant="ph--rose"
            style={{ position: "absolute", right: 0, bottom: 0, width: "60%", height: "55%", borderTopLeftRadius: 999, borderTopRightRadius: 999 }} />
          <div style={{
            position: “absolute”, left: “50%”, top: “42%”,
            transform: “translateX(-50%)”,
            background: “var(--whisper)”,
            padding: “14px 18px”,
            border: “1px solid var(--line)”,
            fontFamily: “var(--display)”, fontStyle: “italic”,
            fontSize: 17, color: “var(--ink)”,
            whiteSpace: “nowrap”,
          }}>
            “Lo sencillo también puede ser extraordinario.”
          </div>
        </div>
      </div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// Newsletter
function Newsletter() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <section style={{ background: "var(--bone)", padding: "80px 0" }}>
      <div className="meander" style={{ marginBottom: 56 }}></div>
      <div className="shell" style={{ textAlign: "center", maxWidth: 720, margin: "0 auto" }}>
        <span className="eyebrow">Newsletter DIONE</span>
        <h2 className="display" style={{ fontSize: "clamp(40px, 5vw, 64px)", margin: "16px 0 18px", lineHeight: 1 }}>
          Novedades de <span className="display-it">DIONE</span>
        </h2>
        <p style={{ color: "var(--ink-soft)", maxWidth: 520, margin: "0 auto 32px" }}>
          Sé la primera en conocer las nuevas llegadas, ofertas exclusivas y tips de estilo.
          Sin spam, solo lo mejor.
        </p>

        {!sent ? (
          <form
            onSubmit={(e) => { e.preventDefault(); if (email) setSent(true); }}
            style={{
              display: "flex", maxWidth: 480, margin: "0 auto",
              border: "1px solid var(--ink)", background: "var(--whisper)",
            }}
          >
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{
                flex: 1, height: 50, padding: "0 18px",
                background: "transparent", border: 0, outline: "none",
                fontFamily: "var(--body)", fontSize: 14, color: "var(--ink)",
                letterSpacing: "0.02em",
              }}
            />
            <button type="submit" className="btn" style={{ height: 50 }}>Suscribirme</button>
          </form>
        ) : (
          <div className="display-it" style={{ fontSize: 22, color: "var(--bronze-deep)" }}>
            ¡Bienvenida a la familia DIONE! ✦
          </div>
        )}
      </div>
      <div className="meander" style={{ marginTop: 56 }}></div>
    </section>
  );
}

// ────────────────────────────────────────────────────────────
// Footer
function Footer() {
  const cols = [
    { h: "Tienda", links: ["Vestidos", "Tops y blusas", "Faldas", "Pantalones", "Conjuntos", "Outlet"] },
    { h: "DIONE", links: ["El atelier", "Sostenibilidad", "Lookbooks", "Diario", "Press"] },
    { h: "Ayuda", links: ["Guía de tallas", "Envíos", "Devoluciones", "Cuidado de prendas", "Contacto"] },
  ];
  return (
    <footer style={{ background: "var(--ink)", color: "var(--whisper)", padding: "72px 0 28px" }}>
      <div className="shell">
        <div className="dione-footer-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.4fr repeat(3, 1fr)",
          gap: 48,
          paddingBottom: 56,
          borderBottom: "1px solid rgba(250,246,238,0.15)",
        }}>
          <div>
            <div className="display" style={{ fontSize: 36, letterSpacing: "0.24em", marginBottom: 24 }}>DIONE</div>
            <p style={{ color: "rgba(250,246,238,0.65)", fontSize: 14, lineHeight: 1.7, maxWidth: 320 }}>
              Ropa casual femenina hecha con amor.
              <br /><span className="display-it">Bogotá, Colombia.</span>
            </p>
            <div style={{ display: "flex", gap: 14, marginTop: 24, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase" }}>
              <span className="link-u">Instagram</span>
              <span style={{ color: "rgba(250,246,238,0.3)" }}>·</span>
              <span className="link-u">Pinterest</span>
              <span style={{ color: "rgba(250,246,238,0.3)" }}>·</span>
              <span className="link-u">TikTok</span>
            </div>
          </div>

          {cols.map(col => (
            <div key={col.h}>
              <div className="eyebrow" style={{ color: "rgba(250,246,238,0.6)", marginBottom: 18 }}>{col.h}</div>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map(l => (
                  <li key={l}>
                    <span className="link-u" style={{ fontSize: 13.5, color: "rgba(250,246,238,0.85)" }}>{l}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="dione-footer-bottom" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          paddingTop: 24, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
          color: "rgba(250,246,238,0.55)", flexWrap: "wrap", gap: 14,
        }}>
          <span>© MMXXVI DIONE · Bogotá, Colombia</span>
          <span className=”display-it” style={{ letterSpacing: 0, textTransform: “none”, fontSize: 14 }}>
            “Vístete para ti, y para nadie más.”
          </span>
          <span>Términos · Privacidad · Cookies</span>
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, {
  Announcement, Header, Hero, SectionHead, Catalog, ProductCard, Lookbook, About, Newsletter, Footer,
});
