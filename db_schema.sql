### Schema

DROP DATABASE IF EXISTS employees_db;

CREATE DATABASE employees_db;

USE employees_db;

CREATE TABLE departments
(
	id int NOT NULL AUTO_INCREMENT,
	name varchar(30) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE roles
(
	id int NOT NULL AUTO_INCREMENT,
	title varchar(30) NOT NULL,
	salary decimal NOT NULL,
	department_id int NOT NULL,
    PRIMARY KEY (id)
-- 	FOREIGN KEY (client_id) REFERENCES clients(id)
);

CREATE TABLE employees
(
	id int NOT NULL auto_increment,
    first_name varchar(30) NOT NULL,
    last_name varchar(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
)
