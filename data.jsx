// DIONE — product data + helper components

const CATEGORIES = [
  { id: "all", label: "Todo" },
  { id: "vestidos", label: "Vestidos" },
  { id: "tops", label: "Tops y Blusas" },
  { id: "faldas", label: "Faldas y Shorts" },
  { id: "pantalones", label: "Pantalones" },
  { id: "abrigos", label: "Abrigos" },
  { id: "conjuntos", label: "Conjuntos" },
];

const PRODUCTS = [
  { id: "athena",   name: "Vestido Athena",      cat: "vestidos",   price: 189000, was: null,    tag: "Nuevo",      desc: "Vestido midi en lino con caída fluida y cuello en V. Inspirado en la túnica griega clásica.",     swatch: "ph",      swatchAlt: "ph--rose", color: "Crema",    sizes: ["XS","S","M","L"], img: "VESTIDO 01", img2: "DETALLE 01" },
  { id: "selene",   name: "Blusa Selene",        cat: "tops",       price: 119000, was: null,    tag: null,         desc: "Blusa satinada manga larga con drapeado lateral. Acabado fluido, transpirable.",                   swatch: "ph--dark",swatchAlt: "ph",       color: "Arena",    sizes: ["XS","S","M","L","XL"], img: "BLUSA 02", img2: "DETALLE 02" },
  { id: "hera",     name: "Falda Hera",          cat: "faldas",     price: 139000, was: 169000,  tag: "−18%",       desc: "Falda midi plisada en tela con caída de seda fría. Pretina alta, talla regulable.",               swatch: "ph",      swatchAlt: "ph--dark", color: "Hueso",    sizes: ["S","M","L"], img: "FALDA 03", img2: "DETALLE 03" },
  { id: "iris",     name: "Top Iris",            cat: "tops",       price: 79000,  was: null,    tag: null,         desc: "Top cruzado con tirantes ajustables. Tela tipo crepé suave al tacto, ideal para entretiempo.",     swatch: "ph--rose",swatchAlt: "ph--deep", color: "Terracota",sizes: ["XS","S","M"], img: "TOP 04", img2: "DETALLE 04" },
  { id: "calipso",  name: "Conjunto Calipso",    cat: "conjuntos",  price: 249000, was: null,    tag: "Edición limitada", desc: "Conjunto de crop + falda envolvente en lino mezclado. Las dos piezas se venden juntas.",      swatch: "ph--dark",swatchAlt: "ph--rose", color: "Avellana", sizes: ["S","M","L"], img: "CONJUNTO 05", img2: "DETALLE 05" },
  { id: "nike",     name: "Pantalón Niké",       cat: "pantalones", price: 159000, was: null,    tag: null,         desc: "Pantalón wide-leg con tiro alto y pinzas. Caída perfecta sobre cualquier silueta.",                swatch: "ph--deep",swatchAlt: "ph",       color: "Café",     sizes: ["XS","S","M","L","XL"], img: "PANTALÓN 06", img2: "DETALLE 06" },
  { id: "afrodita", name: "Vestido Afrodita",    cat: "vestidos",   price: 219000, was: 259000,  tag: "−15%",       desc: "Vestido largo drapeado con tirantes finos y espalda abierta. Para tardes de verano y noches suaves.", swatch: "ph",   swatchAlt: "ph--rose", color: "Marfil",   sizes: ["XS","S","M","L"], img: "VESTIDO 07", img2: "DETALLE 07" },
  { id: "casandra", name: "Blazer Casandra",     cat: "abrigos",    price: 289000, was: null,    tag: "Nuevo",      desc: "Blazer oversize con hombros estructurados. Forrado en satén, dos botones de nácar.",               swatch: "ph--deep",swatchAlt: "ph--dark", color: "Cacao",    sizes: ["S","M","L"], img: "BLAZER 08", img2: "DETALLE 08" },
  { id: "tea",      name: "Cardigan Tea",        cat: "abrigos",    price: 169000, was: null,    tag: null,         desc: "Cardigan tejido en algodón con botones forrados. Punto suave, ligero como una caricia.",          swatch: "ph--rose",swatchAlt: "ph",       color: "Durazno",  sizes: ["XS","S","M","L"], img: "CARDIGAN 09", img2: "DETALLE 09" },
  { id: "helena",   name: "Camisa Helena",       cat: "tops",       price: 129000, was: null,    tag: null,         desc: "Camisa de lino con cuello clásico y puños abotonados. Translúcida al sol, perfecta sobre piel.",  swatch: "ph",      swatchAlt: "ph--dark", color: "Crudo",    sizes: ["XS","S","M","L","XL"], img: "CAMISA 10", img2: "DETALLE 10" },
  { id: "eos",      name: "Short Eos",           cat: "faldas",     price: 99000,  was: null,    tag: null,         desc: "Short de lino con pretina alta y cinturón a juego. Bolsillos laterales, caída relajada.",          swatch: "ph--dark",swatchAlt: "ph--rose", color: "Beige",    sizes: ["XS","S","M","L"], img: "SHORT 11", img2: "DETALLE 11" },
  { id: "persea",   name: "Vestido Persea",      cat: "vestidos",   price: 149000, was: null,    tag: "Best seller",desc: "Vestido mini con falda fruncida y cuello cuadrado. Manga corta abullonada. Romance moderno.",     swatch: "ph--rose",swatchAlt: "ph--deep", color: "Rosa polvo", sizes: ["XS","S","M","L"], img: "VESTIDO 12", img2: "DETALLE 12" },
];

const formatCOP = (n) => "$" + n.toLocaleString("es-CO");

// ────────────────────────────────────────────────────────────
// Placeholder image — striped fabric with mono caption
function Placeholder({ tag = "IMAGEN", variant = "ph", className = "", style = {}, children }) {
  return (
    <div className={`ph ${variant} ${className}`} style={style}>
      {children}
      <span className="ph__tag">{tag}</span>
    </div>
  );
}

// Logo wordmark
function Logo({ size = 22 }) {
  return (
    <span className="display" style={{ fontSize: size, letterSpacing: "0.26em", fontWeight: 500 }}>
      DIONE
    </span>
  );
}

// Tiny icons (line)
const Icon = {
  search: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  ),
  bag: (p = {}) => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="M5 8h14l-1.2 12.2a1.5 1.5 0 0 1-1.5 1.3H7.7a1.5 1.5 0 0 1-1.5-1.3L5 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  ),
  user: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <circle cx="12" cy="9" r="3.5" /><path d="M4.5 20c1.2-3.7 4-5.5 7.5-5.5s6.3 1.8 7.5 5.5" strokeLinecap="round" />
    </svg>
  ),
  heart: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z" />
    </svg>
  ),
  close: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  ),
  arrow: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  plus: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  minus: (p = {}) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
      <path d="M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  menu: (p = {}) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  ),
};

Object.assign(window, { CATEGORIES, PRODUCTS, formatCOP, Placeholder, Logo, Icon });
