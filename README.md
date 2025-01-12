## Hospital Management System

### Features

- User Authentication and Authorization
- Doctor Profile Management
- Appointment Booking and Management
- Notice Management
- Blog and Comment Management
- Contact Form Handling
- Overview and Analytics for Admin

### Getting Started

To get started with the application, follow these instructions:

#### Prerequisites

- Node.js
- PNPM
- Nodemon

#### Installation

1. Clone the repository:

```
git clone https://github.com/Zaw-Naing-Oo/hms-backend.git
cd pc-hms-backend
```

2. Install dependencies:

```
pnpm install
```

3. Create a .env file in the root directory and add the following configuration:

```
NODE_ENV=development

PORT=5000

DATABASE_URL=your_mongo_database_url

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
CLIENT_URL=your_client_url



MAIL_HOST=your_mail_host
MAIL_PORT=your_mail_port
MAIL_USER=your_mail_user
MAIL_PASS=your_mail_pass

EMAIL_TO=receiver_email_adress
```

4. Start the server:

```
pnpm dev
```
