# Smart Secure File Vault

A secure file storage system with encryption, compression, and access control features.

## Features

- 🔒 Secure file encryption using C++ modules
- 📦 File compression
- 👤 User authentication and authorization
- 📁 File management (upload, download, delete)
- 🔍 File search functionality
- 📱 Responsive UI design

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Axios
- React Router
- Lucide React Icons

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Multer (file handling)
- bcrypt (password hashing)

### Security
- C++ encryption modules
- JWT token blacklisting
- Protected routes
- Secure file storage

## Project Structure

```
Smart-Secure-File-Vault/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── auth/
│   │   └── api/
│   └── public/
├── backend/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── uploads/
└── cpp_module/
    └── encryption/
```

## Getting Started

### Prerequisites
- Node.js
- MongoDB
- C++ compiler (for encryption modules)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/Smart-Secure-File-Vault.git
cd Smart-Secure-File-Vault
```

2. **Backend Setup**
```bash
cd backend
npm install

# Create .env file with:
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
```

3. **Frontend Setup**
```bash
cd frontend
npm install
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout

### Files
- `POST /files/upload` - Upload file
- `GET /files` - Get user's files
- `GET /files/:id` - Download file
- `DELETE /files/:id` - Delete file
- `POST /files/encrypt/:id` - Encrypt file
- `POST /files/decrypt/:id` - Decrypt file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License