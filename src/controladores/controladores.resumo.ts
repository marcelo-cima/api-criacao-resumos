import { Request, Response } from "express";
import { adicionarResumo, exibirResumos, gerarDescricao } from "../utilitarios/utilitarios";
import { Resumo } from "../modelos/Resumo";
import pool from "../conexaoBd";


/* Criar um resumo */
export class criarResumo {
    async controlador(req: Request, res: Response){
        const { materiaId, titulo, topicos } = req.body
        
        
        if(!materiaId || !topicos) {
            return res.status(400).json({
                mensagem: 'Todos os campos são obrigatórios'
            })
        }
        
        const bancodedados = await exibirResumos()
        const materiaParecida = bancodedados.find ( materias => {
            return materias.materiaId === materiaId
        })
        if(!materiaParecida) {
            return res.status(400).json({
                mensagem: 'Matéria não encontrada'
            })
        }

        if(!titulo){
            const novoResumo = new Resumo({
                id: 1,
                usuarioId: 2,
                materiaId: materiaId,
                titulo: "Sem título",
                topicos: topicos,
                descricao: gerarDescricao("insira descricao longa aqui"),
                criado: "hoje"
            })
            await adicionarResumo(novoResumo)
            return res.status(201).json(novoResumo)
        } else {
            const novoResumo = new Resumo({
                id: 1,
                usuarioId: 2,
                materiaId: materiaId,
                titulo: titulo,
                topicos: topicos,
                descricao: gerarDescricao("insira descricao longa aqui"),
                criado: "hoje"
            })
            await adicionarResumo(novoResumo)
            return res.status(201).json(novoResumo)
        }
    }
}

/* Listar resumos */
export class listarResumos {
    async controlador(req: Request, res: Response){
        const { materia } = req.query
        
        try {
            const { rows } = await pool.query(`
                select * from resumos;
            `)
            return res.json(rows)

        } catch (error) {
            console.log((error as Error).message)
            return res.status(500).json({ mensagem: 'Erro interno' })
        }
    }
} 

/* Editar um resumo */
export class editarResumo {
    async controlador(req: Request, res: Response){
        const { id } = req.params
        const { materiaId, titulo} = req.body

        if(!id || !materiaId || !titulo) {
            return res.status(400).json({
                mensagem: 'Todos os campos são obrigatórios'
            })
        }

        const bancodedados = await exibirResumos()
        const idParecido = bancodedados.find ( resumos => {
            return resumos.id === Number(id)
        })
        if(!idParecido) {
            return res.status(404).json({
                mensagem: 'Resumo não encontrado'
            })
        }

        /* const materiaIdParecida = bancodedados.find ( resumos => {
            return resumos.materiaId === materiaId
        })
        if(!materiaIdParecida){
            return res.status(404).json({
                mensagem: 'Matéria não encontrada'
            })
        } */

        idParecido.titulo = titulo
        idParecido.materiaId = materiaId

        return res.status(200).json(idParecido)

    }
}