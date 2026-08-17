import React, { useState, useRef, useEffect } from 'react';
import { HudAdminLayout } from '../../components/HudAdminLayout';
import { useQuiz } from '../../context/QuizContext';
import { api } from '../../services/api';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Image as ImageIcon, X, FolderKanban, Tag, Loader2, Layers, Sparkles } from 'lucide-react';

function useTilt(ref, maxDeg = 8) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width;
      const py = (e.clientY - r.top) / r.height;
      el.style.transform = `rotateX(${(py - .5) * -2 * maxDeg}deg) rotateY(${(px - .5) * 2 * maxDeg}deg) translateZ(6px)`;
      el.style.setProperty('--mx', px * 100 + '%');
      el.style.setProperty('--my', py * 100 + '%');
    };
    const onLeave = () => { el.style.transform = 'rotateX(0) rotateY(0) translateZ(0)'; };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => { el.removeEventListener('mousemove', onMove); el.removeEventListener('mouseleave', onLeave); };
  }, [ref, maxDeg]);
}

const AdminCategoryCard = ({ cat, coverImage, onEdit, onDelete }) => {
  const cardRef = useRef(null);
  useTilt(cardRef, 8);
  const quizCount = cat.count || 0;
  const isUrl = (str) => str && (str.startsWith('http') || str.startsWith('/') || str.startsWith('data:'));

  return (
    <div ref={cardRef} className="brackets tilt metal clip-hud overflow-hidden flex flex-col h-full" style={{ transformStyle: 'preserve-3d' }}>
      <div className="shine" />
      <div className="pop flex flex-col h-full">
        {/* Banner */}
        <div className="q-banner !h-40 relative overflow-hidden">
          {isUrl(coverImage) ? (
            <img src={coverImage} alt={cat.name} className="absolute inset-0 h-full w-full object-cover opacity-40 q-thumb" />
          ) : (
            <span className="q-thumb pop select-none text-5xl">{coverImage || '📁'}</span>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

          <span className="absolute top-3 left-3 hud-badge bg-black/60 text-yellow-300 border border-yellow-400/30 flex items-center gap-1.5">
            <Tag className="w-3 h-3" />
            CATEGORY
          </span>

          <span className="absolute top-3 right-3 hud-badge" style={{
            background: 'rgba(251,191,36,.12)',
            color: '#fde047',
            border: '1px solid rgba(251,191,36,.35)'
          }}>
            <Layers className="w-3 h-3" />
            {quizCount} QUIZZES
          </span>
        </div>

        {/* Body */}
        <div className="p-5 flex-grow flex flex-col">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="q-title font-orbitron font-bold text-base tracking-wide text-white">
              {cat.name}
            </h3>
            <span className="font-orbitron text-[9px] tracking-widest text-zinc-600 mt-1 shrink-0">
              ID-{String(cat.id || '').slice(-3).toUpperCase()}
            </span>
          </div>

          <p className="text-sm text-zinc-400 clamp2 mb-4 flex-grow leading-relaxed">
            {cat.description || 'No description configured for this domain.'}
          </p>

          {/* Stats bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-[9px] font-orbitron tracking-[.2em] uppercase text-zinc-500 mb-1.5">
              <span>Domain Saturation</span>
              <span className="text-neon-yellow">{Math.min(100, quizCount * 8)}%</span>
            </div>
            <div className="micro-bar">
              <div
                className="micro-fill bg-gradient-to-r from-yellow-400 to-amber-500 animated"
                style={{ width: `${Math.min(100, quizCount * 8)}%` }}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-black/30 border border-white/5 clip-hud-sm p-2.5 flex items-center gap-2">
              <FolderKanban className="w-3.5 h-3.5 text-neon-yellow" />
              <div className="flex-grow min-w-0">
                <div className="font-orbitron font-black text-[11px] text-white truncate">{quizCount} Active</div>
                <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase">Assessments</div>
              </div>
            </div>
            <button
              onClick={() => onEdit(cat)}
              className="p-2.5 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-yellow-300 hover:border-yellow-400/40 transition-all"
              title="Edit Category"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(cat.id)}
              className="p-2.5 clip-hud-sm bg-black/35 border border-white/10 text-zinc-400 hover:text-rose-400 hover:border-rose-400/40 transition-all"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <span className="bk bk-tl" />
      <span className="bk bk-br" />
    </div>
  );
};

export const AdminCategoriesPage = () => {
  const { categories, refreshData } = useQuiz();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });
  const [saving, setSaving] = useState(false);

  const getCategoryCoverImage = (cat) => {
    if (cat.image) return cat.image;
    const name = (cat.name || '').toLowerCase();
    if (name.includes('javascript') || name.includes('js')) return 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80';
    if (name.includes('react')) return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80';
    if (name.includes('cyber') || name.includes('security') || name.includes('crypto')) return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80';
    if (name.includes('python')) return 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80';
    if (name.includes('network') || name.includes('computer')) return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80';
    if (name.includes('database') || name.includes('sql')) return 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80';
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80';
  };

  const totalQuizzes = categories.reduce((s, c) => s + (c.count || 0), 0);
  const avgQuizzes = categories.length > 0 ? Math.round(totalQuizzes / categories.length) : 0;

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({ id: cat.id, name: cat.name, description: cat.description, image: cat.image || '' });
    } else {
      setEditingCategory(null);
      setFormData({ name: '', description: '', image: '' });
    }
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
      } else {
        await api.addCategory(formData);
      }
      await refreshData();
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.deleteCategory(id);
        await refreshData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  return (
    <HudAdminLayout>
      <div className="relative w-full px-0 pb-12" style={{ paddingTop: 0 }}>
        <div className="relative">

          {/* ═══ HEADER ═══ */}
          <div className="relative mb-5">
            <div className="hex-divider mb-4" />
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 hud-badge" style={{ background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.3)' }}>
                  <span className="pulse-dot" style={{ background: '#fbbf24', boxShadow: '0 0 10px #fbbf24' }} />
                  <span className="font-orbitron text-[10px] tracking-[.35em] uppercase text-neon-yellow">
                    Admin · Taxonomy Vault
                  </span>
                </div>
                <h1 className="font-orbitron font-black text-2xl sm:text-3xl md:text-4xl tracking-tight mt-2">
                  <span className="chrome-text">DOMAIN&nbsp;</span>
                  <span className="grad-yellow" style={{ filter: 'drop-shadow(0 0 20px rgba(251,191,36,.5))' }}>CLASSIFIER</span>
                </h1>
                <p className="text-zinc-400 font-light text-xs sm:text-sm max-w-2xl mt-1.5 leading-relaxed">
                  Organize assessment domains, craft rich taxonomies, and manage category cover art. Every quiz belongs to a domain.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenModal()}
                  className="relative px-5 py-3 clip-hud-sm font-orbitron text-[10px] tracking-[.22em] font-bold text-black flex items-center gap-2 overflow-hidden transition-all hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(120deg, #fde047, #f59e0b)', boxShadow: '0 0 30px -6px rgba(251,191,36,.7), inset 0 1px 0 rgba(255,255,255,.3)' }}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  NEW DOMAIN
                </button>
              </div>
            </div>
            <div className="hex-divider" />
          </div>

          {/* ═══ QUICK STATS STRIP ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <div className="brackets metal clip-hud p-3 relative">
              <span className="bk bk-tl" /><span className="bk bk-br" />
              <div className="shine" />
              <div className="pop flex items-center gap-3">
                <div className="diamond flex items-center justify-center" style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#fde047,#f59e0b)' }}>
                  <FolderKanban className="w-4 h-4 text-black" style={{ transform: 'rotate(-45deg)' }} />
                </div>
                <div className="min-w-0">
                  <div className="font-orbitron font-black text-xl text-white leading-none">{categories.length}</div>
                  <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase mt-0.5">Total Domains</div>
                </div>
              </div>
            </div>

            <div className="brackets metal clip-hud p-3 relative">
              <span className="bk bk-tl" /><span className="bk bk-br" />
              <div className="shine" />
              <div className="pop flex items-center gap-3">
                <div className="diamond flex items-center justify-center" style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#fbbf24,#d97706)' }}>
                  <Layers className="w-4 h-4 text-black" style={{ transform: 'rotate(-45deg)' }} />
                </div>
                <div className="min-w-0">
                  <div className="font-orbitron font-black text-xl text-white leading-none">{totalQuizzes}</div>
                  <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase mt-0.5">Linked Quizzes</div>
                </div>
              </div>
            </div>

            <div className="brackets metal clip-hud p-3 relative">
              <span className="bk bk-tl" /><span className="bk bk-br" />
              <div className="shine" />
              <div className="pop flex items-center gap-3">
                <div className="diamond flex items-center justify-center" style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#facc15,#b45309)' }}>
                  <Tag className="w-4 h-4 text-black" style={{ transform: 'rotate(-45deg)' }} />
                </div>
                <div className="min-w-0">
                  <div className="font-orbitron font-black text-xl text-white leading-none">{avgQuizzes}</div>
                  <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase mt-0.5">Avg / Domain</div>
                </div>
              </div>
            </div>

            <div className="brackets metal clip-hud p-3 relative">
              <span className="bk bk-tl" /><span className="bk bk-br" />
              <div className="shine" />
              <div className="pop flex items-center gap-3">
                <div className="diamond flex items-center justify-center" style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#fef08a,#ca8a04)' }}>
                  <Sparkles className="w-4 h-4 text-black" style={{ transform: 'rotate(-45deg)' }} />
                </div>
                <div className="min-w-0">
                  <div className="font-orbitron font-black text-xl text-white leading-none">
                    {categories.filter(c => c.image).length}
                  </div>
                  <div className="font-orbitron text-[7px] tracking-[.2em] text-zinc-500 uppercase mt-0.5">Cover Art Live</div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══ CATEGORIES GRID ═══ */}
          {categories.length === 0 ? (
            <div className="metal clip-hud p-16 text-center brackets">
              <div className="shine" />
              <div className="pop">
                <div className="w-16 h-16 diamond mx-auto mb-5 flex items-center justify-center" style={{ background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.3)' }}>
                  <FolderKanban className="w-7 h-7 text-neon-yellow" style={{ transform: 'rotate(-45deg)' }} />
                </div>
                <p className="font-orbitron text-sm tracking-[.25em] text-white uppercase mb-2">No Taxonomy Configured</p>
                <p className="text-zinc-500 text-sm mb-5">Click NEW DOMAIN to create your first assessment category.</p>
                <button
                  onClick={() => handleOpenModal()}
                  className="px-5 py-2.5 clip-hud-sm font-orbitron text-[10px] tracking-[.2em] font-bold text-black"
                  style={{ background: 'linear-gradient(120deg, #fde047, #f59e0b)' }}
                >
                  <Plus className="w-3.5 h-3.5 inline mr-2" /> CREATE FIRST DOMAIN
                </button>
              </div>
              <span className="bk bk-tl" /><span className="bk bk-br" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: 1200 }}>
              {categories.map((cat) => (
                <AdminCategoryCard
                  key={cat.id}
                  cat={cat}
                  coverImage={getCategoryCoverImage(cat)}
                  onEdit={handleOpenModal}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ═══ MODAL ═══ */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,.85)', backdropFilter: 'blur(6px)' }}>
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="w-full max-w-lg relative brackets metal clip-hud overflow-hidden"
            style={{ background: '#08080b' }}
          >
            <div className="shine" />
            <div className="pop p-6 space-y-5">
              {/* Modal Header */}
              <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/5">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 hud-badge mb-2" style={{ background: 'rgba(251,191,36,.1)', border: '1px solid rgba(251,191,36,.25)' }}>
                    <Sparkles className="w-3 h-3 text-neon-yellow" />
                    <span className="font-orbitron text-[9px] tracking-[.3em] uppercase text-neon-yellow">
                      {editingCategory ? 'Edit Operation' : 'Creation Protocol'}
                    </span>
                  </div>
                  <h3 className="font-orbitron font-black text-xl tracking-tight">
                    <span className="chrome-text">{editingCategory ? 'EDIT&nbsp;' : 'NEW&nbsp;'}</span>
                    <span className="grad-yellow">DOMAIN</span>
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 clip-hud-sm bg-black/40 border border-white/10 text-zinc-500 hover:text-white hover:border-yellow-400/40 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="block font-orbitron uppercase text-[9px] tracking-[.25em] text-zinc-500">
                    Domain Name <span className="text-neon-yellow">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Advanced Cryptography"
                    className="hud-input w-full clip-hud-sm px-4 py-3 text-xs font-orbitron tracking-wide outline-none"
                    autoFocus
                  />
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <label className="block font-orbitron uppercase text-[9px] tracking-[.25em] text-zinc-500">
                    Domain Overview <span className="text-neon-yellow">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe the assessment domain, topics covered, and target skill level…"
                    className="hud-input w-full clip-hud-sm px-4 py-3 text-xs tracking-wide outline-none resize-none"
                  />
                </div>

                {/* Image URL */}
                <div className="space-y-1.5">
                  <label className="block font-orbitron uppercase text-[9px] tracking-[.25em] text-zinc-500">
                    Cover Image URL <span className="text-zinc-600 font-normal">(optional)</span>
                  </label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-…"
                      className="hud-input w-full clip-hud-sm pl-10 pr-4 py-3 text-xs font-orbitron tracking-wide outline-none"
                    />
                  </div>
                  <p className="text-[9px] font-orbitron tracking-[.2em] text-zinc-600 uppercase pt-1">
                    ⚡ Leave blank to auto-generate a thematic cover from Unsplash
                  </p>
                </div>

                {/* Preview hint */}
                {formData.image && (
                  <div className="relative h-24 clip-hud-sm overflow-hidden border border-white/10">
                    <img src={formData.image} alt="preview" className="w-full h-full object-cover opacity-50" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                      <span className="font-orbitron text-[9px] tracking-[.25em] uppercase text-zinc-300">Cover Preview</span>
                    </div>
                  </div>
                )}

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn-steel px-5 py-2.5 clip-hud-sm font-orbitron text-[10px] tracking-[.2em] font-bold"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="relative px-6 py-2.5 clip-hud-sm font-orbitron text-[10px] tracking-[.2em] font-bold text-black flex items-center gap-2 overflow-hidden disabled:opacity-60"
                    style={{ background: 'linear-gradient(120deg, #fde047, #f59e0b)', boxShadow: '0 0 20px -4px rgba(251,191,36,.6)' }}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        COMMITTING…
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        {editingCategory ? 'SAVE CHANGES' : 'CREATE DOMAIN'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            <span className="bk bk-tl" /><span className="bk-bk-tr" style={{ display: 'none' }} />
            <span className="bk bk-bl" /><span className="bk bk-br" />
          </motion.div>
        </div>
      )}
    </HudAdminLayout>
  );
};

export default AdminCategoriesPage;
