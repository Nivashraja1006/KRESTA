import React, { useState, useEffect } from 'react';
import { Truck, Plus, Star, Mail, Phone, MapPin, Clock, Search } from 'lucide-react';
import apiClient from '../../api/client';
import { Supplier } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  // New Supplier Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [leadTime, setLeadTime] = useState(2);
  const [rating, setRating] = useState(4.8);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSuppliers = async () => {
    setIsLoading(true);
    try {
      const resp = await apiClient.get<Supplier[]>('/suppliers/');
      setSuppliers(resp.data);
    } catch (e) {
      console.error('Failed to load suppliers:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleCreateSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.post('/suppliers/', {
        name,
        contact_person: contactPerson,
        email,
        phone,
        lead_time_days: leadTime,
        rating
      });
      setIsModalOpen(false);
      setName('');
      fetchSuppliers();
    } catch (e: any) {
      alert(e.response?.data?.detail || 'Failed to create supplier');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = suppliers.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Suppliers & Vendor Partners</h1>
          <p className="text-sm text-slate-400 mt-1">Manage vendor lead times, quality ratings, and supply contact information.</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Plus size={16} />}
        >
          Add Supplier Vendor
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-2.5 text-slate-500" size={15} />
        <input
          type="text"
          placeholder="Search suppliers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-brand-500"
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((sup) => (
          <div
            key={sup.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700/80 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-white tracking-tight">{sup.name}</h3>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-bold bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/20">
                  <Star size={12} fill="currentColor" />
                  <span>{sup.rating.toFixed(1)}</span>
                </div>
              </div>

              <p className="text-xs text-brand-400 font-semibold mb-4">Contact: {sup.contact_person || 'Representative'}</p>

              <div className="space-y-2 text-xs text-slate-400">
                {sup.email && (
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-500" />
                    <span>{sup.email}</span>
                  </div>
                )}
                {sup.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-slate-500" />
                    <span>{sup.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-slate-400" />
                <span>Lead Time: <strong className="text-white">{sup.lead_time_days} days</strong></span>
              </span>
              <span className="text-emerald-400 font-semibold">Active Vendor</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Supplier Vendor"
        subtitle="Record vendor delivery lead times for automated inventory replenishment math"
      >
        <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Company Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Golden Grain Mills"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>
          <div>
            <label className="text-slate-300 font-semibold mb-1 block">Contact Person</label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              placeholder="e.g. Arthur Pendelton"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="orders@goldengrain.com"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 101-2001"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Lead Time (Days)</label>
              <input
                type="number"
                value={leadTime}
                onChange={(e) => setLeadTime(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold mb-1 block">Vendor Rating (1-5)</label>
              <input
                type="number"
                step="0.1"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-white"
              />
            </div>
          </div>
          <Button
            type="submit"
            variant="primary"
            size="md"
            className="w-full mt-3"
            isLoading={isSubmitting}
          >
            Save Supplier
          </Button>
        </form>
      </Modal>
    </div>
  );
};
