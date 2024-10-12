import { createBrowserRouter } from "react-router-dom";
import { authRouter } from "./authRouter";

const routes = [...authRouter];

export const router = createBrowserRouter([...routes]);
