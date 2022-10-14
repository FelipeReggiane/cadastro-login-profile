import { NextFunction, Request, Response } from "express";
import * as yup from "yup";

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
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
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
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
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

export default { createUser, loginUser };
