import supertest from "supertest";
import pool from "../src/conexaoBd";
import app from "../src/app";
import { popularMaterias } from "./seed";
import { QueryResult } from "pg";
import TMateria from "../src/tipos/TMateria";

beforeAll(async () => {
  await Promise.all([
    pool.query(`TRUNCATE TABLE resumos CASCADE;`),
    pool.query(`TRUNCATE TABLE usuarios CASCADE;`),
    pool.query(`TRUNCATE TABLE materias CASCADE;`),
  ]);
});

afterAll(async () => {
  await Promise.all([
    pool.query(`TRUNCATE TABLE resumos CASCADE;`),
    pool.query(`TRUNCATE TABLE usuarios CASCADE;`),
    pool.query(`TRUNCATE TABLE materias CASCADE;`),
  ]);
  await pool.end();
});

beforeEach(async () => {
  await pool.query(`BEGIN`);
});

afterEach(async () => {
  await pool.query("ROLLBACK");
});

describe("POST /resumos", function () {
  it("deve retornar status apropriado e mensagem de erro se o token não for passado ou for inválido", async () => {
    const corpo = {
      materiaId: 1,
      titulo: "Resumo 1",
      topicos: ["front", "back"],
    };

    const respostaSemToken = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .send(corpo);

    const respostaTokenInvalido = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer TokenInvalido`)
      .send(corpo);

    expect(respostaSemToken.statusCode).toBe(401);
    expect(respostaSemToken.body).toHaveProperty(
      "mensagem",
      "Falha na autenticação"
    );
    expect(respostaTokenInvalido.statusCode).toBe(401);
    expect(respostaTokenInvalido.body).toHaveProperty(
      "mensagem",
      "Falha na autenticação"
    );
  });

  it("deve retornar status apropriado e mensagem de erro se algum campo obrigatório não for passado", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    const corpos = [
      { materiaId: 1, titulo: "Título 01" },
      { titulo: "Título 01", topicos: ["front", "back"] },
      { titulo: "Título 01" },
      { topicos: [] },
      {},
    ];

    for (let corpo of corpos) {
      const respostaCadastrarResumo = await supertest(app)
        .post("/resumos")
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(corpo);

      expect(respostaCadastrarResumo.statusCode).toEqual(400);
      expect(respostaCadastrarResumo.body).toHaveProperty(
        "mensagem",
        "Todos os campos são obrigatórios"
      );
    }
  });

  it("deve retornar status apropriado e mensagem de erro se a matéria não existir", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    const corpo = {
      materiaId: -1,
      titulo: "Título 01",
      topicos: ["front", "back"],
    };

    const respostaCadastrarResumo = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpo);

    expect(respostaCadastrarResumo.statusCode).toEqual(404);
    expect(respostaCadastrarResumo.body).toHaveProperty(
      "mensagem",
      "Matéria não encontrada"
    );
  });

  it("deve retornar status apropriado e os dados do resumo criado (incluindo o id)", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaCadastroUsuario = await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const idUsuario = respostaCadastroUsuario.body.id;

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    await popularMaterias();

    const { rows: materiasEncontradas }: QueryResult<Required<TMateria>> =
      await pool.query(`SELECT * FROM materias`);

    const idPrimeiraMateria = materiasEncontradas[0].id;

    const corpoComTitulo = {
      materiaId: idPrimeiraMateria,
      titulo: "Resumo sobre APIs",
      topicos: ["front", "back"],
    };

    const respostaCadastrarResumoComTitulo = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpoComTitulo);

    const corpoSemTitulo = {
      materiaId: idPrimeiraMateria,
      topicos: ["front", "back"],
    };

    const respostaCadastrarResumoSemTitulo = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpoSemTitulo);

    expect(respostaCadastrarResumoSemTitulo.statusCode).toEqual(201);
    expect(respostaCadastrarResumoSemTitulo.body).toHaveProperty("id");
    expect(respostaCadastrarResumoSemTitulo.body).toHaveProperty(
      "materiaId",
      idPrimeiraMateria
    );
    expect(respostaCadastrarResumoSemTitulo.body).toHaveProperty(
      "usuarioId",
      idUsuario
    );
    expect(respostaCadastrarResumoSemTitulo.body).toHaveProperty(
      "titulo",
      "Sem título"
    );
    expect(respostaCadastrarResumoComTitulo.body).toHaveProperty(
      "titulo",
      "Resumo sobre APIs"
    );
    expect(respostaCadastrarResumoSemTitulo.body).toHaveProperty("topicos", [
      "front",
      "back",
    ]);
    expect(respostaCadastrarResumoSemTitulo.body).toHaveProperty("descricao");
    expect(respostaCadastrarResumoSemTitulo.body).toHaveProperty("criado");
  });
});

describe("GET /resumos", function () {
  it("deve retornar status apropriado e mensagem de erro se o token não for passado ou for inválido", async () => {
    const corpo = {
      materiaId: 1,
      titulo: "Resumo 1",
      topicos: ["front", "back"],
    };

    const respostaSemToken = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .send(corpo);

    const respostaTokenInvalido = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer TokenInvalido`)
      .send(corpo);

    expect(respostaSemToken.statusCode).toBe(401);
    expect(respostaSemToken.body).toHaveProperty(
      "mensagem",
      "Falha na autenticação"
    );
    expect(respostaTokenInvalido.statusCode).toBe(401);
    expect(respostaTokenInvalido.body).toHaveProperty(
      "mensagem",
      "Falha na autenticação"
    );
  });

  it("deve retornar status apropriado e todos os resumos do usuário logado caso o filtro não seja passado", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    await popularMaterias();

    const { rows: materiasEncontradas }: QueryResult<Required<TMateria>> =
      await pool.query(`SELECT * FROM materias`);

    const idPrimeiraMateria = materiasEncontradas[0].id;

    const corpoComTitulo = {
      materiaId: idPrimeiraMateria,
      titulo: "Resumo sobre APIs",
      topicos: ["front", "back"],
    };

    const respostaListarResumosVazio = await supertest(app)
      .get("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(respostaListarResumosVazio.statusCode).toBe(200);
    expect(respostaListarResumosVazio.body.length).toBe(0);

    await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpoComTitulo);
    await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpoComTitulo);

    const respostaListarResumos = await supertest(app)
      .get("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(respostaListarResumos.statusCode).toBe(200);
    expect(respostaListarResumos.body.length).toBe(2);
    expect(respostaListarResumos.body[0]).toHaveProperty("id");
    expect(respostaListarResumos.body[0]).toHaveProperty("usuarioId");
    expect(respostaListarResumos.body[0]).toHaveProperty("materia");
    expect(respostaListarResumos.body[0]).toHaveProperty("titulo");
    expect(respostaListarResumos.body[0]).toHaveProperty("topicos");
    expect(respostaListarResumos.body[0]).toHaveProperty("descricao");
    expect(respostaListarResumos.body[0]).toHaveProperty("criado");
  });

  it("deve retornar status apropriado e os resumos filtrados do usuário logado caso o filtro seja passado", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    await popularMaterias();

    const { rows: materiasEncontradas }: QueryResult<Required<TMateria>> =
      await pool.query(`SELECT * FROM materias`);

    const idPrimeiraMateria = materiasEncontradas[0].id;

    const corpoComTituloIdPrimeiraMateria = {
      materiaId: idPrimeiraMateria,
      titulo: "Resumo sobre APIs",
      topicos: ["front", "back"],
    };

    const respostaListarResumosVazio = await supertest(app)
      .get("/resumos?materia=Backe-end")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(respostaListarResumosVazio.statusCode).toBe(200);
    expect(respostaListarResumosVazio.body.length).toBe(0);

    await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpoComTituloIdPrimeiraMateria);

    await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpoComTituloIdPrimeiraMateria);

    const idSegundaMateria = materiasEncontradas[1].id;

    const corpoComTituloIdSegundaMateria = {
      materiaId: idSegundaMateria,
      titulo: "Resumo sobre APIs",
      topicos: ["front", "back"],
    };

    await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpoComTituloIdSegundaMateria);

    const respostaListarResumosBack = await supertest(app)
      .get("/resumos?materia=Back-end")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    const respostaListarResumosFront = await supertest(app)
      .get("/resumos?materia=Front-end")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(respostaListarResumosBack.statusCode).toBe(200);
    expect(respostaListarResumosBack.body.length).toBe(2);
    expect(respostaListarResumosFront.body.length).toBe(1);
    expect(respostaListarResumosBack.body[0]).toHaveProperty("id");
    expect(respostaListarResumosBack.body[0]).toHaveProperty("usuarioId");
    expect(respostaListarResumosBack.body[0]).toHaveProperty("materia");
    expect(respostaListarResumosBack.body[0]).toHaveProperty("titulo");
    expect(respostaListarResumosBack.body[0]).toHaveProperty("topicos");
    expect(respostaListarResumosBack.body[0]).toHaveProperty("descricao");
    expect(respostaListarResumosBack.body[0]).toHaveProperty("criado");
  });
});

describe("PUT /resumos", function () {
  it("deve retornar status apropriado e mensagem de erro se o token não for passado ou for inválido", async () => {
    const corpo = {
      materiaId: 1,
      titulo: "Resumo 1",
      topicos: ["front", "back"],
    };

    const respostaSemToken = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .send(corpo);

    const respostaTokenInvalido = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer TokenInvalido`)
      .send(corpo);

    expect(respostaSemToken.statusCode).toBe(401);
    expect(respostaSemToken.body).toHaveProperty(
      "mensagem",
      "Falha na autenticação"
    );
    expect(respostaTokenInvalido.statusCode).toBe(401);
    expect(respostaTokenInvalido.body).toHaveProperty(
      "mensagem",
      "Falha na autenticação"
    );
  });

  it("deve retornar status apropriado e mensagem de erro caso algum campo obrigatório não seja passado", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    const corpos = [{ materiaId: 1 }, { titulo: "Título 01" }, {}];

    for (const corpo of corpos) {
      const resposta = await supertest(app)
        .put("/resumos/1")
        .set("Content-type", "application/json")
        .set("Authorization", `Bearer ${token}`)
        .send(corpo);

      expect(resposta.statusCode).toBe(400);
      expect(resposta.body).toHaveProperty(
        "mensagem",
        "Todos os campos são obrigatórios"
      );
    }
  });

  it("deve retornar status apropriado e mensagem de erro caso a matéria não seja encontrada", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    const corpo = { materiaId: -1, titulo: "Título 01" };

    const resposta = await supertest(app)
      .put("/resumos/1")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpo);

    expect(resposta.statusCode).toBe(404);
    expect(resposta.body).toHaveProperty("mensagem", "Matéria não encontrada");
  });

  it("deve retornar status apropriado e mensagem de erro caso o resumo não seja encontrado", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    await popularMaterias();

    const respostaListagemMateria = await supertest(app)
      .get("/materias")
      .set("Authorization", `Bearer ${token}`);

    const corpo = {
      materiaId: respostaListagemMateria.body[0].id,
      titulo: "Título 01",
    };

    const idResumoProdurado = 1;

    await pool.query(`DELETE FROM resumos WHERE id = $1;`, [idResumoProdurado]);

    const resposta = await supertest(app)
      .put(`/resumos/${idResumoProdurado}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpo);

    expect(resposta.statusCode).toBe(404);
    expect(resposta.body).toHaveProperty("mensagem", "Resumo não encontrado");
  });

  it("deve retornar status apropriado e o resumo editado", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaUsuarioCadastrado = await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const idUsuarioLogado = respostaUsuarioCadastrado.body.id;

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    await popularMaterias();

    const respostaMateria = await supertest(app)
      .get("/materias")
      .set("Authorization", `Bearer ${token}`);

    const corpoCriacaoResumo = {
      materiaId: respostaMateria.body[0].id,
      titulo: "Título 01",
      topicos: ["front", "back", "Carreira"],
    };

    const respostaCriacaoResumo = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpoCriacaoResumo);

    const corpoEdicaoResumo = {
      materiaId: respostaMateria.body[1].id,
      titulo: "Novo título",
    };

    const resposta = await supertest(app)
      .put(`/resumos/${respostaCriacaoResumo.body.id}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpoEdicaoResumo);

    expect(resposta.statusCode).toBe(200);
    expect(resposta.body).toHaveProperty("id");
    expect(resposta.body).toHaveProperty("usuarioId", idUsuarioLogado);
    expect(resposta.body).toHaveProperty(
      "materiaId",
      corpoEdicaoResumo.materiaId
    );
    expect(resposta.body).toHaveProperty("titulo", corpoEdicaoResumo.titulo);
    expect(resposta.body).toHaveProperty("topicos");
    expect(Array.isArray(resposta.body.topicos)).toBe(true);
    expect(resposta.body).toHaveProperty("descricao");
    expect(resposta.body).toHaveProperty("criado");
  });
});

describe("DELETE /resumos/:id", () => {
  it("deve retornar status apropriado e mensagem de erro se o token não for passado ou for inválido", async () => {
    const corpo = {
      materiaId: 1,
      titulo: "Resumo 1",
      topicos: ["front", "back"],
    };

    const respostaSemToken = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .send(corpo);

    const respostaTokenInvalido = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer TokenInvalido`)
      .send(corpo);

    expect(respostaSemToken.statusCode).toBe(401);
    expect(respostaSemToken.body).toHaveProperty(
      "mensagem",
      "Falha na autenticação"
    );
    expect(respostaTokenInvalido.statusCode).toBe(401);
    expect(respostaTokenInvalido.body).toHaveProperty(
      "mensagem",
      "Falha na autenticação"
    );
  });

  it("deve retornar status apropriado e mensagem de erro caso o resumo não seja encontrado", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    await popularMaterias();

    await supertest(app)
      .get("/materias")
      .set("Authorization", `Bearer ${token}`);

    const idResumoProdurado = 1;

    await pool.query(`DELETE FROM resumos WHERE id = $1;`, [idResumoProdurado]);

    const resposta = await supertest(app)
      .delete(`/resumos/${idResumoProdurado}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(resposta.statusCode).toBe(404);
    expect(resposta.body).toHaveProperty("mensagem", "Resumo não encontrado");
  });

  it("deve retornar status apropriado e o resumo deletado", async () => {
    const corpoCadastroUsuario = {
      nome: "Cubos Academy",
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    await supertest(app)
      .post("/usuarios")
      .set("Content-type", "application/json")
      .send(corpoCadastroUsuario);

    const corpoLogin = {
      email: "cubos.academy@cubos.com",
      senha: "123",
    };

    const respostaLogin = await supertest(app)
      .post("/login")
      .set("Content-type", "application/json")
      .send(corpoLogin);

    const token = respostaLogin.body.token;

    await popularMaterias();

    const respostaMateria = await supertest(app)
      .get("/materias")
      .set("Authorization", `Bearer ${token}`);

    const corpoCriacaoResumo = {
      materiaId: respostaMateria.body[0].id,
      titulo: "Título 01",
      topicos: ["front", "back", "Carreira"],
    };

    const respostaCriacaoResumo = await supertest(app)
      .post("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send(corpoCriacaoResumo);

    const respostaDeletarResumo = await supertest(app)
      .delete(`/resumos/${respostaCriacaoResumo.body.id}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    const respostaListarResumos = await supertest(app)
      .get("/resumos")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);

    expect(respostaDeletarResumo.statusCode).toBe(204);
    expect(respostaListarResumos.body.length).toBe(0);
  });
});
