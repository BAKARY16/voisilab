const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Nettoyer le localStorage au démarrage si corrompu
try {
  const userStr = localStorage.getItem('user');
  if (userStr && (userStr === 'undefined' || userStr === 'null')) {
    console.warn('🧹 Nettoyage localStorage corrompu');
    localStorage.removeItem('user');
  }
} catch (error) {
  console.error('Erreur lors du nettoyage localStorage:', error);
}

// Fonction utilitaire pour gérer les réponses et détecter les erreurs d'authentification
const handleResponse = async (response) => {
  if (response.status === 401) {
    console.warn('🔒 Session expirée - déconnexion automatique');
    // Déconnecter l'utilisateur
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Rediriger vers la page de connexion
    window.location.href = '/login';
    throw new Error('Session expirée. Veuillez vous reconnecter.');
  }
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }
  
  // Vérifier si la réponse a du contenu
  const text = await response.text();
  if (!text || text.trim() === '') {
    return {};
  }
  
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Erreur de parsing JSON:', text);
    throw new Error('Réponse serveur invalide');
  }
};

// Auth Service
export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await handleResponse(response);
    
    if (!data || !data.token || !data.user) {
      throw new Error('Réponse de connexion invalide');
    }
    
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    console.log('✅ Connexion réussie:', data.user.email);
    return data;
  },

  async verifyToken() {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        this.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error('Erreur vérification token:', error);
      this.logout();
      return false;
    }
  },

  async getProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Non authentifié');
    }
    
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await handleResponse(response);
    console.log('📡 getProfile data:', data);
    
    // Backend retourne { user: {...} }
    if (data && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async updateProfile(profileData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Non authentifié');
    }
    
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(profileData)
    });
    const data = await handleResponse(response);
    console.log('📡 updateProfile data:', data);
    
    // Backend retourne { message: ..., user: {...} }
    if (data && data.user) {
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  },

  async changePassword(currentPassword, newPassword) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        current_password: currentPassword, 
        new_password: newPassword 
      })
    });
    return handleResponse(response);
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      localStorage.removeItem('user');
      return null;
    }
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Erreur parsing user depuis localStorage:', error);
      localStorage.removeItem('user');
      return null;
    }
  }
};

// Generic API Client
class ApiClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
  }

  async getAll(params = {}) {
    const token = localStorage.getItem('token');
    const url = new URL(`${API_URL}${this.endpoint}`);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const response = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  }

  async getById(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${this.endpoint}/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  }

  async create(data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${this.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }

  async update(id, data) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${this.endpoint}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    return handleResponse(response);
  }

  async delete(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${this.endpoint}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  }

  async updateStatus(id, status, notes = null) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${this.endpoint}/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ status, review_notes: notes })
    });
    return handleResponse(response);
  }

  async downloadFile(submissionId, filename) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}${this.endpoint}/${submissionId}/files/${filename}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) throw new Error('Erreur de téléchargement');
    return response.blob();
  }
}

// Services pour chaque entité
export const blogService = new ApiClient('/api/blog');
export const projectsService = new ApiClient('/api/projects');
export const ppnService = new ApiClient('/api/ppn');
export const workshopsService = new ApiClient('/api/workshops');
export const equipmentService = new ApiClient('/api/equipment');
export const mediaService = new ApiClient('/api/media');
export const teamService = new ApiClient('/api/team');
export const servicesApiService = new ApiClient('/api/services');
export const contactsService = new ApiClient('/api/contacts');
export const projectSubmissionsService = new ApiClient('/api/project-submissions');
export const usersService = new ApiClient('/api/users');
export const pagesService = new ApiClient('/api/pages');
export const settingsService = new ApiClient('/api/settings');

// Service spécial pour les statistiques du dashboard
export const statsService = {
  async getDashboard() {
    const token = localStorage.getItem('token');
    console.log('📡 Appel API stats/dashboard');
    console.log('📡 URL:', `${API_URL}/api/stats`);
    console.log('📡 Token:', token ? 'Présent' : 'Absent');
    
    const response = await fetch(`${API_URL}/api/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('📡 Statut réponse:', response.status, response.statusText);
    return handleResponse(response);
  },

  async getByPeriod(period) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/stats/period/${period}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  }
};

// Service pour les notifications
export const notificationsService = {
  async getAll(unreadOnly = false) {
    const token = localStorage.getItem('token');
    const url = new URL(`${API_URL}/api/notifications`);
    if (unreadOnly) {
      url.searchParams.append('unread_only', 'true');
    }
    
    const response = await fetch(url.toString(), {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  async markAsRead(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  async markAllAsRead() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  async delete(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/notifications/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  },

  async deleteReadNotifications() {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/notifications/read`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
  }
};