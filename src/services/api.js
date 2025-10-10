const API_BASE_URL = 'http://localhost:8080';

export const metricsAPI = {
  async getTotalUsers() {
    const response = await fetch(`${API_BASE_URL}/metrics/users/total`);
    if (!response.ok) throw new Error('Failed to fetch total users');
    return response.json();
  },

  async getActiveUsers(days = 7) {
    const response = await fetch(`${API_BASE_URL}/metrics/users/active?days=${days}`);
    if (!response.ok) throw new Error('Failed to fetch active users');
    return response.json();
  },

  async getUserRetention() {
    const response = await fetch(`${API_BASE_URL}/metrics/users/retention`);
    if (!response.ok) throw new Error('Failed to fetch user retention');
    return response.json();
  },

  async getTotalGroups() {
    const response = await fetch(`${API_BASE_URL}/metrics/groups/total`);
    if (!response.ok) throw new Error('Failed to fetch total groups');
    return response.json();
  },

  async getActiveGroups(days = 7) {
    const response = await fetch(`${API_BASE_URL}/metrics/groups/active?days=${days}`);
    if (!response.ok) throw new Error('Failed to fetch active groups');
    return response.json();
  },

  async getTotalMessages() {
    const response = await fetch(`${API_BASE_URL}/metrics/messages/total`);
    if (!response.ok) throw new Error('Failed to fetch total messages');
    return response.json();
  },

  async getDailyMessages() {
    const response = await fetch(`${API_BASE_URL}/metrics/messages/daily`);
    if (!response.ok) throw new Error('Failed to fetch daily messages');
    return response.json();
  },

  async getMetricsByDateRange(startDate, endDate) {
    const response = await fetch(`${API_BASE_URL}/metrics/by-date-range?start_date=${startDate}&end_date=${endDate}`);
    if (!response.ok) throw new Error('Failed to fetch date range metrics');
    return response.json();
  },

  async getMessageHistory(days = 30) {
    const response = await fetch(`${API_BASE_URL}/metrics/messages/history?days=${days}`);
    if (!response.ok) throw new Error('Failed to fetch message history');
    return response.json();
  },

  async getAllMetrics() {
    try {
      const [
        totalUsers,
        activeUsers,
        userRetention,
        totalGroups,
        activeGroups,
        totalMessages,
        dailyMessages
      ] = await Promise.all([
        this.getTotalUsers(),
        this.getActiveUsers(),
        this.getUserRetention(),
        this.getTotalGroups(),
        this.getActiveGroups(),
        this.getTotalMessages(),
        this.getDailyMessages()
      ]);

      return {
        totalUsers: totalUsers.total_users,
        activeUsers: activeUsers.active_users,
        userRetention: userRetention.retention_rate,
        totalGroups: totalGroups.total_groups,
        activeGroups: activeGroups.active_groups,
        totalMessages: totalMessages.total_messages,
        dailyMessages: dailyMessages.daily_messages
      };
    } catch (error) {
      console.error('Error fetching metrics:', error);
      throw error;
    }
  },

  // Rewards API endpoints
  async generateRewardsCSV() {
    const response = await fetch(`${API_BASE_URL}/rewards/sheet/csv`);
    if (!response.ok) throw new Error('Failed to generate CSV');
    
    // Get the CSV blob
    const blob = await response.blob();
    return blob;
  },

  async updateGoogleSheet() {
    // Changed from POST to GET
    const response = await fetch(`${API_BASE_URL}/rewards/sheet/google`, {
      method: 'GET'
    });
    if (!response.ok) throw new Error('Failed to update Google Sheet');
    return response.json();
  },

  async markAmbassadorPaid(phoneNumber, note) {
    // Send phone as query parameter, not in body
    const response = await fetch(`${API_BASE_URL}/rewards/mark-paid?phone=${encodeURIComponent(phoneNumber)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
      // No body needed since backend only uses query parameter
    });
    if (!response.ok) throw new Error('Failed to mark ambassador as paid');
    return response.json();
  }
};