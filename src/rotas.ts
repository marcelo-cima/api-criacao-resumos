import { Router } from "express";
import { ControladorResumo } from "./controladores/controladores.resumo";
import { criarUmaConta, fazerLogin, validarToken } from "./controladores/controladores.login";
import { Materias } from "./controladores/controladores.materias";

export const rotas = Router()


rotas.post('/usuarios', new criarUmaConta().controlador )

rotas.post('/login', new fazerLogin().controlador)


rotas.use(new validarToken().intermediario)

rotas.get('/materias', new Materias().controlador)

rotas.post("/resumos", new ControladorResumo().criar)

rotas.get('/resumos', new ControladorResumo().listar)

rotas.put('/resumos/:id', new ControladorResumo().editar)

rotas.delete('/resumos/:id', new ControladorResumo().deletar )

