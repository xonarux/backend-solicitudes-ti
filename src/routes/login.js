import { Router } from "express";
import { login } from "../controllers/auth.js";

const loginRouter = Router();
loginRouter.post('/', login);

export default loginRouter; 
