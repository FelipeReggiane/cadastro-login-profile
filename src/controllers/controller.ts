import { NextFunction, Request, Response } from "express";
import service from "../services/service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user;
  if (!user) {
    const error = {
      message: "Could not find data in request",
      status: 500,
    };
    return next(error);
  }
  try {
    await service.createUser(user);
    return res.status(200).json({
      message: "User registered successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user;
  if (!user) {
    const error = {
      message: "Could not find data in request",
      status: 500,
    };
    return next(error);
  }
  try {
    const returnService = await service.loginUser(user);

    if (returnService) {
      return res.status(200).json({
        message: `success`,
        token: returnService,
      });
    }
  } catch (error) {
    return next(error);
  }
};

const profile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const returnService = await service.profileUser(res.locals.email);
    return res.status(200).json(returnService);
  } catch (error) {
    next(error);
  }
};

export default { createUser, loginUser, profile };
