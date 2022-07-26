module.exports = [
    `CREATE DATABASE IF NOT exists delilah;`,
    `USE delilah;`,
    `CREATE TABLE IF NOT exists users (
        ID int PRIMARY KEY NOT NULL AUTO_INCREMENT,
        USER_NAME varchar(30) NOT NULL,
        FULL_NAME varchar(60) NOT NULL,
        EMAIL varchar(100) NOT NULL,
        PHONE_COUNTRY_CODE INT NOT NULL,
        PHONE_NUMBER INT NOT NULL,
        ADDRESS varchar(250) NOT NULL,
        USER_PASSWORD varchar(100) NOT NULL,
        USER_ROLE varchar(50) not null
    );`,
    `CREATE TABLE IF NOT exists products (
        ID int PRIMARY KEY NOT NULL AUTO_INCREMENT,
        PRODUCT_NAME varchar(100) NOT NULL,
        PRICE float NOT NULL,
        IMAGE varchar(150)
    );`,
    `CREATE TABLE IF NOT EXISTS orders (
        ID INT auto_increment primary KEY,
        PAYMENT_DATE varchar(10),
        ORDER_STATUS ENUM('NUEVO', 'CONFIRMADO', 'PREPARADO', 'ENVIADO', 'CANCELADO', 'ENTREGADO'),
        PAYMENT ENUM('EFECTIVO', 'TARJETA DE CREDITO', 'TARJETA DEBITO'),
        ID_USER INT
    );`,
    `CREATE TABLE IF NOT EXISTS OrderProducts (
        ID_ORDER INT,
        ID_PRODUCT INT,
        QUANTITY INT
    );`,
];
