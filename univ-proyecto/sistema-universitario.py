import sys
import os
from datetime import date
from PyQt5 import QtWidgets, uic
from PyQt5.QtWidgets import QMessageBox, QTableWidgetItem, QComboBox
from PyQt5.QtCore import Qt

# Clase base para todas las personas
class Usuario:
    def __init__(self, nombre, apellido1, apellido2, ci, area):
        self.nombre = nombre
        self.apellido1 = apellido1
        self.apellido2 = apellido2
        self.ci = ci
        self.area = area  # Objeto de tipo Area
        self.fecha_creacion = date.today()
        self.login = ""
        self.cuota = 0
    
    def generar_login(self, logins_existentes=[]):
        # login = nombre.apellido1, si se repite se duplica primera letra
        base = f"{self.nombre.lower()}.{self.apellido1.lower()}"
        login = base
        contador = 1
        
        # Si ya existe el login base, añadir número
        while login in logins_existentes:
            login = f"{base}{contador}"
            contador += 1
        
        return login
    
    def obtener_tipo_usuario(self):
        """Retorna el tipo de usuario como string"""
        return "Usuario"


# Estudiantes
class Estudiante(Usuario):
    def __init__(self, nombre, apellido1, apellido2, ci, area, carrera, anio, becado=False):
        super().__init__(nombre, apellido1, apellido2, ci, area)
        self.carrera = carrera
        self.anio = anio
        self.becado = becado
        self.cuota = 150 if not becado else 75  # 50% de descuento si es becado
    
    def obtener_tipo_usuario(self):
        return "Estudiante"


class AlumnoAyudante(Estudiante):
    def __init__(self, nombre, apellido1, apellido2, ci, area, carrera, anio, becado, asignatura, experiencia):
        super().__init__(nombre, apellido1, apellido2, ci, area, carrera, anio, becado)
        self.asignatura = asignatura
        self.experiencia = experiencia
        self.cuota += 20 * experiencia
    
    def obtener_tipo_usuario(self):
        return "Alumno Ayudante"


# Profesores
class Profesor(Usuario):
    def __init__(self, nombre, apellido1, apellido2, ci, area, departamento, grado, categoria, edad):
        super().__init__(nombre, apellido1, apellido2, ci, area)
        self.departamento = departamento
        self.grado = grado  # graduado, master, doctor
        self.categoria = categoria  # titular, auxiliar, asistente, instructor
        self.edad = edad
        self.calcular_cuota()
    
    def calcular_cuota(self):
        self.cuota = 200
        
        if self.grado.lower() == "doctor":
            self.cuota += 100
        elif self.grado.lower() == "master":
            self.cuota += 50
        
        if self.categoria.lower() in ["auxiliar", "titular"]:
            self.cuota += 100
        elif self.categoria.lower() in ["asistente", "instructor"]:
            self.cuota += 30
    
    def obtener_tipo_usuario(self):
        return "Profesor"


# Trabajadores no docentes
class Trabajador(Usuario):
    def __init__(self, nombre, apellido1, apellido2, ci, area, ocupacion, fecha_inicio):
        super().__init__(nombre, apellido1, apellido2, ci, area)
        self.ocupacion = ocupacion
        self.fecha_inicio = fecha_inicio
        self.cuota = 200  # Por defecto
    
    def obtener_tipo_usuario(self):
        return "Trabajador"


# Área o Facultad
class Area:
    def __init__(self, nombre, tipo):
        self.nombre = nombre
        self.tipo = tipo  # Facultad o área no docente


# SISTEMA DE GESTIÓN

class Sistema:
    def __init__(self):
        self.usuarios = []
        self.areas = []
        self.cuentas = []
        
        # Crear algunas áreas por defecto
        self.crear_areas_por_defecto()
    
    def crear_areas_por_defecto(self):
        """Crea algunas áreas/facultades para pruebas"""
        areas_defecto = [
            ("Facultad de Ingeniería", "Facultad"),
            ("Facultad de Ciencias", "Facultad"),
            ("Facultad de Medicina", "Facultad"),
            ("Administración Central", "Área no docente"),
            ("Biblioteca", "Área no docente"),
            ("Decanato", "Facultad"),
        ]
        
        for nombre, tipo in areas_defecto:
            self.agregar_area(Area(nombre, tipo))
    
    def agregar_area(self, area):
        """Agrega un área al sistema"""
        if area.nombre not in [a.nombre for a in self.areas]:
            self.areas.append(area)
            return True
        return False
    
    def obtener_areas(self):
        """Retorna lista de nombres de áreas"""
        return [area.nombre for area in self.areas]
    
    def obtener_area_por_nombre(self, nombre):
        """Busca un área por nombre"""
        for area in self.areas:
            if area.nombre == nombre:
                return area
        return None
    
    # Funciones CRUD para usuarios
    def agregar_usuario(self, usuario):
        """Agrega un usuario al sistema"""
        # Generar login único
        logins_existentes = [u.login for u in self.usuarios]
        usuario.login = usuario.generar_login(logins_existentes)
        
        if usuario.login not in logins_existentes:
            self.usuarios.append(usuario)
            self.cuentas.append({'login': usuario.login, 'cuota': usuario.cuota})
            return True, f"Usuario agregado exitosamente. Login: {usuario.login}"
        else:
            return False, "Error: Login duplicado"
    
    def eliminar_usuario(self, login):
        """Elimina un usuario por login"""
        for i, usuario in enumerate(self.usuarios):
            if usuario.login == login:
                del self.usuarios[i]
                # Eliminar también de cuentas
                for j, cuenta in enumerate(self.cuentas):
                    if cuenta['login'] == login:
                        del self.cuentas[j]
                        break
                return True, f"Usuario {login} eliminado exitosamente"
        return False, f"Usuario {login} no encontrado"
    
    def buscar_usuario_por_login(self, login):
        """Busca un usuario por login"""
        for usuario in self.usuarios:
            if usuario.login == login:
                return usuario
        return None
    
    def listar_usuarios(self):
        """Lista todos los usuarios ordenados por login"""
        usuarios_info = []
        for u in sorted(self.usuarios, key=lambda x: x.login):
            usuarios_info.append({
                'nombre': u.nombre,
                'apellido1': u.apellido1,
                'apellido2': u.apellido2,
                'login': u.login,
                'cuota': u.cuota,
                'tipo': u.obtener_tipo_usuario(),
                'area': u.area.nombre if u.area else "Sin área"
            })
        return usuarios_info
    
    # Filtros y listados especializados
    def profesores_por_categoria(self, categoria):
        """Lista profesores por categoría, ordenados por edad"""
        profs = [p for p in self.usuarios if isinstance(p, Profesor) and p.categoria.lower() == categoria.lower()]
        return sorted(profs, key=lambda x: x.edad)  # de jóvenes a mayores
    
    def usuarios_por_area(self, area_nombre):
        """Lista usuarios por área, ordenados por cuota descendente"""
        usuarios_area = [u for u in self.usuarios if u.area.nombre == area_nombre]
        usuarios_info = []
        for u in sorted(usuarios_area, key=lambda x: x.cuota, reverse=True):
            usuarios_info.append({
                'login': u.login,
                'nombre_completo': f"{u.nombre} {u.apellido1} {u.apellido2}",
                'cuota': u.cuota,
                'tipo': u.obtener_tipo_usuario()
            })
        return usuarios_info
    
    def obtener_estadisticas(self):
        """Retorna estadísticas del sistema"""
        total_usuarios = len(self.usuarios)
        total_profesores = len([u for u in self.usuarios if isinstance(u, Profesor)])
        total_estudiantes = len([u for u in self.usuarios if isinstance(u, Estudiante)])
        total_trabajadores = len([u for u in self.usuarios if isinstance(u, Trabajador)])
        
        # Calcular ingresos totales
        ingresos_totales = sum(u.cuota for u in self.usuarios)
        
        # Usuario con mayor cuota
        if self.usuarios:
            usuario_max_cuota = max(self.usuarios, key=lambda x: x.cuota)
            max_cuota_info = f"{usuario_max_cuota.login} (${usuario_max_cuota.cuota})"
        else:
            max_cuota_info = "N/A"
        
        return {
            'total_usuarios': total_usuarios,
            'total_profesores': total_profesores,
            'total_estudiantes': total_estudiantes,
            'total_trabajadores': total_trabajadores,
            'ingresos_totales': ingresos_totales,
            'usuario_max_cuota': max_cuota_info,
            'areas_registradas': len(self.areas)
        }


# INTERFAZ GRÁFICA CON PyQt5

class MainWindow(QtWidgets.QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        
        # Inicializar sistema
        self.sistema = Sistema()
        
        # Cargar interfaz desde archivo .ui
        try:
            # Buscar archivo .ui en la misma carpeta
            current_dir = os.path.dirname(os.path.abspath(__file__))
            ui_file = os.path.join(current_dir, "interfaz_universidad.ui")
            
            if os.path.exists(ui_file):
                uic.loadUi(ui_file, self)
            else:
                # Si no existe el archivo .ui, crear interfaz programáticamente
                self.crear_interfaz_programatica()
                print("Archivo .ui no encontrado. Se creó interfaz programática.")
        except Exception as e:
            print(f"Error al cargar interfaz: {e}")
            self.crear_interfaz_programatica()
        
        # Configurar interfaz
        self.setup_ui()
        
        # Conectar señales y slots
        self.conectar_eventos()
        
        # Cargar datos iniciales
        self.cargar_datos_iniciales()
        
        # Actualizar displays
        self.actualizar_estadisticas()
        self.mostrar_todos_usuarios()
    
    def crear_interfaz_programatica(self):
        """Crea la interfaz gráfica programáticamente si no hay archivo .ui"""
        self.setWindowTitle("Sistema de Gestión Universitaria - POO")
        self.setGeometry(100, 100, 1200, 700)
        
        # Widget central
        central_widget = QtWidgets.QWidget()
        self.setCentralWidget(central_widget)
        
        # Layout principal
        layout = QtWidgets.QVBoxLayout(central_widget)
        
        # Título
        titulo = QtWidgets.QLabel("SISTEMA DE GESTIÓN UNIVERSITARIA")
        titulo.setStyleSheet("font-size: 24px; font-weight: bold; color: #2c3e50; padding: 10px;")
        titulo.setAlignment(Qt.AlignCenter)
        layout.addWidget(titulo)
        
        # Pestañas
        self.tab_widget = QtWidgets.QTabWidget()
        layout.addWidget(self.tab_widget)
        
        # Crear pestañas
        self.crear_tab_registro()
        self.crear_tab_usuarios()
        self.crear_tab_consultas()
        self.crear_tab_estadisticas()
        
        # Barra de estado
        self.status_bar = QtWidgets.QStatusBar()
        self.setStatusBar(self.status_bar)
        self.status_bar.showMessage("Sistema listo. Bienvenido!")
    
    def crear_tab_registro(self):
        """Crea la pestaña de registro de usuarios"""
        tab = QtWidgets.QWidget()
        self.tab_widget.addTab(tab, "Registrar Usuario")
        
        layout = QtWidgets.QVBoxLayout(tab)
        
        # Tipo de usuario
        tipo_layout = QtWidgets.QHBoxLayout()
        tipo_layout.addWidget(QtWidgets.QLabel("Tipo de usuario:"))
        self.combo_tipo_usuario = QtWidgets.QComboBox()
        self.combo_tipo_usuario.addItems(["Estudiante", "Alumno Ayudante", "Profesor", "Trabajador"])
        self.combo_tipo_usuario.currentTextChanged.connect(self.cambiar_formulario)
        tipo_layout.addWidget(self.combo_tipo_usuario)
        tipo_layout.addStretch()
        layout.addLayout(tipo_layout)
        
        # Formulario común (datos básicos)
        form_common = QtWidgets.QGroupBox("Datos Básicos")
        form_common_layout = QtWidgets.QGridLayout()
        
        # Campos comunes
        self.input_nombre = QtWidgets.QLineEdit()
        self.input_apellido1 = QtWidgets.QLineEdit()
        self.input_apellido2 = QtWidgets.QLineEdit()
        self.input_ci = QtWidgets.QLineEdit()
        
        # Área
        self.combo_area = QtWidgets.QComboBox()
        
        form_common_layout.addWidget(QtWidgets.QLabel("Nombre:"), 0, 0)
        form_common_layout.addWidget(self.input_nombre, 0, 1)
        form_common_layout.addWidget(QtWidgets.QLabel("Primer Apellido:"), 1, 0)
        form_common_layout.addWidget(self.input_apellido1, 1, 1)
        form_common_layout.addWidget(QtWidgets.QLabel("Segundo Apellido:"), 2, 0)
        form_common_layout.addWidget(self.input_apellido2, 2, 1)
        form_common_layout.addWidget(QtWidgets.QLabel("CI:"), 0, 2)
        form_common_layout.addWidget(self.input_ci, 0, 3)
        form_common_layout.addWidget(QtWidgets.QLabel("Área/Facultad:"), 1, 2)
        form_common_layout.addWidget(self.combo_area, 1, 3)
        
        form_common.setLayout(form_common_layout)
        layout.addWidget(form_common)
        
        # Formulario específico (inicialmente para Estudiante)
        self.form_specific = QtWidgets.QGroupBox("Datos Específicos")
        self.specific_layout = QtWidgets.QGridLayout()
        self.form_specific.setLayout(self.specific_layout)
        layout.addWidget(self.form_specific)
        
        # Botones
        button_layout = QtWidgets.QHBoxLayout()
        self.btn_registrar = QtWidgets.QPushButton("Registrar Usuario")
        self.btn_registrar.clicked.connect(self.registrar_usuario)
        self.btn_registrar.setStyleSheet("background-color: #27ae60; color: white; font-weight: bold; padding: 10px;")
        
        self.btn_limpiar = QtWidgets.QPushButton("Limpiar Formulario")
        self.btn_limpiar.clicked.connect(self.limpiar_formulario)
        self.btn_limpiar.setStyleSheet("background-color: #e74c3c; color: white; padding: 10px;")
        
        button_layout.addWidget(self.btn_registrar)
        button_layout.addWidget(self.btn_limpiar)
        layout.addLayout(button_layout)
        
        # Inicializar formulario específico
        self.cambiar_formulario("Estudiante")
    
    def crear_tab_usuarios(self):
        """Crea la pestaña de visualización de usuarios"""
        tab = QtWidgets.QWidget()
        self.tab_widget.addTab(tab, "Usuarios Registrados")
        
        layout = QtWidgets.QVBoxLayout(tab)
        
        # Barra de búsqueda y filtros
        filter_layout = QtWidgets.QHBoxLayout()
        
        filter_layout.addWidget(QtWidgets.QLabel("Buscar:"))
        self.input_buscar = QtWidgets.QLineEdit()
        self.input_buscar.setPlaceholderText("Nombre, apellido o login...")
        self.input_buscar.textChanged.connect(self.filtrar_usuarios)
        filter_layout.addWidget(self.input_buscar)
        
        filter_layout.addWidget(QtWidgets.QLabel("Filtrar por tipo:"))
        self.combo_filtrar_tipo = QtWidgets.QComboBox()
        self.combo_filtrar_tipo.addItems(["Todos", "Estudiante", "Alumno Ayudante", "Profesor", "Trabajador"])
        self.combo_filtrar_tipo.currentTextChanged.connect(self.filtrar_usuarios)
        filter_layout.addWidget(self.combo_filtrar_tipo)
        
        filter_layout.addWidget(QtWidgets.QLabel("Ordenar por:"))
        self.combo_ordenar = QtWidgets.QComboBox()
        self.combo_ordenar.addItems(["Login", "Nombre", "Cuota (Mayor)", "Cuota (Menor)"])
        self.combo_ordenar.currentTextChanged.connect(self.filtrar_usuarios)
        filter_layout.addWidget(self.combo_ordenar)
        
        filter_layout.addStretch()
        layout.addLayout(filter_layout)
        
        # Tabla de usuarios
        self.tabla_usuarios = QtWidgets.QTableWidget()
        self.tabla_usuarios.setColumnCount(7)
        self.tabla_usuarios.setHorizontalHeaderLabels(["Login", "Nombre", "Apellidos", "Tipo", "Área", "Cuota ($)", "Acciones"])
        self.tabla_usuarios.setAlternatingRowColors(True)
        layout.addWidget(self.tabla_usuarios)
        
        # Botones de acción
        action_layout = QtWidgets.QHBoxLayout()
        self.btn_eliminar = QtWidgets.QPushButton("Eliminar Seleccionado")
        self.btn_eliminar.clicked.connect(self.eliminar_usuario_seleccionado)
        self.btn_eliminar.setStyleSheet("background-color: #c0392b; color: white;")
        
        self.btn_exportar = QtWidgets.QPushButton("Exportar a CSV")
        self.btn_exportar.clicked.connect(self.exportar_usuarios)
        self.btn_exportar.setStyleSheet("background-color: #3498db; color: white;")
        
        self.btn_actualizar = QtWidgets.QPushButton("Actualizar Lista")
        self.btn_actualizar.clicked.connect(self.mostrar_todos_usuarios)
        self.btn_actualizar.setStyleSheet("background-color: #2ecc71; color: white;")
        
        action_layout.addWidget(self.btn_eliminar)
        action_layout.addWidget(self.btn_exportar)
        action_layout.addWidget(self.btn_actualizar)
        action_layout.addStretch()
        layout.addLayout(action_layout)
    
    def crear_tab_consultas(self):
        """Crea la pestaña de consultas especializadas"""
        tab = QtWidgets.QWidget()
        self.tab_widget.addTab(tab, "Consultas")
        
        layout = QtWidgets.QVBoxLayout(tab)
        
        # Consulta por área
        area_group = QtWidgets.QGroupBox("Usuarios por Área")
        area_layout = QtWidgets.QVBoxLayout()
        
        area_sub_layout = QtWidgets.QHBoxLayout()
        area_sub_layout.addWidget(QtWidgets.QLabel("Seleccionar área:"))
        self.combo_consulta_area = QtWidgets.QComboBox()
        area_sub_layout.addWidget(self.combo_consulta_area)
        
        self.btn_consultar_area = QtWidgets.QPushButton("Consultar")
        self.btn_consultar_area.clicked.connect(self.consultar_por_area)
        self.btn_consultar_area.setStyleSheet("background-color: #3498db; color: white;")
        area_sub_layout.addWidget(self.btn_consultar_area)
        area_sub_layout.addStretch()
        
        area_layout.addLayout(area_sub_layout)
        
        self.tabla_por_area = QtWidgets.QTableWidget()
        self.tabla_por_area.setColumnCount(4)
        self.tabla_por_area.setHorizontalHeaderLabels(["Login", "Nombre", "Tipo", "Cuota ($)"])
        area_layout.addWidget(self.tabla_por_area)
        
        area_group.setLayout(area_layout)
        layout.addWidget(area_group)
        
        # Consulta de profesores por categoría
        prof_group = QtWidgets.QGroupBox("Profesores por Categoría")
        prof_layout = QtWidgets.QVBoxLayout()
        
        prof_sub_layout = QtWidgets.QHBoxLayout()
        prof_sub_layout.addWidget(QtWidgets.QLabel("Categoría:"))
        self.combo_categoria_prof = QtWidgets.QComboBox()
        self.combo_categoria_prof.addItems(["titular", "auxiliar", "asistente", "instructor"])
        prof_sub_layout.addWidget(self.combo_categoria_prof)
        
        self.btn_consultar_prof = QtWidgets.QPushButton("Consultar")
        self.btn_consultar_prof.clicked.connect(self.consultar_profesores_categoria)
        self.btn_consultar_prof.setStyleSheet("background-color: #9b59b6; color: white;")
        prof_sub_layout.addWidget(self.btn_consultar_prof)
        prof_sub_layout.addStretch()
        
        prof_layout.addLayout(prof_sub_layout)
        
        self.tabla_profesores = QtWidgets.QTableWidget()
        self.tabla_profesores.setColumnCount(6)
        self.tabla_profesores.setHorizontalHeaderLabels(["Login", "Nombre", "Categoría", "Grado", "Edad", "Cuota ($)"])
        prof_layout.addWidget(self.tabla_profesores)
        
        prof_group.setLayout(prof_layout)
        layout.addWidget(prof_group)
        
        layout.addStretch()
    
    def crear_tab_estadisticas(self):
        """Crea la pestaña de estadísticas"""
        tab = QtWidgets.QWidget()
        self.tab_widget.addTab(tab, "Estadísticas")
        
        layout = QtWidgets.QVBoxLayout(tab)
        
        # Estadísticas principales
        stats_group = QtWidgets.QGroupBox("Resumen del Sistema")
        stats_layout = QtWidgets.QGridLayout()
        
        self.label_total_usuarios = QtWidgets.QLabel("Total de usuarios: 0")
        self.label_total_profesores = QtWidgets.QLabel("Profesores: 0")
        self.label_total_estudiantes = QtWidgets.QLabel("Estudiantes: 0")
        self.label_total_trabajadores = QtWidgets.QLabel("Trabajadores: 0")
        self.label_ingresos_totales = QtWidgets.QLabel("Ingresos totales: $0")
        self.label_usuario_max_cuota = QtWidgets.QLabel("Mayor cuota: N/A")
        self.label_areas_registradas = QtWidgets.QLabel("Áreas registradas: 0")
        
        # Estilo para las etiquetas
        for label in [self.label_total_usuarios, self.label_ingresos_totales]:
            label.setStyleSheet("font-size: 16px; font-weight: bold; color: #2c3e50;")
        
        stats_layout.addWidget(self.label_total_usuarios, 0, 0)
        stats_layout.addWidget(self.label_ingresos_totales, 0, 1)
        stats_layout.addWidget(self.label_total_profesores, 1, 0)
        stats_layout.addWidget(self.label_total_estudiantes, 1, 1)
        stats_layout.addWidget(self.label_total_trabajadores, 2, 0)
        stats_layout.addWidget(self.label_usuario_max_cuota, 2, 1)
        stats_layout.addWidget(self.label_areas_registradas, 3, 0)
        
        stats_group.setLayout(stats_layout)
        layout.addWidget(stats_group)
        
        # Distribución de usuarios por tipo (gráfico simple)
        dist_group = QtWidgets.QGroupBox("Distribución por Tipo de Usuario")
        dist_layout = QtWidgets.QVBoxLayout()
        
        self.distribucion_text = QtWidgets.QTextEdit()
        self.distribucion_text.setReadOnly(True)
        self.distribucion_text.setMaximumHeight(150)
        dist_layout.addWidget(self.distribucion_text)
        
        dist_group.setLayout(dist_layout)
        layout.addWidget(dist_group)
        
        # Distribución por área
        area_dist_group = QtWidgets.QGroupBox("Usuarios por Área")
        area_dist_layout = QtWidgets.QVBoxLayout()
        
        self.area_dist_text = QtWidgets.QTextEdit()
        self.area_dist_text.setReadOnly(True)
        self.area_dist_text.setMaximumHeight(150)
        area_dist_layout.addWidget(self.area_dist_text)
        
        area_dist_group.setLayout(area_dist_layout)
        layout.addWidget(area_dist_group)
        
        # Botón para actualizar estadísticas
        self.btn_actualizar_stats = QtWidgets.QPushButton("Actualizar Estadísticas")
        self.btn_actualizar_stats.clicked.connect(self.actualizar_estadisticas)
        self.btn_actualizar_stats.setStyleSheet("background-color: #f39c12; color: white; font-weight: bold; padding: 10px;")
        layout.addWidget(self.btn_actualizar_stats)
        
        layout.addStretch()
    
    def setup_ui(self):
        """Configuración inicial de la interfaz"""
        self.setWindowTitle("Sistema de Gestión Universitaria - POO")
        
        # Si se cargó desde .ui, conectar los elementos
        if hasattr(self, 'btnRegistrar'):
            self.btnRegistrar.clicked.connect(self.registrar_usuario)
        
        # Cargar áreas en comboboxes
        self.cargar_areas_combobox()
    
    def conectar_eventos(self):
        """Conecta las señales y slots de la interfaz"""
        # Esta función es principalmente para cuando se carga desde .ui
        pass
    
    def cargar_datos_iniciales(self):
        """Carga algunos datos de ejemplo para pruebas"""
        # Crear algunos usuarios de ejemplo
        area_ingenieria = self.sistema.obtener_area_por_nombre("Facultad de Ingeniería")
        area_ciencias = self.sistema.obtener_area_por_nombre("Facultad de Ciencias")
        
        if area_ingenieria:
            # Estudiante de ejemplo
            estudiante1 = Estudiante(
                "Juan", "Pérez", "Gómez", "12345678", 
                area_ingenieria, "Ingeniería Informática", 3, False
            )
            self.sistema.agregar_usuario(estudiante1)
            
            # Profesor de ejemplo
            profesor1 = Profesor(
                "María", "López", "Rodríguez", "87654321",
                area_ingenieria, "Informática", "doctor", "titular", 45
            )
            self.sistema.agregar_usuario(profesor1)
        
        if area_ciencias:
            # Alumno ayudante de ejemplo
            ayudante1 = AlumnoAyudante(
                "Carlos", "García", "Martínez", "23456789",
                area_ciencias, "Biología", 4, True, "Genética", 2
            )
            self.sistema.agregar_usuario(ayudante1)
            
            # Trabajador de ejemplo
            trabajador1 = Trabajador(
                "Ana", "Martínez", "Sánchez", "34567890",
                area_ciencias, "Bibliotecaria", date(2020, 5, 15)
            )
            self.sistema.agregar_usuario(trabajador1)
    
    def cargar_areas_combobox(self):
        """Carga las áreas en los comboboxes correspondientes"""
        areas = self.sistema.obtener_areas()
        
        # Para el formulario de registro
        if hasattr(self, 'combo_area'):
            self.combo_area.clear()
            self.combo_area.addItems(areas)
        
        # Para la consulta por área
        if hasattr(self, 'combo_consulta_area'):
            self.combo_consulta_area.clear()
            self.combo_consulta_area.addItems(areas)
            if areas:
                self.combo_consulta_area.setCurrentIndex(0)
    
    # MÉTODOS PARA FORMULARIO DE REGISTRO

    def cambiar_formulario(self, tipo_usuario):
        """Cambia el formulario específico según el tipo de usuario seleccionado"""
        # Limpiar layout específico
        for i in reversed(range(self.specific_layout.count())): 
            widget = self.specific_layout.itemAt(i).widget()
            if widget is not None:
                widget.setParent(None)
        
        # Reconstruir formulario según tipo
        if tipo_usuario == "Estudiante":
            self.construir_form_estudiante()
        elif tipo_usuario == "Alumno Ayudante":
            self.construir_form_ayudante()
        elif tipo_usuario == "Profesor":
            self.construir_form_profesor()
        elif tipo_usuario == "Trabajador":
            self.construir_form_trabajador()
    
    def construir_form_estudiante(self):
        """Construye el formulario para Estudiante"""
        row = 0
        
        self.specific_layout.addWidget(QtWidgets.QLabel("Carrera:"), row, 0)
        self.input_carrera = QtWidgets.QLineEdit()
        self.specific_layout.addWidget(self.input_carrera, row, 1)
        
        row += 1
        self.specific_layout.addWidget(QtWidgets.QLabel("Año:"), row, 0)
        self.input_anio = QtWidgets.QSpinBox()
        self.input_anio.setMinimum(1)
        self.input_anio.setMaximum(6)
        self.specific_layout.addWidget(self.input_anio, row, 1)
        
        row += 1
        self.check_becado = QtWidgets.QCheckBox("¿Es becado?")
        self.specific_layout.addWidget(self.check_becado, row, 0, 1, 2)
    
    def construir_form_ayudante(self):
        """Construye el formulario para Alumno Ayudante"""
        row = 0
        
        self.specific_layout.addWidget(QtWidgets.QLabel("Carrera:"), row, 0)
        self.input_carrera_ayudante = QtWidgets.QLineEdit()
        self.specific_layout.addWidget(self.input_carrera_ayudante, row, 1)
        
        row += 1
        self.specific_layout.addWidget(QtWidgets.QLabel("Año:"), row, 0)
        self.input_anio_ayudante = QtWidgets.QSpinBox()
        self.input_anio_ayudante.setMinimum(1)
        self.input_anio_ayudante.setMaximum(6)
        self.specific_layout.addWidget(self.input_anio_ayudante, row, 1)
        
        row += 1
        self.check_becado_ayudante = QtWidgets.QCheckBox("¿Es becado?")
        self.specific_layout.addWidget(self.check_becado_ayudante, row, 0, 1, 2)
        
        row += 1
        self.specific_layout.addWidget(QtWidgets.QLabel("Asignatura:"), row, 0)
        self.input_asignatura = QtWidgets.QLineEdit()
        self.specific_layout.addWidget(self.input_asignatura, row, 1)
        
        row += 1
        self.specific_layout.addWidget(QtWidgets.QLabel("Experiencia (años):"), row, 0)
        self.input_experiencia = QtWidgets.QSpinBox()
        self.input_experiencia.setMinimum(0)
        self.input_experiencia.setMaximum(10)
        self.specific_layout.addWidget(self.input_experiencia, row, 1)
    
    def construir_form_profesor(self):
        """Construye el formulario para Profesor"""
        row = 0
        
        self.specific_layout.addWidget(QtWidgets.QLabel("Departamento:"), row, 0)
        self.input_departamento = QtWidgets.QLineEdit()
        self.specific_layout.addWidget(self.input_departamento, row, 1)
        
        row += 1
        self.specific_layout.addWidget(QtWidgets.QLabel("Grado académico:"), row, 0)
        self.combo_grado = QtWidgets.QComboBox()
        self.combo_grado.addItems(["graduado", "master", "doctor"])
        self.specific_layout.addWidget(self.combo_grado, row, 1)
        
        row += 1
        self.specific_layout.addWidget(QtWidgets.QLabel("Categoría:"), row, 0)
        self.combo_categoria = QtWidgets.QComboBox()
        self.combo_categoria.addItems(["titular", "auxiliar", "asistente", "instructor"])
        self.specific_layout.addWidget(self.combo_categoria, row, 1)
        
        row += 1
        self.specific_layout.addWidget(QtWidgets.QLabel("Edad:"), row, 0)
        self.input_edad = QtWidgets.QSpinBox()
        self.input_edad.setMinimum(22)
        self.input_edad.setMaximum(80)
        self.specific_layout.addWidget(self.input_edad, row, 1)
    
    def construir_form_trabajador(self):
        """Construye el formulario para Trabajador"""
        row = 0
        
        self.specific_layout.addWidget(QtWidgets.QLabel("Ocupación:"), row, 0)
        self.input_ocupacion = QtWidgets.QLineEdit()
        self.specific_layout.addWidget(self.input_ocupacion, row, 1)
        
        row += 1
        self.specific_layout.addWidget(QtWidgets.QLabel("Fecha de inicio:"), row, 0)
        
        fecha_layout = QtWidgets.QHBoxLayout()
        self.input_dia = QtWidgets.QSpinBox()
        self.input_dia.setMinimum(1)
        self.input_dia.setMaximum(31)
        self.input_mes = QtWidgets.QSpinBox()
        self.input_mes.setMinimum(1)
        self.input_mes.setMaximum(12)
        self.input_anio_trab = QtWidgets.QSpinBox()
        self.input_anio_trab.setMinimum(2000)
        self.input_anio_trab.setMaximum(date.today().year)
        self.input_anio_trab.setValue(2020)
        
        fecha_layout.addWidget(QtWidgets.QLabel("Día:"))
        fecha_layout.addWidget(self.input_dia)
        fecha_layout.addWidget(QtWidgets.QLabel("Mes:"))
        fecha_layout.addWidget(self.input_mes)
        fecha_layout.addWidget(QtWidgets.QLabel("Año:"))
        fecha_layout.addWidget(self.input_anio_trab)
        
        fecha_widget = QtWidgets.QWidget()
        fecha_widget.setLayout(fecha_layout)
        self.specific_layout.addWidget(fecha_widget, row, 1)
    
    def limpiar_formulario(self):
        """Limpia todos los campos del formulario"""
        self.input_nombre.clear()
        self.input_apellido1.clear()
        self.input_apellido2.clear()
        self.input_ci.clear()
        
        if hasattr(self, 'combo_area'):
            if self.combo_area.count() > 0:
                self.combo_area.setCurrentIndex(0)
        
        # Limpiar campos específicos según el tipo actual
        tipo = self.combo_tipo_usuario.currentText()
        if tipo == "Estudiante":
            if hasattr(self, 'input_carrera'):
                self.input_carrera.clear()
            if hasattr(self, 'input_anio'):
                self.input_anio.setValue(1)
            if hasattr(self, 'check_becado'):
                self.check_becado.setChecked(False)
        
        elif tipo == "Alumno Ayudante":
            if hasattr(self, 'input_carrera_ayudante'):
                self.input_carrera_ayudante.clear()
            if hasattr(self, 'input_anio_ayudante'):
                self.input_anio_ayudante.setValue(1)
            if hasattr(self, 'check_becado_ayudante'):
                self.check_becado_ayudante.setChecked(False)
            if hasattr(self, 'input_asignatura'):
                self.input_asignatura.clear()
            if hasattr(self, 'input_experiencia'):
                self.input_experiencia.setValue(0)
        
        elif tipo == "Profesor":
            if hasattr(self, 'input_departamento'):
                self.input_departamento.clear()
            if hasattr(self, 'combo_grado'):
                self.combo_grado.setCurrentIndex(0)
            if hasattr(self, 'combo_categoria'):
                self.combo_categoria.setCurrentIndex(0)
            if hasattr(self, 'input_edad'):
                self.input_edad.setValue(30)
        
        elif tipo == "Trabajador":
            if hasattr(self, 'input_ocupacion'):
                self.input_ocupacion.clear()
            if hasattr(self, 'input_dia'):
                self.input_dia.setValue(1)
            if hasattr(self, 'input_mes'):
                self.input_mes.setValue(1)
            if hasattr(self, 'input_anio_trab'):
                self.input_anio_trab.setValue(2020)
        
        self.status_bar.showMessage("Formulario limpiado.", 3000)
    
    def validar_formulario(self):
        """Valida los campos del formulario antes de registrar"""
        # Validar campos comunes
        if not self.input_nombre.text().strip():
            QMessageBox.warning(self, "Error de validación", "El nombre es obligatorio.")
            return False
        
        if not self.input_apellido1.text().strip():
            QMessageBox.warning(self, "Error de validación", "El primer apellido es obligatorio.")
            return False
        
        if not self.input_ci.text().strip():
            QMessageBox.warning(self, "Error de validación", "El CI es obligatorio.")
            return False
        
        # Validar área seleccionada
        if self.combo_area.currentIndex() < 0:
            QMessageBox.warning(self, "Error de validación", "Debe seleccionar un área.")
            return False
        
        # Validar campos específicos según tipo
        tipo = self.combo_tipo_usuario.currentText()
        
        if tipo == "Estudiante":
            if not hasattr(self, 'input_carrera') or not self.input_carrera.text().strip():
                QMessageBox.warning(self, "Error de validación", "La carrera es obligatoria.")
                return False
        
        elif tipo == "Alumno Ayudante":
            if not hasattr(self, 'input_carrera_ayudante') or not self.input_carrera_ayudante.text().strip():
                QMessageBox.warning(self, "Error de validación", "La carrera es obligatoria.")
                return False
            
            if not hasattr(self, 'input_asignatura') or not self.input_asignatura.text().strip():
                QMessageBox.warning(self, "Error de validación", "La asignatura es obligatoria.")
                return False
        
        elif tipo == "Profesor":
            if not hasattr(self, 'input_departamento') or not self.input_departamento.text().strip():
                QMessageBox.warning(self, "Error de validación", "El departamento es obligatorio.")
                return False
        
        elif tipo == "Trabajador":
            if not hasattr(self, 'input_ocupacion') or not self.input_ocupacion.text().strip():
                QMessageBox.warning(self, "Error de validación", "La ocupación es obligatoria.")
                return False
        
        return True
    
    def registrar_usuario(self):
        """Registra un nuevo usuario en el sistema"""
        if not self.validar_formulario():
            return
        
        try:
            # Obtener datos comunes
            nombre = self.input_nombre.text().strip()
            apellido1 = self.input_apellido1.text().strip()
            apellido2 = self.input_apellido2.text().strip()
            ci = self.input_ci.text().strip()
            
            # Obtener área
            area_nombre = self.combo_area.currentText()
            area = self.sistema.obtener_area_por_nombre(area_nombre)
            
            if not area:
                QMessageBox.warning(self, "Error", "Área no válida.")
                return
            
            # Crear usuario según tipo
            tipo = self.combo_tipo_usuario.currentText()
            usuario = None
            
            if tipo == "Estudiante":
                carrera = self.input_carrera.text().strip()
                anio = self.input_anio.value()
                becado = self.check_becado.isChecked()
                
                usuario = Estudiante(nombre, apellido1, apellido2, ci, area, carrera, anio, becado)
            
            elif tipo == "Alumno Ayudante":
                carrera = self.input_carrera_ayudante.text().strip()
                anio = self.input_anio_ayudante.value()
                becado = self.check_becado_ayudante.isChecked()
                asignatura = self.input_asignatura.text().strip()
                experiencia = self.input_experiencia.value()
                
                usuario = AlumnoAyudante(nombre, apellido1, apellido2, ci, area, carrera, anio, becado, asignatura, experiencia)
            
            elif tipo == "Profesor":
                departamento = self.input_departamento.text().strip()
                grado = self.combo_grado.currentText()
                categoria = self.combo_categoria.currentText()
                edad = self.input_edad.value()
                
                usuario = Profesor(nombre, apellido1, apellido2, ci, area, departamento, grado, categoria, edad)
            
            elif tipo == "Trabajador":
                ocupacion = self.input_ocupacion.text().strip()
                dia = self.input_dia.value()
                mes = self.input_mes.value()
                anio_trab = self.input_anio_trab.value()
                fecha_inicio = date(anio_trab, mes, dia)
                
                usuario = Trabajador(nombre, apellido1, apellido2, ci, area, ocupacion, fecha_inicio)
            
            # Agregar usuario al sistema
            if usuario:
                resultado, mensaje = self.sistema.agregar_usuario(usuario)
                
                if resultado:
                    QMessageBox.information(self, "Registro exitoso", mensaje)
                    self.limpiar_formulario()
                    self.mostrar_todos_usuarios()
                    self.actualizar_estadisticas()
                    self.cargar_areas_combobox()
                    self.status_bar.showMessage(f"Usuario {usuario.login} registrado exitosamente.", 5000)
                else:
                    QMessageBox.critical(self, "Error", mensaje)
        
        except Exception as e:
            QMessageBox.critical(self, "Error inesperado", f"Ocurrió un error: {str(e)}")
    
    # MÉTODOS PARA GESTIÓN DE USUARIOS

    def mostrar_todos_usuarios(self):
        """Muestra todos los usuarios en la tabla"""
        usuarios = self.sistema.listar_usuarios()
        self.mostrar_usuarios_en_tabla(usuarios)
    
    def mostrar_usuarios_en_tabla(self, usuarios):
        """Muestra una lista de usuarios en la tabla principal"""
        self.tabla_usuarios.setRowCount(len(usuarios))
        
        for i, usuario in enumerate(usuarios):
            # Login
            self.tabla_usuarios.setItem(i, 0, QTableWidgetItem(usuario['login']))
            
            # Nombre
            self.tabla_usuarios.setItem(i, 1, QTableWidgetItem(usuario['nombre']))
            
            # Apellidos
            apellidos = f"{usuario['apellido1']} {usuario['apellido2']}"
            self.tabla_usuarios.setItem(i, 2, QTableWidgetItem(apellidos))
            
            # Tipo
            self.tabla_usuarios.setItem(i, 3, QTableWidgetItem(usuario['tipo']))
            
            # Área
            self.tabla_usuarios.setItem(i, 4, QTableWidgetItem(usuario['area']))
            
            # Cuota
            self.tabla_usuarios.setItem(i, 5, QTableWidgetItem(f"${usuario['cuota']}"))
            
            # Botón de eliminar
            btn_eliminar = QtWidgets.QPushButton("Eliminar")
            btn_eliminar.setStyleSheet("background-color: #e74c3c; color: white;")
            btn_eliminar.clicked.connect(lambda checked, login=usuario['login']: self.eliminar_usuario(login))
            
            # Botón de detalles
            btn_detalles = QtWidgets.QPushButton("Detalles")
            btn_detalles.setStyleSheet("background-color: #3498db; color: white;")
            btn_detalles.clicked.connect(lambda checked, login=usuario['login']: self.mostrar_detalles_usuario(login))
            
            # Contenedor para botones
            widget_botones = QtWidgets.QWidget()
            layout_botones = QtWidgets.QHBoxLayout(widget_botones)
            layout_botones.addWidget(btn_eliminar)
            layout_botones.addWidget(btn_detalles)
            layout_botones.setContentsMargins(2, 2, 2, 2)
            
            self.tabla_usuarios.setCellWidget(i, 6, widget_botones)
        
        # Ajustar columnas
        self.tabla_usuarios.resizeColumnsToContents()
    
    def filtrar_usuarios(self):
        """Filtra usuarios según criterios de búsqueda"""
        texto_buscar = self.input_buscar.text().lower()
        tipo_filtrar = self.combo_filtrar_tipo.currentText()
        orden = self.combo_ordenar.currentText()
        
        # Obtener todos los usuarios
        todos_usuarios = self.sistema.listar_usuarios()
        
        # Filtrar por texto
        if texto_buscar:
            usuarios_filtrados = [
                u for u in todos_usuarios 
                if texto_buscar in u['nombre'].lower() or 
                   texto_buscar in u['apellido1'].lower() or
                   texto_buscar in u['apellido2'].lower() or
                   texto_buscar in u['login'].lower()
            ]
        else:
            usuarios_filtrados = todos_usuarios
        
        # Filtrar por tipo
        if tipo_filtrar != "Todos":
            usuarios_filtrados = [u for u in usuarios_filtrados if u['tipo'] == tipo_filtrar]
        
        # Ordenar
        if orden == "Login":
            usuarios_filtrados.sort(key=lambda x: x['login'])
        elif orden == "Nombre":
            usuarios_filtrados.sort(key=lambda x: x['nombre'])
        elif orden == "Cuota (Mayor)":
            usuarios_filtrados.sort(key=lambda x: x['cuota'], reverse=True)
        elif orden == "Cuota (Menor)":
            usuarios_filtrados.sort(key=lambda x: x['cuota'])
        
        # Mostrar en tabla
        self.mostrar_usuarios_en_tabla(usuarios_filtrados)
    
    def eliminar_usuario(self, login):
        """Elimina un usuario por su login"""
        respuesta = QMessageBox.question(
            self, "Confirmar eliminación",
            f"¿Está seguro de eliminar al usuario '{login}'?",
            QMessageBox.Yes | QMessageBox.No, QMessageBox.No
        )
        
        if respuesta == QMessageBox.Yes:
            resultado, mensaje = self.sistema.eliminar_usuario(login)
            
            if resultado:
                QMessageBox.information(self, "Eliminación exitosa", mensaje)
                self.mostrar_todos_usuarios()
                self.actualizar_estadisticas()
                self.status_bar.showMessage(mensaje, 5000)
            else:
                QMessageBox.warning(self, "Error", mensaje)
    
    def eliminar_usuario_seleccionado(self):
        """Elimina el usuario seleccionado en la tabla"""
        fila_seleccionada = self.tabla_usuarios.currentRow()
        
        if fila_seleccionada >= 0:
            login = self.tabla_usuarios.item(fila_seleccionada, 0).text()
            self.eliminar_usuario(login)
        else:
            QMessageBox.warning(self, "Selección requerida", "Por favor, seleccione un usuario de la tabla.")
    
    def mostrar_detalles_usuario(self, login):
        """Muestra los detalles de un usuario"""
        usuario = self.sistema.buscar_usuario_por_login(login)
        
        if usuario:
            detalles = f"""
            <h3>Detalles del Usuario: {login}</h3>
            <b>Nombre completo:</b> {usuario.nombre} {usuario.apellido1} {usuario.apellido2}<br>
            <b>CI:</b> {usuario.ci}<br>
            <b>Área/Facultad:</b> {usuario.area.nombre if usuario.area else 'Sin área'}<br>
            <b>Tipo de usuario:</b> {usuario.obtener_tipo_usuario()}<br>
            <b>Cuota mensual:</b> ${usuario.cuota}<br>
            <b>Fecha de registro:</b> {usuario.fecha_creacion}<br>
            """
            
            # Añadir detalles específicos
            if isinstance(usuario, Estudiante):
                detalles += f"""
                <b>Carrera:</b> {usuario.carrera}<br>
                <b>Año:</b> {usuario.anio}<br>
                <b>Becado:</b> {'Sí' if usuario.becado else 'No'}<br>
                """
                
                if isinstance(usuario, AlumnoAyudante):
                    detalles += f"""
                    <b>Asignatura:</b> {usuario.asignatura}<br>
                    <b>Experiencia (años):</b> {usuario.experiencia}<br>
                    """
            
            elif isinstance(usuario, Profesor):
                detalles += f"""
                <b>Departamento:</b> {usuario.departamento}<br>
                <b>Grado académico:</b> {usuario.grado}<br>
                <b>Categoría:</b> {usuario.categoria}<br>
                <b>Edad:</b> {usuario.edad}<br>
                """
            
            elif isinstance(usuario, Trabajador):
                detalles += f"""
                <b>Ocupación:</b> {usuario.ocupacion}<br>
                <b>Fecha de inicio:</b> {usuario.fecha_inicio}<br>
                """
            
            QMessageBox.information(self, f"Detalles de {login}", detalles)
        else:
            QMessageBox.warning(self, "Usuario no encontrado", f"No se encontró el usuario '{login}'")
    
    def exportar_usuarios(self):
        """Exporta la lista de usuarios a un archivo CSV"""
        try:
            from datetime import datetime
            
            usuarios = self.sistema.listar_usuarios()
            
            if not usuarios:
                QMessageBox.warning(self, "Sin datos", "No hay usuarios para exportar.")
                return
            
            # Generar nombre de archivo con fecha
            fecha_actual = datetime.now().strftime("%Y%m%d_%H%M%S")
            nombre_archivo = f"usuarios_universidad_{fecha_actual}.csv"
            
            # Escribir archivo CSV
            with open(nombre_archivo, 'w', encoding='utf-8') as archivo:
                # Encabezados
                archivo.write("Login,Nombre,Apellido1,Apellido2,Tipo,Área,Cuota,Fecha_Registro\n")
                
                # Datos
                for usuario in usuarios:
                    linea = f"{usuario['login']},{usuario['nombre']},{usuario['apellido1']},{usuario['apellido2']},{usuario['tipo']},{usuario['area']},{usuario['cuota']},{date.today()}\n"
                    archivo.write(linea)
            
            QMessageBox.information(
                self, "Exportación exitosa", 
                f"Se exportaron {len(usuarios)} usuarios al archivo:\n{nombre_archivo}"
            )
            
            self.status_bar.showMessage(f"Exportación completada: {nombre_archivo}", 5000)
        
        except Exception as e:
            QMessageBox.critical(self, "Error en exportación", f"No se pudo exportar: {str(e)}")
    
    # MÉTODOS PARA CONSULTAS ESPECIALIZADAS
    
    def consultar_por_area(self):
        """Consulta usuarios por área seleccionada"""
        area_nombre = self.combo_consulta_area.currentText()
        
        if not area_nombre:
            QMessageBox.warning(self, "Selección requerida", "Por favor, seleccione un área.")
            return
        
        usuarios = self.sistema.usuarios_por_area(area_nombre)
        
        # Mostrar en tabla
        self.tabla_por_area.setRowCount(len(usuarios))
        
        for i, usuario in enumerate(usuarios):
            self.tabla_por_area.setItem(i, 0, QTableWidgetItem(usuario['login']))
            self.tabla_por_area.setItem(i, 1, QTableWidgetItem(usuario['nombre_completo']))
            self.tabla_por_area.setItem(i, 2, QTableWidgetItem(usuario['tipo']))
            self.tabla_por_area.setItem(i, 3, QTableWidgetItem(f"${usuario['cuota']}"))
        
        # Ajustar columnas
        self.tabla_por_area.resizeColumnsToContents()
        
        # Actualizar barra de estado
        self.status_bar.showMessage(f"Mostrando {len(usuarios)} usuarios del área: {area_nombre}", 5000)
    
    def consultar_profesores_categoria(self):
        """Consulta profesores por categoría seleccionada"""
        categoria = self.combo_categoria_prof.currentText()
        
        profesores = self.sistema.profesores_por_categoria(categoria)
        
        # Mostrar en tabla
        self.tabla_profesores.setRowCount(len(profesores))
        
        for i, profesor in enumerate(profesores):
            self.tabla_profesores.setItem(i, 0, QTableWidgetItem(profesor.login))
            
            nombre_completo = f"{profesor.nombre} {profesor.apellido1} {profesor.apellido2}"
            self.tabla_profesores.setItem(i, 1, QTableWidgetItem(nombre_completo))
            
            self.tabla_profesores.setItem(i, 2, QTableWidgetItem(profesor.categoria))
            self.tabla_profesores.setItem(i, 3, QTableWidgetItem(profesor.grado))
            self.tabla_profesores.setItem(i, 4, QTableWidgetItem(str(profesor.edad)))
            self.tabla_profesores.setItem(i, 5, QTableWidgetItem(f"${profesor.cuota}"))
        
        # Ajustar columnas
        self.tabla_profesores.resizeColumnsToContents()
        
        # Actualizar barra de estado
        self.status_bar.showMessage(f"Mostrando {len(profesores)} profesores de categoría: {categoria}", 5000)
    
    # MÉTODOS PARA ESTADÍSTICAS

    def actualizar_estadisticas(self):
        """Actualiza las estadísticas del sistema"""
        stats = self.sistema.obtener_estadisticas()
        
        # Actualizar etiquetas
        self.label_total_usuarios.setText(f"Total de usuarios: {stats['total_usuarios']}")
        self.label_total_profesores.setText(f"Profesores: {stats['total_profesores']}")
        self.label_total_estudiantes.setText(f"Estudiantes: {stats['total_estudiantes']}")
        self.label_total_trabajadores.setText(f"Trabajadores: {stats['total_trabajadores']}")
        self.label_ingresos_totales.setText(f"Ingresos totales: ${stats['ingresos_totales']}")
        self.label_usuario_max_cuota.setText(f"Mayor cuota: {stats['usuario_max_cuota']}")
        self.label_areas_registradas.setText(f"Áreas registradas: {stats['areas_registradas']}")
        
        # Actualizar distribución por tipo
        if stats['total_usuarios'] > 0:
            distribucion_texto = f"""
            Total: {stats['total_usuarios']} usuarios
            - Profesores: {stats['total_profesores']} ({stats['total_profesores']/stats['total_usuarios']*100:.1f}%)
            - Estudiantes: {stats['total_estudiantes']} ({stats['total_estudiantes']/stats['total_usuarios']*100:.1f}%)
            - Trabajadores: {stats['total_trabajadores']} ({stats['total_trabajadores']/stats['total_usuarios']*100:.1f}%)
            """
        else:
            distribucion_texto = "No hay usuarios registrados."
        
        self.distribucion_text.setText(distribucion_texto)
        
        # Actualizar distribución por área
        if self.sistema.areas:
            area_dist_texto = "Usuarios por área:\n"
            for area in self.sistema.areas:
                usuarios_area = len([u for u in self.sistema.usuarios if u.area and u.area.nombre == area.nombre])
                area_dist_texto += f"- {area.nombre}: {usuarios_area} usuarios\n"
        else:
            area_dist_texto = "No hay áreas registradas."
        
        self.area_dist_text.setText(area_dist_texto)
        
        self.status_bar.showMessage("Estadísticas actualizadas.", 3000)


# EJECUCIÓN PRINCIPAL

def main():
    app = QtWidgets.QApplication(sys.argv)
    
    # Establecer estilo visual
    app.setStyle('Fusion')
    
    # Crear y mostrar ventana principal
    window = MainWindow()
    window.show()
    
    sys.exit(app.exec_())


if __name__ == "__main__":
    main()