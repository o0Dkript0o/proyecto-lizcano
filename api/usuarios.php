<?php
/**
 * ============================================================================
 * ENDPOINT DE GESTIÓN DE USUARIOS (CRUD BÁSICO - GET y POST)
 * ============================================================================
 * Métodos soportados:
 * - GET: Retorna lista de usuarios registrados en MySQL.
 * - POST: Registra un nuevo usuario con name y correo electrónico.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

// Manejo de preflight para CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    responderJSON(true, 'OK', null, 200);
}

try {
    $conexion = obtenerConexion();
    $metodo = $_SERVER['REQUEST_METHOD'];

    // ------------------------------------------------------------------------
    // MÉTODO GET: Listar registros
    // ------------------------------------------------------------------------
    if ($metodo === 'GET') {
        $stmt = $conexion->query('SELECT id, name, email, created_at FROM users ORDER BY id DESC');
        $usuarios = $stmt->fetchAll();

        responderJSON(true, 'Usuarios obtenidos correctamente.', [
            'total'    => count($usuarios),
            'usuarios' => $usuarios
        ]);
    }

    // ------------------------------------------------------------------------
    // MÉTODO POST: Crear nuevo registro
    // ------------------------------------------------------------------------
    if ($metodo === 'POST') {
        // Obtener datos desde JSON en el cuerpo de la petición o desde form-data
        $cuerpo = file_get_contents('php://input');
        $datosJSON = json_decode($cuerpo, true);

        $name     = trim($datosJSON['name'] ?? $_POST['name'] ?? '');
        $email    = trim($datosJSON['email'] ?? $_POST['email'] ?? '');
        $password = trim($datosJSON['password'] ?? $_POST['password'] ?? '');

        // Validaciones básicas
        if ($name === '' || $email === '' || $password === '') {
            responderJSON(false, 'El nombre, correo electrónico y la contraseña son obligatorios.', null, 400);
        }

        if (strlen($password) < 4) {
            responderJSON(false, 'La contraseña debe contener al menos 4 caracteres.', null, 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            responderJSON(false, 'El formato del correo electrónico no es válido.', null, 400);
        }

        // Inserción segura con sentencia preparada y hash de contraseña
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);
        $sql = 'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (:name, :email, :password, NOW(), NOW())';
        $stmt = $conexion->prepare($sql);
        $stmt->execute([
            ':name'     => htmlspecialchars($name, ENT_QUOTES, 'UTF-8'),
            ':email'    => strtolower($email),
            ':password' => $passwordHash
        ]);

        $nuevoId = (int)$conexion->lastInsertId();

        responderJSON(true, 'Usuario registrado con éxito en MySQL.', [
            'id'         => $nuevoId,
            'name'       => $name,
            'email'      => $email,
            'created_at' => date('Y-m-d H:i:s')
        ], 201);
    }

    // Método no permitido
    responderJSON(false, 'Método HTTP no soportado. Usa GET o POST.', null, 405);

} catch (PDOException $e) {
    // Manejo de error por clave duplicada (ej. email ya existente)
    if ($e->getCode() === '23000') {
        responderJSON(false, 'El correo electrónico ya se encuentra registrado.', null, 409);
    }

    responderJSON(false, 'Error en la base de datos: ' . $e->getMessage(), null, 500);
}
