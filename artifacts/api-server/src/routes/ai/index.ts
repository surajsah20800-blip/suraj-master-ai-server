import { Router, type IRouter } from "express";
import chatRouter from "./chat";
import imageSearchRouter from "./image-search";

const router: IRouter = Router();

router.use(chatRouter);
router.use(imageSearchRouter);

export default router;
