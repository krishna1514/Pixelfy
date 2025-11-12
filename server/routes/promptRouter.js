import express from "express";
import { promptEnhancing } from "../controllers/promptController.js";

const promptRouter = express.Router();

promptRouter.post("/enhance-prompt", promptEnhancing);

export default promptRouter;
