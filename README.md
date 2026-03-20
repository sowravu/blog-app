# Tech Blog Application

A full-stack blogging platform built with modern web technologies. This application allows users to read, write, and interact with blog posts in a clean, responsive, and animated environment.

## 🚀 Key Features

- **User Authentication**: Secure signup and login functionality using JWT (JSON Web Tokens) and bcrypt for password hashing.
- **Blog Management**: Full CRUD (Create, Read, Update, Delete) operations for blog posts.
- **Rich Media**: Seamless image uploading and management integrated with Cloudinary.
- **Engaging Interactions**: Leave comments on blog posts to engage with the authors and other readers.
- **User Moderation**: App features a user blocking/admin system to manage interactions and maintain a safe environment.
- **Responsive & Animated UI**: Built with Tailwind CSS for broad device compatibility and Framer Motion for smooth, engaging animations.
- **Modern Architecture**: Leverages the power of Next.js App Router and React 19 for optimal performance.

## 🛠️ Technology Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS v4, Framer Motion, Lucide React
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ORM
- **Authentication**: JSON Web Tokens (JWT), `jose`, `bcryptjs`
- **Image Storage**: Cloudinary

## ⚙️ Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- MongoDB Database (Local or MongoDB Atlas)
- Cloudinary Account (for image hosting)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sowravuu/blog-app.git
   cd blog-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` or `.env.local` file in the root directory and add the following configurations:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the application.

## 🌐 Live Demo

Check out the live version of the project: [Tech Blog - sowravuu.live](https://techblog.sowravuu.live/)
