# 🏦 Fintech Wallet API

A secure backend API for peer-to-peer (P2P) financial transactions. Built with **Node.js**, **Express**, and **MongoDB**.

## 🚀 Features
* **Secure Authentication:** JWT-based login & registration.
* **Atomic Wallets:** Automatically creates a financial wallet for every new user.
* **Money Transfer:** Secure ACID-compliant transactions between users.
* **Audit Trail:** Records every debit and credit with unique reference IDs.

## 🛠️ Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas (Cloud)
* **Security:** JSON Web Tokens (JWT) & Bcrypt

## ⚙️ Setup & Installation

1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/gabrieliyinbor/fintech-wallet-api.git](https://github.com/gabrieliyinbor/fintech-wallet-api.git)
    cd fintech-wallet-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment:**
    Create a `.env` file in the root folder and add:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_key
    ```

4.  **Run the Server:**
    ```bash
    npm run dev
    ```

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Register a new user & auto-create wallet |
| **POST** | `/api/auth/login` | Login and receive Access Token |
| **POST** | `/api/wallet/transfer` | Transfer money (Requires Token) |
| **GET** | `/api/wallet` | Get current user balance |

---
*Developed by Gabriel Iyinbor*