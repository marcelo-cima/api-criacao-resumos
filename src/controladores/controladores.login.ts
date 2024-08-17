import { NextFunction, Request, Response } from "express";
import pool from "../conexaoBd";
import { Token, validarSenha } from "../utilitarios/utilitarios";
import bcrypt from "bcrypt"


export class criarUmaConta{
    async controlador(req: Request, res: Response){
        const { nome, email, senha } = req.body

        try {
            if (!nome || !email || !senha){
                return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios'}) 
            }
    
            const {rows: emailExistente} = await pool.query(`
                select email from usuarios where email = $1
                `, [email]
            )
            
            if(emailExistente.length !== 0){
                return res.status(400).json({ mensagem: 'E-mail já cadastrado'})
            }
    
            const senhaCriptografada: string = await bcrypt.hash(senha, 10)
    
            await pool.query(`
                insert into usuarios(nome, email, senha) values($1, $2, $3)
                `, [nome, email, senhaCriptografada]
            )
    
            const {rows: usuarioCriado} = await pool.query(`
                select id, nome, email from usuarios where nome = $1
                `, [nome]
            )
    
            return res.status(201).json(usuarioCriado[0])
        } catch (error) {
            console.log((error as Error).message)
            return res.status(500).json({ mensagem: 'Erro interno' })   
        }
    }
}

export class fazerLogin {
    async controlador(req: Request, res: Response){
        const { email, senha } = req.body

        try {
        /* Campo não enviado */
        if(!email || !senha) {
            return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios'})
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
        const senhaConferida = validarSenha(email, senha)
        if(!senhaConferida){
            return res.status(400).json({ mensagem: 'E-mail ou senha inválidos' })
        }

        /* Sucesso */
        const token = new Token().criar({ id: usuarioCadastrado.id })
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

                /* Authorization não inserido */
                if (!bearerAuthorization){
                    return res.status(401).json({ mensagem: "Falha na autenticação"})
                }
            
                /* Tirar Bearer do Authorization */
                const authorization = bearerAuthorization.substring(7)
                
                /* Sem id vinculado à authorization */
                const id = new Token().extrair(authorization)
                if (!id) { 
                    return res.status(401).json({ mensagem: "Falha na autenticação"}) 
                }
        
                /* Usuário não encontrado */
                const { rows: usuario } = await pool.query(`
                select * from usuarios where id = $1
                `, [id])
                if (usuario.length === 0) {
                    return res.status(401).json({ mensagem: "Falha na autenticação"})
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
