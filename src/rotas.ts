import { Router } from "express";
import { criarResumo, editarResumo } from "./controladores/controladores";

export const rotas = Router()

rotas.post("/resumos", new criarResumo().controlador)

rotas.get('/resumos', )

rotas.put('/resumos/:id', new editarResumo().controlador )

rotas.delete('/resumos/:id', )

