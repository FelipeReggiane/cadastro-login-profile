import { Router } from "express";
import controller from "./controllers/controller";
import middleware from "./middleware/middleware";

export const router: Router = Router();

router.post("/register", middleware.createUser, controller.createUser);
router.post("/login", middleware.loginUser, controller.loginUser);
router.get("/profile", middleware.profile, controller.profile);
