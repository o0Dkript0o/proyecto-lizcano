<?php
/**
 * ============================================================================
 * ENDPOINT DE VERIFICACIÓN DE ESTADO DE LA CONEXIÓN A MYSQL
 * ============================================================================
 * Método: GET
 * Retorna estado de la conexión a MySQL en JSON.
 */

declare(strict_types=1);

require_once __DIR__ . '/config.php';

try {
    $conexion = obtenerConexion();

    // Consulta simple para validar estado del servidor MySQL
    $versionQuery = $conexion->query('SELECT VERSION() AS version, DATABASE() AS database_name');
    $info = $versionQuery->fetch();

    responderJSON(true, 'Conexión a MySQL establecida correctamente.', [
        'servidor'       => DB_HOST . ':' . DB_PORT,
        'base_de_datos'  => $info['database_name'] ?? DB_NAME,
        'mysql_version'  => $info['version'] ?? 'Desconocida',
        'usuario'        => DB_USER,
        'estado'         => 'Conectado'
    ], 200);

} catch (PDOException $e) {
    responderJSON(false, 'Error al conectar con la base de datos MySQL.', [
        'error_codigo' => $e->getCode(),
        'error_mensaje' => $e->getMessage(),
        'ayuda' => 'Verifica que el servicio MySQL esté corriendo y que las credenciales en api/config.php coincidan con tu usuario y contraseña de MySQL.'
    ], 500);
}
