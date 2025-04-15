# Room Booking and Vacate Management System

This project is a Node.js-based backend for managing room bookings and vacate requests. It provides functionality for users to register, book rooms, update their profiles, and for administrators to approve or reject vacate requests.

## Features

- **User Authentication**  
  - User registration and login using JWT authentication.
  - Profile creation and updates including complete details and document uploads.

- **Room Booking**  
  - Users can book a room (single-occupant system).
  - The system tracks room availability and booking details.

- **Vacate Requests**  
  - Users can submit a vacate request.
  - Admin panel to review, approve, or reject vacate requests.
  - On approval, room booking details (bookedBy, department, year) are cleared and room availability is updated.

## Technologies Used

- Node.js & Express
- MongoDB & Mongoose
- JSON Web Tokens (JWT)
- Bcrypt for password hashing
- Multer (for file upload if needed)
- dotenv for environment configuration

## Project Structure

```
project/
│
├── backend/
│   ├── models/
│   │   ├── Room.js              # Room schema and model
│   │   ├── user.js              # User schema and model
│   │   ├── vacateticket.js      # Vacate Ticket schema and model
│   │   └── admin.js             # Admin schema and model (if separate)
│   │
│   ├── routes/
│   │   ├── auth.js              # Authentication (register and login) routes
│   │   ├── bookroom.js          # Room booking routes
│   │   ├── adminvacate.js       # Admin vacate request processing routes
│   │   └── user.js              # User routes for profile and other functionalities
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js    # Authentication middleware to secure routes
│   │   └── adminAuthMiddleware.js  # Admin-specific authentication middleware
│   │
│   └── server.js                # Main server file to start Express
│
└── README.md                    # This file
```

## Installation

1. **Clone the repository**
   ```bash
   git clone https://your-repository-url.git
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**

   Create a `.env` file in the backend directory with at least the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   The server should run on the port specified (default: 5000).

## API Endpoints

### Authentication

- **GET** `/api/auth/`  
  *Checks if the Auth API is working.*

- **POST** `/api/auth/register`  
  *Body (JSON)*:
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "your_secure_password"
  }
  ```
  *Registers a new user.*

- **POST** `/api/auth/login`  
  *Body (JSON)*:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "your_secure_password"
  }
  ```
  *Logs in a user and returns a JWT token.*

### Room Booking

- **POST** `/api/room/book`  
  *Headers*: `Authorization: Bearer YOUR_TOKEN_HERE`  
  *Books a room for the user. Returns booking details.*

- **GET** `/api/room/book`  
  *Headers*: `Authorization: Bearer YOUR_TOKEN_HERE`  
  *Returns the room booked by the user (if any).*

### Vacate Request Management (Admin)

- **GET** `/api/admin/vacate`  
  *Headers*: `Authorization: Bearer ADMIN_TOKEN_HERE`  
  *Returns all vacate requests for admin review.*

- **PUT** `/api/admin/vacate/:ticketId`  
  *Headers*: `Authorization: Bearer ADMIN_TOKEN_HERE`  
  *Body (JSON)*:
  ```json
  {
    "status": "approved"  // or "rejected"
  }
  ```
  *Updates the vacate ticket status. If approved, clears the room booking details and updates availability.*

### User Profile

- **GET** `/api/user/me`  
  *Headers*: `Authorization: Bearer YOUR_TOKEN_HERE`  
  *Returns the authenticated user's profile (excludes password).*

- **PUT** `/api/user/:userId/complete-profile`  
  *Headers*: `Authorization: Bearer YOUR_TOKEN_HERE`  
  *Body*: multipart/form-data with fields (name, dob, gender, contactNumber, etc.) and optionally files under `documents`.  
  *Updates the user's complete profile.*

## Postman Test Examples

For testing endpoints by Postman, refer to the [Postman documentation](https://learning.postman.com/docs/getting-started/introduction/).

### Example: User Registration Test

- **Method:** POST  
- **URL:** `http://localhost:5000/api/auth/register`  
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
  ```json
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "your_secure_password"
  }
  ```

### Example: Complete Profile Update Test

- **Method:** PUT  
- **URL:** `http://localhost:5000/api/user/<userId>/complete-profile`  
  *(Replace `<userId>` with the actual user id)*  
- **Headers:**
  - `Authorization: Bearer YOUR_TOKEN_HERE`
- **Body (form-data):**
  - Key: `name` – Value: `John Doe`
  - Key: `dob` – Value: `1990-01-01`
  - Key: `gender` – Value: `male`
  - Key: `nationality` – Value: `American`
  - Key: `email` – Value: `john.doe@example.com`
  - Key: `contactNumber` – Value: `1234567890`
  - Key: `guardianName` – Value: `Jane Doe`
  - Key: `guardianContact` – Value: `0987654321`
  - Key: `permAddress` – Value: `123 Main St, Anytown, USA`
  - Key: `studentID` – Value: `S123456`
  - Key: `course` – Value: `Computer Science`
  - Key: `department` – Value: `CSI`
  - Key: `year` – Value: `2`
  - Key: `bloodGroup` – Value: `O+`
  - Key: `medical` – Value: `None`
  - Key: `emergencyContact` – Value: `1122334455`
  - Key: `agreement` – Value: `true`
  - *For key `documents`, change the type to File and attach file(s).*

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

Distributed under the MIT License. See `LICENSE` for more information.
