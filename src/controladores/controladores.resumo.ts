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

        const novoTitulo = titulo || "Sem título"

        /* Adiciona descrição */
        const descricao: string = gerarDescricao("Uma descrição interessante")

        /* Recuperar id */
        const usuarioId = await new Token().extrair(bearerAuthorization as string)

        /* Tratar array */
        const novoTopicos = JSON.stringify(topicos)

        /* Sucesso */
        const {rows: resumo } = await pool.query(`
            insert into resumos(titulo, topicos, descricao, materia_id, usuario_id) 
            values ($1, $2, $3, $4, $5)
            returning id,
            usuario_id as "usuarioId",
            materia_id as "materiaId",
            titulo, topicos::jsonb as topicos, descricao, criado;
            `, [novoTitulo, novoTopicos, descricao, materiaId, usuarioId]
        )
        return res.status(201).json(resumo[0])

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
        const id = await new Token().extrair(bearerAuthorization as string)
        
        /* Resumo sem materia */
        if(!materia){
            const { rows: resultadoSemMateria } = await pool.query(`
                select resumos.id,
                usuario_id as "usuarioId",
                nome as "materia",
                titulo, topicos::jsonb, descricao, criado 
                from resumos
                inner join materias on resumos.materia_id = materias.id
                where usuario_id = $1
                `, [id]
            )
            return res.json(resultadoSemMateria)
        }

        /* Procurar matérias */
        const { rows: nomeMateria } = await pool.query(`
            select * from materias where nome = $1
            `, [materia]
        )
        const materiaId = (nomeMateria[0].id)

        /* Sucesso */
        const { rows: resumosUsuario } = await pool.query(`
            select resumos.id,
            usuario_id as "usuarioId",
            nome as "materia",
            titulo, topicos::jsonb as topicos, descricao, criado 
            from resumos
            inner join materias on resumos.materia_id = materias.id 
            where usuario_id = $1 and materia_id = $2
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
            const usuario_id = await new Token().extrair(bearerAuthorization as string)

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
            const { rows: resumo } = await pool.query(`
                update resumos set materia_id = $1, titulo = $2 where id = $3 
                returning id,
                usuario_id as "usuarioId",
                materia_id as "materiaId",
                titulo, topicos::jsonb as topicos, descricao, criado
                `, [materia_id, titulo, id]
            )
            return res.json(resumo[0])

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
        const usuario_id = await new Token().extrair(bearerAuthorization as string)

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
