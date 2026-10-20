# Proyecto Web Vanilla + MySQL Local

Plantilla base limpia, moderna y profesional para el desarrollo de sitios y aplicaciones web utilizando **HTML5 semántico**, **CSS3 moderno** y **JavaScript vanilla** conectado a una base de datos local en **MySQL** a través de una API ligera en **PHP con PDO**.

---

## 📁 Estructura del Proyecto

```text
proyecto-web/
│
├── index.html              # Página principal con interfaz y panel de control MySQL
├── database.sql            # Script SQL de creación de base de datos y tabla inicial
│
├── api/                    # Capa de Backend / API REST en PHP (PDO)
│   ├── config.php          # Configuración y credenciales de conexión a MySQL
│   ├── status.php          # Endpoint GET para validar el estado de MySQL
│   └── usuarios.php        # Endpoint GET / POST para consultar e insertar registros
│
├── assets/                 # Recursos estáticos del proyecto
│   ├── css/
│   │   └── styles.css      # Hoja de estilos global, diseño responsive y componentes
│   ├── js/
│   │   └── app.js          # Lógica frontend: peticiones fetch(), UI reactiva y validación
│   ├── img/                # Fotografías e imágenes generales
│   ├── icons/              # Favicons, iconos SVG y recursos gráficos pequeños
│   └── fonts/              # Fuentes y tipografías locales
│
├── pages/                  # Vistas o páginas HTML secundarias (contacto, acerca, etc.)
│
├── components/             # Fragmentos o componentes reutilizables
│
├── README.md               # Documentación y guía del proyecto
└── .gitignore              # Exclusiones de Git (archivos de SO, IDEs y temporales)
```

---

## 📂 Descripción y Función de Carpetas

| Carpeta / Archivo | Propósito y Uso |
| :--- | :--- |
| `index.html` | Interfaz principal con panel de control de MySQL (estado en tiempo real, formulario y tabla de usuarios). |
| `database.sql` | Script SQL para crear la base de datos `proyecto_db` y la tabla `usuarios` en tu servidor MySQL. |
| `api/` | Carpeta de backend encargada de comunicar el cliente web de forma segura con MySQL. |
| `api/config.php` | Parámetros de conexión PDO (`DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`). |
| `api/status.php` | Devuelve en JSON si la base de datos está activa, la versión de MySQL y el nombre de la BD. |
| `api/usuarios.php` | Procesa peticiones `GET` (listar registros) y `POST` (crear nuevos registros con sentencias preparadas). |
| `assets/css/` | Estilos con reset, variables CSS, layout, estilos para el panel de base de datos y diseño responsive. |
| `assets/js/` | Archivo JavaScript con `"use strict"`, llamadas `fetch()` asíncronas y renderizado dinámico. |
| `assets/img/`, `icons/`, `fonts/` | Recursos multimedia y fuentes locales. |
| `pages/`, `components/` | Espacios reservados para modularizar páginas y componentes HTML adicionales. |
| `.gitignore` | Excluye archivos del sistema operativo, configuraciones de IDEs y temporales. |

---

## ⚙️ Paso a Paso: Conexión con MySQL Local

### 1. Inicializar la base de datos en MySQL
Abre tu cliente de MySQL favorito (MySQL Workbench, phpMyAdmin, DBeaver o la consola de comandos de MySQL) y ejecuta el contenido del archivo [`database.sql`](file:///c:/Dev/Repositories/proyecto-lizcano/database.sql):

```sql
CREATE DATABASE IF NOT EXISTS proyecto_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE proyecto_db;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Configurar tus credenciales en `api/config.php`
Abre el archivo [`api/config.php`](file:///c:/Dev/Repositories/proyecto-lizcano/api/config.php) y verifica o ajusta las credenciales de tu instalación local:

```php
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'proyecto_db');
define('DB_USER', 'root');
define('DB_PASS', 'tu_password_aqui'); // Déjalo vacío "" si root no tiene contraseña
```

---

## 🚀 Cómo Iniciar el Proyecto

Para que el navegador pueda comunicarse con la API de PHP y MySQL, ejecuta el servidor de desarrollo integrado de PHP:

1. Abre una terminal en la carpeta del proyecto (`c:\Dev\Repositories\proyecto-lizcano`).
2. Ejecuta el siguiente comando:
   ```bash
   php -S localhost:8000
   ```
3. Abre tu navegador en:
   👉 **[http://localhost:8000](http://localhost:8000)**

### ¿Qué verás al abrirlo?
- **Indicador de Conexión en Vivo:** El frontend consultará `/api/status.php` automáticamente. Si MySQL está activo y las credenciales son correctas, el indicador cambiará a color verde ("Conexión a MySQL Exitosa").
- **Tabla reactiva:** Cargará los registros existentes de la tabla `usuarios`.
- **Formulario interactivo:** Te permitirá registrar nuevos usuarios al instante mediante `POST`, guardándolos de forma segura en MySQL mediante sentencias preparadas de PDO.

---

## 🔒 Arquitectura y Seguridad

- **Separación de Responsabilidades:** El navegador no expone credenciales ni se conecta de manera directa al puerto TCP de MySQL. Todo pasa por la API REST controlada.
- **Sentencias Preparadas (PDO):** Protección completa contra ataques de inyección SQL (SQL Injection).
- **Sanitización y Validación:** Validación de correos electrónicos y escape de entidades HTML para evitar ataques Cross-Site Scripting (XSS).
