'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, IdCard, Phone, ArrowRight, Smartphone, Loader2 } from 'lucide-react';
import { apiClient } from '../lib/api'; // Asegúrate que la ruta sea correcta
import { useNotification } from '../contexts/NotificationContext';

export default function RegisterPage() {
  const router = useRouter();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    dni: '',
    email: '',
    phone_number: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // El backend exige DNI de 8 dígitos y obtiene el nombre desde RENIEC
    if (!/^\d{8}$/.test(formData.dni)) {
        showNotification('El DNI debe tener 8 dígitos', 'warning');
        setLoading(false);
        return;
    }

    // Validación simple de celular
    if (formData.phone_number.length !== 9) {
        showNotification('El celular debe tener 9 dígitos', 'warning');
        setLoading(false);
        return;
    }

    try {
      await apiClient.post('/auth/register', formData);
      
      showNotification('¡Cuenta creada con éxito! Ahora inicia sesión.', 'success');
      router.push('/login'); // Redirigir al login en lugar del dashboard directo

    } catch (err: any) {
      const msg = err.message.includes('already registered') 
        ? 'Este correo o celular ya está registrado.' 
        : err.message;
      showNotification(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4">
      <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border border-slate-700">
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h1>
          <p className="text-slate-400">Únete a Pixel Money</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* DNI */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <IdCard className="h-5 w-5 text-slate-500" />
            </div>
            <input
              name="dni"
              type="text"
              inputMode="numeric"
              required
              placeholder="DNI"
              className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.dni}
              onChange={handleChange}
              maxLength={8}
            />
          </div>

          {/* Email */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-slate-500" />
            </div>
            <input
              name="email"
              type="email"
              required
              placeholder="Correo Electrónico"
              className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          {/* Celular */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-slate-500" />
            </div>
            <input
              name="phone_number"
              type="tel"
              required
              placeholder="Número de Celular"
              className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.phone_number}
              onChange={handleChange}
              maxLength={9}
            />
          </div>

          {/* Password */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-500" />
            </div>
            <input
              name="password"
              type="password"
              required
              placeholder="Contraseña"
              className="block w-full pl-11 pr-4 py-3.5 bg-slate-900/50 border border-slate-600 rounded-xl text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Registrarse'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-slate-400 text-sm">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-blue-400 hover:text-blue-300 font-semibold transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}