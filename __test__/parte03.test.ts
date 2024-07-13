import app from "../src/app";
import supertest from "supertest";
import pool from "../src/conexaoBd";
import { popularMaterias } from "./seed";

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE usuarios CASCADE;`);
  await pool.query(`TRUNCATE TABLE materias CASCADE;`);
});

afterAll(async () => {
  await pool.query(`TRUNCATE TABLE usuarios CASCADE;`);
  await pool.query(`TRUNCATE TABLE usuarios CASCADE;`);
  await pool.end();
});

beforeEach(async () => {
  await pool.query(`BEGIN`);
});

afterEach(async () => {
  await pool.query("ROLLBACK");
});

describe("GET /materias", function () {
  it("deve retornar todas as matérias", async () => {
    await popularMaterias();

    const corpoCadastro = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastro);

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    const respostaListagemMaterias = await supertest(app)
      .get("/materias")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(respostaListagemMaterias.statusCode).toBe(200);
    expect(respostaListagemMaterias.body[0]).toHaveProperty("id");
    expect(respostaListagemMaterias.body[0]).toHaveProperty("nome");
    expect(respostaListagemMaterias.body.length).toBe(7);
  });
});
