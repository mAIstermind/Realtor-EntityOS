import axios, { AxiosInstance, AxiosError } from 'axios';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Secure connection class utility for Teable REST API.
 * Automatically appends the Authorization Bearer token header to all requests.
 */
export class TeableClient {
  private client: AxiosInstance;

  constructor() {
    const baseURL = process.env.TEABLE_API_URL || 'https://app.teable.io/api';
    const token = process.env.TEABLE_API_TOKEN || '';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
    });

    // Intercept responses to isolate clean errors without terminating server thread
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const status = error.response.status;
          if (status === 403) {
            console.error('[TeableClient Security Alert] 403 Forbidden - Check API tokens and permissions.');
          } else if (status === 404) {
            console.error('[TeableClient Alert] 404 Not Found - The requested record or table does not exist.');
          } else {
            console.error(`[TeableClient Error] Status ${status}:`, error.response.data);
          }
        } else if (error.request) {
          console.error('[TeableClient Error] No response received from Teable API.', error.message);
        } else {
          console.error('[TeableClient Error] Request setup failed:', error.message);
        }
        // Return a safe mocked structure instead of throwing and crashing the thread
        return Promise.resolve({ data: { records: [] }, error: true, message: error.message });
      }
    );
  }

  /**
   * Fetch records from a specified table with optional query parameters.
   */
  public async getRecords(tableId: string, queryParams: Record<string, any> = {}) {
    return this.client.get(`/table/${tableId}/record`, { params: queryParams });
  }

  /**
   * Update a specific record with partial fields.
   */
  public async updateRecord(tableId: string, recordId: string, fields: Record<string, any>) {
    return this.client.patch(`/table/${tableId}/record/${recordId}`, { fields });
  }

  /**
   * Create a new record in a specified table.
   */
  public async createRecord(tableId: string, fields: Record<string, any>) {
    return this.client.post(`/table/${tableId}/record`, { fields });
  }
}

// Export a singleton instance for global server usage
export const teableDB = new TeableClient();
