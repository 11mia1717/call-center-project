export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';
// Hardcoded token for monitoring console simplicity
const SERVICE_TOKEN = 'local-dev-token';

export const api = {
    async get(endpoint) {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            headers: { 'X-Service-Token': SERVICE_TOKEN }
        });
        return res.json();
    },

    async post(endpoint, body) {
        const res = await fetch(`${API_BASE_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Service-Token': SERVICE_TOKEN
            },
            body: JSON.stringify(body)
        });
        return res.json();
    }
};
