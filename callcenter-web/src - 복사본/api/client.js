export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8082';

class ApiClient {
    constructor() {
        this.token = localStorage.getItem('operator_token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('operator_token', token);
    }

    clearToken() {
        this.token = null;
        localStorage.removeItem('operator_token');
    }

    async request(endpoint, method = 'GET', body = null) {
        const headers = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['X-Operator-Token'] = this.token;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        const config = {
            method,
            headers,
            signal: controller.signal
        };
        if (body) {
            config.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
            clearTimeout(timeoutId);

            if (!response.ok) {
                if (response.status === 401) {
                    console.warn('Session expired. Redirecting to login...');
                    this.clearToken();
                    window.location.href = '/login';
                    return;
                }
                throw new Error(`API Error: ${response.status}`);
            }
            // Handle void response (200 OK but empty)
            const text = await response.text();
            return text ? JSON.parse(text) : {};
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                console.error('Request Timed Out');
            } else {
                console.error('Request Failed:', error);
            }
            throw error;
        }
    }

    post(endpoint, body) {
        return this.request(endpoint, 'POST', body);
    }

    get(endpoint) {
        return this.request(endpoint, 'GET');
    }
}

export const api = new ApiClient();
