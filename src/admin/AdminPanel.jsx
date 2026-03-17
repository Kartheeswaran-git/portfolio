import React, { useState, useEffect } from 'react';
import { useData } from '../contexts/DataContext';
import { FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaProjectDiagram, FaTools, FaUserTie, FaBars, FaTimes, FaCheckCircle, FaExclamationCircle, FaStar, FaLink, FaFlask, FaUpload, FaSpinner } from 'react-icons/fa';
import './AdminPanel.css';
import { normalizeImageUrl } from '../utils/imageLinks';
import { compressImage } from '../utils/compression';

const SCHEMAS = {
  projects: ['title', 'abstract', 'description', 'longDescription', 'toolsUsed', 'videoLink', 'images', 'tags', 'github', 'demo'],
  technicalExplorations: ['title', 'abstract', 'description', 'longDescription', 'toolsUsed', 'videoLink', 'images', 'tags', 'github', 'demo'],
  skills: ['name', 'level', 'category'],
  roles: ['title', 'company', 'duration', 'description'],
  headlines: ['text'],
  links: ['resume', 'github', 'linkedin', 'email']
};

const SECTION_LABELS = {
  projects: { plural: 'Projects', singular: 'Project' },
  technicalExplorations: { plural: 'Technical Explorations', singular: 'Technical Exploration' },
  skills: { plural: 'Skills', singular: 'Skill' },
  roles: { plural: 'Work History', singular: 'Role' },
  headlines: { plural: 'Profile Headlines', singular: 'Headline' },
  links: { plural: 'Profile Links', singular: 'Link' },
};

const SECTION_ICONS = {
  projects: FaProjectDiagram,
  technicalExplorations: FaFlask,
  skills: FaTools,
  roles: FaUserTie,
  headlines: FaStar,
  links: FaLink,
};

const AdminPanel = () => {
  const { data, loading, updateData, login, isAuthenticated, logout, authUser, error: dataError } = useData();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('projects');
  const [editItem, setEditItem] = useState(null);
  const [editIndex, setEditIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingStatus, setUploadingStatus] = useState({}); // Track progress per index
  const [isDragActive, setIsDragActive] = useState(false);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center">
        <div className="loading-spinner mb-4"></div>
        <p className="text-slate-500 font-medium">Loading Dashboard...</p>
      </div>
    </div>
  );

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-slate-100 max-w-sm">
        <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Sync Error</h2>
        <p className="text-slate-600 mb-6">We couldn't load your portfolio data. Please check your connection.</p>
        <button onClick={() => window.location.reload()} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all">
          Retry Connection
        </button>
      </div>
    </div>
  );

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (!result.success) {
      setNotification({ type: 'error', message: result.error || 'Login failed' });
    }
  };

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const section = activeTab;
    let newData = { ...data };

    try {
      if (section === 'links') {
         // Links is just a single object now, not an array
         newData[section] = { ...editItem };
      }
      else if (isAdding) {
        const newItem = { ...editItem, id: Date.now().toString() };
        newData[section] = Array.isArray(newData[section]) ? [...newData[section], newItem] : [newItem];
      } else {
        newData[section] = newData[section].map((item, index) =>
          index === editIndex ? { ...editItem } : item
        );
      }

      const result = await updateData(newData);
      if (result.success) {
        showNotification('success', `${SECTION_LABELS[activeTab]?.singular || 'Item'} saved successfully!`);
        setEditItem(null);
        setIsAdding(false);
      } else {
        showNotification('error', result.error || 'Failed to save data');
      }
    } catch (err) {
      showNotification('error', 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item permanently?')) return;
    
    const section = activeTab;
    let newData = { ...data };
    newData[section] = newData[section].filter(item => item.id !== id);
    
    const result = await updateData(newData);
    if (result.success) {
      showNotification('success', 'Item deleted');
    } else {
      showNotification('error', 'Delete failed');
    }
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Process each file
    const currentImages = editItem.images || [];
    const newImages = [...currentImages];
    const startIdx = newImages.length;

    // Add placeholders for loading
    files.forEach((_, i) => {
      setUploadingStatus(prev => ({ ...prev, [startIdx + i]: 10 }));
    });

    try {
      const uploadPromises = files.map(async (file, i) => {
        const idx = startIdx + i;
        try {
          console.log(`Processing file ${idx}:`, file.name);
          setUploadingStatus(prev => ({ ...prev, [idx]: 30 }));
          
          const base64String = await compressImage(file, { maxWidth: 1000, quality: 0.6 });
          
          setUploadingStatus(prev => ({ ...prev, [idx]: 100 }));
          
          // Clear status after brief delay
          setTimeout(() => {
            setUploadingStatus(prev => {
              const newState = { ...prev };
              delete newState[idx];
              return newState;
            });
          }, 800);

          return base64String;
        } catch (err) {
          console.error(`Error processing file ${idx}:`, err);
          setUploadingStatus(prev => {
            const newState = { ...prev };
            delete newState[idx];
            return newState;
          });
          return null;
        }
      });

      const processedImages = await Promise.all(uploadPromises);
      const validImages = processedImages.filter(img => img !== null);
      
      if (validImages.length > 0) {
        setEditItem({ ...editItem, images: [...newImages, ...validImages] });
        showNotification('success', `Added ${validImages.length} images successfully`);
      }
    } catch (error) {
      console.error('Multi-upload failed:', error);
      showNotification('error', 'Image processing failed');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md border border-slate-100 fade-in">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FaUserTie className="text-indigo-600 text-3xl" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Admin Panel</h2>
            <p className="text-slate-500">Welcome back! Please sign in to manage your portfolio.</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100"
            >
              Sign In to Dashboard
            </button>
            {dataError && (
              <div className="flex items-center justify-center text-red-500 text-sm bg-red-50 py-2 rounded-lg">
                <FaExclamationCircle className="mr-2" /> {dataError}
              </div>
            )}
          </form>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'projects', label: 'Projects', icon: FaProjectDiagram },
    { id: 'technicalExplorations', label: 'Technical Explorations', icon: FaFlask },
    { id: 'skills', label: 'Skills', icon: FaTools },
    { id: 'roles', label: 'Work History', icon: FaUserTie },
    { id: 'headlines', label: 'Profile Headlines', icon: FaStar },
    { id: 'links', label: 'Profile Links', icon: FaLink },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-slate-100 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-white font-bold">P</span>
              </div>
              <h1 className="text-xl font-black tracking-tight text-slate-800">PORTFOLIO</h1>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setEditItem(null);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 rounded-xl font-semibold transition-all group ${
                    active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`mr-3 text-lg ${active ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  {item.label}
                  {active && <div className="ml-auto w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
                </button>
              );
            })}
          </nav>
          <div className="p-6 border-t border-slate-100">
            <button
              onClick={logout}
              className="w-full flex items-center px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-semibold"
            >
              <FaSignOutAlt className="mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 overflow-hidden flex flex-col">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-6 sm:px-10 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 mr-4 text-slate-500 hover:text-slate-900"
            >
              <FaBars className="text-xl" />
            </button>
            <h2 className="text-2xl font-bold text-slate-800">
              {SECTION_LABELS[activeTab]?.plural || activeTab}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-slate-800">{authUser?.email?.split('@')[0]}</span>
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Administrator</span>
            </div>
            <div className="w-10 h-10 bg-slate-100 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-slate-600">
              {authUser?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 sm:p-10">
          {notification && (
            <div className={`mb-8 flex items-center gap-3 p-4 rounded-2xl border fade-in ${
              notification.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-red-50 border-red-100 text-red-700'
            }`}>
              {notification.type === 'success' ? <FaCheckCircle className="shrink-0" /> : <FaExclamationCircle className="shrink-0" />}
              <span className="font-semibold text-sm">{notification.message}</span>
            </div>
          )}

          {/* Action Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {activeTab === 'links' ? 'Profile Links Configuration' : 'Content Management'}
              </h3>
              <p className="text-sm text-slate-500">
                {activeTab === 'links' ? 'Update your main contact and social URLs here.' : 'Update your portfolio information in real-time.'}
              </p>
            </div>
            {!editItem && activeTab !== 'links' && (
              <button
                onClick={() => { setEditItem({}); setIsAdding(true); }}
                className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 shrink-0"
              >
                <FaPlus className="mr-2" />
                Add New {SECTION_LABELS[activeTab]?.singular || 'Item'}
              </button>
            )}
            {!editItem && activeTab === 'links' && (
              <button
                onClick={() => { setEditItem(data.links || {}); setIsAdding(false); }}
                className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-100 shrink-0"
              >
                <FaEdit className="mr-2" />
                Edit Links
              </button>
            )}
          </div>

          {/* Form Modal Overlay (Simulated with a card) */}
          {editItem && (
            <div className="mb-10 fade-in">
              <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="text-lg font-bold text-slate-800">
                    {isAdding
                      ? `Create New ${SECTION_LABELS[activeTab]?.singular || 'Item'}`
                      : `Update ${SECTION_LABELS[activeTab]?.singular || 'Item'}`}
                  </h4>
                  <button onClick={() => setEditItem(null)} className="p-2 text-slate-400 hover:text-slate-600">
                    <FaTimes />
                  </button>
                </div>
                <form onSubmit={handleSave} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {SCHEMAS[activeTab].map(key => {
                      if (key === 'images') {
                        return (
                          <div key={key} className="md:col-span-2 space-y-4">
                            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                              Image Gallery <span className="text-xs font-normal text-slate-400">(Upload or paste links)</span>
                            </label>
                            
                            {/* Dropzone Area */}
                            <div 
                              className={`dropzone ${isDragActive ? 'active' : ''}`}
                              onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
                              onDragLeave={() => setIsDragActive(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragActive(false);
                                handleFileUpload({ target: { files: e.dataTransfer.files } });
                              }}
                              onClick={() => document.getElementById('multi-upload-input').click()}
                            >
                              <input 
                                type="file" 
                                id="multi-upload-input" 
                                className="hidden" 
                                multiple 
                                accept="image/*"
                                onChange={handleFileUpload}
                              />
                              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-1">
                                <FaUpload className="text-xl" />
                              </div>
                              <p className="font-bold text-slate-700">Drop images here or click to upload</p>
                              <p className="text-xs text-slate-400">Supports JPG, PNG, WEBP (Multiselect allowed)</p>
                            </div>

                            {/* Image Grid */}
                            {(editItem.images && editItem.images.length > 0) && (
                              <div className="image-grid">
                                {editItem.images.map((img, i) => (
                                  <div key={i} className="image-item group">
                                    <img src={img} alt={`Gallery ${i}`} />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newImages = editItem.images.filter((_, idx) => idx !== i);
                                        setEditItem({ ...editItem, images: newImages });
                                      }}
                                      className="image-delete-btn"
                                      title="Remove image"
                                    >
                                      <FaTrash size={12} />
                                    </button>
                                    {uploadingStatus[i] !== undefined && (
                                      <div className="upload-overlay">
                                        <FaSpinner className="animate-spin text-indigo-600 mb-2" />
                                        <div className="px-2 w-full">
                                          <div className="progress-pill">
                                            <div className="progress-fill" style={{ width: `${uploadingStatus[i]}%` }}></div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* URL Option Section */}
                            <div className="space-y-3 pt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const currentImages = editItem.images || [];
                                  setEditItem({ ...editItem, images: [...currentImages, ''] });
                                }}
                                className="text-xs bg-slate-100 text-slate-600 px-3 py-2 rounded-lg font-bold hover:bg-slate-200 transition-all flex items-center gap-1.5"
                              >
                                <FaLink className="text-xs" /> Add Manual URL
                              </button>

                              {editItem.images && editItem.images.some(url => url.startsWith('http')) && (
                                <div className="space-y-2">
                                  {editItem.images.map((img, i) => img.startsWith('http') ? (
                                    <div key={i} className="flex gap-2 animate-fadeIn">
                                      <input
                                        type="text"
                                        value={img}
                                        onChange={(e) => {
                                          const newImages = [...editItem.images];
                                          newImages[i] = normalizeImageUrl(e.target.value);
                                          setEditItem({ ...editItem, images: newImages });
                                        }}
                                        className="flex-1 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm"
                                        placeholder="Paste image URL here..."
                                      />
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const newImages = editItem.images.filter((_, idx) => idx !== i);
                                          setEditItem({ ...editItem, images: newImages });
                                        }}
                                        className="p-2.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                      >
                                        <FaTrash size={14} />
                                      </button>
                                    </div>
                                  ) : null)}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                      return (
                        <div key={key} className={['description', 'longDescription', 'videoLink'].includes(key) ? 'md:col-span-2' : ''}>
                          <label className="block text-sm font-bold text-slate-700 mb-2 capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </label>
                          {['description', 'longDescription', 'abstract', 'toolsUsed', 'videoLink'].includes(key) ? (
                            <textarea
                              value={editItem[key] || ''}
                              onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                              placeholder={`Enter ${key}...`}
                              rows="4"
                            />
                          ) : (
                            <input
                              type="text"
                              value={editItem[key] || ''}
                              onChange={(e) => setEditItem({ ...editItem, [key]: e.target.value })}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
                              placeholder={`Enter ${key}...`}
                            />
                          )}
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditItem(null)}
                      className="px-6 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-10 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSaving ? 'Saving Changes...' : 'Save Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Records Grid */}
          {activeTab !== 'links' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {(Array.isArray(data[activeTab]) ? data[activeTab] : []).map((item, index) => (
                <div key={item.id || index} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all duration-300 fade-in">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        {React.createElement(SECTION_ICONS[activeTab] || FaUserTie)}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => { setEditItem(item); setEditIndex(index); setIsAdding(false); }}
                          className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-indigo-50 hover:text-indigo-600"
                          title="Edit Item"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 bg-slate-50 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600"
                          title="Delete Item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-800 mb-2 truncate">
                      {item.title || item.name || item.text || item.type}
                    </h4>
                    <p className="text-slate-500 text-sm mb-6 line-clamp-3 leading-relaxed flex-1">
                      {item.description || item.level || item.company || item.url}
                    </p>
                    <div className="pt-4 border-t border-slate-50 flex items-center justify-between mt-auto">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        ID: {item.id ? item.id.toString().slice(-4) : 'NEW'}
                      </span>
                      {item.level && (
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded uppercase">
                          {item.level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {(Array.isArray(data[activeTab]) ? data[activeTab] : []).length === 0 && (
                <div className="col-span-full py-20 bg-white border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <FaPlus className="text-2xl" />
                  </div>
                  <p className="font-bold">No {SECTION_LABELS[activeTab]?.plural || activeTab} yet. Start by adding one!</p>
                </div>
              )}
            </div>
          )}
          
          {/* Output for Links */}
          {activeTab === 'links' && !editItem && (
             <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-2xl mx-auto fade-in">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-bold">
                    <FaLink />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">Current Links</h4>
                    <p className="text-sm text-slate-500">These URLs control the buttons on your main landing page.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  {SCHEMAS.links.map(key => (
                    <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                      <div className="sm:w-32 font-bold text-slate-700 capitalize flex items-center gap-2">
                        {key === 'email' ? '✉️' : key === 'github' ? '💻' : key === 'linkedin' ? '🤝' : '📄'} {key}
                      </div>
                      <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-600 truncate">
                        {data.links?.[key] || <span className="text-slate-400 italic">Not set</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => { setEditItem(data.links || {}); setIsAdding(false); }}
                  className="mt-8 w-full py-4 border-2 border-dashed border-indigo-200 text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                >
                  <FaEdit />
                  Update Links
                </button>
             </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;
