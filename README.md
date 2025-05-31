# Smart Secure File Vault

A secure file management system with encryption, compression, and preview capabilities.

## Features

- 🔒 Secure file storage with encryption/decryption
- 🗜️ File compression/decompression
- 👁️ File preview functionality
- 📤 File upload with progress tracking
- 📥 Secure file download
- 🔍 File search capabilities
- 👤 User authentication and authorization
- 💫 Modern, responsive UI

## Tech Stack

- **Frontend**: React.js, TailwindCSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JWT
- **File Operations**: Multer, Crypto, Zlib

## Working Flow

1. **User Authentication**
   - Register with name, email and password
   - Login with credentials
   - JWT token-based authentication
   - Secure session management

2. **File Upload**
   - Drag & drop or click to select files
   - Progress bar shows upload status
   - File size limit: 50MB
   - Automatic file type detection

3. **File Management**
   - View all uploaded files in a grid layout
   - Search files by name
   - File icons based on type (PDF, Image, Video, etc.)
   - View file details (name, type, size)

4. **File Operations**
   - **Preview**: View files directly in browser
   - **Download**: Secure file download
   - **Compress/Decompress**: Toggle file compression
   - **Encrypt/Decrypt**: Toggle file encryption
   - **Delete**: Remove files with confirmation
   - **Share**: Share files with other users (coming soon)

5. **Security Features**
   - AES-256-CBC encryption
   - Secure file storage
   - Token-based authentication
   - Protected routes
   - Blacklisted token management

## Screenshots

<img src="frontend/public/Screenshot 2025-05-29 214611.png" alt="Screenshot 1" height="400px" />

<img src="frontend/public/Screenshot 2025-05-29 214824.png" alt="Screenshot 2" height="400px" />

<img src="frontend/public/Screenshot 2025-05-29 214934.png" alt="Screenshot 3" height="400px" />

<img src="frontend/public/Screenshot 2025-05-29 215151.png" alt="Screenshot 4" height="400px" />

### Api Testing Done
<img src="frontend/public/Screenshot 2025-05-30 111918.png" alt="Screenshot 5" height="400px" />

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-secure-file-vault.git
cd smart-secure-file-vault
```

2. Install dependencies:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the application:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend development server
cd frontend
npm run dev
```

## API Documentation

### Authentication Routes
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `GET /auth/logout` - Logout user

### File Routes
- `POST /files/upload` - Upload file
- `GET /files` - Get all user files
- `GET /files/:id` - Download file
- `GET /files/preview/:id` - Preview file
- `DELETE /files/:id` - Delete file
- `POST /files/compress/:id` - Compress file
- `POST /files/decompress/:id` - Decompress file
- `POST /files/encrypt/:id` - Encrypt file
- `POST /files/decrypt/:id` - Decrypt file

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

Name - [@?](https://twitter.com/?)
Project Link: [https://github.com/?/smart-secure-file-vault](https://github.com/?/smart-secure-file-vault)
