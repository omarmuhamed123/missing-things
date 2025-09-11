# Missing Things - Backend Project

## Table of Contents

- [Missing Things - Backend Project](#missing-things---backend-project)
  - [Table of Contents](#table-of-contents)
  - [1. Definition of Project](#1-definition-of-project)
  - [2. Types of Users](#2-types-of-users)
    - [2.1 Normal User](#21-normal-user)
    - [2.2 Employee User](#22-employee-user)
    - [2.3 Delivery User](#23-delivery-user)
  - [3. Features](#3-features)
    - [3.1 Sign Up and Login](#31-sign-up-and-login)
    - [3.2 Normal User Posts](#32-normal-user-posts)
    - [3.3 User Competitions](#33-user-competitions)
    - [3.4 User Complaints](#34-user-complaints)
    - [3.5 Employee Notifications](#35-employee-notifications)
    - [3.6 Delivery Trips](#36-delivery-trips)
    - [3.7 Prizes and Transactions](#37-prizes-and-transactions)
    - [3.8 Finding Missing Thing Service](#38-finding-missing-thing-service)
    - [3.9 Offering Found Items](#39-offering-found-items)
    - [3.10 Delivery Notifications](#310-delivery-notifications)
  - [4. Technology](#4-technology)
  - [5. Implementation Details](#5-implementation-details)
    - [BackEnd Folder](#backend-folder)
    - [SQL File](#sql-file)
  - [6. Technology](#6-technology)
    - [4.1 Fast Execution](#41-fast-execution)
    - [4.2 Rich Ecosystem (NPM)](#42-rich-ecosystem-npm)
    - [4.3 PostgreSQL - Powerful Relational Database](#43-postgresql---powerful-relational-database)
    - [4.4 Security](#44-security)

---

## 1. Definition of Project

The current challenge revolves around the lack of an efficient and centralized platform for connecting individuals who have lost personal belongings with those who have found them. Traditional methods of lost and found rely on physical notices, which are often limited in reach and effectiveness. To address this issue, our project aims to create a web-based platform that facilitates the seamless connection between individuals who have lost items and those who have found them. The primary objective is to streamline the process of reuniting lost belongings with their owners by leveraging the power of online connectivity and community collaboration. The system will be designed to allow users to report lost items, search for found items, and establish communication between the rightful owner and the finder, fostering a more efficient and widespread lost and found network.

## 2. Types of Users

### 2.1 Normal User

Individuals who have lost personal items can use the platform to report missing things, update posts, participate in competitions, and file complaints.

### 2.2 Employee User

Employees are responsible for managing requests and posts. They also notify users when their lost items have been found, prompting the creation of a post by the respective normal user.

### 2.3 Delivery User

Delivery users are responsible for delivering missing items to their owners. They receive notifications from employees to initiate the delivery process.

## 3. Features

### 3.1 Sign Up and Login

All types of users can sign up and log in securely using token-based authentication.

### 3.2 Normal User Posts

Normal users can create or update posts for their missing items, providing detailed information about the lost belongings.

### 3.3 User Competitions

Normal users can initiate competitions for their lost items, encouraging others to help find their lost items by offering a prize.

### 3.4 User Complaints

Normal users can submit complaints if any issues arise during the process.

### 3.5 Employee Notifications

Employees send notifications to normal users when someone has found an item that belongs to them, prompting the creation of a post.

### 3.6 Delivery Trips

Employees can assign a delivery user to a trip, facilitating the delivery of lost items. Prizes won in competitions are delivered through online transactions.

### 3.7 Prizes and Transactions

Normal users who find lost items which have a compeitition receive prizes through online transactions.

### 3.8 Finding Missing Thing Service

Users can offer a service to find missing items and receive compensation for their efforts.

### 3.9 Offering Found Items

Found items with no corresponding posts can be offered for sale, allowing users to make a profit.

### 3.10 Delivery Notifications

Delivery users receive notifications from employees to pick up a car and deliver a missing item. Normal users reimburse the delivery cost through online transactions.

## 4. Technology

Using ExpressJS/NodeJS with PostgreSQL for a backend project offers several advantages, making it a popular choice for web development. The combination of ExpressJS/NodeJS and PostgreSQL provides a powerful, efficient, and scalable foundation for building modern web applications, allowing developers to leverage a unified language across the entire stack while benefiting from the strengths of a relational database system.

---

## 5. Implementation Details

### BackEnd Folder

The `BackEnd` folder contains the main backend implementation using ExpressJS and Node.js. The structure is organized as follows:

- **app.js**: Entry point for the Express application, sets up middleware, routes, and server configuration.
- **package.json**: Lists dependencies and scripts for running the backend server.
- **controllers/**: Contains controller files for handling business logic for each resource (e.g., cars, centers, competitions, complaints, discounts, items, login, notifications, products, users, user trips). Each controller manages requests and responses for its respective route.
- **middlewares/**: Includes authentication and permission middleware to secure endpoints and manage user roles.
- **models/**: Contains the data-model file, which defines the structure and interactions with the database.
- **routes/**: Defines Express routes for each resource, mapping HTTP endpoints to controller functions.

### SQL File

The `database_script.sql` file contains the PostgreSQL database schema and logic. It includes:

- Table definitions for all entities (users, items, complaints, competitions, trips, cars, centers, products, etc.), with primary and foreign key constraints to enforce relationships.
- Indexes and constraints for data integrity (e.g., unique keys, check constraints).
- Stored procedures for common operations (e.g., adding users, competitions, centers, cars).
- Functions for business logic (e.g., payment, rent calculations).
- Comments and ALTER statements for evolving the schema and maintaining referential integrity.

This structure ensures a clear separation of concerns, with the backend code handling API logic and the SQL file managing data storage and relationships.

---

## 6. Technology

### 4.1 Fast Execution

NodeJS is built on the V8 JavaScript runtime, which is known for its speed and performance. It's well-suited for applications that require high-speed data processing and handling.

### 4.2 Rich Ecosystem (NPM)

Node Package Manager (NPM) provides a vast collection of libraries and modules. This rich ecosystem accelerates development by allowing developers to easily integrate third-party packages into their projects.

### 4.3 PostgreSQL - Powerful Relational Database

PostgreSQL is a robust, open-source relational database system. It supports complex queries, transactions, and data integrity, making it an excellent choice for applications that require a structured data storage model.

### 4.4 Security

When properly configured, both ExpressJS and PostgreSQL offer robust security features. ExpressJS provides middleware for handling common security concerns, while PostgreSQL supports features like SSL connections, encryption, and access control.
