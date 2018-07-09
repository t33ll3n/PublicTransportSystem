-- MySQL dump 10.13  Distrib 5.7.18, for Linux (x86_64)
--
-- Host: localhost    Database: public_Transport_System
-- ------------------------------------------------------
-- Server version	5.7.18-0ubuntu0.16.10.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Linija`
--


DROP TABLE IF EXISTS `Linija`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Linija` (
  `linija_id` int(11) NOT NULL AUTO_INCREMENT,
  `linija_ime` varchar(255) NOT NULL,
  `isHoliday` tinyint(1) NOT NULL,
  `isChecked` tinyint(1) NOT NULL,
  PRIMARY KEY (`linija_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Linija`
--

LOCK TABLES `Linija` WRITE;
/*!40000 ALTER TABLE `Linija` DISABLE KEYS */;
/*!40000 ALTER TABLE `Linija` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Ocena_linije`
--

DROP TABLE IF EXISTS `Ocena_linije`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Ocena_linije` (
  `ocena_id` int(11) NOT NULL AUTO_INCREMENT,
  `linija_id` int(11) NOT NULL,
  `uporabnik_id` int(11) NOT NULL,
  `ocena` tinyint(1) NOT NULL,
  PRIMARY KEY (`ocena_id`,`linija_id`,`uporabnik_id`),
  KEY `uporabnik_id` (`uporabnik_id`),
  CONSTRAINT `Ocena_linije_ibfk_1` FOREIGN KEY (`uporabnik_id`) REFERENCES `Uporabnik` (`uporabnik_id`),
  CONSTRAINT `Ocena_linije_ibfk_2` FOREIGN KEY (`uporabnik_id`) REFERENCES `Uporabnik` (`uporabnik_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Ocena_linije`
--

LOCK TABLES `Ocena_linije` WRITE;
/*!40000 ALTER TABLE `Ocena_linije` DISABLE KEYS */;
/*!40000 ALTER TABLE `Ocena_linije` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Postaja`
--

DROP TABLE IF EXISTS `Postaja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Postaja` (
  `postaja_id` int(11) NOT NULL AUTO_INCREMENT,
  `postaja_ime` varchar(255) NOT NULL,
  `altitude` float DEFAULT NULL,
  `longitude` float DEFAULT NULL,
  `isChecked` tinyint(1) NOT NULL,
  PRIMARY KEY (`postaja_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Postaja`
--

LOCK TABLES `Postaja` WRITE;
/*!40000 ALTER TABLE `Postaja` DISABLE KEYS */;
/*!40000 ALTER TABLE `Postaja` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Uporabnik`
--

DROP TABLE IF EXISTS `Uporabnik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Uporabnik` (
  `uporabnik_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `isCompany` tinyint(1) NOT NULL,
  PRIMARY KEY (`uporabnik_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Uporabnik`
--

LOCK TABLES `Uporabnik` WRITE;
/*!40000 ALTER TABLE `Uporabnik` DISABLE KEYS */;
/*!40000 ALTER TABLE `Uporabnik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Urnik`
--

DROP TABLE IF EXISTS `Urnik`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Urnik` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `linija_id` int(11) NOT NULL,
  `zacetni_cas` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `linija_id` (`linija_id`),
  CONSTRAINT `Urnik_ibfk_1` FOREIGN KEY (`linija_id`) REFERENCES `Linija` (`linija_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Urnik`
--

LOCK TABLES `Urnik` WRITE;
/*!40000 ALTER TABLE `Urnik` DISABLE KEYS */;
/*!40000 ALTER TABLE `Urnik` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Vsebuje`
--

DROP TABLE IF EXISTS `Vsebuje`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Vsebuje` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `zaporedna_st` int(11) NOT NULL,
  `linija_id` int(11) NOT NULL,
  `postaja_id` int(11) NOT NULL,
  `razdalja_do_naslednje` int(11) NOT NULL,
  PRIMARY KEY (`id`,`linija_id`,`postaja_id`),
  KEY `linija_id` (`linija_id`),
  KEY `postaja_id` (`postaja_id`),
  CONSTRAINT `Vsebuje_ibfk_1` FOREIGN KEY (`linija_id`) REFERENCES `Linija` (`linija_id`),
  CONSTRAINT `Vsebuje_ibfk_2` FOREIGN KEY (`postaja_id`) REFERENCES `Postaja` (`postaja_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vsebuje`
--

LOCK TABLES `Vsebuje` WRITE;
/*!40000 ALTER TABLE `Vsebuje` DISABLE KEYS */;
/*!40000 ALTER TABLE `Vsebuje` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `predlogi_popravkov_linija`
--

DROP TABLE IF EXISTS `predlogi_popravkov_linija`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `predlogi_popravkov_linija` (
  `popravek_id` int(11) NOT NULL AUTO_INCREMENT,
  `tip_napake` varchar(255) NOT NULL,
  `predlagan_popravek` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `linija_id` int(11) NOT NULL,
  PRIMARY KEY (`popravek_id`),
  KEY `linija_id` (`linija_id`),
  CONSTRAINT `predlogi_popravkov_linija_ibfk_1` FOREIGN KEY (`linija_id`) REFERENCES `Linija` (`linija_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `predlogi_popravkov_linija`
--

LOCK TABLES `predlogi_popravkov_linija` WRITE;
/*!40000 ALTER TABLE `predlogi_popravkov_linija` DISABLE KEYS */;
/*!40000 ALTER TABLE `predlogi_popravkov_linija` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `predlogi_popravkov_postaja`
--

DROP TABLE IF EXISTS `predlogi_popravkov_postaja`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `predlogi_popravkov_postaja` (
  `popravek_id` int(11) NOT NULL AUTO_INCREMENT,
  `tip_napake` varchar(255) NOT NULL,
  `predlagan_popravek` varchar(255) NOT NULL,
  `status` tinyint(1) NOT NULL,
  `postaja_id` int(11) NOT NULL,
  PRIMARY KEY (`popravek_id`),
  KEY `postaja_id` (`postaja_id`),
  CONSTRAINT `predlogi_popravkov_postaja_ibfk_1` FOREIGN KEY (`postaja_id`) REFERENCES `Postaja` (`postaja_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `predlogi_popravkov_postaja`
--

LOCK TABLES `predlogi_popravkov_postaja` WRITE;
/*!40000 ALTER TABLE `predlogi_popravkov_postaja` DISABLE KEYS */;
/*!40000 ALTER TABLE `predlogi_popravkov_postaja` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-06-24 17:59:31
