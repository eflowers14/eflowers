function openModal(projectId) {
    const modal = document.querySelectorAll('#projectModal');
    console.log(modal);
    if (!modal) {
        console.error("Modal no encontrado");
        return;
    }
    modal.style.display = "flex";
    const modalContent = document.querySelectorAll('#modalContent');

    //Condicional para cargar contenido dinamico segun el proyecto clickeado
    if (projectId === 'proyecto1') {
        //Insertar HTML personalizado para el proyecto 1
        modalContent.innerHTML = `
            <h3>E-commerce React</h3>
            <img src="#"
                style="width=100%; margin: 15px 0;">
            <p><strong>Tecnologías:</strong>React, Redux, Node.js, MongoDB</p>
            <p>Tienda online con carrito de compras y autentificación</p>
            <a href="#" target="_blank" 
                style="display:inline-block; padding: 10px 20px; background: #2c3e50; color: white; text-decoration: none;">
                Ver online
            </a>
            <a href="#" target="_blank">Código</a>
        `;
    }
    //Insertar HTML personalizado para el proyecto 2
    else if (projectId === 'proyecto2') {
        modalContent.innerHTML = `
            <img src="#" alt="Proyecto 2" class="project-thumbnail" onclick="openModal('proyecto2')">
                <h3>Analizador de datos</h3>
                <p><strong>Tecnologías: </strong>Python, Pandas, Excel</p>
                <p>Scrpit de procesamiento de datasets grandes</p>
                <a href="#" target="_blank"
                    style="display: inline-block; padding: 10px 20px; background: #2c3e50; color: white; text-decoration: none;">
                    Ver Online
                </a>
                <a href="#" target="_blank">Ver Código</a>
        `;
    }
}
//Función para cerrar el modal
function closeModal(){
    document.getElementById('projectModal').style.display = "none";
}
//Funcion para cerral al modal tocando fuera del contenido
window.onclick = function (event) {
    const modal = document.getElementById('projectModal')
    if (event.target == modal) {
        closeModal();
    }
}