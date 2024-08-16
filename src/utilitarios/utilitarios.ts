import fs from 'fs/promises'
import { Resumo } from '../modelos/Resumo'

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
    if(descricao){
        return descricao
    }

    return "gerado automaticamente"
}

export function editarDado() {
    
}
