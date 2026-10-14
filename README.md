# Natours API 🌲

A robust, feature-rich RESTful API built for a fictional tour booking application called **Natours**. This project was developed as part of an advanced Node.js, Express, and MongoDB backend development curriculum.

---

## 👨‍💻 Acknowledgment & Credits
This project was built following the incredible **"Node.js, Express, MongoDB & More: The Complete Bootcamp"** course taught by **Jonas Schmedtmann**. 

---

## 🚀 Features

* **Advanced RESTful Routing & Controllers:** Clean separation of concerns for tours, users, reviews, and authentication.
* **Secure Authentication & Authorization:** 
  * User sign-up, login, and JWT (JSON Web Token) authentication.
  * Role-based access control (e.g., normal users vs. guides/admins).
  * Password reset functionality via encrypted tokens sent through email.
* **Data Filtering, Sorting, & Pagination:** Advanced API query features for searching tours dynamically.
* **Aggregation Pipelines:** MongoDB aggregation framework used for tour statistics and calculating closest tour locations (GeoJSON/ geospatial queries).
* **Security Best Practices:** 
  * Data sanitization against NoSQL query injection and XSS.
  * Rate limiting to prevent brute-force attacks.
  * Security headers management via Helmet.
* **Error Handling:** Centralized asynchronous error handling middleware for both operational and programming errors.

---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database & ODM:** MongoDB, Mongoose
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Email Services:** Nodemailer, Mailtrap / SendGrid

---

## ⚙️ Getting Started

To run this project locally on your machine:

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/mohamed-yaser1/natours.git](https://github.com/mohamed-yaser1/natours.git)
   cd natours