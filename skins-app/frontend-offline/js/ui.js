class UIManager {
    // Mostrar skins en la grid
    static displaySkins(skins) {
        const container = document.getElementById('skins-container');
        container.innerHTML = '';

        skins.forEach(skin => {
            const skinCard = this.createSkinCard(skin);
            container.appendChild(skinCard);
        });
    }

    // Crear tarjeta de skin
    static createSkinCard(skin) {
        const card = document.createElement('div');
        card.className = `skin-card rarity-${skin.rarity}`;
        
        card.innerHTML = `
            <h3>${skin.name}</h3>
            <p class="game">Juego: ${skin.game}</p>
            <p class="rarity">Rareza: ${skin.rarity}</p>
            <p class="price">$${skin.price}</p>
            ${skin.description ? `<p class="description">${skin.description}</p>` : ''}
            <button class="buy-btn" data-skin-id="${skin.id}">Comprar</button>
        `;

        return card;
    }

    // Mostrar/ocultar modal de auth
    static toggleAuthModal(show, formType = 'login') {
        const modal = document.getElementById('auth-modal');
        const formsContainer = document.getElementById('auth-forms');
        
        if (show) {
            formsContainer.innerHTML = this.createAuthForm(formType);
            modal.style.display = 'block';
        } else {
            modal.style.display = 'none';
        }
    }

    // Crear formulario de auth
    static createAuthForm(type) {
        const isLogin = type === 'login';
        
        return `
            <h2>${isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h2>
            <form id="auth-form">
                ${!isLogin ? `
                    <div class="form-group">
                        <label>Username:</label>
                        <input type="text" id="username" required>
                    </div>
                ` : ''}
                <div class="form-group">
                    <label>Email:</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label>Contraseña:</label>
                    <input type="password" id="password" required>
                </div>
                <button type="submit">${isLogin ? 'Ingresar' : 'Registrar'}</button>
            </form>
        `;
    }

    // Mostrar mensajes de error/éxito
    static showMessage(message, type = 'error') {
        // Implementar notificaciones
        alert(`${type.toUpperCase()}: ${message}`);
    }
}

