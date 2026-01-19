import React, { useState, useEffect } from 'react';
import { User, Users, Calendar, FileText, LogOut, Plus, Search, ArrowLeft, Save, Trash2, Edit, Eye, ChevronRight, Lock } from 'lucide-react';

// Storage utility functions using localStorage
const storage = {
  async get(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  },
  async set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  async delete(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  async list(prefix) {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return keys;
    } catch {
      return [];
    }
  }
};

// Body Schema Component with clickable zones
const BodySchema = ({ selectedZones = [], onZoneClick, view = 'front' }) => {
  const zones = {
    front: [
      { id: 'head_front', name: 'Tête', path: 'M 95 25 Q 95 10, 110 10 Q 125 10, 125 25 Q 125 45, 110 50 Q 95 45, 95 25', cx: 110, cy: 30 },
      { id: 'neck_front', name: 'Cou', path: 'M 102 50 L 118 50 L 115 65 L 105 65 Z', cx: 110, cy: 57 },
      { id: 'shoulder_left', name: 'Épaule gauche', path: 'M 70 70 Q 85 65, 95 70 L 95 85 Q 80 80, 70 85 Z', cx: 82, cy: 77 },
      { id: 'shoulder_right', name: 'Épaule droite', path: 'M 125 70 Q 135 65, 150 70 L 150 85 Q 140 80, 125 85 Z', cx: 138, cy: 77 },
      { id: 'chest_left', name: 'Thorax gauche', path: 'M 95 70 L 110 70 L 110 120 L 95 120 Z', cx: 102, cy: 95 },
      { id: 'chest_right', name: 'Thorax droit', path: 'M 110 70 L 125 70 L 125 120 L 110 120 Z', cx: 118, cy: 95 },
      { id: 'abdomen_left', name: 'Abdomen gauche', path: 'M 95 120 L 110 120 L 110 170 L 95 170 Z', cx: 102, cy: 145 },
      { id: 'abdomen_right', name: 'Abdomen droit', path: 'M 110 120 L 125 120 L 125 170 L 110 170 Z', cx: 118, cy: 145 },
      { id: 'hip_left', name: 'Hanche gauche', path: 'M 85 170 L 105 170 L 100 195 L 85 195 Z', cx: 95, cy: 182 },
      { id: 'hip_right', name: 'Hanche droite', path: 'M 115 170 L 135 170 L 135 195 L 120 195 Z', cx: 125, cy: 182 },
      { id: 'arm_left_upper', name: 'Bras gauche', path: 'M 65 85 L 80 85 L 75 140 L 60 140 Z', cx: 70, cy: 112 },
      { id: 'arm_right_upper', name: 'Bras droit', path: 'M 140 85 L 155 85 L 160 140 L 145 140 Z', cx: 150, cy: 112 },
      { id: 'arm_left_lower', name: 'Avant-bras gauche', path: 'M 55 140 L 75 140 L 70 195 L 50 195 Z', cx: 62, cy: 167 },
      { id: 'arm_right_lower', name: 'Avant-bras droit', path: 'M 145 140 L 165 140 L 170 195 L 150 195 Z', cx: 158, cy: 167 },
      { id: 'hand_left', name: 'Main gauche', path: 'M 45 195 L 70 195 L 65 220 L 40 220 Z', cx: 55, cy: 207 },
      { id: 'hand_right', name: 'Main droite', path: 'M 150 195 L 175 195 L 180 220 L 155 220 Z', cx: 165, cy: 207 },
      { id: 'thigh_left', name: 'Cuisse gauche', path: 'M 85 195 L 105 195 L 100 270 L 85 270 Z', cx: 95, cy: 232 },
      { id: 'thigh_right', name: 'Cuisse droite', path: 'M 115 195 L 135 195 L 135 270 L 120 270 Z', cx: 127, cy: 232 },
      { id: 'knee_left', name: 'Genou gauche', path: 'M 85 270 L 100 270 L 100 295 L 85 295 Z', cx: 92, cy: 282 },
      { id: 'knee_right', name: 'Genou droit', path: 'M 120 270 L 135 270 L 135 295 L 120 295 Z', cx: 127, cy: 282 },
      { id: 'leg_left', name: 'Jambe gauche', path: 'M 85 295 L 100 295 L 98 370 L 87 370 Z', cx: 92, cy: 332 },
      { id: 'leg_right', name: 'Jambe droite', path: 'M 120 295 L 135 295 L 133 370 L 122 370 Z', cx: 127, cy: 332 },
      { id: 'foot_left', name: 'Pied gauche', path: 'M 82 370 L 100 370 L 100 390 L 78 390 Z', cx: 90, cy: 380 },
      { id: 'foot_right', name: 'Pied droit', path: 'M 120 370 L 138 370 L 142 390 L 120 390 Z', cx: 130, cy: 380 },
    ],
    back: [
      { id: 'head_back', name: 'Tête (dos)', path: 'M 95 25 Q 95 10, 110 10 Q 125 10, 125 25 Q 125 45, 110 50 Q 95 45, 95 25', cx: 110, cy: 30 },
      { id: 'neck_back', name: 'Nuque', path: 'M 102 50 L 118 50 L 115 65 L 105 65 Z', cx: 110, cy: 57 },
      { id: 'cervical', name: 'Cervicales', path: 'M 105 55 L 115 55 L 115 75 L 105 75 Z', cx: 110, cy: 65 },
      { id: 'trapeze_left', name: 'Trapèze gauche', path: 'M 70 70 Q 85 65, 100 70 L 100 95 Q 80 90, 70 95 Z', cx: 85, cy: 82 },
      { id: 'trapeze_right', name: 'Trapèze droit', path: 'M 120 70 Q 135 65, 150 70 L 150 95 Q 140 90, 120 95 Z', cx: 135, cy: 82 },
      { id: 'thoracic_upper', name: 'Dorsales hautes', path: 'M 100 75 L 120 75 L 120 105 L 100 105 Z', cx: 110, cy: 90 },
      { id: 'thoracic_mid', name: 'Dorsales moyennes', path: 'M 100 105 L 120 105 L 120 135 L 100 135 Z', cx: 110, cy: 120 },
      { id: 'thoracic_lower', name: 'Dorsales basses', path: 'M 100 135 L 120 135 L 120 160 L 100 160 Z', cx: 110, cy: 147 },
      { id: 'scapula_left', name: 'Omoplate gauche', path: 'M 75 85 L 98 85 L 98 130 L 75 130 Z', cx: 86, cy: 107 },
      { id: 'scapula_right', name: 'Omoplate droite', path: 'M 122 85 L 145 85 L 145 130 L 122 130 Z', cx: 134, cy: 107 },
      { id: 'lumbar', name: 'Lombaires', path: 'M 95 160 L 125 160 L 125 195 L 95 195 Z', cx: 110, cy: 177 },
      { id: 'sacrum', name: 'Sacrum', path: 'M 100 195 L 120 195 L 118 220 L 102 220 Z', cx: 110, cy: 207 },
      { id: 'gluteal_left', name: 'Fessier gauche', path: 'M 80 195 L 105 195 L 100 240 L 80 240 Z', cx: 92, cy: 217 },
      { id: 'gluteal_right', name: 'Fessier droit', path: 'M 115 195 L 140 195 L 140 240 L 120 240 Z', cx: 127, cy: 217 },
      { id: 'arm_left_upper_back', name: 'Bras gauche (dos)', path: 'M 55 85 L 73 85 L 68 140 L 50 140 Z', cx: 62, cy: 112 },
      { id: 'arm_right_upper_back', name: 'Bras droit (dos)', path: 'M 147 85 L 165 85 L 170 140 L 152 140 Z', cx: 158, cy: 112 },
      { id: 'arm_left_lower_back', name: 'Avant-bras gauche (dos)', path: 'M 45 140 L 68 140 L 63 195 L 40 195 Z', cx: 54, cy: 167 },
      { id: 'arm_right_lower_back', name: 'Avant-bras droit (dos)', path: 'M 152 140 L 175 140 L 180 195 L 157 195 Z', cx: 166, cy: 167 },
      { id: 'thigh_left_back', name: 'Cuisse gauche (dos)', path: 'M 80 240 L 105 240 L 100 300 L 82 300 Z', cx: 92, cy: 270 },
      { id: 'thigh_right_back', name: 'Cuisse droite (dos)', path: 'M 115 240 L 140 240 L 138 300 L 120 300 Z', cx: 127, cy: 270 },
      { id: 'calf_left', name: 'Mollet gauche', path: 'M 82 300 L 100 300 L 98 370 L 84 370 Z', cx: 91, cy: 335 },
      { id: 'calf_right', name: 'Mollet droit', path: 'M 120 300 L 138 300 L 136 370 L 122 370 Z', cx: 129, cy: 335 },
      { id: 'heel_left', name: 'Talon gauche', path: 'M 84 370 L 98 370 L 98 390 L 84 390 Z', cx: 91, cy: 380 },
      { id: 'heel_right', name: 'Talon droit', path: 'M 122 370 L 136 370 L 136 390 L 122 390 Z', cx: 129, cy: 380 },
    ]
  };

  const currentZones = zones[view];

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 220 400" className="w-full max-w-xs h-auto">
        {/* Body outline */}
        <ellipse cx="110" cy="30" rx="18" ry="22" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" />
        <rect x="100" y="50" width="20" height="18" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" />
        <path d="M 70 68 L 95 68 L 95 175 L 85 195 L 70 195 Q 55 195, 55 175 L 55 85 Q 55 68, 70 68" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" />
        <path d="M 150 68 L 125 68 L 125 175 L 135 195 L 150 195 Q 165 195, 165 175 L 165 85 Q 165 68, 150 68" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" />
        <rect x="95" y="68" width="30" height="107" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" />
        <path d="M 85 195 L 100 195 L 100 390 L 85 390 Z" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" />
        <path d="M 120 195 L 135 195 L 135 390 L 120 390 Z" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" />
        <path d="M 55 85 L 70 85 L 50 200 L 35 200 Z" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" />
        <path d="M 150 85 L 165 85 L 185 200 L 170 200 Z" fill="#f5f5f5" stroke="#ccc" strokeWidth="1" />

        {/* Clickable zones */}
        {currentZones.map((zone) => (
          <path
            key={zone.id}
            d={zone.path}
            fill={selectedZones.includes(zone.id) ? '#ef4444' : 'transparent'}
            fillOpacity={selectedZones.includes(zone.id) ? 0.5 : 0}
            stroke={selectedZones.includes(zone.id) ? '#dc2626' : '#94a3b8'}
            strokeWidth={selectedZones.includes(zone.id) ? 2 : 1}
            className="cursor-pointer hover:fill-blue-200 hover:fill-opacity-50 transition-all"
            onClick={() => onZoneClick(zone.id)}
          />
        ))}
      </svg>
      <p className="text-sm text-gray-500 mt-2">
        {view === 'front' ? 'Vue de face' : 'Vue de dos'} - Cliquez sur les zones concernées
      </p>
    </div>
  );
};

// Zone names mapping
const zoneNames = {
  head_front: 'Tête', neck_front: 'Cou', shoulder_left: 'Épaule gauche', shoulder_right: 'Épaule droite',
  chest_left: 'Thorax gauche', chest_right: 'Thorax droit', abdomen_left: 'Abdomen gauche', abdomen_right: 'Abdomen droit',
  hip_left: 'Hanche gauche', hip_right: 'Hanche droite', arm_left_upper: 'Bras gauche', arm_right_upper: 'Bras droit',
  arm_left_lower: 'Avant-bras gauche', arm_right_lower: 'Avant-bras droit', hand_left: 'Main gauche', hand_right: 'Main droite',
  thigh_left: 'Cuisse gauche', thigh_right: 'Cuisse droite', knee_left: 'Genou gauche', knee_right: 'Genou droit',
  leg_left: 'Jambe gauche', leg_right: 'Jambe droite', foot_left: 'Pied gauche', foot_right: 'Pied droit',
  head_back: 'Tête (dos)', neck_back: 'Nuque', cervical: 'Cervicales', trapeze_left: 'Trapèze gauche',
  trapeze_right: 'Trapèze droit', thoracic_upper: 'Dorsales hautes', thoracic_mid: 'Dorsales moyennes',
  thoracic_lower: 'Dorsales basses', scapula_left: 'Omoplate gauche', scapula_right: 'Omoplate droite',
  lumbar: 'Lombaires', sacrum: 'Sacrum', gluteal_left: 'Fessier gauche', gluteal_right: 'Fessier droit',
  arm_left_upper_back: 'Bras gauche (dos)', arm_right_upper_back: 'Bras droit (dos)',
  arm_left_lower_back: 'Avant-bras gauche (dos)', arm_right_lower_back: 'Avant-bras droit (dos)',
  thigh_left_back: 'Cuisse gauche (dos)', thigh_right_back: 'Cuisse droite (dos)',
  calf_left: 'Mollet gauche', calf_right: 'Mollet droit', heel_left: 'Talon gauche', heel_right: 'Talon droit'
};

// Login Component
const LoginPage = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isFirstSetup, setIsFirstSetup] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSetup();
  }, []);

  const checkSetup = async () => {
    const storedHash = await storage.get('osteo_password_hash');
    setIsFirstSetup(!storedHash);
    setLoading(false);
  };

  const hashPassword = async (pwd) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(pwd + 'osteo_salt_2024');
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const handleSetup = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    const hash = await hashPassword(newPassword);
    await storage.set('osteo_password_hash', hash);
    onLogin();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const storedHash = await storage.get('osteo_password_hash');
    const inputHash = await hashPassword(password);
    if (inputHash === storedHash) {
      onLogin();
    } else {
      setError('Mot de passe incorrect');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">OstéoGestion</h1>
          <p className="text-gray-500 mt-2">
            {isFirstSetup ? 'Créez votre mot de passe' : 'Connectez-vous pour accéder à vos patients'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {isFirstSetup ? (
          <form onSubmit={handleSetup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nouveau mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Minimum 6 caractères"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Confirmez votre mot de passe"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Créer mon compte
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Votre mot de passe"
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors"
            >
              Se connecter
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showConsultationForm, setShowConsultationForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadPatients();
    }
  }, [isAuthenticated]);

  const loadPatients = async () => {
    setLoading(true);
    const keys = await storage.list('patient_');
    const patientList = [];
    for (const key of keys) {
      const patient = await storage.get(key);
      if (patient) patientList.push(patient);
    }
    patientList.sort((a, b) => a.lastName.localeCompare(b.lastName));
    setPatients(patientList);
    setLoading(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('patients');
    setSelectedPatient(null);
    setSelectedConsultation(null);
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  const filteredPatients = patients.filter(p =>
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone?.includes(searchTerm)
  );

  // Patient Form Component
  const PatientForm = ({ patient, onSave, onCancel }) => {
    const [form, setForm] = useState(patient || {
      id: `patient_${Date.now()}`,
      firstName: '',
      lastName: '',
      birthDate: '',
      phone: '',
      email: '',
      address: '',
      profession: '',
      medicalHistory: '',
      contraindications: '',
      consultations: [],
      createdAt: new Date().toISOString()
    });

    const handleSubmit = async (e) => {
      e.preventDefault();
      await storage.set(form.id, form);
      await loadPatients();
      onSave(form);
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {patient ? 'Modifier le patient' : 'Nouveau patient'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                required
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input
                type="text"
                required
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                value={form.birthDate}
                onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
              <input
                type="text"
                value={form.profession}
                onChange={(e) => setForm({ ...form, profession: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Antécédents médicaux</label>
            <textarea
              value={form.medicalHistory}
              onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contre-indications</label>
            <textarea
              value={form.contraindications}
              onChange={(e) => setForm({ ...form, contraindications: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Consultation Form Component
  const ConsultationForm = ({ patient, consultation, onSave, onCancel }) => {
    const [form, setForm] = useState(consultation || {
      id: `consultation_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      reason: '',
      painfulZones: [],
      tests: '',
      techniques: '',
      advice: '',
      nextSession: '',
      notes: ''
    });
    const [bodyView, setBodyView] = useState('front');

    const handleZoneClick = (zoneId) => {
      const zones = form.painfulZones || [];
      if (zones.includes(zoneId)) {
        setForm({ ...form, painfulZones: zones.filter(z => z !== zoneId) });
      } else {
        setForm({ ...form, painfulZones: [...zones, zoneId] });
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      const updatedConsultations = consultation
        ? patient.consultations.map(c => c.id === consultation.id ? form : c)
        : [...(patient.consultations || []), form];
      
      const updatedPatient = { ...patient, consultations: updatedConsultations };
      await storage.set(patient.id, updatedPatient);
      await loadPatients();
      onSave(updatedPatient, form);
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {consultation ? 'Modifier la consultation' : 'Nouvelle consultation'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Motif de consultation *</label>
            <textarea
              required
              value={form.reason}
              onChange={(e) => setForm({ ...form, reason: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Douleurs lombaires depuis 2 semaines..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Zones douloureuses</label>
            <div className="flex gap-2 mb-4">
              <button
                type="button"
                onClick={() => setBodyView('front')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  bodyView === 'front' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Face
              </button>
              <button
                type="button"
                onClick={() => setBodyView('back')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  bodyView === 'back' ? 'bg-teal-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Dos
              </button>
            </div>
            <BodySchema
              selectedZones={form.painfulZones}
              onZoneClick={handleZoneClick}
              view={bodyView}
            />
            {form.painfulZones?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {form.painfulZones.map(zone => (
                  <span
                    key={zone}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center gap-1"
                  >
                    {zoneNames[zone] || zone}
                    <button
                      type="button"
                      onClick={() => handleZoneClick(zone)}
                      className="ml-1 hover:text-red-900"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tests effectués</label>
            <textarea
              value={form.tests}
              onChange={(e) => setForm({ ...form, tests: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Test de Lasègue négatif, mobilité L4-L5 réduite..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Techniques utilisées</label>
            <textarea
              value={form.techniques}
              onChange={(e) => setForm({ ...form, techniques: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Manipulation structurelle L4-L5, travail fascial lombaire..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Conseils donnés</label>
            <textarea
              value={form.advice}
              onChange={(e) => setForm({ ...form, advice: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Éviter la position assise prolongée, exercices d'étirement..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prochaine séance recommandée</label>
            <input
              type="text"
              value={form.nextSession}
              onChange={(e) => setForm({ ...form, nextSession: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Ex: Dans 3 semaines, à revoir si douleurs persistantes..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes complémentaires</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-teal-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Enregistrer
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Patient Detail View
  const PatientDetail = ({ patient }) => {
    const deletePatient = async () => {
      if (confirm(`Êtes-vous sûr de vouloir supprimer ${patient.firstName} ${patient.lastName} ?`)) {
        await storage.delete(patient.id);
        await loadPatients();
        setSelectedPatient(null);
        setCurrentView('patients');
      }
    };

    const deleteConsultation = async (consultationId) => {
      if (confirm('Êtes-vous sûr de vouloir supprimer cette consultation ?')) {
        const updatedPatient = {
          ...patient,
          consultations: patient.consultations.filter(c => c.id !== consultationId)
        };
        await storage.set(patient.id, updatedPatient);
        await loadPatients();
        setSelectedPatient(updatedPatient);
      }
    };

    const sortedConsultations = [...(patient.consultations || [])].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    const calculateAge = (birthDate) => {
      if (!birthDate) return null;
      const today = new Date();
      const birth = new Date(birthDate);
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    };

    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {patient.firstName} {patient.lastName}
              </h2>
              {patient.birthDate && (
                <p className="text-gray-500">
                  {calculateAge(patient.birthDate)} ans • Né(e) le {new Date(patient.birthDate).toLocaleDateString('fr-FR')}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditingPatient(patient)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
              <button
                onClick={deletePatient}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {patient.phone && (
              <div>
                <span className="text-gray-500">Téléphone:</span>
                <p className="font-medium">{patient.phone}</p>
              </div>
            )}
            {patient.email && (
              <div>
                <span className="text-gray-500">Email:</span>
                <p className="font-medium">{patient.email}</p>
              </div>
            )}
            {patient.profession && (
              <div>
                <span className="text-gray-500">Profession:</span>
                <p className="font-medium">{patient.profession}</p>
              </div>
            )}
            {patient.address && (
              <div>
                <span className="text-gray-500">Adresse:</span>
                <p className="font-medium">{patient.address}</p>
              </div>
            )}
          </div>

          {patient.medicalHistory && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm text-gray-500 mb-1">Antécédents médicaux</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{patient.medicalHistory}</p>
            </div>
          )}

          {patient.contraindications && (
            <div className="mt-4 pt-4 border-t">
              <h3 className="text-sm text-gray-500 mb-1">Contre-indications</h3>
              <p className="text-red-600 whitespace-pre-wrap">{patient.contraindications}</p>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Consultations ({sortedConsultations.length})
            </h3>
            <button
              onClick={() => setShowConsultationForm(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle consultation
            </button>
          </div>

          {sortedConsultations.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Aucune consultation enregistrée</p>
          ) : (
            <div className="space-y-3">
              {sortedConsultations.map((consultation) => (
                <div
                  key={consultation.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-medium text-gray-800">
                          {new Date(consultation.date).toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">{consultation.reason}</p>
                      {consultation.painfulZones?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {consultation.painfulZones.slice(0, 3).map(zone => (
                            <span key={zone} className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs">
                              {zoneNames[zone] || zone}
                            </span>
                          ))}
                          {consultation.painfulZones.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                              +{consultation.painfulZones.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSelectedConsultation(consultation)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteConsultation(consultation.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Consultation Detail View
  const ConsultationDetail = ({ consultation, patient }) => {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Consultation du {new Date(consultation.date).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <p className="text-gray-500">{patient.firstName} {patient.lastName}</p>
          </div>
          <button
            onClick={() => {
              setSelectedConsultation(null);
              setShowConsultationForm(true);
            }}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Motif de consultation</h3>
            <p className="text-gray-800">{consultation.reason}</p>
          </div>

          {consultation.painfulZones?.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Zones douloureuses</h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {consultation.painfulZones.map(zone => (
                  <span key={zone} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                    {zoneNames[zone] || zone}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 max-w-md">
                <div>
                  <p className="text-xs text-gray-500 text-center mb-1">Face</p>
                  <BodySchema selectedZones={consultation.painfulZones} onZoneClick={() => {}} view="front" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 text-center mb-1">Dos</p>
                  <BodySchema selectedZones={consultation.painfulZones} onZoneClick={() => {}} view="back" />
                </div>
              </div>
            </div>
          )}

          {consultation.tests && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Tests effectués</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{consultation.tests}</p>
            </div>
          )}

          {consultation.techniques && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Techniques utilisées</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{consultation.techniques}</p>
            </div>
          )}

          {consultation.advice && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Conseils donnés</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{consultation.advice}</p>
            </div>
          )}

          {consultation.nextSession && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Prochaine séance recommandée</h3>
              <p className="text-gray-800">{consultation.nextSession}</p>
            </div>
          )}

          {consultation.notes && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Notes complémentaires</h3>
              <p className="text-gray-800 whitespace-pre-wrap">{consultation.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calendar View
  const CalendarView = () => {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    
    const allConsultations = patients.flatMap(p => 
      (p.consultations || []).map(c => ({ ...c, patient: p }))
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    const monthConsultations = allConsultations.filter(c => {
      const consultDate = new Date(c.date);
      return consultDate.getMonth() === selectedMonth.getMonth() &&
             consultDate.getFullYear() === selectedMonth.getFullYear();
    });

    const groupedByDate = monthConsultations.reduce((acc, c) => {
      if (!acc[c.date]) acc[c.date] = [];
      acc[c.date].push(c);
      return acc;
    }, {});

    const prevMonth = () => {
      setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() - 1));
    };

    const nextMonth = () => {
      setSelectedMonth(new Date(selectedMonth.getFullYear(), selectedMonth.getMonth() + 1));
    };

    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold text-gray-800">
            {selectedMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
          </h2>
          <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg rotate-180">
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {Object.keys(groupedByDate).length === 0 ? (
          <p className="text-gray-500 text-center py-8">Aucune consultation ce mois-ci</p>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedByDate)
              .sort(([a], [b]) => new Date(b) - new Date(a))
              .map(([date, consultations]) => (
                <div key={date} className="border-l-4 border-teal-500 pl-4">
                  <h3 className="font-medium text-gray-800 mb-2">
                    {new Date(date).toLocaleDateString('fr-FR', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long'
                    })}
                  </h3>
                  <div className="space-y-2">
                    {consultations.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedPatient(c.patient);
                          setSelectedConsultation(c);
                          setCurrentView('patients');
                        }}
                        className="bg-gray-50 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <p className="font-medium text-gray-800">
                          {c.patient.firstName} {c.patient.lastName}
                        </p>
                        <p className="text-sm text-gray-600 truncate">{c.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    );
  };

  // Main content rendering
  const renderContent = () => {
    if (editingPatient) {
      return (
        <PatientForm
          patient={editingPatient}
          onSave={(p) => {
            setEditingPatient(null);
            setSelectedPatient(p);
          }}
          onCancel={() => setEditingPatient(null)}
        />
      );
    }

    if (showPatientForm) {
      return (
        <PatientForm
          onSave={(p) => {
            setShowPatientForm(false);
            setSelectedPatient(p);
          }}
          onCancel={() => setShowPatientForm(false)}
        />
      );
    }

    if (showConsultationForm && selectedPatient) {
      return (
        <ConsultationForm
          patient={selectedPatient}
          consultation={selectedConsultation}
          onSave={(updatedPatient, consultation) => {
            setShowConsultationForm(false);
            setSelectedPatient(updatedPatient);
            setSelectedConsultation(consultation);
          }}
          onCancel={() => {
            setShowConsultationForm(false);
          }}
        />
      );
    }

    if (selectedConsultation && selectedPatient) {
      return (
        <ConsultationDetail
          consultation={selectedConsultation}
          patient={selectedPatient}
        />
      );
    }

    if (selectedPatient) {
      return <PatientDetail patient={selectedPatient} />;
    }

    if (currentView === 'calendar') {
      return <CalendarView />;
    }

    // Patients list
    return (
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'Aucun patient trouvé' : 'Aucun patient enregistré'}
          </div>
        ) : (
          <div className="divide-y">
            {filteredPatients.map((patient) => (
              <div
                key={patient.id}
                onClick={() => setSelectedPatient(patient)}
                className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                    <span className="text-teal-700 font-medium">
                      {patient.firstName[0]}{patient.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {patient.firstName} {patient.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {patient.consultations?.length || 0} consultation(s)
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {(selectedPatient || showPatientForm || editingPatient) && (
              <button
                onClick={() => {
                  if (showConsultationForm) {
                    setShowConsultationForm(false);
                  } else if (selectedConsultation) {
                    setSelectedConsultation(null);
                  } else if (editingPatient) {
                    setEditingPatient(null);
                  } else if (showPatientForm) {
                    setShowPatientForm(false);
                  } else {
                    setSelectedPatient(null);
                    setSelectedConsultation(null);
                  }
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h1 className="text-xl font-bold text-teal-700">OstéoGestion</h1>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {renderContent()}
      </main>

      {/* Bottom navigation */}
      {!selectedPatient && !showPatientForm && !editingPatient && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
          <div className="max-w-4xl mx-auto px-4 py-2 flex justify-around">
            <button
              onClick={() => setCurrentView('patients')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                currentView === 'patients' ? 'text-teal-600' : 'text-gray-500'
              }`}
            >
              <Users className="w-6 h-6" />
              <span className="text-xs mt-1">Patients</span>
            </button>
            <button
              onClick={() => setShowPatientForm(true)}
              className="flex flex-col items-center p-2 text-white bg-teal-600 rounded-xl -mt-4 shadow-lg"
            >
              <Plus className="w-6 h-6" />
              <span className="text-xs mt-1">Nouveau</span>
            </button>
            <button
              onClick={() => setCurrentView('calendar')}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                currentView === 'calendar' ? 'text-teal-600' : 'text-gray-500'
              }`}
            >
              <Calendar className="w-6 h-6" />
              <span className="text-xs mt-1">Historique</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
