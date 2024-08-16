import { NextFunction, Request, Response } from "express";
import pool from "../conexaoBd";
import { criarToken, extrairId, validarSenha } from "../utilitarios/utilitarios";
import * as jwt from "jsonwebtoken"



export class logarUsuario {
    async controlador(req: Request, res: Response){
        const { email, senha } = req.body


        try {
        /* Campo não enviado */
        if(!email || !senha) {
            return res.status(400).json
            ({ mensagem: 'Todos os campos são obrigatórios'})
        }
        
        /* Confere email */
        const { rows: usuariosCadastrados } = await pool.query(`
            select * from usuarios where email = $1 limit 1;
        `, [email])
        if(usuariosCadastrados.length === 0){
            return res.status(404).json({ mensagem: 'E-mail ou senha inválidos' })
        }

        /* Confere senha */
        const usuarioCadastrado = usuariosCadastrados[0]
        const senhaConferida = validarSenha(usuarioCadastrado.senha, senha)
        if(!senhaConferida){
            return res.status(400).json({ mensagem: 'E-mail ou senha inválidos' })
        }

        /* Sucesso */
        const token = criarToken({ id: usuarioCadastrado.id })
        if (!token){
            return res.status(401).json({ mensagem: "Falha na autenticação"})
        }
        return res.json({ token })

        /* Comprovante de login */

        } catch (error) {
            console.log((error as Error).message)
            return res.status(500).json({ mensagem: 'Erro interno' })  
        }

       
    
    }
}


export class validarToken {
    async intermediario (req: Request, res: Response, next: NextFunction) {
        {
            const { authorization: bearerAuthorization } = req.headers;
        
            try {

                const falhaAutenticacao = res.status(401).json({ mensagem: "Falha na autenticação"})

                /* Authorization não inserido */
                if (!bearerAuthorization){
                    return falhaAutenticacao
                }
            
                /* Tirar Bearer do Authorization */
                const authorization = bearerAuthorization.substring(7)
                
                /* Sem id vinculado à authorization */
                const id = extrairId(authorization)
                if (!id) { 
                    return falhaAutenticacao 
                }
        
                /* Usuário não encontrado */
                const { rows: usuario } = await pool.query(`
                select * from usuarios where id = $1
                `, [id])
                if (usuario.length === 0) {
                    return falhaAutenticacao
                }
        
                /* Sucesso */
                next()
                
            } catch (error) {
                console.log((error as Error).message)
                return res.status(500).json({ mensagem: 'Erro interno' })
            }
        
            
        }
    }
}
