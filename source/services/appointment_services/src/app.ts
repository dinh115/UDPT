import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import { connectDatabase } from './config/database';
import { ApiResponse } from './types';

// Import routes
import authRoutes from './routes/auth';
import doctorRoutes from './routes/doctors';
import appointmentRoutes from './routes/appointments';

export class App {
    public app: Application;

    constructor() {
        this.app = express();
        this.initializeDatabase();
        this.initializeMiddlewares();
        this.initializeRoutes();
        this.initializeErrorHandling();
    }

    private async initializeDatabase(): Promise<void> {
        await connectDatabase();
    }

    private initializeMiddlewares(): void {
        this.app.use(express.json()); // Parse JSON body
        this.app.use(express.urlencoded({ extended: true })); // Parse URL-encoded
        this.app.use(cors()); // Enable CORS
        this.app.use(helmet()); // Set security headers
        this.app.use(morgan('dev')); // Log HTTP requests
        this.app.use(rateLimit({
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100, // limit each IP to 100 requests per windowMs
            message: 'Too many requests, please try again later.',
            standardHeaders: true,
            legacyHeaders: false,
        }));
        //this.app.use(mongoSanitize()); // Prevent MongoDB operator injection
        this.app.use((req, res, next) => {
            mongoSanitize.sanitize(req.body);
            next();
        });
    }

    private initializeRoutes(): void {
        console.log('API is running');

        // Health check or root route
        this.app.get('/', (req: Request, res: Response<ApiResponse>) => {
            console.log('API is running');
            res.status(200).json({ success: true, message: 'API is running' });
        });

        this.app.use('/api/auth', authRoutes);
        this.app.use('/api/doctors', doctorRoutes);
        this.app.use('/api/appointments', appointmentRoutes);
    }

    private initializeErrorHandling(): void {
        // Not Found Handler
        this.app.use((req: Request, res: Response<ApiResponse>) => {
            res.status(404).json({
                success: false,
                message: 'Route not found'
            });
        });

        // Global Error Handler
        this.app.use((err: any, req: Request, res: Response<ApiResponse>, next: NextFunction) => {
            console.error(err.stack);
            res.status(err.status || 500).json({
                success: false,
                message: err.message || 'Internal Server Error',
            });
        });
    }
}