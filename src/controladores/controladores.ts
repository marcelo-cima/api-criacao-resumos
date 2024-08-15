import TResumo from "../tipos/TResumo"

class Resumo{
    id?: number
    usuarioId: number
    materiaId: number
    titulo: string
    topicos: string | string[]
    descricao: string
    criado?: string

    constructor(resumo: TResumo){
        this.id = resumo.id
        this.usuarioId = resumo.usuarioId
        this.materiaId = resumo.materiaId
        this.titulo = resumo.titulo
        this.topicos = resumo.topicos
        this.descricao = resumo.descricao
        this.criado = resumo.criado
    }
}

const novoResumo = new Resumo({
    usuarioId: 2,
    materiaId: 3,
    titulo: 'oi',
    topicos: 'ola',
    descricao: 'string',
})

console.log(novoResumo)