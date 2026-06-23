# VinylVault

A full-stack e-commerce web application for vinyl records featuring a modern DevOps pipeline with Docker, Kubernetes, and GitHub Actions.

Developed as part of the **Continuous Integration and Delivery (CI/CD)** course at the **Faculty of Computer Science and Engineering (FINKI), Ss. Cyril and Methodius University (UKIM).**

![Java](https://img.shields.io/badge/Java-21-orange)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.3-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)
![Docker](https://img.shields.io/badge/Docker-2496ED)
![Kubernetes](https://img.shields.io/badge/Kubernetes-K3D-326CE5)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-CI/CD-2088FF)

---

## Overview

VinylVault is a modern three-tier web application that simulates an online marketplace for vinyl records. It combines a Spring Boot backend, a React frontend, and a PostgreSQL database while demonstrating industry-standard DevOps practices such as containerization, orchestration, and automated continuous integration and deployment.

The project showcases the complete software development lifecycle, from application development and testing to packaging, deployment, and infrastructure management.

---

## Features

* JWT-based authentication and secure user registration/login
* Role-Based Access Control (RBAC) with `USER` and `ADMIN` roles
* Vinyl record catalog with search, filtering, and pagination
* Shopping cart with server-side synchronization and guest persistence using `localStorage`
* User profile management and order history
* Responsive interface optimized for desktop and mobile devices
* RESTful backend API built with Spring Boot
* PostgreSQL database integration using Spring Data JPA
* Automated Docker multi-stage builds
* Container orchestration with Docker Compose
* Kubernetes deployment using K3D
* Continuous Integration and Delivery pipelines powered by GitHub Actions

---

## Architecture

The application follows a classic three-tier architecture:

* **Frontend:** React 18 with Vite, served through Nginx
* **Backend:** Spring Boot 3 REST API with Spring Security and JWT authentication
* **Database:** PostgreSQL 16 for persistent data storage

The frontend communicates with the backend via REST APIs, while the backend interacts with the PostgreSQL database through Spring Data JPA and Hibernate.

---

## Technology Stack

### Backend

* Java 21
* Spring Boot 3
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate
* Maven

### Frontend

* React 18
* Vite
* React Router
* Axios

### Database

* PostgreSQL 16

### DevOps

* Docker
* Docker Compose
* Multi-stage Docker builds
* Kubernetes (K3D)
* GitHub Actions
* CI/CD Pipelines

---

## Project Structure

```text
VinylVault/
├── backend/
├── frontend/
├── kubernetes/
├── .github/workflows/
├── docker-compose.yml
└── README.md
```

---

## Branching Strategy

The project follows a structured Git workflow with multiple long-lived branches:

| Branch       | Purpose                                    |
| ------------ | ------------------------------------------ |
| `main`       | Stable production-ready code               |
| `production` | Production deployment                      |
| `test`       | Testing and quality assurance              |
| `develop`    | Active development and feature integration |

This strategy enables isolated development, automated testing, and controlled promotion of changes across environments.

---

## Getting Started

### Clone the repository

```bash
git clone https://github.com/your-username/VinylVault.git
cd VinylVault
```

### Run using Docker Compose

```bash
docker compose up -d
```

After the containers start successfully:

| Service     | URL                   |
| ----------- | --------------------- |
| Frontend    | http://localhost      |
| Backend API | http://localhost:8080 |
| PostgreSQL  | localhost:5432        |

To stop the application:

```bash
docker compose down
```

---

## Kubernetes Deployment

Deployment manifests are included for Kubernetes environments using K3D.

Deploy the application with:

```bash
kubectl apply -f kubernetes/
```

The Kubernetes configuration deploys the frontend, backend, and PostgreSQL services while providing networking between the components.

---

## Default Credentials

| Role          | Email                    | Password   |
| ------------- | ------------------------ | ---------- |
| Administrator | `admin@vinylvault.local` | `admin123` |
| Standard User | `user@vinylvault.local`  | `user123`  |

---

## CI/CD Pipeline

The project integrates GitHub Actions to automate the build and delivery process. The pipeline performs:

* Source code checkout
* Dependency installation
* Project compilation
* Automated testing
* Docker image creation
* Container validation
* Deployment preparation

This workflow ensures that code changes are consistently built and verified before deployment.

---

## Future Improvements

Potential future enhancements include:

* Payment gateway integration
* Wishlist functionality
* Product reviews and ratings
* Email notifications
* Recommendation engine
* Analytics dashboard
* Cloud deployment support
* Monitoring and observability tools

---

## Author

**Anika Ristevska**

Faculty of Computer Science and Engineering (FINKI)
Ss. Cyril and Methodius University (UKIM)

---

## License

This project was developed for educational purposes as part of a university course assignment.
