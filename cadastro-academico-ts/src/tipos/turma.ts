import type { Estudante } from "./estudante.js";

export type TurnoTurma = "MATUTINO" | "VESPERTINO" | "NOTURNO";

export interface Turma {
  readonly id: string;
  readonly codigoComponente: string;
  readonly nomeComponente: string;
  readonly periodoLetivo: string;
  readonly turno: TurnoTurma;
  readonly capacidadeMaxima: number;
  estudantes: Estudante[];
  ativa: boolean;
}

export interface RelatorioTurma {
  readonly turmaId: string;
  readonly codigoComponente: string;
  readonly totalInscritos: number;
  readonly vagasRestantes: number;
  readonly percentualOcupacao: number;
  readonly mediaGeralTurma: number | null;
}
