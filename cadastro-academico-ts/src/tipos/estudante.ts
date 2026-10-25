export interface Estudante {
  readonly matricula: string;
  nome: string;
  curso: string;
  ativo: boolean;
  email?: string;
  notas: readonly number[];
  readonly dataIngresso: Date;
}

export interface FiltroEstudante {
  curso?: string;
  ativo?: boolean;
  nomeContem?: string;
}

export interface DesempenhoEstudante {
  readonly matricula: string;
  readonly nome: string;
  readonly media: number;
  readonly aprovado: boolean;
}
