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
-- Table structure for table `ods_name`
--

DROP TABLE IF EXISTS `ods_name`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ods_name` (
  `IDNO` int NOT NULL AUTO_INCREMENT,
  `time` date DEFAULT NULL,
  `adress` varchar(100) DEFAULT NULL,
  `Registration_Amount` varchar(45) DEFAULT '2000',
  `Invitation_Link` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`IDNO`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ods_name`
--

LOCK TABLES `ods_name` WRITE;
/*!40000 ALTER TABLE `ods_name` DISABLE KEYS */;
INSERT INTO `ods_name` VALUES (1,'2024-04-22','2mnUp37nese3mePmH5VcmUd6PzxGJ2v3iuf7LAeriuNL','2000','https://soll.im/HF427'),(2,'2024-04-22','HJHKJKJHJHKJHKJHJKHKJ','2000','https://soll.im/HF428'),(3,'2024-04-22','112121221212112','2000','https://soll.im/HF429'),(4,'2024-04-22','2323232323232323','2000','https://soll.im/HF430'),(5,'2024-04-22','888888888888888888','2000','https://soll.im/HF488'),(6,'2024-04-22','2222222222222','2000','https://soll.im/HF489'),(7,'2024-04-27','                                 2mnUp37nese3mePmH5VcmUd6PzxGJ2v3iuf7LAeriuNL                       ','2000','Salvz'),(8,'2024-04-27','                                 2mnUp37nese3mePmH5VcmUd6PzxGJ2v3iuf7LAeriuNL                       ','2000','JJNTh'),(9,'2024-04-27','                                 2mnUp37nese3mePmH5VcmUd6PzxGJ2v3iuf7LAeriuNL                       ','2000','FQXZc');
/*!40000 ALTER TABLE `ods_name` ENABLE KEYS */;
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
