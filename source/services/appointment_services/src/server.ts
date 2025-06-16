import dotenv from 'dotenv';
dotenv.config();

import { App } from './app';

const PORT = process.env.PORT || 5000;

async function startServer() {
    try {
        const appInstance = new App();

        appInstance.app.listen(PORT, () => {
            console.log(`🚀 Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start the server:', error);
        process.exit(1);
    }
}

startServer();