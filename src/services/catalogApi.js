// ------------------------------------------------------------
// Catálogo desde el Panel de Administración
// (https://github.com/sdv12/catalogo-limpieza · /api/publico/*)
// Convierte la respuesta de la API al shape que usa la landing.
// ------------------------------------------------------------
import { CATEGORY_ICONS } from '../data/products'

const BASE   = (import.meta.env.VITE_CATALOG_API_URL || '').replace(/\/$/, '')
const SLUG   = import.meta.env.VITE_CATALOG_SLUG || 'aromas'

/** true si la landing debe leer del panel en vez de Firestore. */
export const USING_PANEL = Boolean(BASE)

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

/** Aplana producto + presentación → un "producto" de la landing. */
function toLandingProduct(prod, variante, multiPresentacion) {
  const precios = variante.precios || {}
  const minorista =
    num(precios.minorista?.precio) ||
    num(Object.values(precios)[0]?.precio)
  const mayorista = num(precios.mayorista?.precio) || minorista

  const attrs = prod.atributos || {}
  const tamano = variante.tamano
    ? `${variante.tamano}${variante.unidad ? ` ${variante.unidad}` : ''}`
    : null

  return {
    id: variante.sku || `${prod.sku_base}-${variante.nombre}`,
    productId: prod.id,
    sku: variante.sku,
    barcode: variante.codigo_barras || null,
    name: multiPresentacion
      ? `${prod.nombre} — ${variante.nombre}`
      : prod.nombre,
    brand: prod.marca || 'Aromas Córdoba',
    category: prod.categoria_slug || 'sin-categoria',
    categoryLabel: prod.categoria || null,
    description: prod.descripcion || '',
    size: tamano,
    price: minorista,
    wholesalePrice: mayorista,
    prices: Object.fromEntries(
      Object.entries(precios).map(([code, v]) => [code, num(v?.precio)]),
    ),
    stock: num(variante.stock),
    image: prod.imagenes?.[0] || '',
    images: prod.imagenes || [],
    tags: Array.isArray(attrs.tags) ? attrs.tags : [],
    rating: num(attrs.rating) || 4.6,
    reviews: num(attrs.reviews) || 0,
    isOffer: Boolean(attrs.oferta),
    offerPercent: num(attrs.oferta_pct),
    isFeatured: Boolean(attrs.destacado),
    attributes: attrs,
    updatedAt: prod.actualizado || null,
  }
}

/** Descarga productos + metadatos del catálogo del panel. */
export async function fetchCatalog(signal) {
  if (!BASE) throw new Error('VITE_CATALOG_API_URL no configurada')

  const [rProd, rMeta] = await Promise.all([
    fetch(`${BASE}/api/publico/${SLUG}/productos?limit=300`, { signal }),
    fetch(`${BASE}/api/publico/${SLUG}/meta`, { signal }),
  ])
  if (!rProd.ok) throw new Error(`Catálogo: HTTP ${rProd.status}`)

  const { productos = [] } = await rProd.json()
  const meta = rMeta.ok ? await rMeta.json() : null

  const products = []
  for (const prod of productos) {
    const presentaciones = prod.presentaciones?.length
      ? prod.presentaciones
      : [{ sku: prod.sku_base, nombre: 'Único', precios: {}, stock: 0 }]
    const multi = presentaciones.length > 1
    for (const v of presentaciones) {
      products.push(toLandingProduct(prod, v, multi))
    }
  }

  const categories = (meta?.categorias || [])
    .filter((c) => !c.padre) // solo raíz en el filtro principal
    .map((c) => ({
      id: c.slug,
      label: c.nombre,
      icon: CATEGORY_ICONS[c.slug] || CATEGORY_ICONS._default,
      count: c.productos,
    }))

  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort()

  return { products, categories, brands, meta }
}
