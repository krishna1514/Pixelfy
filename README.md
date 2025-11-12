# Pixelfy

## Description

Pixelfy is an AI-powered image generation SaaS web application built with the MERN stack. It uses the Clipdrop API to generate high-quality images and includes a secure login/signup system.

---

## Features

- AI-based image generation using the Clipdrop API.
- User authentication system with login and signup functionality.

---

## Installation Instructions

1. Clone the repository:

```bash
git clone https://github.com/krishna1514/Pixelfy
```

2. Navigate to the project directory:

```bash
cd Pixelfy
```

### Server Setup

3. Navigate to the server folder:

```bash
cd server
```

4. Install dependencies:

```bash
npm install
```

5. Configure environment variables:
   Create a `.env` file in the `server` folder and add the following:

   ```env
   MONGODB_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   CLIPDROP_API=<your-clipdrop-api-key>
   PORT=<your-port-number>
   GEMINI_API_KEY=<your-gemini-api-key>
   ```

6. Start the server:

```bash
npm start
```

### Client Setup

7. Navigate to the client folder:

```bash
cd client
```

8. Install dependencies:

```bash
npm install
```

9. Configure environment variables:
   Create a `.env` file in the `client` folder and add the following:

   ```env
   VITE_BACKEND_URL=<url-for-server-side>
   ```

10. Start the client:

```bash
npm run dev
```
