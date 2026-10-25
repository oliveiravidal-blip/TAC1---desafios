export type StatusChamado = "ABERTO" | "EM_ATENDIMENTO" | "FINALIZADO";

export type CategoriaChamado = "ACADEMICO" | "MATRICULA" | "FINANCEIRO" | "TI";

export interface Chamado {
  readonly id: string;
  readonly matriculaEstudante: string;
  readonly categoria: CategoriaChamado;
  titulo: string;
  descricao: string;
  status: StatusChamado;
  readonly dataAbertura: Date;
  dataAtualizacao?: Date;
  resolucao?: string;
}

export interface CriarChamadoDTO {
  readonly matriculaEstudante: string;
  readonly categoria: CategoriaChamado;
  readonly titulo: string;
  readonly descricao: string;
}

export interface AtualizarStatusChamadoDTO {
  readonly chamadoId: string;
  readonly novoStatus: StatusChamado;
  readonly resolucao?: string;
}
