
const API_BASE = 'http://localhost:5000/api';

class SkinsAPI {
    // Obtener todas las skins
    static async getAllSkins(filters = {}) {
        const queryParams = new URLSearchParams(filters).toString();
        const response = await fetch(`${API_BASE}/skins?${queryParams}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar skins');
        }
        
        return await response.json();
    }

    // Obtener skin por ID
    static async getSkinById(id) {
        const response = await fetch(`${API_BASE}/skins/${id}`);
        
        if (!response.ok) {
            throw new Error('Skin no encontrada');
        }
        
        return await response.json();
    }

    // Comprar skin
    static async purchaseSkin(skinId) {
        const token = localStorage.getItem('authToken');
        
        const response = await fetch(`${API_BASE}/skins/purchase`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ skinId })
        });
        
        if (!response.ok) {
            throw new Error('Error al comprar skin');
        }
        
        return await response.json();
    }

    // Login
    static async login(email, password) {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            throw new Error('Credenciales inválidas');
        }
        
        return await response.json();
    }

    // Registro
    static async register(username, email, password) {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });
        
        if (!response.ok) {
            throw new Error('Error al registrar usuario');
        }
        
        return await response.json();
    }
}
