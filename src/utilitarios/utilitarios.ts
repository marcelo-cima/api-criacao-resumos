import fs from 'fs/promises'
import { Resumo } from '../modelos/Resumo'
import * as jwt from "jsonwebtoken"
import pool from '../conexaoBd'
import bcrypt from "bcrypt"
import { decrypt } from 'dotenv'

const caminhoBancoDeDados = 'src/bancodedados.json'

export async function exibirResumos(): Promise<Resumo[]> {
    const dados = await fs.readFile(caminhoBancoDeDados)
    const parse = JSON.parse(dados.toString())
    return parse
}


export async function adicionarResumo(resumo: Resumo){
    const dados = await exibirResumos()
    dados.push(resumo)
    await fs.writeFile(caminhoBancoDeDados, JSON.stringify(dados, null, '\t'))
}

export function gerarDescricao(descricao: string): string {
    return descricao ? descricao : 'gerado automaticamente'   
}

export async function validarSenha (email: string, senhaDigitada: string): Promise<boolean> {
       
    const { rows: senhaCriptografada} = await pool.query(`
        select senha from usuarios email = $1
        `, [email]
    )
    
    return await bcrypt.compare(senhaDigitada, senhaCriptografada[0].senha)
} 


export class Token{
    criar(conteudo: any){
        try {
            const token = jwt.sign(
            conteudo, 
            process.env.SENHA_JWT || "", 
            { expiresIn: "1h" })
    
            return token
        } catch (error) {
            console.log((error as Error).message)
            return false
        }
    }

    extrair(authorization: string){
        try {
            const {id} = jwt.verify(
                authorization, 
                process.env.SENHA_JWT || ""
            ) as jwt.JwtPayload
    
            return id
        } catch (error) {
            return false
        }
    }
}