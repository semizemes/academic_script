const API_URL = '/api';

export async function fetchData(endpoint: string, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        ...options,
    });

    if(!response.ok) {
        throw new Error(`API error: ${response.status}`);
    }

    return response.json()
}

const api = {
    login: async (email: string, password: string) => {
        return fetchData('/login', {
            method: 'POST',
            body: JSON.stringify({email, password})
        })
    },

    getCurrentUser: async () => {
        return fetchData('/user');
    },

    logout: async () => {
        return fetchData('/logout')
    }
}

export default api;