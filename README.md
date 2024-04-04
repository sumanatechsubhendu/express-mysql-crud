# CRUD using Node js (Express + Mysql) 

## Inspiration

GIT URL (https://github.com/laravel/breeze-next) project. 🏝️
DOC LINK (https://docs.google.com/document/d/1MHwp9b5baAoE3oh3mn3PqEYhdjehxGo2xqL5pTa0-jk/edit?usp=sharing)

## Introduction

Creating a CRUD (Create, Read, Update, Delete) application using Express.js and MySQL involves setting up a backend server with Express.js to handle HTTP requests and a MySQL database to store and manage data. Below is a basic example of how you can create a simple CRUD application:

## Documentation
Please follow the below PDF file for details overview

Learning Docs For  Node js (Express + Mysql) .pdf
https://github.com/sumanatechsubhendu/express-mysql-crud/blob/master/Learning%20Docs%20For%20%20Node%20js%20(Express%20%2B%20Mysql)%20.pdf

### Installation
clone the git repo by using below command

git clone https://github.com/sumanatechsubhendu/express-mysql-crud.git

```bash
# Install npm packages and dependencies...
npm install

nodemon app.js
```

Next, clone this repository and install its dependencies with `yarn install` or `npm install`. Then, copy the `.env.example` file to `.env` and supply the URL of your backend:

```
JWT_SECRET="d4e79c638e6b80d5b0fbfc3ab80cd9f08674c0fe91dcd75e6743bb1d1f1461ddb5c4f8db96471cb5251276087ec7faf07760c8d159ed3af7a0bb688df8b39701"
JWT_REFRESH_SECRET="49e27134ecc747120306b019768472fe0d45c5c4076b0d89d37f6a6d059d2bb5a8b1e24042d34039d3986ce45c04b1ca5e83adf017b2a690545d7c1c0b3288f3"
```

Finally, run the application via `nodemon app.js`. The application will be available at `http://localhost:3000`:

```
nodemon app.js
```

> Note: Currently, we recommend using `localhost` during local development of your backend and frontend to avoid CORS "Same-Origin" issues.

