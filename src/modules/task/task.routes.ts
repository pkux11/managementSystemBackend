import { Router } from "express";
import * as controller from "./task.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", controller.createTask);
router.get("/", controller.getTasks);
router.patch("/:id", controller.updateTask);
router.delete("/:id", controller.deleteTask);
router.patch("/:id/toggle", controller.toggleTask);
router.get("/:id", controller.getTaskById);


export default router;
