import TResumo from "../tipos/TResumo"

export class Resumo{
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