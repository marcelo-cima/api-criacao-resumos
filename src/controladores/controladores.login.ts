import { Request, Response } from "express";
import pool from "../conexaoBd";

export class logarUsuario {
    async controlador(req: Request, res: Response){
        const { email, senha } = req.body

        if(!email || !senha) {
            return res.status(400).json
            ({ mensagem: 'Todos os campos são obrigatórios'})
        }
        
        const { rows: usuariosCadastrados } = await pool.query(`
            select * from usuarios where email = $1;
        `, [email])

    
    }
} 