import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

import BatteryRoutes from './routes/batteryRoutes';
import { errorHandler } from './middleware/errorHandler';

dotenv.config()

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('POWER HUB API 1.0.0');
});

app.use('/batteries', BatteryRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
});
