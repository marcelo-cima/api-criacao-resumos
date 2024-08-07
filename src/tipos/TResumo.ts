type TResumo = {
  id?: number;
  usuarioId: number;
  materiaId: number;
  titulo: string;
  topicos: string | string[];
  descricao: string;
  criado?: string;
};

export default TResumo;
