class SkinsApp {
    constructor() {
        this.currentFilters = {};
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadSkins();
        this.checkAuthStatus();
    }

    bindEvents() {
        // Filtros
        document.getElementById('search-game').addEventListener('input', (e) => {
            this.currentFilters.game = e.target.value;
            this.debouncedFilter();
        });

        document.getElementById('filter-rarity').addEventListener('change', (e) => {
            this.currentFilters.rarity = e.target.value;
            this.loadSkins();
        });

        // Auth buttons
        document.getElementById('login-btn').addEventListener('click', () => {
            UIManager.toggleAuthModal(true, 'login');
        });

        document.getElementById('register-btn').addEventListener('click', () => {
            UIManager.toggleAuthModal(true, 'register');
        });

        // Cerrar modal
        document.querySelector('.close').addEventListener('click', () => {
            UIManager.toggleAuthModal(false);
        });

        // Comprar skins (event delegation)
        document.getElementById('skins-container').addEventListener('click', (e) => {
            if (e.target.classList.contains('buy-btn')) {
                this.purchaseSkin(e.target.dataset.skinId);
            }
        });
    }

    async loadSkins() {
        try {
            document.getElementById('loading').style.display = 'block';
            const data = await SkinsAPI.getAllSkins(this.currentFilters);
            UIManager.displaySkins(data.skins);
        } catch (error) {
            UIManager.showMessage(error.message);
        } finally {
            document.getElementById('loading').style.display = 'none';
        }
    }

    async purchaseSkin(skinId) {
        if (!localStorage.getItem('authToken')) {
            UIManager.showMessage('Debes iniciar sesión para comprar');
            UIManager.toggleAuthModal(true, 'login');
            return;
        }

        try {
            await SkinsAPI.purchaseSkin(skinId);
            UIManager.showMessage('¡Skin comprada exitosamente!', 'success');
        } catch (error) {
            UIManager.showMessage(error.message);
        }
    }

    checkAuthStatus() {
        const token = localStorage.getItem('authToken');
        if (token) {
            // Cambiar botones de auth
            document.getElementById('auth-section').innerHTML = `
                <span>Bienvenido!</span>
                <button id="logout-btn">Cerrar Sesión</button>
            `;
            document.getElementById('logout-btn').addEventListener('click', this.logout.bind(this));
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        location.reload();
    }

    // Debounce para búsqueda
    debouncedFilter = this.debounce(() => this.loadSkins(), 300);

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Iniciar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new SkinsApp();
});

