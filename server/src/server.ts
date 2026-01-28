import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import serviceRoutes from './routes/serviceRoutes';
import eventRoutes from './routes/eventRoutes';
import innovationRoutes from './routes/innovationRoutes';
import { connectToDatabase } from './config/database';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to the database
connectToDatabase();

// Routes
app.use('/api/services', serviceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/innovations', innovationRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});