

## Welcome👋
Welcome to Natours! This web application is crafted for wanderlusts and adventure seekers who crave thrilling tour vacations.
## Introduction 🌟
> **This was developed under the guidance of _Jonas Schmedtmann's_ [Node.js course](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) that consists of**
- 📃How to create an API
- 🎮MVC Architecture
- 👩‍💻User Authentication
- 📚Data Modelling
- 🤳File Uploading

## Technologies 🚀

- Node.js
- Express.js
- MongoDB
- Mongoose
- HTML, CSS
- Pug (Template Engine)
- Nodemailer
- Mailtrap
- JSON Web Token(JWT)
- bcrypt
- Gmail
* I am currently learning React, and I may consider incorporating it into this application in the future.
## Features ✨

-  Browse and book a variety of nature tours.
-  Signup and create your own account!
-  Login to your account!
-  Each login session is persisted using cookies
-  Detailed information about each tour, including duration, difficulty, and price.
-  Interactive maps to visualize tour destinations.
-  Tour reviews and ratings by fellow travelers.
-  Reset your password
-  Update your password and profile
-  Upload Profile Picture
-  Email service 📨
-  Responsive for Mobiles, Laptops and PC 📱

## Setting Up Your Local Environment

Follow these steps to set up your local environment for the Natours app:

1. **Clone the Repository:**
   Clone this repository to your local machine:
   ```bash
   git clone https://github.com/omar2-2khaled/natrous-clone.git
   cd natours
   ```
2. **Install Dependencies:**
   Run the following command to install all the required dependencies:
   ```bash
   npm install
   ```
3. **Configure Environment Variables:**

   Before you can run the Natours app, you need to set up your environment variables. These variables store sensitive information required for the app to function properly. Follow these steps to configure your environment variables:

   1. **Create a `.env` File:**
      In the root directory of the app, create a file named `.env`.

   2. **Add the Following Environment Variables:**
      Replace the placeholders with your actual information. You might need to sign up for accounts and services to obtain the required credentials.

      ```dotenv

      # MongoDB Configuration
      DATABASE=your-mongodb-database-url
      USERNAME=your-mongodb-username
      DATABASE_PASSWORD=your-mongodb-password

      # JSON Web Token Configuration
      SECRET=your-json-web-token-secret
      JWT_EXPIRES_IN=90d
      JWT_COOKIE_EXPIRES_IN=90
      ```

## Request limit

100 requests per hour.

## Query operators

Natours API uses these operators may be in the future will increase:

- $gt: greater than to a value specified
- $gte: greater than or equal to a value specified
- $lt: less than to a value specified
- $lte: less than or equal to a value specified

# API reference

During API development, I use `Postman` for handling/testing all endpoints.

- Postman collection/documentation is available on this link [click here](https://documenter.getpostman.com/view/28703015/2sA2xfXYMY)
- Base URL endpoints: `http://127.0.0.1:3001/api/V1/` or `http://localhost:3001/api/v1/`

## License

[![License](https://img.shields.io/:License-MIT-blue.svg?style=flat-square)](http://badges.mit-license.org)

- [Omar Khaled](https://github.com/omar2-2khaled)
