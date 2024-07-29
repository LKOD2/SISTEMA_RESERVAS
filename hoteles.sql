-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-07-2024 a las 22:43:19
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `hoteles`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `habitaciones`
--

CREATE TABLE `habitaciones` (
  `ID` int(11) NOT NULL,
  `numero` int(11) DEFAULT NULL,
  `tipo` varchar(50) DEFAULT NULL,
  `estado` varchar(50) DEFAULT NULL,
  `orientacion` varchar(50) DEFAULT NULL,
  `precio` int(11) DEFAULT NULL,
  `hoteles_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `habitaciones`
--

INSERT INTO `habitaciones` (`ID`, `numero`, `tipo`, `estado`, `orientacion`, `precio`, `hoteles_id`) VALUES
(1, 101, 'doble', 'ocupada', 'norte', 20000, 2),
(2, 2, 'doble', 'limpieza', 'norte', 40000, 2),
(6, 200, 'simple', 'limpieza', 'norte', 20000, 2),
(7, 3, 'triple', 'disponible', 'norte', 60000, 2),
(8, 1, 'simple', 'limpieza', 'norte', 20000, 2),
(9, 4, 'doble', 'disponible', 'norte', 20000, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hoteles`
--

CREATE TABLE `hoteles` (
  `ID` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `direccion` varchar(255) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `hoteles`
--

INSERT INTO `hoteles` (`ID`, `nombre`, `direccion`, `estado`) VALUES
(2, 'warrior', 'calle falsa 123, caca', 'activo'),
(6, 'perro', 'calle falsa 123, caca', 'activo'),
(7, 'Duerme bien', 'calle falsa 123', 'activo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `huespedes`
--

CREATE TABLE `huespedes` (
  `ID` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pais` varchar(100) DEFAULT NULL,
  `telefono` int(11) DEFAULT NULL,
  `tipo_documento` varchar(100) DEFAULT NULL,
  `num_documento` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `huespedes`
--

INSERT INTO `huespedes` (`ID`, `nombre`, `apellido`, `email`, `pais`, `telefono`, `tipo_documento`, `num_documento`, `estado`) VALUES
(64, 'homero', 'simpson', 'homero@gmail.com', 'Chile', 0, 'rut', '123456789', 'inactivo'),
(65, 'marge', 'simpson', 'marge@gmail.com', 'Chile', 0, 'rut', '111111111', 'inactivo'),
(66, 'bart', 'simpson', 'bart@gmail.com', 'Chile', 0, 'rut', '333333333', 'inactivo'),
(67, 'lisa', 'simpson', 'lisa@gmail.com', 'Chile', 0, 'rut', '444444444', 'inactivo'),
(68, 'abeja', 'reina', 'abeja@prueba.cl', 'Chile', 999261155, 'rut', '000000000', 'inactivo'),
(69, 'nedd', 'flanders', 'nedd@gmail.com', 'chile', 0, 'rut', '555555555', 'activo'),
(70, 'nelson', 'monts', 'nelson@gmail.com', 'USA', 0, 'id-card', '777777777', 'activo'),
(71, 'nelson', 'monts', 'nelson@gmail.com', 'Estados Unidos', 0, 'rut', '989898989', 'inactivo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `hues_res`
--

CREATE TABLE `hues_res` (
  `ID` int(11) NOT NULL,
  `huespedes_id` int(11) DEFAULT NULL,
  `reservas_id` int(11) DEFAULT NULL,
  `responsable` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `ID` int(11) NOT NULL,
  `tipo_pago` varchar(50) DEFAULT NULL,
  `precio_inicial` float DEFAULT NULL,
  `adelanto` float DEFAULT NULL,
  `restante` float DEFAULT NULL,
  `multa` float DEFAULT 0,
  `total` float DEFAULT 0,
  `estado_pago` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reservas`
--

CREATE TABLE `reservas` (
  `ID` int(11) NOT NULL,
  `habitaciones_id` int(11) DEFAULT NULL,
  `pagos_id` int(11) DEFAULT NULL,
  `usuarios_usuario` varchar(50) DEFAULT NULL,
  `fecha_entrada` date DEFAULT NULL,
  `fecha_salida` date DEFAULT NULL,
  `observacion` varchar(255) DEFAULT NULL,
  `cant_personas` int(11) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usuario` varchar(50) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL,
  `apellido` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `clave` varchar(255) NOT NULL,
  `rol` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usuario`, `nombre`, `apellido`, `email`, `clave`, `rol`, `estado`) VALUES
('abeja', 'abeja', 'reina', 'abeja@prueba.cl', 'scrypt:32768:8:1$v9z5GJRMuDiIb8Mm$d06e765ec491dce7b5cce1971685690d54b9b0eee82be632bd11785c27e5679e6e2d78f09432cd6d30a6291ba94c17176c6805b33a9cb07551b0cd3247cd81a1', 'empleado', 'activo'),
('apu', 'apus', 'nahasapeema', 'apu@gmail.com', 'scrypt:32768:8:1$fQyMm4OjuzPNBtNc$a0e114c71594da8ea4801dd73ffbb1e02f38611c974684fb655468320ba342307ccf9fddb643754af284aa66114d8fbe05f3fb32a7425e85ebadb71fc940bb53', 'empleado', 'activo'),
('diego', 'diego', 'arias', 'diego@gmail.com', 'scrypt:32768:8:1$bAuv34AK4TPZyes2$fe7b250c09eea8ed74d7be42937faa8f72b3c26288f6c25d479dc83d8a87861f84e103483c3d293db837bab86d1fa9f4f4a737c0e13fb0e6db38922650e93ee1', 'admin', 'activo'),
('homero', 'homero', 'simpson', 'homero@gmail.com', 'scrypt:32768:8:1$XRlFDnBGGmenAP8K$2c82d938f88cfba95198058a00a95d8486b7335107930c8dde778067a51f79a7cb7d92e9ca7d47f45c7c3de30950c1898df400a1c440ada86f845108a8145c7c', 'empleado', 'desactivo');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `hoteles_id` (`hoteles_id`);

--
-- Indices de la tabla `hoteles`
--
ALTER TABLE `hoteles`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `huespedes`
--
ALTER TABLE `huespedes`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `hues_res`
--
ALTER TABLE `hues_res`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `huespedes_id` (`huespedes_id`),
  ADD KEY `reservas_id` (`reservas_id`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`ID`);

--
-- Indices de la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `habitaciones_id` (`habitaciones_id`),
  ADD KEY `pagos_id` (`pagos_id`),
  ADD KEY `usuarios_usuario` (`usuarios_usuario`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `hoteles`
--
ALTER TABLE `hoteles`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `huespedes`
--
ALTER TABLE `huespedes`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT de la tabla `hues_res`
--
ALTER TABLE `hues_res`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT de la tabla `reservas`
--
ALTER TABLE `reservas`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=65;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `habitaciones`
--
ALTER TABLE `habitaciones`
  ADD CONSTRAINT `habitaciones_ibfk_1` FOREIGN KEY (`hoteles_id`) REFERENCES `hoteles` (`ID`);

--
-- Filtros para la tabla `hues_res`
--
ALTER TABLE `hues_res`
  ADD CONSTRAINT `hues_res_ibfk_1` FOREIGN KEY (`huespedes_id`) REFERENCES `huespedes` (`ID`),
  ADD CONSTRAINT `hues_res_ibfk_2` FOREIGN KEY (`reservas_id`) REFERENCES `reservas` (`ID`);

--
-- Filtros para la tabla `reservas`
--
ALTER TABLE `reservas`
  ADD CONSTRAINT `reservas_ibfk_1` FOREIGN KEY (`habitaciones_id`) REFERENCES `habitaciones` (`ID`),
  ADD CONSTRAINT `reservas_ibfk_2` FOREIGN KEY (`pagos_id`) REFERENCES `pagos` (`ID`),
  ADD CONSTRAINT `reservas_ibfk_3` FOREIGN KEY (`usuarios_usuario`) REFERENCES `usuarios` (`usuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
