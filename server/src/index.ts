import express, {ErrorRequestHandler} from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import './types/express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: [/^http:\/\/localhost:\d+$/, 'https://mary-no.github.io/'],
    credentials: true,
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);


app.get('/', (req, res) => {
    res.send('Server is running!');
});

app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});

app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

const errorHandler: ErrorRequestHandler = (err, req, res) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);