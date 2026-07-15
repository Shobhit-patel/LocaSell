import "dotenv/config";
import express from 'express'
import cors from 'cors'
import http from "http";

import connectDB from './config/db.js'
await import('./config/cloudinary.js')
import initializeSocket from './socket/socket.js';

import userRoutes from './routes/userRoutes.js'
import listingRoutes from './routes/listingRoutes.js'
import chatRoutes from './routes/chatRoutes.js'
import wishlistRoutes from './routes/wishListRoutes.js'
import cartRoutes from './routes/cartRoute.js'
import notificationRoutes from './routes/notificationRoutes.js' 
import ratingRoutes from './routes/ratingRoute.js'

connectDB()    
  
const app = express()

const server = http.createServer(app);

app.use(cors({ origin: 'http://localhost:5173', }));

app.use(express.json())

const PORT = process.env.PORT || 3000

app.use("/api/auth", userRoutes);
app.use("/api", listingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/rating", ratingRoutes);

// Initialize Socket.IO
initializeSocket(server);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});