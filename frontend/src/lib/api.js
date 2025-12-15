/**
 * API client for communicating with the backend.
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';
const TOKEN_KEY = 'habit-tracker-token';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.token = localStorage.getItem(TOKEN_KEY);
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getToken() {
    return this.token;
  }

  isAuthenticated() {
    return !!this.token;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = { ...options, headers };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      if (response.status === 204) {
        return null;
      }

      return response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Habits
  async getHabits() {
    return this.request('/habits');
  }

  async createHabit(habit) {
    return this.request('/habits', {
      method: 'POST',
      body: JSON.stringify(habit),
    });
  }

  async updateHabit(habitId, updates) {
    return this.request(`/habits/${habitId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteHabit(habitId) {
    return this.request(`/habits/${habitId}`, {
      method: 'DELETE',
    });
  }

  // Completions
  async toggleCompletion(habitId, date) {
    return this.request('/habits/completions/toggle', {
      method: 'POST',
      body: JSON.stringify({ habit_id: habitId, date }),
    });
  }

  async getCompletions(habitId) {
    return this.request(`/habits/completions/${habitId}`);
  }

  // Auth
  async register(email, password, name) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    return data;
  }

  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (data.access_token) {
      this.setToken(data.access_token);
    }
    return data;
  }

  async getMe() {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
