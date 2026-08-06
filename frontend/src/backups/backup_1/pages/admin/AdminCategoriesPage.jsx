import React, { useState } from 'react';
import { AdminSidebar } from '../../components/AdminSidebar';
import { useQuiz } from '../../context/QuizContext';
import { api } from '../../services/api';
import { Plus, Edit, Trash2, Layers, Image as ImageIcon } from 'lucide-react';

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
    <div className="min-h-screen bg-[#10141a] flex">
      <AdminSidebar />

      <main className="flex-grow p-6 sm:p-8 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Category <span className="text-[#38BDF8]">Management</span>
            </h1>
            <p className="mt-1 text-sm text-[#88929b] font-mono">
              Organize assessment domains and topics with rich cover pictures
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="px-5 py-2.5 rounded-xl bg-[#38BDF8] text-[#10141a] font-bold text-xs hover:bg-[#38BDF8]/90 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </button>
        </div>

        {/* Categories Grid with Cover Picture Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div key={cat.id} className="glass-panel glass-panel-hover rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between group">
              {/* Cover Picture Banner Header */}
              <div className="relative h-44 w-full overflow-hidden bg-[#181c22]">
                <img
                  src={getCategoryCoverImage(cat)}
                  alt={cat.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#181c22] via-[#181c22]/40 to-transparent" />
                
                {/* Quiz Count Badge */}
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-mono font-medium border border-[#38BDF8]/30 bg-[#10141a]/80 text-[#38BDF8] backdrop-blur-md">
                  {cat.count || 0} Quizzes
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white group-hover:text-[#38BDF8] transition-colors">{cat.name}</h3>
                  <p className="text-xs text-[#88929b] line-clamp-2 leading-relaxed">{cat.description}</p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenModal(cat)}
                    className="p-2 rounded-lg bg-[#262a31] text-[#dfe2eb] hover:bg-[#38BDF8] hover:text-[#10141a] transition-all"
                    title="Edit Category"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    className="p-2 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
                    title="Delete Category"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
            <h3 className="text-xl font-bold text-white">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[#88929b] uppercase font-mono mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Machine Learning"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-[#88929b] uppercase font-mono mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter domain overview..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#10141a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="block text-[#88929b] uppercase font-mono mb-1">Cover Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#88929b]" />
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-[#10141a] border border-white/10 text-white text-sm focus:outline-none focus:border-[#38BDF8]"
                  />
                </div>
                <p className="text-[10px] text-[#88929b] mt-1">Leave empty to use default domain cover picture</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#262a31] text-white hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#38BDF8] text-[#10141a] font-bold hover:bg-[#38BDF8]/90"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
