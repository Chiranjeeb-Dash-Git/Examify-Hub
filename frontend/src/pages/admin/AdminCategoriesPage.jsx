import React, { useState } from 'react';
import { AnimatedFluidBackground } from '../../components/landing/AnimatedFluidBackground';
import { useQuiz } from '../../context/QuizContext';
import { api } from '../../services/api';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react';

export const AdminCategoriesPage = () => {
  const { categories, refreshData } = useQuiz();
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', image: '' });

  const getCategoryCoverImage = (cat) => {
    if (cat.image) return cat.image;
    const name = (cat.name || '').toLowerCase();
    
    if (name.includes('javascript') || name.includes('js')) {
      return 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?auto=format&fit=crop&w=600&q=80';
    }
    if (name.includes('react')) {
      return 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80';
    }
    if (name.includes('cyber') || name.includes('security') || name.includes('crypto')) {
      return 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80';
    }
    if (name.includes('python')) {
      return 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=600&q=80';
    }
    if (name.includes('network') || name.includes('computer')) {
      return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=600&q=80';
    }
    if (name.includes('database') || name.includes('sql')) {
      return 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=600&q=80';
    }
    return 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80';
  };

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
    <div className="min-h-screen py-8 pt-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-10">
      <div className="space-y-6">
        {/* Header Title Bar */}
        <div className="liquid-glass rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/10 backdrop-blur-xl">
          <div>
            <h1 
              className="text-3xl sm:text-4xl font-medium text-white tracking-tight"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Assessment Category Domains
            </h1>
            <p className="mt-1 text-xs text-white/60 font-sans">
              Organize assessment domains and topics with rich cover pictures
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleOpenModal()}
            className="px-6 py-2.5 rounded-full bg-white text-black font-medium text-xs hover:bg-white/90 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-white/10"
          >
            <Plus className="h-4 w-4" />
            <span>Add Category</span>
          </motion.button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              whileHover={{ y: -4 }}
              className="liquid-glass rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between backdrop-blur-xl group"
            >
              {/* Cover Picture */}
              <div className="relative h-44 w-full overflow-hidden bg-black">
                <img
                  src={getCategoryCoverImage(cat)}
                  alt={cat.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[11px] font-medium liquid-glass text-white border border-white/20 backdrop-blur-md">
                  {cat.count || 0} Quizzes
                </span>
              </div>

              {/* Body */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-medium text-white leading-snug">{cat.name}</h3>
                  <p className="text-xs text-white/60 line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="p-2 rounded-full liquid-glass text-white/70 hover:text-white transition-all cursor-pointer border border-white/20"
                    title="Edit Category"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-full liquid-glass text-white/70 hover:text-red-400 transition-all cursor-pointer border border-white/20"
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md liquid-glass p-6 rounded-3xl border border-white/20 space-y-6 bg-black/90">
            <h3 className="text-2xl font-medium text-white" style={{ fontFamily: "'Instrument Serif', serif" }}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Machine Learning"
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter domain overview..."
                  className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-white/60 uppercase text-[10px] tracking-wider">Cover Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-9 pr-3.5 py-3 rounded-2xl bg-white/[0.03] border border-white/10 text-white text-xs focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 rounded-full liquid-glass text-white/80 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-white text-black font-medium uppercase tracking-wider hover:bg-white/90"
                >
                  Save Category
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};
