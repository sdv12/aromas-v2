import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus, Edit2, Trash2, X, Save, RefreshCw, Search,
  Package, AlertTriangle, Star, Bell, Mail, Trash, Upload, Loader2
} from 'lucide-react'
import { useProducts }        from '../../context/ProductsContext'
import { useAuth }            from '../../context/AuthContext'
import { CATEGORIES, BRANDS } from '../../data/products'
import { seedProducts, reseedProducts } from '../../utils/seedProducts'

const EMPTY_PRODUCT = {
  name: '', brand: BRANDS[0], category: CATEGORIES[0].id,
  description: '', price: '', wholesalePrice: '',
  stock: '', image: '', isOffer: false, offerPercent: 0,
  isFeatured: false, rating: 4.5, reviews: 0, tags: [],
}

export default function CatalogAdmin() {
  const { products, addProduct, updateProduct, deleteProduct } = useProducts()
  const { isEmployee } = useAuth()
  const navigate = useNavigate()

  const [activeTab,    setActiveTab]    = useState('catalog')
  const [search,       setSearch]       = useState('')
  const [modal,        setModal]        = useState(null)
  const [confirm,      setConfirm]      = useState(null)
  const [form,         setForm]         = useState(EMPTY_PRODUCT)
  const [resetConfirm, setResetConfirm] = useState(false)
  const [seedLoading,  setSeedLoading]  = useState(false)
  const [seedMsg,      setSeedMsg]      = useState('')

  // Stock alerts (localStorage — migración a Firestore pendiente)
  const [alerts, setAlerts] = useState(() =>
    JSON.parse(localStorage.getItem('aromascba_stock_alerts') || '[]')
  )
  const alertsByProduct = alerts.reduce((acc, a) => {
    if (!acc[a.productId]) acc[a.productId] = { productName: a.productName, emails: [] }
    if (!acc[a.productId].emails.includes(a.email)) acc[a.productId].emails.push(a.email)
    return acc
  }, {})
  const clearProductAlerts = (productId) => {
    const updated = alerts.filter(a => a.productId !== productId)
    localStorage.setItem('aromascba_stock_alerts', JSON.stringify(updated))
    setAlerts(updated)
  }
  const clearAllAlerts = () => {
    localStorage.removeItem('aromascba_stock_alerts')
    setAlerts([])
  }

  const handleSeed = async (force = false) => {
    setSeedLoading(true); setSeedMsg('')
    try {
      if (force) await reseedProducts()
      else       await seedProducts()
      setSeedMsg('Catálogo cargado correctamente.')
    } catch (err) {
      setSeedMsg(err.message || 'Error al cargar el catálogo.')
    } finally {
      setSeedLoading(false)
      setTimeout(() => setSeedMsg(''), 4000)
    }
  }

  if (!isEmployee) {
    return (
      <div className="max-w-lg mx-auto py-20 px-4 text-center">
        <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Acceso restringido</h2>
        <p className="text-gray-500 mb-6">Esta sección es solo para administradores y empleados.</p>
        <button onClick={() => navigate('/')} className="btn-primary">Volver al inicio</button>
      </div>
    )
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => { setForm(EMPTY_PRODUCT); setModal('add') }
  const openEdit = p => { setForm({ ...p, tags: p.tags || [] }); setModal({ product: p }) }
  const closeModal = () => { setModal(null); setForm(EMPTY_PRODUCT) }

  const handleSave = async e => {
    e.preventDefault()
    const data = {
      ...form,
      price:          Number(form.price),
      wholesalePrice: Number(form.wholesalePrice),
      stock:          Number(form.stock),
      offerPercent:   Number(form.offerPercent),
      rating:         Number(form.rating),
      reviews:        Number(form.reviews),
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags,
    }
    if (modal === 'add') {
      await addProduct(data)
    } else {
      await updateProduct(modal.product.id, data)
    }
    closeModal()
  }

  const handleDelete = async id => {
    await deleteProduct(id)
    setConfirm(null)
  }

  const f = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const catLabel = id => CATEGORIES.find(c => c.id === id)?.label || id

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Package size={24} className="text-primary-600" /> Panel de Catálogo
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{products.length} productos en total</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {seedMsg && (
            <span className={`text-xs px-3 py-2 rounded-lg ${seedMsg.includes('Error') ? 'bg-red-50 text-red-600 dark:bg-red-950' : 'bg-green-50 text-green-700 dark:bg-green-950'}`}>
              {seedMsg}
            </span>
          )}
          {products.length === 0 ? (
            <button
              onClick={() => handleSeed(false)}
              disabled={seedLoading}
              className="btn-primary text-sm flex items-center gap-1.5"
            >
              {seedLoading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Cargar catálogo inicial
            </button>
          ) : (
            <button
              onClick={() => setResetConfirm(true)}
              className="btn-ghost text-sm border border-gray-200 dark:border-navy-700 flex items-center gap-1.5"
            >
              <RefreshCw size={14} /> Restaurar
            </button>
          )}
          <button onClick={openAdd} className="btn-primary flex items-center gap-1.5">
            <Plus size={16} /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-primary-50 dark:bg-navy-800 p-1 rounded-lg w-fit mb-6">
        {[
          { id: 'catalog', label: 'Catálogo',           Icon: Package },
          { id: 'alerts',  label: `Alertas de stock${alerts.length > 0 ? ` (${alerts.length})` : ''}`, Icon: Bell },
        ].map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === id
                ? 'bg-white dark:bg-navy-700 text-primary-600 shadow'
                : 'text-gray-500 dark:text-blue-300 hover:text-gray-700 dark:hover:text-white'
            }`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {activeTab === 'alerts' ? (
        /* ── Alerts panel ── */
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {Object.keys(alertsByProduct).length === 0
                ? 'No hay alertas de stock registradas.'
                : `${Object.keys(alertsByProduct).length} producto${Object.keys(alertsByProduct).length > 1 ? 's' : ''} con demanda pendiente`}
            </p>
            {alerts.length > 0 && (
              <button
                onClick={clearAllAlerts}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors"
              >
                <Trash size={13} /> Limpiar todas
              </button>
            )}
          </div>

          {Object.keys(alertsByProduct).length === 0 ? (
            <div className="card p-12 text-center">
              <Bell size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Cuando un cliente haga clic en "Avisame cuando haya stock", aparecerá aquí.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(alertsByProduct).map(([productId, { productName, emails }]) => {
                const product = products.find(p => p.id === Number(productId))
                return (
                  <div key={productId} className="card p-4 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      {product?.image && (
                        <img
                          src={product.image}
                          alt={productName}
                          className="w-12 h-12 rounded-lg object-cover shrink-0 bg-gray-100"
                          onError={e => { e.target.src = 'https://placehold.co/48x48/d8edf8/1285b5?text=A' }}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{productName}</p>
                        <p className="text-xs text-gray-400 mb-2">
                          {emails.length} {emails.length === 1 ? 'contacto interesado' : 'contactos interesados'}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {emails.map(email => (
                            <span key={email} className="flex items-center gap-1 text-xs bg-primary-50 dark:bg-navy-800 text-primary-700 dark:text-primary-300 px-2 py-0.5 rounded-full">
                              <Mail size={10} /> {email}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => clearProductAlerts(Number(productId))}
                      className="shrink-0 text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Limpiar alertas de este producto"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        /* ── Catalog panel ── */
        <>

      {/* Search */}
      <div className="relative mb-4 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="input pl-9 text-sm"
          placeholder="Buscar por nombre, marca, categoría…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary-50 dark:bg-navy-800 text-xs uppercase tracking-wide text-primary-700 dark:text-primary-300">
              <tr>
                <th className="px-4 py-3 text-left">Producto</th>
                <th className="px-4 py-3 text-left hidden sm:table-cell">Categoría</th>
                <th className="px-4 py-3 text-right">Precio</th>
                <th className="px-4 py-3 text-right hidden md:table-cell">Mayorista</th>
                <th className="px-4 py-3 text-center hidden lg:table-cell">Stock</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-navy-800">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-primary-50/40 dark:hover:bg-navy-850/50 transition-colors">
                  {/* Name */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 rounded-lg object-cover shrink-0 bg-primary-50"
                        onError={e => { e.target.src = 'https://placehold.co/40x40/d8edf8/1285b5?text=A' }}
                      />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{p.name}</p>
                        <p className="text-xs text-gray-400">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  {/* Category */}
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="badge-retail">{catLabel(p.category)}</span>
                  </td>
                  {/* Price */}
                  <td className="px-4 py-3 text-right font-semibold text-gray-900 dark:text-white">
                    ${p.price.toLocaleString('es-AR')}
                  </td>
                  {/* Wholesale */}
                  <td className="px-4 py-3 text-right hidden md:table-cell text-yellow-600 dark:text-yellow-400 font-medium">
                    ${p.wholesalePrice.toLocaleString('es-AR')}
                  </td>
                  {/* Stock */}
                  <td className="px-4 py-3 text-center hidden lg:table-cell">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      p.stock > 20 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : p.stock > 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  {/* Status badges */}
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1 justify-center">
                      {p.isFeatured && <span className="text-[10px] font-bold bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 px-1.5 py-0.5 rounded-full">★ Dest.</span>}
                      {p.isOffer    && <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 px-1.5 py-0.5 rounded-full">-{p.offerPercent}%</span>}
                    </div>
                  </td>
                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-navy-800 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-navy-700 flex items-center justify-center transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setConfirm(p.id)}
                        className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 flex items-center justify-center transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

        </>
      )}

      {/* ──────────── Add / Edit Modal ──────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-8 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl w-full max-w-2xl border border-primary-100 dark:border-navy-700 mb-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-navy-800">
              <h2 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                {modal === 'add' ? <><Plus size={20} className="text-primary-600" /> Agregar Producto</> : <><Edit2 size={20} className="text-primary-600" /> Editar Producto</>}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-navy-800 transition-colors">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-blue-200 uppercase tracking-wide mb-1">Nombre *</label>
                  <input className="input" placeholder="Nombre del producto" value={form.name} onChange={e => f('name', e.target.value)} required />
                </div>
                {/* Brand */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-blue-200 uppercase tracking-wide mb-1">Marca</label>
                  <select className="input" value={form.brand} onChange={e => f('brand', e.target.value)}>
                    {BRANDS.map(b => <option key={b}>{b}</option>)}
                    <option value="__new__">+ Nueva marca</option>
                  </select>
                </div>
                {/* Category */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-blue-200 uppercase tracking-wide mb-1">Categoría</label>
                  <select className="input" value={form.category} onChange={e => f('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                  </select>
                </div>
                {/* Description */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-blue-200 uppercase tracking-wide mb-1">Descripción</label>
                  <textarea className="input min-h-[70px] resize-none" placeholder="Descripción del producto…" value={form.description} onChange={e => f('description', e.target.value)} />
                </div>
                {/* Price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-blue-200 uppercase tracking-wide mb-1">Precio Retail *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" className="input pl-7" placeholder="0" min="0" value={form.price} onChange={e => f('price', e.target.value)} required />
                  </div>
                </div>
                {/* Wholesale price */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-blue-200 uppercase tracking-wide mb-1">Precio Mayorista *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" className="input pl-7" placeholder="0" min="0" value={form.wholesalePrice} onChange={e => f('wholesalePrice', e.target.value)} required />
                  </div>
                </div>
                {/* Stock */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-blue-200 uppercase tracking-wide mb-1">Stock</label>
                  <input type="number" className="input" placeholder="0" min="0" value={form.stock} onChange={e => f('stock', e.target.value)} />
                </div>
                {/* Rating */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-blue-200 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Star size={11} className="text-yellow-400 fill-yellow-400" /> Rating (1–5)
                  </label>
                  <input type="number" className="input" placeholder="4.5" min="1" max="5" step="0.1" value={form.rating} onChange={e => f('rating', e.target.value)} />
                </div>
                {/* Image URL */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-blue-200 uppercase tracking-wide mb-1">URL de Imagen</label>
                  <input className="input" placeholder="https://…" value={form.image} onChange={e => f('image', e.target.value)} />
                  {form.image && (
                    <img src={form.image} alt="preview" className="mt-2 h-20 w-20 object-cover rounded-lg border border-primary-100 dark:border-navy-700"
                      onError={e => e.target.style.display = 'none'} />
                  )}
                </div>
                {/* Tags */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-blue-200 uppercase tracking-wide mb-1">Tags (separados por coma)</label>
                  <input className="input" placeholder="difusor, lavanda, natural…" value={Array.isArray(form.tags) ? form.tags.join(', ') : form.tags} onChange={e => f('tags', e.target.value)} />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-4 pt-2 border-t border-gray-100 dark:border-navy-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isFeatured} onChange={e => f('isFeatured', e.target.checked)}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-blue-200">⭐ Producto Destacado</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.isOffer} onChange={e => f('isOffer', e.target.checked)}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-blue-200">🏷 En Oferta</span>
                </label>
                {form.isOffer && (
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600 dark:text-blue-200">% Descuento:</label>
                    <input type="number" min="1" max="90" className="input w-20 text-sm py-1.5" value={form.offerPercent}
                      onChange={e => f('offerPercent', e.target.value)} />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="btn-ghost flex-1 border border-gray-200 dark:border-navy-700">
                  Cancelar
                </button>
                <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <Save size={16} />
                  {modal === 'add' ? 'Agregar Producto' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ──────────── Delete Confirm ──────────── */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-red-200 dark:border-red-900/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <Trash2 size={20} className="text-red-500" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Eliminar Producto</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-blue-200 mb-5">
              ¿Estás seguro? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirm(null)} className="btn-ghost flex-1 border border-gray-200 dark:border-navy-700">Cancelar</button>
              <button onClick={() => handleDelete(confirm)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                <Trash2 size={15} /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ──────────── Reset Confirm ──────────── */}
      {resetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-yellow-200 dark:border-yellow-900/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <RefreshCw size={20} className="text-yellow-600" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">Restaurar Catálogo</h3>
            </div>
            <p className="text-sm text-gray-600 dark:text-blue-200 mb-5">
              Se restaurarán los productos originales. Se perderán todos los cambios realizados.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setResetConfirm(false)} className="btn-ghost flex-1 border border-gray-200 dark:border-navy-700">Cancelar</button>
              <button onClick={() => { setResetConfirm(false); handleSeed(true) }}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                <RefreshCw size={15} /> Restaurar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
