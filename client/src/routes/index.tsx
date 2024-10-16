import { createBrowserRouter } from 'react-router-dom';
import { authRouter } from '@/routes/auth';

const routes = [...authRouter];

export const router = createBrowserRouter([...routes]);
