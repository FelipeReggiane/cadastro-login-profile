import express, { NextFunction, Request, Response } from "express";
import service from "../services/service";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user;
  console.log("controller", { user });
  if (!user) {
    const error = {
      message: "Could not find data in request",
      status: 500,
    };
    return next(error);
  }
  try {
    await service.createUser(user, next);
    return res.status(200).json({
      message: "Usuário criado com sucesso",
    });
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  const user = req.body.user;
  console.log("controller", { user });
  if (!user) {
    const error = {
      message: "Could not find data in request",
      status: 500,
    };
    return next(error);
  }
  try {
    const returnService = await service.loginUser(user, next);
    console.log("controller retornado", { returnService });

    if (returnService) {
      return res.status(200).json({
        message: "Usuário logado com sucesso",
      });
    }
  } catch (error) {
    return next(error);
  }
};

export default { createUser, loginUser };
