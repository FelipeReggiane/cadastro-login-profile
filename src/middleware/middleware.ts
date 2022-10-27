import { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import jwt, { JwtPayload } from "jsonwebtoken";
import repository from "../repositiories/repository";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let schema = yup.object().shape({
      name: yup
        .string()
        .required("Name required")
        .matches(/^[a-zA-Z\s]*$/, "Name must contain only letters"),
      email: yup.string().email().required("Email required"),
      password: yup
        .string()
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
          "Password must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ),
      confirmPassword: yup
        .string()
        .required()
        .oneOf([yup.ref("password"), null], "Passwords must match"),
    });

    // confirmando se os dados estão corretos
    await schema.validate(req.body.user);
    next();
  } catch (error: any) {
    error.status = 400;
    next(error);
  }
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let schema = yup.object().shape({
      email: yup.string().email().required("Email required"),
      password: yup
        .string()
        .matches(
          /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
          "Password must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    });

    // confirmando se os dados estão corretos
    await schema.validate(req.body.user);
    next();
  } catch (error: any) {
    error.status = 400;
    next(error);
  }
};

const profile = async (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization;
  token ? (token = token.split(" ")[1]) : "";
  if (!token) {
    const error = {
      message: "Invalid token",
      status: 401,
    };
    next(error);
  } else {
    try {
      const decoded: any = jwt.decode(token);
      const userDB = await repository.findUserByEmail(decoded.email);
      const verify = jwt.verify(token, userDB.password);
      res.locals.email = userDB.email;
      next();
    } catch (error: any) {
      error.message = "Invalid token";
      error.status = 401;
      next(error);
    }
  }
};

export default { createUser, loginUser, profile };
