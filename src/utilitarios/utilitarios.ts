import fs from 'fs/promises'
import { Resumo } from '../modelos/Resumo'

const caminhoBancoDeDados = 'src/bancodedados.json'

export async function listarResumos(): Promise<Resumo[]> {
    const dados = await fs.readFile(caminhoBancoDeDados)
    const parse = JSON.parse(dados.toString())
    return parse
}


export async function adicionarResumos(resumo: Resumo){
    const dados = await listarResumos()
    dados.push(resumo)
    await fs.writeFile(caminhoBancoDeDados, JSON.stringify(dados, null, '\t'))
}