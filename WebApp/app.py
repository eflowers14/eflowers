from flask import Flask, request, jsonify
import sqlite3

#Iniciar la aplicacion 
app = Flask(__name__)

#Funcion para conectar a la base de datos
def conectar_db():
    con = sqlite3.connect('database.db')
    con_row = sqlite3.Row #Permite acceder a las columnas por su nombre
    return con

#Ruta para crear un nuevo usuario
@app.route('/api/usuarios', methods=['POST'])
def crear_usuario():
    #Obtener los datos del cuerpo de la solicitud del form
    datos = request.get_json()

    #Validar que existan los campos requeridos
    if not datos or 'nombre' not in datos or 'email' not in datos:
        return jsonify({'error': 'Datos incompletos'}), 400

    #Insertar en la base de datos 
    con = conectar_db()
    cursor = con.cursor()

    try:
        cursor.execute('INSERT INTO usuarios (nombre, email) VALUES (?, ?)'),(datos['nombre'], datos['email'])
        con.commit()

        #Obtener el id del nuevo usuario
        usuario_id = cursor.lastrowid

        return jsonify({
            'id': usuario_id,
            'nombre': datos['nombre'],
            'email': datos['email']
        }), 201
    except sqlite3.IntegrityError:
        return jsonify({
            'error': 'Email ya existente'
        }), 400
    finally: 
        con.close()
    
#Ruta para obtener todos los usuarios
@app.route('/api/usuarios', methods=['GET'])
def usuarios():
    con = conectar_db()
    cursor = con.cursor()

    cursor.execute('SELECT id, nombre, email FROM usuarios')
    usuarios = cursor .fetchall()
    con.close()

    #Convertir rows to dicccionarios 
    usuarios_lista = [dict(usuario) for usuario in usuarios]

    return jsonify(usuarios_lista)

#Iniciar la aplicacion si se ejecuta este archivo directamente
if __name__ == '__main__':
    #Crear la base de datos y tabla si no existen
    con = sqlite3.connect('database.db')
    cursor = con.cursor()
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
        )
    ''')
    con.commit()
    con.close

    #Ejecutar la aplicacion en modo debug
    app.run(debug=True)