import type { Estudante, FiltroEstudante, DesempenhoEstudante } from "../tipos/estudante.js";

const bancoEstudantes: Estudante[] = [];

export function cadastrarEstudante(
  matricula: string,
  nome: string,
  curso: string,
  email?: string
): Estudante {
  const novoEstudante: Estudante = {
    matricula,
    nome,
    curso,
    ativo: true,
    notas: [],
    dataIngresso: new Date(),
    ...(email !== undefined ? { email } : {}),
  };

  bancoEstudantes.push(novoEstudante);
  return novoEstudante;
}


export function buscarEstudantePorMatricula(matricula: string): Estudante | null {
  const estudanteEncontrado = bancoEstudantes.find((e) => e.matricula === matricula);
  return estudanteEncontrado ?? null;
}

export function listarEstudantes(filtro?: FiltroEstudante): readonly Estudante[] {
  if (!filtro) {
    return [...bancoEstudantes];
  }

  return bancoEstudantes.filter((estudante) => {
    if (filtro.curso !== undefined && estudante.curso !== filtro.curso) {
      return false;
    }
    if (filtro.ativo !== undefined && estudante.ativo !== filtro.ativo) {
      return false;
    }
    if (
      filtro.nomeContem !== undefined &&
      !estudante.nome.toLowerCase().includes(filtro.nomeContem.toLowerCase())
    ) {
      return false;
    }
    return true;
  });
}

export function registrarNota(matricula: string, nota: number): Estudante | null {
  if (nota < 0 || nota > 10) {
    throw new RangeError(`Nota inválida: ${nota}. A nota deve estar entre 0 e 10.`);
  }

  const estudante = buscarEstudantePorMatricula(matricula);
  if (estudante === null) {
    return null;
  }

  // Cria um novo array de notas para manter o princípio de imutabilidade funcional
  estudante.notas = [...estudante.notas, nota];
  return estudante;
}

export function calcularMediaEstudante(matricula: string): number | null {
  const estudante = buscarEstudantePorMatricula(matricula);

  if (estudante === null || estudante.notas.length === 0) {
    return null;
  }

  const somaNotas = estudante.notas.reduce((acumulado, nota) => acumulado + nota, 0);
  const media = somaNotas / estudante.notas.length;

  return Number(media.toFixed(2));
}

export function obterDesempenhoEstudante(matricula: string): DesempenhoEstudante | null {
  const estudante = buscarEstudantePorMatricula(matricula);
  if (estudante === null) {
    return null;
  }

  const media = calcularMediaEstudante(matricula);
  const mediaFinal = media ?? 0;
  const aprovado = mediaFinal >= 6.0;

  return {
    matricula: estudante.matricula,
    nome: estudante.nome,
    media: mediaFinal,
    aprovado,
  };
}

export function resetarBancoEstudantes(): void {
  bancoEstudantes.length = 0;
}
