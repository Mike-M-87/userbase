# Userbase - User Management API

### Table of Contents
- #### [Backend](#backend)
- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Setting up the Backend](#backend-setup)
- [Running the Backend](#running-the-backend)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Notes](#notes)
- ##### [Frontend](#frontend)


# Backend
## Introduction
This is a user management API built with Node.js, Express, and MongoDB. It includes functionalities such as user registration, authentication, and CRUD operations on user data.

## Features
- User registration
- User authentication with JWT
- CRUD operations on user data
- Protected routes for authenticated users
- Admin-only access for certain operations

## Prerequisites
Make sure you have the following installed on your machine:
- Node.js (>= 14.x.x)
- npm (>= 6.x.x)
- MongoDB (>= 4.x.x)

## Installation
1. **Clone the repository:**
   ```sh
   git clone https://github.com/Mike-M-87/userbase
   cd userbase
   ```

## Backend Setup
1. **Navigate to the backend directory to run the server**
   ```sh
   cd backend
   ```

2. **Create a `.env` file in the backend directory and add the following environment variables:**
   ```env
   PORT=3000
   DATABASE=mongodb://localhost:27017/your-database-name
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN= <jwt expiration duration e.g 7d>
   ```

## Running the Backend
1. **Start the MongoDB server:**
   Ensure that your MongoDB server is running. If you are using a local installation, you can start it using:
   ```sh
   mongod --dbpath ~/data/db --logpath ~/data/log/mongodb/mongo.log --fork
   ```
2. **Run the application:**
   ```sh
   node index.js
   ```
3. **Access the API:**
   Open your API client (like Postman or HTTPie) and navigate to:
   ```
   http://localhost:8089
   ```

## API Endpoints
Here are the available endpoints in the API:

### Authentication

- **POST /auth/register**
  - Register a new user. Accessible only to authenticated users with admin privileges. So you will need to manually add the first admin to the database at the start
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "passwordConfirm": "password123",
      "phoneNumber": "123-456-7890",
      "company":"my company",
      "isAdmin": false
    }
    ```
  - Response Body - Auth Response

- **POST /auth/login**
  - Authenticate user and generate JWT token.
  - Request Body:
    ```json
    {
      "email": "user@example.com",
      "password": "password123"
    }
    ```

  - Response - Auth Response


  #### Example Auth Response
    ```json
      {
        "success": true,
        "token": "<jwt_token>",
        "data": {
          "user": {
            "_id": "6660d57c89d9d1620dfde492",
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phoneNumber": "123-456-7890",
            "company":"my company",
            "isAdmin": false
            "__v": 0
          }
        }
      }
    ```

### Users
- **GET /users**
  - Retrieve a list of all users.
  - Requires authentication.
  - Response Body (example)
    ```json
      {
        "success": true,
        "data": {
          "users": [UserObject]
        }
      }
    ```

- **POST /users**
  - Create a new user in the database.
  - Requires authentication.
  - Same as auth/register
  - Request Body:
    ```json
    {
      "name": "John Doe",
      "email": "john.doe@example.com",
      "password": "password123",
      "passwordConfirm": "password123",
      "phoneNumber": "123-456-7890",
      "company":"my company",
      "isAdmin": false
    }
    ```
  - Response - Auth Response
    


- **GET /users/:id**
  - Retrieve a specific user by their ID.
  - Requires authentication.
  - Response Body (example)
    ```json
    {
      "success": true,
      "data": {
        "users": UserObject
      }
    }
    ```

- **PUT /users/:id**
  - Update an existing user.
  - Requires authentication.
  - Request Body (example):
    ```json
    {
      "name": "Jane Doe"
    }
    ```
  - Response Body (example)
    ```json
    {
      "success": true,
      "data": {
        "users": UserObject
      }
    }
    ```

- **DELETE /users/:id**
  - Delete a user from the database.
  - Requires authentication.
  - Response - No content


  #### Example UserObject
  ```json
    {
      "_id": "6660d57c89d9d1620dfde443",
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "123-456-7890",
      "company":"my company",
      "isAdmin": false
      "__v": 0
    },
  ```


## Error Handling
Errors are returned in the following format:
```json
{
  "success": false,
  "errors": ["This is an error","Another error"]
}
```
The appropriate HTTP status codes are used to indicate the type of error (e.g., 400 for bad requests, 401 for unauthorized access, 403 for forbidden methods, 404 for not found, etc.).

## Testing
To run test. Open the app.test.js file and edit default admin login credentials according to what you have on your database then run
```sh
npm test
```

### Notes:
- Replace placeholder values (like `your-username`, `your-database-name`, `your_jwt_secret`) with your actual values.
- Add any additional steps or instructions specific to your application setup if necessary.



# Frontend

- Open the client directory
  ```sh
  cd client
  ```

- Install Dependencies
  ```sh
  npm install
  ```

- Start server
  ```sh
  npm start
  ```
  
This will Runs the app in the development mode.\
- Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.