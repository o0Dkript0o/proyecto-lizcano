<?php
/**
 * ============================================================================
 * CONFIGURACIÓN DE CONEXIÓN A BASE DE DATOS LOCAL MYSQL (PDO)
 * ============================================================================
 * Ajusta aquí tus credenciales de MySQL según tu instalación local.
 */

declare(strict_types=1);

// Parámetros de conexión a MySQL local
define('DB_HOST', '127.0.0.1');
define('DB_PORT', '3306');
define('DB_NAME', 'TU_DB');
define('DB_USER', 'TU_USUARIO');
define('DB_PASS', '?'); // Coloca aquí la contraseña de tu usuario MySQL si tiene una

/**
 * Establece y retorna una instancia de conexión PDO a MySQL.
 * 
 * @return PDO Instancia de conexión PDO activa.
 * @throws PDOException Si falla la conexión.
 */
function obtenerConexion(): PDO
{
    static $pdo = null;

    if ($pdo === null) {
        $dsn = sprintf(
            'mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4',
            DB_HOST,
            DB_PORT,
            DB_NAME
        );

        $opciones = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
        ];

        $pdo = new PDO($dsn, DB_USER, DB_PASS, $opciones);
    }

    return $pdo;
}

/**
 * Envía una respuesta estandarizada en formato JSON y finaliza la ejecución.
 * 
 * @param bool $success Indica si la operación fue exitosa.
 * @param string $message Mensaje descriptivo.
 * @param mixed $data Datos adicionales a retornar.
 * @param int $statusCode Código de estado HTTP (200, 400, 500, etc.).
 */
function responderJSON(bool $success, string $message, mixed $data = null, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');

    echo json_encode([
        'success'   => $success,
        'message'   => $message,
        'data'      => $data,
        'timestamp' => date('Y-m-d H:i:s')
    ], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);

    exit;
}
