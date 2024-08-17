import { Router } from "express";
import { criarResumo, editarResumo, listarResumos } from "./controladores/controladores.resumo";
import { criarUmaConta, fazerLogin, validarToken } from "./controladores/controladores.login";

export const rotas = Router()


rotas.post('/usuarios', new criarUmaConta().controlador )

rotas.post('/login', new fazerLogin().controlador)


rotas.use(new validarToken().intermediario)


rotas.post("/resumos", new criarResumo().controlador)

rotas.get('/resumos', new listarResumos().controlador)

rotas.put('/resumos/:id', new editarResumo().controlador)

rotas.delete('/resumos/:id', )

