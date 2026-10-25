import type { Turma, TurnoTurma, RelatorioTurma } from "../tipos/turma.js";
import { buscarEstudantePorMatricula } from "./estudanteS.js";

const bancoTurmas: Turma[] = [];

export function criarTurma(
  id: string,
  codigoComponente: string,
  nomeComponente: string,
  periodoLetivo: string,
  turno: TurnoTurma,
  capacidadeMaxima: number
): Turma {
  const novaTurma: Turma = {
    id,
    codigoComponente,
    nomeComponente,
    periodoLetivo,
    turno,
    capacidadeMaxima,
    estudantes: [],
    ativa: true,
  };

  bancoTurmas.push(novaTurma);
  return novaTurma;
}

export function buscarTurmaPorId(id: string): Turma | null {
  const turma = bancoTurmas.find((t) => t.id === id);
  return turma ?? null;
}

export function matricularEstudanteEmTurma(
  turmaId: string,
  matriculaEstudante: string
): { sucesso: boolean; mensagem: string; turma: Turma | null } {
  const turma = buscarTurmaPorId(turmaId);
  if (turma === null) {
    return {
      sucesso: false,
      mensagem: `Turma com ID '${turmaId}' não encontrada.`,
      turma: null,
    };
  }

  if (!turma.ativa) {
    return {
      sucesso: false,
      mensagem: `A turma '${turma.codigoComponente}' está inativa para novas matrículas.`,
      turma,
    };
  }

  const estudante = buscarEstudantePorMatricula(matriculaEstudante);
  if (estudante === null) {
    return {
      sucesso: false,
      mensagem: `Estudante com matrícula '${matriculaEstudante}' não existe no cadastro.`,
      turma,
    };
  }

  if (!estudante.ativo) {
    return {
      sucesso: false,
      mensagem: `O estudante '${estudante.nome}' está inativo e não pode ser matriculado.`,
      turma,
    };
  }

  const jaMatriculado = turma.estudantes.some(
    (e) => e.matricula === matriculaEstudante
  );
  if (jaMatriculado) {
    return {
      sucesso: false,
      mensagem: `Estudante '${estudante.nome}' já está matriculado nesta turma.`,
      turma,
    };
  }

  if (turma.estudantes.length >= turma.capacidadeMaxima) {
    return {
      sucesso: false,
      mensagem: `Não há vagas disponíveis na turma '${turma.codigoComponente}'. Limite: ${turma.capacidadeMaxima}.`,
      turma,
    };
  }

  turma.estudantes.push(estudante);

  return {
    sucesso: true,
    mensagem: `Estudante '${estudante.nome}' matriculado com sucesso na turma ${turma.codigoComponente}.`,
    turma,
  };
}

export function gerarRelatorioTurma(turmaId: string): RelatorioTurma | null {
  const turma = buscarTurmaPorId(turmaId);
  if (turma === null) {
    return null;
  }

  const totalInscritos = turma.estudantes.length;
  const vagasRestantes = Math.max(0, turma.capacidadeMaxima - totalInscritos);
  const percentualOcupacao = Number(
    ((totalInscritos / turma.capacidadeMaxima) * 100).toFixed(1)
  );

  let mediaGeralTurma: number | null = null;
  if (totalInscritos > 0) {
    let somaMedias = 0;
    let estudantesComNotas = 0;

    for (const est of turma.estudantes) {
      if (est.notas.length > 0) {
        const somaNotas = est.notas.reduce((a, b) => a + b, 0);
        somaMedias += somaNotas / est.notas.length;
        estudantesComNotas++;
      }
    }

    if (estudantesComNotas > 0) {
      mediaGeralTurma = Number((somaMedias / estudantesComNotas).toFixed(2));
    }
  }

  return {
    turmaId: turma.id,
    codigoComponente: turma.codigoComponente,
    totalInscritos,
    vagasRestantes,
    percentualOcupacao,
    mediaGeralTurma,
  };
}

export function resetarBancoTurmas(): void {
  bancoTurmas.length = 0;
}
