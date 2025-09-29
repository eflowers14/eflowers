import React, { useState, useEffect } from 'react';
import { Skin } from './types/Skin';
import { skinService } from './services/api';
import './App.css';

const App: React.FC = () => {
  const [skins, setSkins] = useState<Skin[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchSkins = async () => {
      try {
        // Esto fallará hasta que crees las rutas en el backend
        const response = await skinService.getAllSkins();
        if (response.success) {
          setSkins(response.data);
        }
      } catch (err) {
        setError('Error al cargar las skins. ¿El backend está ejecutándose?');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSkins();
  }, []);

  if (loading) return <div className="loading">Cargando CS:GO Skins...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>CS:GO Skin Marketplace</h1>
        <p>Total de skins: {skins.length}</p>
        
        {/* Mostrar skins cuando las tengamos */}
        <div className="skins-container">
          {skins.length > 0 ? (
            skins.map(skin => (
              <div key={skin.id} className="skin-card">
                <h3>{skin.name}</h3>
                <p>{skin.description}</p>
                <span>Precio: ${skin.price}</span>
              </div>
            ))
          ) : (
            <p>No hay skins disponibles. Configura el backend primero.</p>
          )}
        </div>
      </header>
    </div>
  );
};

export default App;