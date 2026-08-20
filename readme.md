# Medical Appointment API

A RESTful backend API for managing doctor appointments with role-based access control (Patients, Doctors, Admins) and JWT authentication.

**Live Swagger Docs:** [https://medical-appointment-system-production-2b93.up.railway.app/api/v1/api-docs/](https://medical-appointment-system-production-2b93.up.railway.app/api/v1/api-docs/)

---

## Tech Stack

* **Backend:** Node.js & Express
* **Database:** MongoDB Atlas (Mongoose)
* **Auth & Security:** JWT (Cookies) & Bcrypt
* **Validation & Docs:** Zod & Swagger UI

---

## Key Features

* **Patients:** Search for doctors and book 30-minute appointment slots.
* **Doctors:** View scheduled patient visits and manage appointments.
* **Admins:** Full control to manage users and delete appointments.

---

## Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/IslamMostafaYassin/Medical-Appointment-System
