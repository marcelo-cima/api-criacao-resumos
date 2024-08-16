import fs from 'fs/promises'
import { Resumo } from '../modelos/Resumo'
import * as jwt from "jsonwebtoken"

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

export function validarSenha (senhaCadastrada: string, senhaDigitada: string): boolean {
    return senhaCadastrada !== senhaDigitada ? false : true
} 

export function criarToken(conteudo: any) {
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

export function extrairId(authorization: string){
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