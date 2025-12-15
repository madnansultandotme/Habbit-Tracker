/**
 * API client for communicating with the backend.
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      // Handle 204 No Content
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
}

export const api = new ApiClient(API_BASE_URL);
export default api;
