import app from "../server";
import request from "supertest";
import repository from "../repositiories/repository";
import service from "../services/service";

describe("Testing routes of api", () => {
  // test routes
  it("register route working", async () => {
    // para caso de sucesso
    jest
      .spyOn(repository, "createUserDB")
      .mockResolvedValue({ name: "felipe" });
    const res = await request(app)
      .post("/register")
      .send({
        user: {
          name: "felipe",
          email: "felipereggiane@gmail.com",
          password: "abCd@123",
          confirmPassword: "abCd@123",
        },
      });
    expect(res.statusCode).toEqual(200);
  });

  it("register route erro duplicated email", async () => {
    // para caso de erro
    jest
      .spyOn(repository, "createUserDB")
      .mockRejectedValue({ code: "ER_DUP_ENTRY" });
    const res = await request(app)
      .post("/register")
      .send({
        user: {
          name: "felipe",
          email: "felipereggiane@gmail.com",
          password: "abCd@123",
          confirmPassword: "abCd@123",
        },
      });
    expect(res.statusCode).toEqual(409);
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Email provided already exists");
  });

  it("login route working", async () => {
    // para caso de sucesso
    jest.spyOn(repository, "findUserDB").mockResolvedValue({
      id: 83,
      name: "felipe",
      email: "felipereggiane2@hotmail.com",
      password: "$2b$10$Ic2ZtqmrJHyW0V8pONqWm.Gw6Z2LkOjLxsUDQLQVmODMb3xVZvH.a",
    });
    const res = await request(app)
      .post("/login")
      .send({
        user: {
          email: "felipereggiane2@hotmail.com",
          password: "abCd@123",
        },
      });
    expect(res.statusCode).toEqual(200);
  });

  it("error login route email or password invalid", async () => {
    jest.spyOn(repository, "findUserDB").mockRejectedValue({ status: 401 });
    const res = await request(app)
      .post("/login")
      .send({
        user: {
          email: "felipe@hotmail.com",
          password: "abCd@123",
        },
      });
    expect(res.statusCode).toEqual(401);
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Email or password invalid");
  });

  it("profile route working", async () => {
    jest
      .spyOn(repository, "findProfileByEmail")
      .mockResolvedValue({ name: "felipe" });

    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlbGlwZXJlZ2dpYW5lQGdtYWlsLmNvbSIsImlhdCI6MTY2NTc3NTk1NH0.gBUeNwerE_Ks6StH1j-BFrOwaEHC0hs4jAUNDy3019Y";
    const res = await request(app)
      .get("/profile")
      .set({ Authorization: token });
    expect(res.statusCode).toEqual(200);
  });

  it("error profile route invalid token", async () => {
    jest
      .spyOn(repository, "findProfileByEmail")
      .mockRejectedValue({ message: "Invalid token" });

    const token = "Bearer asdasdadadada";
    const res = await request(app)
      .get("/profile")
      .set({ Authorization: token });
    expect(res.statusCode).toEqual(401);
    expect(res).toHaveProperty("body");
    expect(res.body).toHaveProperty("error");
    expect(res.body.error).toEqual("Invalid token");
  });
});

describe("Testing functions of api", () => {
  // test functions
  it("return 200 register function work", async () => {
    jest
      .spyOn(repository, "createUserDB")
      .mockResolvedValue({ name: "felipe" });

    const user = {
      name: "felipe",
      email: "felipereggiane@gmail.com",
      password: "abCd@123",
      confirmPassword: "abCd@123",
    };

    const res = await service.createUser(user);
    expect(res);
    expect(res).toHaveProperty("name");
    expect(res.name).toEqual("felipe");
  });

  it("register function error duplicated email", async () => {
    jest
      .spyOn(repository, "createUserDB")
      .mockRejectedValue({ code: "ER_DUP_ENTRY" });

    const user = {
      name: "felipe",
      email: "felipereggiane@gmail.com",
      password: "abCd@123",
      confirmPassword: "abCd@123",
    };

    try {
      const res = await service.createUser(user);
      console.log({ res });
      throw new Error();
    } catch (error) {
      expect(error.status).toEqual(409);
      expect(error).toHaveProperty("message");
      expect(error.message).toEqual("Email provided already exists");
    }
  });

  it("login function working", async () => {
    // para caso de sucesso
    jest.spyOn(repository, "findUserDB").mockResolvedValue({
      id: 83,
      name: "felipe",
      email: "felipereggiane2@hotmail.com",
      password: "$2b$10$Ic2ZtqmrJHyW0V8pONqWm.Gw6Z2LkOjLxsUDQLQVmODMb3xVZvH.a",
    });
    const user = {
      email: "felipereggiane2@hotmail.com",
      password: "abCd@123",
    };

    const res = await service.loginUser(user);
    console.log(res);
    expect(res).toContain(
      "eyJlbWFpbCI6ImZlbGlwZXJlZ2dpYW5lMkBob3RtYWlsLmNvbSIsImlhdCI6MTY2NjYzNz"
    );
  });

  it("login function error email or password invalid", async () => {
    jest.spyOn(repository, "findUserDB").mockRejectedValue({ status: 401 });

    const user = {
      email: "felipe@hotmail.com",
      password: "abCd@123",
    };
    try {
      const res = await service.loginUser(user);
      console.log({ res });
      throw new Error();
    } catch (error) {
      expect(error).toHaveProperty("status");
      expect(error.status).toEqual(401);
      expect(error).toHaveProperty("message");
      expect(error.message).toEqual("Email or password invalid");
    }
  });

  it("profile function working", async () => {
    jest
      .spyOn(repository, "findProfileByEmail")
      .mockResolvedValue({ name: "felipe" });

    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlbGlwZXJlZ2dpYW5lQGdtYWlsLmNvbSIsImlhdCI6MTY2NTc3NTk1NH0.gBUeNwerE_Ks6StH1j-BFrOwaEHC0hs4jAUNDy3019Y";
    const res = await service.profileUser("felipereggiane@gmail.com");
    expect(res).toHaveProperty("name");
    expect(res.name).toEqual("felipe");
  });
});
