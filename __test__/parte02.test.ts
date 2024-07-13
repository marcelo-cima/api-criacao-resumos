import bcrypt from "bcrypt";
import app from "../src/app";
import supertest from "supertest";
import { QueryResult } from "pg";
import TUsuario from "../src/tipos/TUsuario";
import pool from "../src/conexaoBd";

beforeAll(async () => {
  await pool.query(`TRUNCATE TABLE usuarios CASCADE;`);
});

afterAll(async () => {
  await pool.query(`TRUNCATE TABLE usuarios CASCADE;`);
  await pool.end();
});

beforeEach(async () => {
  await pool.query(`BEGIN`);
});

afterEach(async () => {
  await pool.query("ROLLBACK");
});

describe("POST /usuarios", function () {
  it("deve retornar status apropriado e mensagem de erro se algum campo obrigatório não for passado", async () => {
    const corpos = [
      { nome: "Lucas", email: "lucas@cubos.academy" },
      { nome: "Lucas", senha: "123" },
      { email: "caldeira@gmail.com", senha: "123" },
      {},
    ];

    for (let corpo of corpos) {
      const resposta = await supertest(app)
        .post("/usuarios")
        .set("Content-type", "application/json")
        .send(corpo);

      expect(resposta.statusCode).toEqual(400);
      expect(resposta.body).toHaveProperty(
        "mensagem",
        "Todos os campos são obrigatórios"
      );
    }
  });

  it("deve retornar status code apropriado e mensagem de erro caso já exista algum usuário com e-mail cadastrado", async () => {
    const corpo = { nome: "Lucas", email: "lucas@cubos.academy", senha: "123" };

    await pool.query(
      `INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3);`,
      [corpo.nome, corpo.email, corpo.senha]
    );

    const resposta = await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpo);

    expect([400, 409]).toContain(resposta.statusCode);
    expect(resposta.body).toHaveProperty("mensagem", "E-mail já cadastrado");
  });

  it("deve criptografar a senha usando o bcrypt antes de cadastrar no banco", async () => {
    const corpo = { nome: "Lucas", email: "lucas@cubos.academy", senha: "123" };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpo);

    const query = "SELECT * FROM usuarios WHERE email = $1 LIMIT 1";

    const resultadoConsulta: QueryResult<Required<TUsuario>> = await pool.query(
      query,
      [corpo.email]
    );

    const senhaCadastrada = resultadoConsulta.rows[0].senha;

    const confere = await bcrypt.compare(corpo.senha, senhaCadastrada);

    expect(confere).toBeTruthy();
  });

  it("deve retornar status apropriado e as informações do usuário cadastrado (incluindo o id e sem a senha)", async () => {
    const corpo = { nome: "Lucas", email: "lucas@cubos.academy", senha: "123" };

    const resposta = await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpo);

    expect(resposta.statusCode).toEqual(201);
    expect(resposta.body).toHaveProperty("id");
    expect(resposta.body).toHaveProperty("nome", corpo.nome);
    expect(resposta.body).toHaveProperty("email", corpo.email);
    expect(resposta.body).not.toHaveProperty("senha");
  });
});

describe("POST /login", function () {
  it("deve retornar status apropriado e mensagem de erro se algum campo obrigatório não for passado", async () => {
    const corpos = [{ email: "lucas@cubos.academy" }, { senha: "123" }, {}];

    for (let corpo of corpos) {
      const resposta = await supertest(app)
        .post("/usuarios")
        .set("Content-type", "application/json")
        .send(corpo);

      expect(resposta.statusCode).toEqual(400);
      expect(resposta.body).toHaveProperty(
        "mensagem",
        "Todos os campos são obrigatórios"
      );
    }
  });

  it("deve retornar status apropriado e mensagem de erro se o usuário não existir no banco de dados", async () => {
    const corpo = { email: "cubos.academy@cubos.com", senha: "123" };

    await pool.query("DELETE FROM usuarios WHERE email = $1", [corpo.email]);

    const resposta = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpo);

    expect(resposta.statusCode).toBe(400);
    expect(resposta.body).toHaveProperty(
      "mensagem",
      "E-mail ou senha inválidos"
    );
  });

  it("deve retornar status apropriado e mensagem de erro se a senha estiver incorreta", async () => {
    const corpo = { email: "cubos.academy@cubos.com", senha: "123" };

    const senhaCriptografada = await bcrypt.hash(corpo.senha + "a", 1);

    await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3)",
      ["Cubos Academy", corpo.email, senhaCriptografada]
    );

    const resposta = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpo);

    expect(resposta.statusCode).toBe(400);
    expect(resposta.body).toHaveProperty(
      "mensagem",
      "E-mail ou senha inválidos"
    );
  });

  it("deve retornar status apropriado e o token de autenticação", async () => {
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

    const resposta = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toHaveProperty("token");
  });
});
