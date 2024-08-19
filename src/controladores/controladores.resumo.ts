import { Request, Response } from "express";
import { adicionarResumo, exibirResumos, gerarDescricao, Token } from "../utilitarios/utilitarios";
import { Resumo } from "../modelos/Resumo";
import pool from "../conexaoBd";

export class ControladorResumo {
    async criar(req: Request, res: Response){
        const { materiaId, titulo, topicos} = req.body
        const { authorization: bearerAuthorization } = req.headers

        try {
            /* Campo não enviado */
        if(!materiaId || !topicos){
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios"})
        }

        /* Matéria não encontrada */
        const {rows: encontrarMateria} = await pool.query(`
            select id from materias where id = $1
            `, [materiaId]
        )
        if(encontrarMateria.length === 0){
            return res.status(404).json({ mensagem: "Matéria não encontrada"})
        }

        /* Adiciona Sem Título */
        if(!titulo){
            let titulo = "Sem título"
        }

        /* Adiciona descrição */
        const descricao: string = gerarDescricao("Uma descrição interessante")

        /* Recuperar id */
        if (!bearerAuthorization){
            return res.status(401).json({ mensagem: "Falha na autenticação"})
        }
        const authorization = bearerAuthorization.substring(7)
        const usuarioId = await new Token().extrair(authorization)

        /* Cria resumo */
        const { rows } = await pool.query(`
            insert into resumos(topicos, descricao, materia_id, usuario_id) values ($1, $2, $3, $4)
            `, [topicos, descricao, materiaId, usuarioId]
        )

        /* Retorna resumo */
        const { rows: resumo } = await pool.query(`
            select * from resumos where topicos = $1 and descricao = $2 and materia_id = $3
            `, [topicos, descricao, materiaId]
        )
        return res.status(201).json(resumo)

        } catch (error) {
            console.log((error as Error).message)
            return res.status(500).json({ mensagem: 'Erro interno' })
        }
    }

    async listar(req: Request, res: Response){
        const { materia } = req.query
        const { authorization: bearerAuthorization } = req.headers

       try {
        /* Recuperar id */
        if (!bearerAuthorization){
            return res.status(401).json({ mensagem: "Falha na autenticação"})
        }
        const authorization = bearerAuthorization.substring(7)
        const id = await new Token().extrair(authorization)
        
        if(!materia){
            const { rows: resultadoSemMateria } = await pool.query(`
                select * from resumos where usuario_id = $1
                `, [id]
            )
            return res.json(resultadoSemMateria)
        }

        /* Procurar matérias */
        const { rows: rowMateriaId } = await pool.query(`
            select id from materias where nome = $1
            `, [materia]
        )
        const materiaId = (rowMateriaId[0].id)

        /* Sucesso */
        const { rows: resumosUsuario } = await pool.query(`
            select * from resumos where usuario_id = $1 and materia_id = $2
            `, [id, materiaId]
        )
        return res.json(resumosUsuario)

       } catch (error) {
            console.log((error as Error).message)
            return res.status(500).json({ mensagem: 'Erro interno' })
       }

    }

    async editar(req: Request, res: Response){
        const { id } = req.params
        const { materiaId: materia_id, titulo } = req.body
        const { authorization: bearerAuthorization } = req.headers

        try {
            /* Campo não enviado */
        if(!id || !materia_id || !titulo){
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios"})
        }

        /* Buscar materia */
        const { rows: materia } = await pool.query(`
            select nome from materias where id = $1
            `, [materia_id]
        )

        /* Matéria não encontrada */
        if(materia.length === 0) {
            return res.status(404).json({ mensagem: "Matéria não encontrada"})
        }

         /* Recuperar id */
         if (!bearerAuthorization){
            return res.status(401).json({ mensagem: "Falha na autenticação"})
        }
        const authorization = bearerAuthorization.substring(7)
        const usuario_id = await new Token().extrair(authorization)

        /* Procurar resumo */
        const { rows: rowResumoId } = await pool.query(`
            select * from resumos where id = $1 and usuario_id = $2
            `, [id, usuario_id]
        )        
        
        /* Não achou resumo */
        if(rowResumoId.length === 0) {
            return res.status(404).json({ mensagem: "Resumo não encontrado"})
        }

       /* Editar resumo */
        await pool.query(`
            update resumos set materia_id = $1, titulo = $2 where id = $3
            `, [materia_id, titulo, id]
        )
        
        /* Retornar resumo */
        const { rows: rowResumo } = await pool.query(`
            select * from resumos where id = $1 and usuario_id = $2
            `, [id]
        )
        const resumo = (rowResumo[0].id)
        return res.json(resumo) 
        } catch (error) {
            console.log((error as Error).message)
            return res.status(500).json({ mensagem: 'Erro interno' })
        }    
    }

    async deletar(req: Request, res: Response){
        const { id: resumo_id } = req.params
        const { authorization: bearerAuthorization } = req.headers

        try {
            /* Campo não enviado */
        if(!resumo_id){
            return res.status(400).json({ mensagem: "Todos os campos são obrigatórios"})
        }

        /* Recuperar id */
         if (!bearerAuthorization){
            return res.status(401).json({ mensagem: "Falha na autenticação"})
        }
        const authorization = bearerAuthorization.substring(7)
        const usuario_id = await new Token().extrair(authorization)

        /* Procurar resumo */
        const { rows: rowResumoId } = await pool.query(`
            select * from resumos where id = $1 and usuario_id = $2
            `, [resumo_id, usuario_id]
        )        
        
        /* Não achou resumo */
        if(rowResumoId.length === 0) {
            return res.status(404).json({ mensagem: "Resumo não encontrado"})
        }

        /* Deletar resumo */
        await pool.query(`
            delete from resumos where id = $1 and usuario_id = $2
            `, [resumo_id, usuario_id]
        )

        return res.status(204).send()
        } catch (error) {
            console.log((error as Error).message)
            return res.status(500).json({ mensagem: 'Erro interno' }) 
        }
        
    }
}
