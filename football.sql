-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Ноя 22 2023 г., 01:45
-- Версия сервера: 8.0.30
-- Версия PHP: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `football`
--

-- --------------------------------------------------------

--
-- Структура таблицы `remarks`
--

CREATE TABLE `remarks` (
  `ID_user` int DEFAULT NULL,
  `theme` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `text` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `login_user` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `remarks`
--

INSERT INTO `remarks` (`ID_user`, `theme`, `text`, `login_user`) VALUES
(1, '1', '1', '1'),
(3, 'Theme', 'cool', 'Серёга'),
(3, '12', '12', 'login'),
(3, '12', '12', 'login'),
(3, 'aaa', 'ddd', 'login'),
(4, 'aaaaaa', 'bvbb', 'sanya'),
(2, 'xxx', 'aa', '123'),
(1, '12', '132', '1'),
(1, '1x2', '12xe', '1'),
(1, 'x123', '1x23', '1'),
(1, '1x23', '1x23', '1'),
(1, 'z32d', 'qwze', '1'),
(1, 'wf', 'we', '1');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `ID` int NOT NULL,
  `Name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Login` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `Pass` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`ID`, `Name`, `Login`, `Pass`) VALUES
(1, '1', '1', '$2a$07$HhWu6eBFjv5oejD7KCzpbOKBhd9seTlGZ.jJ7ISZE/rEr0Tdy29/W'),
(2, 'Anton', '123', '$2a$07$fJ/hpSU5/Nou7GOJBcm9h.Uhnr5og.dx5BaLRhiFV0L/cbRrtHzrq'),
(3, 'Серёга', 'login', '$2a$07$ptdol9Zcrd8fZbJNNh9iO.ZE5zh5D78Ww51Rd8HfwPUnTbGRiz/MO'),
(4, 'Санёк', 'sanya', '$2a$07$fJyUGBH/hmNSUO0Of3yDzOzFLoNDbQ3cEAExrktL3QMzl/iJ4svuy'),
(5, '1x3q', '1q3x2rq', '$2a$07$JKGVPrwPyTBvE4UnGsXELuBS.eHONv.Eez.obHhMTFdokxb9cbSPq'),
(6, 'dx32x', 'd2zq43r', '$2a$07$5yMpFlfsdOPT20m0t7wk2uSk3S6fLI1lUAqoAcfxluQTwMWwxdX4a'),
(7, '2xd32z', '2z3redx2', '$2a$07$FfiwQamAe4/SdoUr35pRieZAV0Qoz1/8q9jUEQgIszmpneuOoAIvm'),
(8, 'ex32', 'x23e', '$2a$07$HDRygU2whme9V3oI.yipCemIP5qHNj5AaWYyia5b92fwDCm2dXav2');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`),
  ADD UNIQUE KEY `users_ID_IDX` (`ID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `ID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
