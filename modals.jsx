// DIONE — Quick View modal + Cart drawer

const { useState: useState_m, useEffect: useEffect_m } = React;

function QuickView({ product, onClose, onAdd }) {
  const [size, setSize] = useState_m(null);
  const [qty, setQty] = useState_m(1);
  const [imgIdx, setImgIdx] = useState_m(0);

  useEffect_m(() => {
    if (product) { setSize(product.sizes[1] || product.sizes[0]); setQty(1); setImgIdx(0); }
  }, [product]);

  useEffect_m(() => {
    document.body.classList.toggle("locked", !!product);
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product, onClose]);

  if (!product) return null;

  const variants = [
    { tag: product.img,  v: product.swatch },
    { tag: product.img2, v: product.swatchAlt },
  ];

  return (
    <React.Fragment>
      <div className={`overlay ${product ? "show" : ""}`} onClick={onClose}></div>
      <div className={`modal ${product ? "show" : ""}`}>
        <div className="modal__card">
          {/* Image side */}
          <div style={{ position: "relative", background: "var(--bone)", minHeight: 480 }}>
            <Placeholder
              tag={variants[imgIdx].tag}
              variant={variants[imgIdx].v}
              style={{ position: "absolute", inset: 0 }}
            />
            <div style={{
              position: "absolute", left: 16, bottom: 16,
              display: "flex", gap: 8,
            }}>
              {variants.map((vv, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  style={{
                    width: 52, height: 64, padding: 0, border: 0, cursor: "pointer",
                    outline: imgIdx === i ? "1.5px solid var(--ink)" : "1.5px solid transparent",
                    outlineOffset: 2,
                  }}
                >
                  <Placeholder tag="" variant={vv.v} style={{ width: "100%", height: "100%" }} />
                </button>
              ))}
            </div>
            <span style={{
              position: "absolute", top: 16, left: 16,
              fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.1em",
              background: "rgba(250,246,238,0.85)", padding: "4px 8px",
            }}>{product.id.toUpperCase()}</span>
          </div>

          {/* Detail side */}
          <div style={{ padding: "44px 44px 36px", display: "flex", flexDirection: "column", overflow: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <span className="eyebrow">{product.cat}</span>
              <button onClick={onClose} style={{ background: "transparent", border: 0, cursor: "pointer", padding: 6 }}>
                {Icon.close()}
              </button>
            </div>

            <h2 className="display" style={{ fontSize: 44, margin: 0, lineHeight: 1 }}>
              {product.name.replace(/^[^ ]+ /, "")}
            </h2>
            <div className="display-it" style={{ fontSize: 16, color: "var(--ink-soft)", marginTop: 4 }}>
              {product.name.split(" ")[0].toLowerCase()} · {product.color.toLowerCase()}
            </div>

            <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginTop: 20 }}>
              <span className="display" style={{ fontSize: 28, color: "var(--bronze-deep)" }}>
                {formatCOP(product.price)}
              </span>
              {product.was && (
                <span style={{ color: "var(--ink-soft)", textDecoration: "line-through" }}>
                  {formatCOP(product.was)}
                </span>
              )}
              <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--ink-soft)" }}>
                o 4 × {formatCOP(Math.round(product.price / 4))}
              </span>
            </div>

            <p style={{ marginTop: 22, color: "var(--ink-soft)", lineHeight: 1.7, fontSize: 14.5 }}>
              {product.desc}
            </p>

            {/* Sizes */}
            <div style={{ marginTop: 26 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                <span className="eyebrow">Talla</span>
                <span className="eyebrow link-u">Guía de tallas</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    style={{
                      minWidth: 48, height: 44,
                      background: size === s ? "var(--ink)" : "transparent",
                      color: size === s ? "var(--whisper)" : "var(--ink)",
                      border: "1px solid " + (size === s ? "var(--ink)" : "var(--line)"),
                      fontFamily: "var(--body)", fontSize: 13, letterSpacing: "0.08em",
                      cursor: "pointer", borderRadius: 0,
                    }}
                  >{s}</button>
                ))}
              </div>
            </div>

            {/* Qty */}
            <div style={{ marginTop: 24, display: "flex", alignItems: "center", gap: 18 }}>
              <span className="eyebrow">Cantidad</span>
              <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)" }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={qtyBtn}>{Icon.minus()}</button>
                <span style={{ minWidth: 36, textAlign: "center", fontFamily: "var(--display)", fontSize: 18 }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={qtyBtn}>{Icon.plus()}</button>
              </div>
            </div>

            {/* CTA */}
            <div style={{ display: "flex", gap: 10, marginTop: "auto", paddingTop: 30 }}>
              <button
                className="btn"
                style={{ flex: 1 }}
                onClick={() => { onAdd(product, size, qty); onClose(); }}
              >
                Agregar a la bolsa · {formatCOP(product.price * qty)}
              </button>
              <button className="btn btn--ghost" aria-label="Guardar">
                {Icon.heart()}
              </button>
            </div>

            <div style={{ display: "flex", gap: 18, marginTop: 18, fontSize: 11.5, color: "var(--ink-soft)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
              <span>✦ Envío en 24-48h</span>
              <span>✦ 30 días devolución</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

const qtyBtn = {
  width: 38, height: 44, background: "transparent", border: 0, cursor: "pointer",
  display: "flex", alignItems: "center", justifyContent: "center", color: "var(--ink)",
};

// ────────────────────────────────────────────────────────────
// Cart Drawer
function CartDrawer({ open, items, onClose, onChange, onRemove }) {
  useEffect_m(() => {
    document.body.classList.toggle("locked", open);
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const subtotal = items.reduce((s, it) => s + it.product.price * it.qty, 0);
  const shipping = subtotal >= 200000 ? 0 : 15000;
  const total = subtotal + shipping;
  const free = Math.max(0, 200000 - subtotal);

  return (
    <React.Fragment>
      <div className={`overlay ${open ? "show" : ""}`} onClick={onClose}></div>
      <aside className={`drawer ${open ? "show" : ""}`}>
        {/* Header */}
        <div style={{ padding: "26px 28px 18px", borderBottom: "1px solid var(--line)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span className="eyebrow">Tu bolsa</span>
              <div className="display" style={{ fontSize: 28, marginTop: 4 }}>
                {items.length} {items.length === 1 ? "pieza" : "piezas"}
              </div>
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: 0, cursor: "pointer", padding: 8 }}>
              {Icon.close()}
            </button>
          </div>

          {items.length > 0 && (
            <div style={{ marginTop: 16 }}>
              {free > 0 ? (
                <div style={{ fontSize: 12, color: "var(--ink-soft)" }}>
                  Te faltan <strong style={{ color: "var(--bronze-deep)" }}>{formatCOP(free)}</strong> para envío gratis.
                </div>
              ) : (
                <div style={{ fontSize: 12, color: "var(--bronze-deep)", fontWeight: 500 }}>
                  ✦ Tienes envío gratis.
                </div>
              )}
              <div style={{ height: 3, background: "var(--bone)", marginTop: 8, position: "relative", overflow: "hidden" }}>
                <div style={{
                  height: "100%", width: `${Math.min(100, (subtotal / 200000) * 100)}%`,
                  background: "var(--bronze)", transition: "width .35s ease",
                }}></div>
              </div>
            </div>
          )}
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 28px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 80, color: "var(--ink-soft)" }}>
              <div className="display-it" style={{ fontSize: 26 }}>Tu bolsa está vacía.</div>
              <p style={{ marginTop: 14, fontSize: 13.5 }}>Agrega tus prendas favoritas aquí.</p>
              <button className="btn" style={{ marginTop: 22 }} onClick={onClose}>Explorar la colección</button>
            </div>
          ) : (
            items.map((it, i) => (
              <div key={i} style={{
                display: "grid", gridTemplateColumns: "84px 1fr",
                gap: 16, padding: "18px 0", borderBottom: "1px solid var(--line-soft)",
              }}>
                <Placeholder tag="" variant={it.product.swatch} style={{ aspectRatio: "3/4" }} />
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div>
                      <div className="display" style={{ fontSize: 20 }}>{it.product.name.replace(/^[^ ]+ /, "")}</div>
                      <div style={{ fontSize: 11.5, color: "var(--ink-soft)", marginTop: 2 }}>
                        {it.product.color} · Talla {it.size}
                      </div>
                    </div>
                    <div style={{ fontFamily: "var(--display)", fontSize: 17 }}>
                      {formatCOP(it.product.price * it.qty)}
                    </div>
                  </div>

                  <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", border: "1px solid var(--line)" }}>
                      <button onClick={() => onChange(i, Math.max(1, it.qty - 1))} style={{ ...qtyBtn, width: 28, height: 30 }}>{Icon.minus()}</button>
                      <span style={{ minWidth: 24, textAlign: "center", fontFamily: "var(--display)", fontSize: 14 }}>{it.qty}</span>
                      <button onClick={() => onChange(i, it.qty + 1)} style={{ ...qtyBtn, width: 28, height: 30 }}>{Icon.plus()}</button>
                    </div>
                    <button
                      onClick={() => onRemove(i)}
                      className="link-u"
                      style={{ background: "transparent", border: 0, cursor: "pointer", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-soft)" }}
                    >Quitar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer / checkout */}
        {items.length > 0 && (
          <div style={{ padding: 28, borderTop: "1px solid var(--line)", background: "var(--cream)" }}>
            <Row label="Subtotal" v={formatCOP(subtotal)} />
            <Row label="Envío" v={shipping === 0 ? "Gratis" : formatCOP(shipping)} />
            <div style={{ height: 1, background: "var(--line)", margin: "12px 0" }}></div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span className="eyebrow">Total</span>
              <span className="display" style={{ fontSize: 26, color: "var(--bronze-deep)" }}>{formatCOP(total)}</span>
            </div>
            <button className="btn" style={{ width: "100%", marginTop: 18, height: 52 }}>
              Pagar ahora {Icon.arrow()}
            </button>
            <div style={{ marginTop: 12, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", textAlign: "center", color: "var(--ink-soft)" }}>
              Hasta 6 cuotas sin interés
            </div>
          </div>
        )}
      </aside>
    </React.Fragment>
  );
}

function Row({ label, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13 }}>
      <span style={{ color: "var(--ink-soft)" }}>{label}</span>
      <span>{v}</span>
    </div>
  );
}

// Toast — small "added to cart" notice
function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", bottom: 24, left: "50%",
      transform: "translateX(-50%)",
      background: "var(--ink)", color: "var(--whisper)",
      padding: "14px 22px",
      fontSize: 11.5, letterSpacing: "0.2em", textTransform: "uppercase",
      zIndex: 200,
      animation: "fadeUp .35s ease",
      boxShadow: "0 16px 40px rgba(42,33,24,0.25)",
    }}>
      ✦ {msg}
    </div>
  );
}

Object.assign(window, { QuickView, CartDrawer, Toast });
