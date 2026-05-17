// DIONE · Admin Panel

const { useState, useEffect, useCallback } = React;

const sb = supabase.createClient(
  "https://bmxftmbjotzfpvbefcxl.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJteGZ0bWJqb3R6ZnB2YmVmY3hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4NjUxMTcsImV4cCI6MjA5NDQ0MTExN30.7uEmQdduRdfio9aMYtlLF26FMRAaiwf_H3xyrdR70eU"
);

const fmt = (n) => "$" + Number(n).toLocaleString("es-AR");

// ── Toast ──────────────────────────────────────────────────────
function Toast({ msg }) {
  if (!msg) return null;
  return <div className="adm-toast">✦ {msg}</div>;
}

// ── Confirm dialog ─────────────────────────────────────────────
function Confirm({ msg, onOk, onCancel }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(42,33,24,0.45)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "var(--whisper)", padding: 32, border: "1px solid var(--line)", maxWidth: 360, width: "90%" }}>
        <p style={{ margin: "0 0 24px", lineHeight: 1.6 }}>{msg}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="adm-btn adm-btn--ghost" onClick={onCancel}>Cancelar</button>
          <button className="adm-btn adm-btn--danger" onClick={onOk}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────
function Dashboard({ products, stock, sales }) {
  const totalUnits   = stock.reduce((s, r) => s + r.quantity, 0);
  const valorCosto   = stock.reduce((s, r) => {
    const p = products.find(p => p.id === r.product_id);
    return s + (p ? p.cost_price * r.quantity : 0);
  }, 0);
  const valorVenta   = stock.reduce((s, r) => {
    const p = products.find(p => p.id === r.product_id);
    return s + (p ? p.sale_price * r.quantity : 0);
  }, 0);
  const ventaTotal   = sales.reduce((s, r) => s + r.sale_price * r.quantity, 0);
  const gananciaEst  = valorVenta - valorCosto;

  const lowStock = stock.filter(r => r.quantity > 0 && r.quantity <= 2);
  const outStock = stock.filter(r => r.quantity === 0);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="adm-page-title">Dashboard</h1>
        <p className="adm-page-sub">Resumen general de DIONE</p>
      </div>

      <div className="adm-metrics">
        <div className="adm-metric">
          <div className="adm-metric__label">Productos</div>
          <div className="adm-metric__value">{products.length}</div>
          <div className="adm-metric__sub">Referencias en catálogo</div>
        </div>
        <div className="adm-metric">
          <div className="adm-metric__label">Unidades en stock</div>
          <div className="adm-metric__value">{totalUnits}</div>
          <div className="adm-metric__sub">{outStock.length} sin stock · {lowStock.length} por agotarse</div>
        </div>
        <div className="adm-metric">
          <div className="adm-metric__label">Stock a costo</div>
          <div className="adm-metric__value" style={{ fontSize: 22 }}>{fmt(valorCosto)}</div>
          <div className="adm-metric__sub">Inversión actual</div>
        </div>
        <div className="adm-metric">
          <div className="adm-metric__label">Stock a precio venta</div>
          <div className="adm-metric__value" style={{ fontSize: 22 }}>{fmt(valorVenta)}</div>
          <div className="adm-metric__sub">Ganancia potencial {fmt(gananciaEst)}</div>
        </div>
        <div className="adm-metric">
          <div className="adm-metric__label">Ventas totales</div>
          <div className="adm-metric__value" style={{ fontSize: 22 }}>{fmt(ventaTotal)}</div>
          <div className="adm-metric__sub">{sales.length} transacciones</div>
        </div>
      </div>

      {(lowStock.length > 0 || outStock.length > 0) && (
        <div className="adm-panel">
          <div className="adm-panel-title" style={{ fontSize: 18 }}>Alertas de stock</div>
          <table className="adm-table" style={{ tableLayout: "fixed" }}>
            <thead>
              <tr><th>Producto</th><th>Color</th><th>Talle</th><th>Unidades</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {[...outStock, ...lowStock].map(r => {
                const p = products.find(p => p.id === r.product_id);
                return (
                  <tr key={r.id}>
                    <td>{p?.name}</td>
                    <td>{p?.color || "—"}</td>
                    <td>{r.size}</td>
                    <td>{r.quantity}</td>
                    <td><span className={`badge ${r.quantity === 0 ? "badge--out" : "badge--low"}`}>{r.quantity === 0 ? "Sin stock" : "Bajo"}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Productos ──────────────────────────────────────────────────
const CATS = ["tops", "vestidos", "faldas", "pantalones", "abrigos", "conjuntos", "accesorios"];
const EMPTY_PROD = { name: "", category: "tops", color: "", cost_price: "", sale_price: "", tag: "", photo_url: "", description: "" };

function Productos({ products, stock, onRefresh, showToast }) {
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(EMPTY_PROD);
  const [showForm, setShowForm]   = useState(false);
  const [confirm, setConfirm]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = React.useRef(null);

  const openNew  = () => { setForm(EMPTY_PROD); setEditing(null); setShowForm(true); };
  const openEdit = (p) => { setForm({ ...p, cost_price: String(p.cost_price), sale_price: String(p.sale_price) }); setEditing(p.id); setShowForm(true); };

  const uploadPhoto = async (file) => {
    if (!file) return;
    setUploading(true);
    const ext  = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("product-photos").upload(path, file, { upsert: false });
    if (error) { showToast("Error al subir la foto"); setUploading(false); return; }
    const { data } = sb.storage.from("product-photos").getPublicUrl(path);
    setForm(prev => ({ ...prev, photo_url: data.publicUrl }));
    setUploading(false);
    showToast("Foto subida ✦");
  };

  const save = async () => {
    if (!form.name.trim()) return showToast("El nombre es obligatorio");
    const payload = {
      name: form.name.trim(),
      category: form.category,
      color: form.color || null,
      cost_price: Number(form.cost_price) || 0,
      sale_price: Number(form.sale_price) || 0,
      tag: form.tag || null,
      photo_url: form.photo_url || null,
      description: form.description || null,
    };
    if (editing) {
      await sb.from("dione_products").update(payload).eq("id", editing);
      showToast("Producto actualizado");
    } else {
      const { data } = await sb.from("dione_products").insert(payload).select().single();
      if (data) await sb.from("dione_stock").insert({ product_id: data.id, size: "Única", quantity: 0 });
      showToast("Producto agregado");
    }
    setShowForm(false);
    onRefresh();
  };

  const remove = async (id) => {
    await sb.from("dione_products").delete().eq("id", id);
    showToast("Producto eliminado");
    setConfirm(null);
    onRefresh();
  };

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <div className="adm-section-header">
        <div>
          <h1 className="adm-page-title">Productos</h1>
          <p className="adm-page-sub">{products.length} referencias</p>
        </div>
        <button className="adm-btn" onClick={openNew}>+ Nuevo producto</button>
      </div>

      {showForm && (
        <div className="adm-panel" style={{ marginBottom: 28 }}>
          <div className="adm-panel-title">{editing ? "Editar producto" : "Nuevo producto"}</div>
          <div className="adm-form">
            <div className="adm-form-row">
              <div className="adm-field">
                <label>Nombre *</label>
                <input className="adm-input" value={form.name} onChange={e => f("name", e.target.value)} placeholder="TOP MARIA" />
              </div>
              <div className="adm-field">
                <label>Categoría</label>
                <select className="adm-input" value={form.category} onChange={e => f("category", e.target.value)}>
                  {CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="adm-form-row">
              <div className="adm-field">
                <label>Color</label>
                <input className="adm-input" value={form.color} onChange={e => f("color", e.target.value)} placeholder="Negro" />
              </div>
              <div className="adm-field">
                <label>Tag</label>
                <input className="adm-input" value={form.tag} onChange={e => f("tag", e.target.value)} placeholder="Nuevo · Best seller" />
              </div>
            </div>
            <div className="adm-form-row">
              <div className="adm-field">
                <label>Precio costo ($)</label>
                <input className="adm-input" type="number" value={form.cost_price} onChange={e => f("cost_price", e.target.value)} placeholder="8400" />
              </div>
              <div className="adm-field">
                <label>Precio venta ($)</label>
                <input className="adm-input" type="number" value={form.sale_price} onChange={e => f("sale_price", e.target.value)} placeholder="16800" />
              </div>
            </div>
            <div className="adm-field">
              <label>Foto del producto</label>
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {form.photo_url && (
                  <img src={form.photo_url} alt="" style={{ width: 72, height: 72, objectFit: "cover", border: "1px solid var(--line)", flexShrink: 0 }} />
                )}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={e => uploadPhoto(e.target.files[0])}
                  />
                  <button
                    type="button"
                    className="adm-btn adm-btn--ghost"
                    onClick={() => fileRef.current.click()}
                    disabled={uploading}
                  >
                    {uploading ? "Subiendo..." : form.photo_url ? "Cambiar foto" : "Subir foto"}
                  </button>
                  {form.photo_url && (
                    <button type="button" className="adm-btn adm-btn--ghost adm-btn--sm" style={{ color: "var(--ink-soft)" }} onClick={() => f("photo_url", "")}>
                      Quitar foto
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="adm-field">
              <label>Descripción</label>
              <textarea className="adm-input" rows={2} value={form.description} onChange={e => f("description", e.target.value)} />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="adm-btn adm-btn--ghost" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="adm-btn" onClick={save}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Color</th>
              <th>Categoría</th>
              <th>Costo</th>
              <th>Venta</th>
              <th>Stock total</th>
              <th>Tag</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => {
              const units = stock.filter(s => s.product_id === p.id).reduce((n, s) => n + s.quantity, 0);
              return (
                <tr key={p.id}>
                  <td><strong>{p.name}</strong></td>
                  <td>{p.color || "—"}</td>
                  <td style={{ textTransform: "capitalize" }}>{p.category}</td>
                  <td>{fmt(p.cost_price)}</td>
                  <td>{fmt(p.sale_price)}</td>
                  <td>
                    <span className={`badge ${units === 0 ? "badge--out" : units <= 2 ? "badge--low" : "badge--ok"}`}>{units}</span>
                  </td>
                  <td style={{ fontSize: 11, color: "var(--ink-soft)" }}>{p.tag || "—"}</td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => openEdit(p)}>Editar</button>
                      <button className="adm-btn adm-btn--danger adm-btn--sm" onClick={() => setConfirm(p.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {confirm && (
        <Confirm
          msg="¿Eliminar este producto? Se eliminará también su stock."
          onOk={() => remove(confirm)}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}

// ── Stock ──────────────────────────────────────────────────────
function Stock({ products, stock, onRefresh, showToast }) {
  const [filter, setFilter] = useState("");
  const [addRow, setAddRow] = useState(null);
  const [newSize, setNewSize] = useState("");
  const [newQty, setNewQty] = useState(0);

  const adjust = async (id, delta) => {
    const row = stock.find(s => s.id === id);
    const next = Math.max(0, row.quantity + delta);
    await sb.from("dione_stock").update({ quantity: next }).eq("id", id);
    onRefresh();
  };

  const setQtyDirect = async (id, val) => {
    const qty = Math.max(0, parseInt(val) || 0);
    await sb.from("dione_stock").update({ quantity: qty }).eq("id", id);
    onRefresh();
  };

  const addSize = async (productId) => {
    if (!newSize.trim()) return;
    await sb.from("dione_stock").upsert({ product_id: productId, size: newSize.trim(), quantity: Number(newQty) || 0 }, { onConflict: "product_id,size" });
    showToast("Talle agregado");
    setAddRow(null); setNewSize(""); setNewQty(0);
    onRefresh();
  };

  const filteredProducts = products.filter(p =>
    !filter || p.name.toLowerCase().includes(filter.toLowerCase()) || (p.color || "").toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div>
      <div className="adm-section-header">
        <div>
          <h1 className="adm-page-title">Stock</h1>
          <p className="adm-page-sub">Gestión de unidades por talle</p>
        </div>
        <input className="adm-input" style={{ width: 220 }} placeholder="Buscar producto..." value={filter} onChange={e => setFilter(e.target.value)} />
      </div>

      {filteredProducts.map(p => {
        const rows = stock.filter(s => s.product_id === p.id);
        return (
          <div key={p.id} className="adm-panel" style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
              <div>
                <span style={{ fontFamily: "var(--display)", fontSize: 20 }}>{p.name}</span>
                {p.color && <span style={{ fontSize: 12, color: "var(--ink-soft)", marginLeft: 10 }}>{p.color}</span>}
              </div>
              <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => { setAddRow(p.id); setNewSize(""); setNewQty(0); }}>
                + Talle
              </button>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {rows.map(r => (
                <div key={r.id} style={{ background: "var(--bone)", border: "1px solid var(--line)", padding: "12px 16px", minWidth: 110 }}>
                  <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: 8 }}>{r.size}</div>
                  <div className="qty-stepper">
                    <button onClick={() => adjust(r.id, -1)}>−</button>
                    <span>{r.quantity}</span>
                    <button onClick={() => adjust(r.id, +1)}>+</button>
                  </div>
                </div>
              ))}

              {addRow === p.id && (
                <div style={{ background: "var(--bone)", border: "1px dashed var(--bronze)", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
                  <input className="adm-input" style={{ width: 80, height: 32 }} placeholder="Talle" value={newSize} onChange={e => setNewSize(e.target.value)} />
                  <input className="adm-input" type="number" style={{ width: 80, height: 32 }} placeholder="Cant." value={newQty} onChange={e => setNewQty(e.target.value)} />
                  <div style={{ display: "flex", gap: 4 }}>
                    <button className="adm-btn adm-btn--sm" onClick={() => addSize(p.id)}>✓</button>
                    <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={() => setAddRow(null)}>✕</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Ventas ─────────────────────────────────────────────────────
function Ventas({ products, stock, sales, onRefresh, showToast }) {
  const [form, setForm] = useState({ product_id: "", size: "", quantity: 1, sale_price: "", notes: "" });
  const [showForm, setShowForm] = useState(false);

  const availableSizes = form.product_id
    ? stock.filter(s => s.product_id === form.product_id && s.quantity > 0).map(s => s.size)
    : [];

  const selectProduct = (id) => {
    const p = products.find(p => p.id === id);
    setForm(prev => ({ ...prev, product_id: id, size: "", sale_price: p ? String(p.sale_price) : "" }));
  };

  const register = async () => {
    if (!form.product_id || !form.size || !form.quantity) return showToast("Completá todos los campos");
    const qty = Number(form.quantity);
    const stockRow = stock.find(s => s.product_id === form.product_id && s.size === form.size);
    if (!stockRow || stockRow.quantity < qty) return showToast("Stock insuficiente");

    await sb.from("dione_sales").insert({
      product_id: form.product_id,
      size: form.size,
      quantity: qty,
      sale_price: Number(form.sale_price) || 0,
      notes: form.notes || null,
    });
    await sb.from("dione_stock").update({ quantity: stockRow.quantity - qty }).eq("id", stockRow.id);
    showToast("Venta registrada ✦");
    setShowForm(false);
    setForm({ product_id: "", size: "", quantity: 1, sale_price: "", notes: "" });
    onRefresh();
  };

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <div>
      <div className="adm-section-header">
        <div>
          <h1 className="adm-page-title">Ventas</h1>
          <p className="adm-page-sub">{sales.length} transacciones registradas</p>
        </div>
        <button className="adm-btn adm-btn--bronze" onClick={() => setShowForm(s => !s)}>+ Registrar venta</button>
      </div>

      {showForm && (
        <div className="adm-panel" style={{ marginBottom: 28 }}>
          <div className="adm-panel-title">Nueva venta</div>
          <div className="adm-form">
            <div className="adm-form-row">
              <div className="adm-field">
                <label>Producto *</label>
                <select className="adm-input" value={form.product_id} onChange={e => selectProduct(e.target.value)}>
                  <option value="">Seleccionar...</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}{p.color ? ` · ${p.color}` : ""}</option>
                  ))}
                </select>
              </div>
              <div className="adm-field">
                <label>Talle *</label>
                <select className="adm-input" value={form.size} onChange={e => f("size", e.target.value)} disabled={!form.product_id}>
                  <option value="">Seleccionar...</option>
                  {availableSizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="adm-form-row">
              <div className="adm-field">
                <label>Cantidad *</label>
                <input className="adm-input" type="number" min="1" value={form.quantity} onChange={e => f("quantity", e.target.value)} />
              </div>
              <div className="adm-field">
                <label>Precio de venta ($)</label>
                <input className="adm-input" type="number" value={form.sale_price} onChange={e => f("sale_price", e.target.value)} />
              </div>
            </div>
            <div className="adm-field">
              <label>Notas</label>
              <input className="adm-input" value={form.notes} onChange={e => f("notes", e.target.value)} placeholder="Venta en efectivo, descuento, etc." />
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button className="adm-btn adm-btn--ghost" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="adm-btn adm-btn--bronze" onClick={register}>Registrar</button>
            </div>
          </div>
        </div>
      )}

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr><th>Fecha</th><th>Producto</th><th>Talle</th><th>Cant.</th><th>Precio</th><th>Total</th><th>Notas</th></tr>
          </thead>
          <tbody>
            {sales.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "var(--ink-soft)", fontStyle: "italic" }}>Aún no hay ventas registradas.</td></tr>
            )}
            {[...sales].sort((a, b) => new Date(b.sold_at) - new Date(a.sold_at)).map(s => {
              const p = products.find(p => p.id === s.product_id);
              const d = new Date(s.sold_at);
              return (
                <tr key={s.id}>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 11 }}>{d.toLocaleDateString("es-AR")} {d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}</td>
                  <td>{p ? `${p.name}${p.color ? " · " + p.color : ""}` : "—"}</td>
                  <td>{s.size}</td>
                  <td>{s.quantity}</td>
                  <td>{fmt(s.sale_price)}</td>
                  <td style={{ fontFamily: "var(--display)", fontSize: 16, color: "var(--bronze-deep)" }}>{fmt(s.sale_price * s.quantity)}</td>
                  <td style={{ fontSize: 12, color: "var(--ink-soft)" }}>{s.notes || "—"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Stock Valorizado ───────────────────────────────────────────
function StockValorizado({ products, stock, sales }) {
  const rows = products.map(p => {
    const stockRows = stock.filter(s => s.product_id === p.id);
    const units     = stockRows.reduce((n, s) => n + s.quantity, 0);
    const vendidas  = sales.filter(s => s.product_id === p.id).reduce((n, s) => n + s.quantity, 0);
    const ingreso   = sales.filter(s => s.product_id === p.id).reduce((n, s) => n + s.sale_price * s.quantity, 0);
    return { ...p, units, vendidas, ingreso, valorCosto: units * p.cost_price, valorVenta: units * p.sale_price };
  }).filter(r => r.units > 0 || r.vendidas > 0);

  const totCosto  = rows.reduce((n, r) => n + r.valorCosto, 0);
  const totVenta  = rows.reduce((n, r) => n + r.valorVenta, 0);
  const totIngres = rows.reduce((n, r) => n + r.ingreso, 0);

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="adm-page-title">Stock Valorizado</h1>
        <p className="adm-page-sub">Valor de inventario actual + resumen de ventas</p>
      </div>

      <div className="adm-metrics" style={{ marginBottom: 32 }}>
        <div className="adm-metric">
          <div className="adm-metric__label">Inversión en stock</div>
          <div className="adm-metric__value" style={{ fontSize: 22 }}>{fmt(totCosto)}</div>
          <div className="adm-metric__sub">A precio de costo</div>
        </div>
        <div className="adm-metric">
          <div className="adm-metric__label">Valor potencial</div>
          <div className="adm-metric__value" style={{ fontSize: 22 }}>{fmt(totVenta)}</div>
          <div className="adm-metric__sub">Si se vende todo al precio lista</div>
        </div>
        <div className="adm-metric">
          <div className="adm-metric__label">Ganancia potencial</div>
          <div className="adm-metric__value" style={{ fontSize: 22 }}>{fmt(totVenta - totCosto)}</div>
          <div className="adm-metric__sub">Margen sobre stock actual</div>
        </div>
        <div className="adm-metric">
          <div className="adm-metric__label">Ingresos por ventas</div>
          <div className="adm-metric__value" style={{ fontSize: 22 }}>{fmt(totIngres)}</div>
          <div className="adm-metric__sub">Recaudado hasta hoy</div>
        </div>
      </div>

      <div className="adm-table-wrap">
        <table className="adm-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Color</th>
              <th>Unidades</th>
              <th>Costo unit.</th>
              <th>Precio venta</th>
              <th>Val. costo</th>
              <th>Val. venta</th>
              <th>Vendidas</th>
              <th>Ingreso</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td><strong>{r.name}</strong></td>
                <td>{r.color || "—"}</td>
                <td><span className={`badge ${r.units === 0 ? "badge--out" : r.units <= 2 ? "badge--low" : "badge--ok"}`}>{r.units}</span></td>
                <td>{fmt(r.cost_price)}</td>
                <td>{fmt(r.sale_price)}</td>
                <td>{fmt(r.valorCosto)}</td>
                <td style={{ color: "var(--bronze-deep)", fontFamily: "var(--display)", fontSize: 15 }}>{fmt(r.valorVenta)}</td>
                <td>{r.vendidas}</td>
                <td>{fmt(r.ingreso)}</td>
              </tr>
            ))}
            <tr style={{ background: "var(--bone)", fontWeight: 600 }}>
              <td colSpan={5}><strong>Totales</strong></td>
              <td><strong>{fmt(totCosto)}</strong></td>
              <td style={{ color: "var(--bronze-deep)", fontFamily: "var(--display)", fontSize: 15 }}><strong>{fmt(totVenta)}</strong></td>
              <td></td>
              <td><strong>{fmt(totIngres)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Login ──────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await sb.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) setError("Email o contraseña incorrectos.");
    else onLogin();
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--ink)" }}>
      <form onSubmit={submit} style={{ background: "var(--whisper, #f8f4ee)", padding: 48, width: 360, display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ fontFamily: "Cormorant Garamond, serif", fontSize: 28, letterSpacing: "0.18em", textAlign: "center", marginBottom: 8 }}>DIONE</div>
        <div style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", opacity: 0.5, marginTop: -12 }}>Panel de administración</div>

        <div className="adm-field">
          <label>Email</label>
          <input className="adm-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@dione.com" autoComplete="email" />
        </div>
        <div className="adm-field">
          <label>Contraseña</label>
          <input className="adm-input" type="password" required value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
        </div>

        {error && <div style={{ color: "#c0392b", fontSize: 13, textAlign: "center" }}>{error}</div>}

        <button className="adm-btn" type="submit" disabled={loading} style={{ marginTop: 4 }}>
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}

// ── App ────────────────────────────────────────────────────────
function App() {
  const [session, setSession]   = useState(undefined); // undefined = verificando
  const [section, setSection]   = useState("dashboard");
  const [products, setProducts] = useState([]);
  const [stock, setStock]       = useState([]);
  const [sales, setSales]       = useState([]);
  const [toast, setToast]       = useState("");
  const [loading, setLoading]   = useState(true);

  // Verificar sesión al montar y escuchar cambios
  useEffect(() => {
    sb.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2500); };

  const load = useCallback(async () => {
    const [{ data: p }, { data: s }, { data: v }] = await Promise.all([
      sb.from("dione_products").select("*").order("name"),
      sb.from("dione_stock").select("*"),
      sb.from("dione_sales").select("*").order("sold_at", { ascending: false }),
    ]);
    setProducts(p || []);
    setStock(s || []);
    setSales(v || []);
    setLoading(false);
  }, []);

  useEffect(() => { if (session) load(); }, [session, load]);

  const logout = async () => {
    await sb.auth.signOut();
    setProducts([]); setStock([]); setSales([]);
  };

  // Verificando sesión
  if (session === undefined) return null;

  // Sin sesión → login
  if (!session) return <Login onLogin={() => {}} />;

  const nav = [
    { id: "dashboard",  label: "Dashboard",        icon: "▦" },
    { id: "productos",  label: "Productos",         icon: "◈" },
    { id: "stock",      label: "Stock",             icon: "◉" },
    { id: "ventas",     label: "Ventas",            icon: "◎" },
    { id: "valorizado", label: "Stock Valorizado",  icon: "◆" },
  ];

  return (
    <div className="adm">
      <aside className="adm-side">
        <div className="adm-logo">DIONE <span>Panel de administración</span></div>
        <nav className="adm-nav">
          {nav.map(n => (
            <div key={n.id} className={`adm-nav-item ${section === n.id ? "active" : ""}`} onClick={() => setSection(n.id)}>
              <span style={{ fontSize: 14, opacity: 0.7 }}>{n.icon}</span>
              {n.label}
            </div>
          ))}
        </nav>
        <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.12em" }}>{session.user.email}</div>
          <div style={{ display: "flex", gap: 8 }}>
            <a href="index.html" style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}>← Sitio</a>
            <span style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <button onClick={logout} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.4)", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", padding: 0 }}>Salir</button>
          </div>
        </div>
      </aside>

      <main className="adm-main">
        <div className="adm-topbar">
          <span className="eyebrow">DIONE · Admin</span>
          <button className="adm-btn adm-btn--ghost adm-btn--sm" onClick={load}>↺ Actualizar</button>
        </div>

        <div className="adm-content">
          {loading ? (
            <div style={{ textAlign: "center", padding: 80, color: "var(--ink-soft)", fontFamily: "var(--display)", fontStyle: "italic", fontSize: 22 }}>
              Cargando...
            </div>
          ) : (
            <>
              {section === "dashboard"  && <Dashboard  products={products} stock={stock} sales={sales} />}
              {section === "productos"  && <Productos  products={products} stock={stock} onRefresh={load} showToast={showToast} />}
              {section === "stock"      && <Stock      products={products} stock={stock} onRefresh={load} showToast={showToast} />}
              {section === "ventas"     && <Ventas     products={products} stock={stock} sales={sales} onRefresh={load} showToast={showToast} />}
              {section === "valorizado" && <StockValorizado products={products} stock={stock} sales={sales} />}
            </>
          )}
        </div>
      </main>

      <Toast msg={toast} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
