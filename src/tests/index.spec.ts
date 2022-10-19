import app from "../server";
import request from "supertest";
import repository from "../repositiories/repository";

describe("POST /register", () => {
  it("test register function", async () => {
    // para caso de erro, email duplicado
    // jest
    //   .spyOn(repository, "createUserDB")
    //   .mockRejectedValue({ code: "ER_DUP_ENTRY" });

    // para caso de sucesso
    jest
      .spyOn(repository, "createUserDB")
      .mockResolvedValue({ name: "felipe" });
    const res = await request(app)
      .post("/register")
      .send({
        user: {
          name: "felipe",
          email: "teste9@hotmail.com",
          password: "abCd@123",
          confirmPassword: "abCd@123",
        },
      });
    // para caso de sucesso
    expect(res.statusCode).toEqual(200);

    // para caso de erro
    // expect(res.statusCode).toEqual(409);
    // expect(res).toHaveProperty("body");
    // expect(res.body).toHaveProperty("error");
    // expect(res.body.error).toEqual("Email provided already exists");
  });

  // it("login work if return status code 200", async () => {
  //   const res = await request(app)
  //     .post("/login")
  //     .send({
  //       user: {
  //         email: "teste3@hotmail.com",
  //         password: "abCd@123",
  //       },
  //     });
  //   try {
  //     expect(res.statusCode).toEqual(200);
  //   } catch (error) {
  //     throw new Error(error);
  //     // console.log(error);
  //   }
  // });

  // it("profile work if return status code 200", async () => {
  //   const token =
  //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZlbGlwZXJlZ2dpYW5lQGdtYWlsLmNvbSIsImlhdCI6MTY2NTc3NTk1NH0.gBUeNwerE_Ks6StH1j-BFrOwaEHC0hs4jAUNDy3019Y";
  //   const res = await request(app)
  //     .get("/profile")
  //     .set({ Authorization: token });
  //   try {
  //     expect(res.statusCode).toEqual(200);
  //   } catch (error) {
  //     throw new Error(error);
  //     // console.log(error);
  //   }
  // });
});
