<div align="center">
	<h3 align="center">Next Chat App</h3>
	<p>A modern real-time chat application built with Next.js, React, and Pusher. Supports group and private messaging, notifications, and more.</p>
	<div>
		<img src="https://img.shields.io/badge/-Next.js-000000?logo=nextdotjs&logoColor=white" alt="Next.js">
		<img src="https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=black" alt="React">
		<img src="https://img.shields.io/badge/-TypeScript-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
		<img src="https://img.shields.io/badge/-TailwindCSS-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS">
		<img src="https://img.shields.io/badge/-Prisma-2D3748?logo=prisma&logoColor=white" alt="Prisma">
		<img src="https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white" alt="MongoDB">
		<img src="https://img.shields.io/badge/-Pusher-6846E4?logo=pusher&logoColor=white" alt="Pusher">
	</div>
</div>

---

### 🚀 Features

- Real-time group and private chat
- User authentication and profile management
- Message notifications and unread indicators
- Friend requests and contact management
- File and image sharing
- Responsive design for desktop and mobile

### 🔨 Installation Guide

Follow these steps to install and use the application.

**Requirements**


Software:

- [Node.js](https://nodejs.org/en/download) (version 20.10.0 or higher)
- [Prisma CLI](https://www.prisma.io/docs/getting-started) (for MongoDB schema management)
- [Pusher account](https://pusher.com/) (for real-time messaging)
- [MongoDB](https://www.mongodb.com/try/download/community) (recommended: latest version)

Hardware:

- RAM: 4GB or higher
- CPU: Any modern processor


**Preparation**

- Clone this repository and install dependencies:
	```bash
	git clone https://github.com/hdkhanh462/next-chat-app
	cd next-chat-app
	npm install
	```
- Update environment variables in `.env` (see `.env.example` if available)
- Update your MongoDB connection string and Pusher credentials as needed
- Push the Prisma schema to MongoDB:
	```bash
	npx prisma db push
	```
- (Optional) Seed the database if a seed script is provided

**Running the App**

- Start the development server:
	```bash
	npm run dev
	```
- Open [http://localhost:3000](http://localhost:3000) in your browser

---