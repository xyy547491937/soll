-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: sell
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ods_invite`
--

DROP TABLE IF EXISTS `ods_invite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ods_invite` (
  `time` datetime DEFAULT NULL,
  `adress` varchar(100) DEFAULT NULL,
  `cookie` varchar(45) DEFAULT NULL,
  `yqlj` varchar(45) DEFAULT NULL,
  `jiangli` varchar(45) DEFAULT NULL,
  `beiyaoqingren` varchar(100) DEFAULT NULL,
  `yue` varchar(45) DEFAULT NULL,
  `IDNO` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ods_invite`
--

LOCK TABLES `ods_invite` WRITE;
/*!40000 ALTER TABLE `ods_invite` DISABLE KEYS */;
INSERT INTO `ods_invite` VALUES ('2024-04-22 12:09:53','2mnUp37nese3mePmH5VcmUd6PzxGJ2v3iuf7LAeriuNL',NULL,'https://soll.im/HF427','2000','EW23423423EWR','2000',1),('2024-04-22 12:14:49','112121221212112',NULL,'https://soll.im/HF429','2000','234WEDSA','2000',3),('2024-04-22 12:14:49','2323232323232323',NULL,'https://soll.im/HF430','2000','2131323SADA','2000',4),('2024-04-22 12:09:53','2mnUp37nese3mePmH5VcmUd6PzxGJ2v3iuf7LAeriuNL',NULL,'https://soll.im/HF427','2000','DWQEQWE12321','2000',5),('2024-04-27 12:29:20','888888888888888888','',NULL,'2000','0iI)R','0',NULL),('2024-04-27 13:54:08','ewef','','FNQjz','2000','ewefadsfafdsafafdsafsdafsdafa','0',NULL),('2024-04-27 14:02:52','ewef','','FNQjz','2000','ewefadsfafdsafafdsafsdafsdaf','0',NULL),('2024-04-27 14:03:35','ewef','','FNQjz','2000','ewefadsfafdsafafdsafsdafsda3','0',NULL),('2024-04-27 14:04:33','ewef','','FNQjz','2000','ewefadsfafdsafafdsafsdafs','0',NULL),('2024-04-27 14:09:40','ewef','','FNQjz','2000','ewefadsfafdsafafdsafsdafs33','0',NULL),('2024-04-27 14:26:36','ewef','','FNQjz','2000','ewefadsfafdsafsafsdafs33','0',NULL),('2024-04-27 14:28:16','ewef','','FNQjz','2000','ewefadsfafdsafsafsdfs33','0',NULL),('2024-04-27 14:43:03','ewef','','FNQjz','2000','ewefadsfafdsafsafsdfs3','0',NULL),('2024-04-27 14:43:11','ewef','','FNQjz','2000','ewefadsfafdsafsdfs3','0',NULL),('2024-04-27 14:46:36','ewef','','FNQjz','2000','ewefadsfaafsdfs3','0',NULL);
/*!40000 ALTER TABLE `ods_invite` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-04-27 17:26:08
