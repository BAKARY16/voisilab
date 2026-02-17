// API Configuration
const API_URL = 'https://api.fablab.voisilab.online';

// Migration from localStorage to sessionStorage (cleanup at startup)
const migrateStorage = () => {
  try {
    // Check if there's data in localStorage to migrate
    const localToken = localStorage.getItem('token');
    const localUser = localStorage.getItem('user');
    
    if (localToken || localUser) {
      // Migrate to sessionStorage if not already there
      if (localToken && !sessionStorage.getItem('token')) {
        sessionStorage.setItem('token', localToken);
      }
      if (localUser && !sessionStorage.getItem('user')) {
        sessionStorage.setItem('user', localUser);
      }
      
      // Clean localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.log('Migration localStorage -> sessionStorage terminee');
    }
    
    // Clean corrupted sessionStorage data
    const user = sessionStorage.getItem('user');
    if (user) {
      try {
        JSON.parse(user);
      } catch (e) {
        console.warn('Donnees utilisateur corrompues, nettoyage...');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
      }
    }
  } catch (error) {
    console.error('Erreur lors de la migration du stockage:', error);
  }
};

// Execute migration at startup
migrateStorage();

// Utility function to handle API responses
const handleResponse = async (response) => {
  // Handle 401 Unauthorized - automatic logout
  if (response.status === 401) {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Session expiree - Deconnexion automatique');
  }
  
  // Parse JSON response
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `Erreur ${response.status}`);
    }
    
    return data;
  }
  
  if (!response.ok) {
    throw new Error(`Erreur ${response.status}`);
  }
  
  return response;
};

// Get authorization headers
const getAuthHeaders = () => {
  const token = sessionStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Authentication Service
export const authService = {
  // Login - stores token and user in sessionStorage
  async login(email, password) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await handleResponse(response);
    
    if (data.token) {
      sessionStorage.setItem('token', data.token);
    }
    if (data.user) {
      sessionStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },
  
  // Verify token validity (uses profile endpoint)
  async verifyToken() {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },
  
  // Get user profile
  async getProfile() {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  },
  
  // Update user profile
  async updateProfile(profileData) {
    const token = sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Non authentifié');
    }
    
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    
    return handleResponse(response);
  },
  
  // Change password
  async changePassword(currentPassword, newPassword) {
    const response = await fetch(`${API_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ current_password: currentPassword, new_password: newPassword })
    });
    
    return handleResponse(response);
  },
  
  // Logout - removes token and user from sessionStorage
  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  },
  
  // Check if user is authenticated
  isAuthenticated() {
    return !!sessionStorage.getItem('token');
  },
  
  // Get current user from sessionStorage
  getCurrentUser() {
    const userStr = sessionStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
};

// Generic API Client class
class ApiClient {
  constructor(endpoint) {
    this.endpoint = endpoint;
    this.baseUrl = `${API_URL}/api/${endpoint}`;
  }
  
  // Get all items with optional query parameters
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  }
  
  // Get single item by ID
  async getById(id) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  }
  
  // Create new item
  async create(data) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  }
  
  // Update existing item
  async update(id, data) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });
    
    return handleResponse(response);
  }
  
  // Delete item
  async delete(id) {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    return handleResponse(response);
  }
  
  // Update item status
  async updateStatus(id, status, notes = '') {
    const response = await fetch(`${this.baseUrl}/${id}/status`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, notes })
    });
    
    return handleResponse(response);
  }
  
  // Download file from submission
  async downloadFile(submissionId, filename) {
    const response = await fetch(`${this.baseUrl}/${submissionId}/download/${filename}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur telechargement: ${response.status}`);
    }
    
    return response.blob();
  }
}

// Blog Service
export const blogService = new ApiClient('blog');

// Projects Service
export const projectsService = new ApiClient('projects');

// PPN (Petit Projet Numerique) Service
export const ppnService = new ApiClient('ppn');

// Workshops Service with additional methods
class WorkshopsApiClient extends ApiClient {
  constructor() {
    super('workshops');
  }
  
  async getUnreadCount() {
    const response = await fetch(`${this.baseUrl}/unread/count`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
  
  async markAsRead(id) {
    const response = await fetch(`${this.baseUrl}/${id}/read`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
  
  async markAllAsRead() {
    const response = await fetch(`${this.baseUrl}/mark-all-read`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
}
export const workshopsService = new WorkshopsApiClient();

// Innovations Service with additional methods
class InnovationsApiClient extends ApiClient {
  constructor() {
    super('innovations');
  }
  
  // Get published innovations (public)
  async getPublished() {
    const response = await fetch(`${this.baseUrl}/published`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
  
  // Get categories with counts
  async getCategories() {
    const response = await fetch(`${this.baseUrl}/categories`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
  
  // Toggle publish status
  async togglePublish(id) {
    const response = await fetch(`${this.baseUrl}/${id}/publish`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
  
  // Toggle featured status
  async toggleFeatured(id) {
    const response = await fetch(`${this.baseUrl}/${id}/featured`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
  
  // Like an innovation
  async like(id) {
    const response = await fetch(`${this.baseUrl}/${id}/like`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
}
export const innovationsService = new InnovationsApiClient();

// Equipment Service
export const equipmentService = new ApiClient('equipment');

// Equipment Requests Service with additional methods
class EquipmentRequestsApiClient extends ApiClient {
  constructor() {
    super('equipment-requests');
  }
  
  async getUnreadCount() {
    const response = await fetch(`${this.baseUrl}/unread/count`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
}
export const equipmentRequestsService = new EquipmentRequestsApiClient();

// Media Service
export const mediaService = new ApiClient('media');

// Team Service with photo upload capability
class TeamApiClient extends ApiClient {
  constructor() {
    super('team');
  }
  
  // Uses the default /api/team endpoint (requires auth in current Docker build)
  // No override needed - parent class getAll() works with authentication
  
  // Upload team member photo
  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = sessionStorage.getItem('token');
    const response = await fetch(`${API_URL}/api/upload/team`, {
      method: 'POST',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: formData
    });
    
    return handleResponse(response);
  }
  
  // Create team member (override to handle all data including photo_url separately)
  async createWithPhoto(memberData, photoFile) {
    let photoUrl = memberData.photo_url;
    
    // If a new photo is provided, upload it first
    if (photoFile) {
      const uploadResult = await this.uploadPhoto(photoFile);
      photoUrl = uploadResult.url;
    }
    
    // Create the member with the photo URL
    return this.create({ ...memberData, photo_url: photoUrl });
  }
  
  // Update team member with optional photo
  async updateWithPhoto(id, memberData, photoFile) {
    let photoUrl = memberData.photo_url;
    
    // If a new photo is provided, upload it first
    if (photoFile) {
      const uploadResult = await this.uploadPhoto(photoFile);
      photoUrl = uploadResult.url;
    }
    
    // Update the member with the photo URL
    return this.update(id, { ...memberData, photo_url: photoUrl });
  }
}
export const teamService = new TeamApiClient();

// Services API Service (for managing services offered)
export const servicesApiService = new ApiClient('services');

// Contacts Service with additional methods
class ContactsApiClient extends ApiClient {
  constructor() {
    super('contacts');
  }
  
  async getUnreadCount() {
    const response = await fetch(`${this.baseUrl}/unread-count`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
}
export const contactsService = new ContactsApiClient();

// Project Submissions Service with additional methods
class ProjectSubmissionsApiClient extends ApiClient {
  constructor() {
    super('project-submissions');
  }
  
  async getUnreadCount() {
    const response = await fetch(`${this.baseUrl}/unread-count`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
  
  // Override updateStatus to use PATCH (backend uses PATCH for project-submissions)
  async updateStatus(id, status, review_notes = '') {
    const response = await fetch(`${this.baseUrl}/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, review_notes })
    });
    return handleResponse(response);
  }
  
  // Override downloadFile to use correct path (/:id/files/:filename)
  async downloadFile(submissionId, filename) {
    const response = await fetch(`${this.baseUrl}/${submissionId}/files/${filename}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur téléchargement: ${response.status}`);
    }
    
    return response.blob();
  }
}
export const projectSubmissionsService = new ProjectSubmissionsApiClient();

// Users Service
export const usersService = new ApiClient('users');

// Pages Service (for dynamic pages management)
export const pagesService = new ApiClient('pages');

// Settings Service
export const settingsService = new ApiClient('settings');

// Stats Service
export const statsService = {
  async getDashboard() {
    const response = await fetch(`${API_URL}/api/stats`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  async getByPeriod(period = '30d') {
    const response = await fetch(`${API_URL}/api/stats/period?period=${period}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Notifications Service
export const notificationsService = {
  async getAll(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString 
      ? `${API_URL}/api/notifications?${queryString}` 
      : `${API_URL}/api/notifications`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  async markAsRead(id) {
    const response = await fetch(`${API_URL}/api/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  async markAllAsRead() {
    const response = await fetch(`${API_URL}/api/notifications/mark-all-read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  async delete(id) {
    const response = await fetch(`${API_URL}/api/notifications/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },
  
  async deleteReadNotifications() {
    const response = await fetch(`${API_URL}/api/notifications/read`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// Export API_URL for external use
export { API_URL };


