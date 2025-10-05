'use client';
import React, { useState, useEffect } from 'react';
import { HiPlus, HiX, HiStar, HiCheckCircle, HiExclamationCircle, HiInformationCircle } from 'react-icons/hi';

interface EventFormData {
  title: string;
  date: string;
  type: 'eclipse' | 'meteor' | 'comet' | 'planetary' | 'aurora' | 'launch' | 'conjunction' | 'opposition';
  description: string;
  image: string;
  images: string[];
  visibility: {
    rating: number;
    conditions: string;
    bestTime: string;
    duration: string;
  };
  location: {
    name: string;
    coordinates: string;
    hemisphere: 'northern' | 'southern' | 'global';
    timezone: string;
  };
  scientific: {
    magnitude?: number;
    distance?: string;
    size?: string;
    speed?: string;
  };
}

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface FieldError {
  field: string;
  message: string;
}

const initialFormData: EventFormData = {
  title: '',
  date: '',
  type: 'eclipse',
  description: '',
  image: '',
  images: [],
  visibility: {
    rating: 3,
    conditions: '',
    bestTime: '',
    duration: ''
  },
  location: {
    name: '',
    coordinates: '',
    hemisphere: 'global',
    timezone: ''
  },
  scientific: {
    magnitude: undefined,
    distance: '',
    size: '',
    speed: ''
  }
};

export default function AdminPanel() {
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [saving, setSaving] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [isDirty, setIsDirty] = useState(false);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(toast => toast.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const validateForm = (): boolean => {
    const newErrors: FieldError[] = [];

    if (!formData.title.trim()) {
      newErrors.push({ field: 'title', message: 'Title is required' });
    }

    if (!formData.date) {
      newErrors.push({ field: 'date', message: 'Date is required' });
    }

    if (!formData.description.trim()) {
      newErrors.push({ field: 'description', message: 'Description is required' });
    } else if (formData.description.length < 50) {
      newErrors.push({ field: 'description', message: 'Description should be at least 50 characters' });
    }

    if (!formData.image.trim()) {
      newErrors.push({ field: 'image', message: 'Main image URL is required' });
    } else if (!isValidUrl(formData.image)) {
      newErrors.push({ field: 'image', message: 'Please enter a valid URL' });
    }

    formData.images.forEach((img, idx) => {
      if (img && !isValidUrl(img)) {
        newErrors.push({ field: `images.${idx}`, message: `Image ${idx + 1} URL is invalid` });
      }
    });

    if (formData.location.coordinates && !isValidCoordinates(formData.location.coordinates)) {
      newErrors.push({ field: 'location.coordinates', message: 'Invalid coordinates format (e.g., 40.7128, -74.0060)' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const isValidCoordinates = (coords: string): boolean => {
    const pattern = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
    return pattern.test(coords);
  };

  const getFieldError = (field: string): string | undefined => {
    return errors.find(err => err.field === field)?.message;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIsDirty(true);
    
    // Clear error for this field
    setErrors(prev => prev.filter(err => err.field !== name));
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setFormData(prev => {
        const sectionKey = section as keyof EventFormData;

        // safely treat nested section as a loose object for updates
        const currentSection = (prev[sectionKey] as Record<string, any>) || {};

        // coerce numeric magnitude to number
        const parsedValue = section === 'scientific' && field === 'magnitude'
          ? (value ? parseFloat(value) : undefined)
          : value;

        const updatedSection: Record<string, any> = {
          ...currentSection,
          [field]: parsedValue
        };

        return {
          ...prev,
          [sectionKey]: updatedSection
        } as EventFormData;
      });
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleImageAdd = () => {
    if (formData.images.length < 4) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, '']
      }));
      setIsDirty(true);
      addToast('info', 'New image field added');
    } else {
      addToast('error', 'Maximum 4 additional images allowed');
    }
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
    setIsDirty(true);
    setErrors(prev => prev.filter(err => err.field !== `images.${index}`));
  };

  const handleImageRemove = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
    setIsDirty(true);
    addToast('info', 'Image removed');
  };

  const handleReset = () => {
    if (isDirty) {
      if (confirm('Are you sure you want to reset the form? All unsaved changes will be lost.')) {
        setFormData(initialFormData);
        setErrors([]);
        setIsDirty(false);
        addToast('info', 'Form reset successfully');
      }
    } else {
      setFormData(initialFormData);
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToast('error', 'Please fix all validation errors before submitting');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/events/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to create event');
      }

      addToast('success', 'Event created successfully! 🎉');
      setFormData(initialFormData);
      setIsDirty(false);
      setErrors([]);
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : 'Failed to create event. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white p-4 sm:p-8">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-lg shadow-2xl backdrop-blur-sm border animate-slide-in ${
              toast.type === 'success'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : toast.type === 'error'
                ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                : 'bg-blue-500/20 border-blue-500/50 text-blue-300'
            }`}
          >
            {toast.type === 'success' && <HiCheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            {toast.type === 'error' && <HiExclamationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            {toast.type === 'info' && <HiInformationCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
            <span className="flex-1 text-sm">{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-current hover:opacity-70 transition-opacity"
            >
              <HiX className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-light mb-2">
            Create <span className="text-emerald-400 font-medium">Cosmic Event</span>
          </h1>
          <p className="text-gray-400 text-sm">Add new celestial events to the SpaceY platform</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-emerald-400 rounded-full"></div>
              <h2 className="text-xl font-semibold text-emerald-400">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Total Solar Eclipse 2025"
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    getFieldError('title')
                      ? 'border-rose-500/50 focus:ring-rose-500/50'
                      : 'border-white/10 focus:ring-emerald-500/50'
                  }`}
                />
                {getFieldError('title') && (
                  <p className="mt-1 text-xs text-rose-400">{getFieldError('title')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Type <span className="text-rose-400">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                >
                  <option value="eclipse">Eclipse</option>
                  <option value="meteor">Meteor Shower</option>
                  <option value="comet">Comet</option>
                  <option value="planetary">Planetary Event</option>
                  <option value="aurora">Aurora</option>
                  <option value="launch">Space Launch</option>
                  <option value="conjunction">Conjunction</option>
                  <option value="opposition">Opposition</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Date & Time <span className="text-rose-400">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 transition-all ${
                    getFieldError('date')
                      ? 'border-rose-500/50 focus:ring-rose-500/50'
                      : 'border-white/10 focus:ring-emerald-500/50'
                  }`}
                />
                {getFieldError('date') && (
                  <p className="mt-1 text-xs text-rose-400">{getFieldError('date')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Main Image URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    getFieldError('image')
                      ? 'border-rose-500/50 focus:ring-rose-500/50'
                      : 'border-white/10 focus:ring-emerald-500/50'
                  }`}
                />
                {getFieldError('image') && (
                  <p className="mt-1 text-xs text-rose-400">{getFieldError('image')}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-rose-400">*</span>
                <span className="text-xs text-gray-500 ml-2">
                  ({formData.description.length} characters)
                </span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Provide a detailed description of the cosmic event..."
                className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all resize-none ${
                  getFieldError('description')
                    ? 'border-rose-500/50 focus:ring-rose-500/50'
                    : 'border-white/10 focus:ring-emerald-500/50'
                }`}
              />
              {getFieldError('description') && (
                <p className="mt-1 text-xs text-rose-400">{getFieldError('description')}</p>
              )}
            </div>
          </div>

          {/* Additional Images */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1 h-6 bg-emerald-400 rounded-full"></div>
                <h2 className="text-xl font-semibold text-emerald-400">Additional Images</h2>
                <span className="text-xs text-gray-500">({formData.images.length}/4)</span>
              </div>
              <button
                type="button"
                onClick={handleImageAdd}
                disabled={formData.images.length >= 4}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-300 rounded-lg hover:bg-emerald-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiPlus className="w-4 h-4" />
                Add Image
              </button>
            </div>

            {formData.images.length === 0 ? (
              <div className="text-center py-8 text-gray-500 text-sm">
                No additional images added yet. Click "Add Image" to include more visuals.
              </div>
            ) : (
              <div className="space-y-3">
                {formData.images.map((url, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-1">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder={`Image ${index + 1} URL`}
                        className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                          getFieldError(`images.${index}`)
                            ? 'border-rose-500/50 focus:ring-rose-500/50'
                            : 'border-white/10 focus:ring-emerald-500/50'
                        }`}
                      />
                      {getFieldError(`images.${index}`) && (
                        <p className="mt-1 text-xs text-rose-400">{getFieldError(`images.${index}`)}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleImageRemove(index)}
                      className="p-2.5 bg-rose-500/20 text-rose-300 rounded-lg hover:bg-rose-500/30 transition-all"
                      title="Remove image"
                    >
                      <HiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Visibility Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-emerald-400 rounded-full"></div>
              <h2 className="text-xl font-semibold text-emerald-400">Visibility Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Visibility Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          visibility: { ...prev.visibility, rating }
                        }));
                        setIsDirty(true);
                      }}
                      className={`p-2 transition-all hover:scale-110 ${
                        rating <= formData.visibility.rating ? 'text-yellow-400' : 'text-gray-600'
                      }`}
                    >
                      <HiStar className="w-7 h-7" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-400">
                    ({formData.visibility.rating}/5)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Viewing Conditions</label>
                <input
                  type="text"
                  name="visibility.conditions"
                  value={formData.visibility.conditions}
                  onChange={handleChange}
                  placeholder="e.g., Clear skies, minimal light pollution"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Best Viewing Time</label>
                <input
                  type="text"
                  name="visibility.bestTime"
                  value={formData.visibility.bestTime}
                  onChange={handleChange}
                  placeholder="e.g., 10:30 PM - 2:00 AM"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration</label>
                <input
                  type="text"
                  name="visibility.duration"
                  value={formData.visibility.duration}
                  onChange={handleChange}
                  placeholder="e.g., 3 hours 45 minutes"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-emerald-400 rounded-full"></div>
              <h2 className="text-xl font-semibold text-emerald-400">Location Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Location Name</label>
                <input
                  type="text"
                  name="location.name"
                  value={formData.location.name}
                  onChange={handleChange}
                  placeholder="e.g., North America, Europe"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Coordinates</label>
                <input
                  type="text"
                  name="location.coordinates"
                  value={formData.location.coordinates}
                  onChange={handleChange}
                  placeholder="e.g., 40.7128, -74.0060"
                  className={`w-full bg-black/30 border rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-all ${
                    getFieldError('location.coordinates')
                      ? 'border-rose-500/50 focus:ring-rose-500/50'
                      : 'border-white/10 focus:ring-emerald-500/50'
                  }`}
                />
                {getFieldError('location.coordinates') && (
                  <p className="mt-1 text-xs text-rose-400">{getFieldError('location.coordinates')}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Hemisphere</label>
                <select
                  name="location.hemisphere"
                  value={formData.location.hemisphere}
                  onChange={handleChange}
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                >
                  <option value="global">Global</option>
                  <option value="northern">Northern</option>
                  <option value="southern">Southern</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Timezone</label>
                <input
                  type="text"
                  name="location.timezone"
                  value={formData.location.timezone}
                  onChange={handleChange}
                  placeholder="e.g., UTC-5, EST"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Scientific Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-emerald-400 rounded-full"></div>
              <h2 className="text-xl font-semibold text-emerald-400">Scientific Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Magnitude</label>
                <input
                  type="number"
                  step="0.1"
                  name="scientific.magnitude"
                  value={formData.scientific.magnitude || ''}
                  onChange={handleChange}
                  placeholder="e.g., -4.5"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Distance</label>
                <input
                  type="text"
                  name="scientific.distance"
                  value={formData.scientific.distance}
                  onChange={handleChange}
                  placeholder="e.g., 384,400 km"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Size</label>
                <input
                  type="text"
                  name="scientific.size"
                  value={formData.scientific.size}
                  onChange={handleChange}
                  placeholder="e.g., 12.5 km diameter"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Speed</label>
                <input
                  type="text"
                  name="scientific.speed"
                  value={formData.scientific.speed}
                  onChange={handleChange}
                  placeholder="e.g., 58 km/s"
                  className="w-full bg-black/30 border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg font-semibold transition-all duration-200"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating Event...
                </span>
              ) : (
                'Create Event'
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 flex items-start gap-3">
            <HiInformationCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-200">
              <p className="font-semibold mb-1">Tips for creating events:</p>
              <ul className="space-y-1 text-blue-300/80">
                <li>• Use high-quality images (at least 1200px wide recommended)</li>
                <li>• Provide detailed descriptions to engage users (minimum 50 characters)</li>
                <li>• Include accurate timing and location information for better visibility</li>
                <li>• Scientific details help astronomers and enthusiasts plan their observations</li>
              </ul>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}