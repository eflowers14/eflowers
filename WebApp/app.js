//Esperar a que el DOM este completamente cargado 
document.addEventListener('DOMContentLoaded', function () {
    //Obtener el form
    const form = document.getElementById('dataForm');
    //Escuchar el evento submit del form
    form.addEventListener('submit', async function (e) {
        e.preventDefault(); //Prevenir el comportamiento por defecto

        //Obtener Valores de los Input
        const nombre = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        try {
            const response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email}),
            });
            //Convertir la respuesta a JSON
            const  data = await response.json();

            //Mostrar el resultado en la pagina con el div
            document.getElementById('resultados').innerHTML = `Usuario: ${data.name} creado con ID ${data.id}`;
        } catch (error) {
            console.log('Error: ', error);
        }
    });
    //Funcion para cargar y mostrar usuarios 
    async function cargarUsuarios() {
        const response = await fetch('/api/usuarios');
        const usuarios = await response.json();

        const lista = usuarios.map(user =>
            `<li>${user.id}:${user.name} (${user.email})</li>`
        ).join('');

        document.getElementById('resultados').innerHTML = `<ul>${lista}</ul>`;
    }

    cargarUsuarios();
})