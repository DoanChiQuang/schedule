import { createBrowserRouter } from 'react-router-dom';
import { authRouter } from '@/routes/auth';
import { mainRouter } from '@/routes/main';

const routes = [...authRouter, ...mainRouter];

export const router = createBrowserRouter([...routes]);
