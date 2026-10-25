import type {
  Chamado,
  StatusChamado,
  CriarChamadoDTO,
  AtualizarStatusChamadoDTO,
} from "../tipos/chamado.js";
import { buscarEstudantePorMatricula } from "./estudanteS.js";

const bancoChamados: Chamado[] = [];
let contadorId = 1;


const STATUS_VALIDOS: readonly StatusChamado[] = [
  "ABERTO",
  "EM_ATENDIMENTO",
  "FINALIZADO",
];


export function éStatusValido(status: string): status is StatusChamado {
  return STATUS_VALIDOS.includes(status as StatusChamado);
}


export function abrirChamado(dados: CriarChamadoDTO): Chamado | null {
  const estudante = buscarEstudantePorMatricula(dados.matriculaEstudante);
  if (estudante === null) {
    return null;
  }

  const novoChamado: Chamado = {
    id: `CHM-${String(contadorId++).padStart(4, "0")}`,
    matriculaEstudante: dados.matriculaEstudante,
    categoria: dados.categoria,
    titulo: dados.titulo,
    descricao: dados.descricao,
    status: "ABERTO",
    dataAbertura: new Date(),
  };

  bancoChamados.push(novoChamado);
  return novoChamado;
}


export function atualizarStatusChamado(
  dto: AtualizarStatusChamadoDTO
): Chamado | null {
  const chamado = buscarChamadoPorId(dto.chamadoId);
  if (chamado === null) {
    return null;
  }

  chamado.status = dto.novoStatus;
  chamado.dataAtualizacao = new Date();

  if (dto.resolucao !== undefined) {
    chamado.resolucao = dto.resolucao;
  }

  return chamado;
}


export function buscarChamadoPorId(id: string): Chamado | null {
  const encontrado = bancoChamados.find((c) => c.id === id);
  return encontrado ?? null;
}


export function listarChamados(
  filtro?: { status?: StatusChamado; matriculaEstudante?: string }
): readonly Chamado[] {
  if (!filtro) {
    return [...bancoChamados];
  }

  return bancoChamados.filter((c) => {
    if (filtro.status !== undefined && c.status !== filtro.status) {
      return false;
    }
    if (
      filtro.matriculaEstudante !== undefined &&
      c.matriculaEstudante !== filtro.matriculaEstudante
    ) {
      return false;
    }
    return true;
  });
}

export function atualizarStatusComValidacao(
  chamadoId: string,
  novoStatusBruto: string,
  resolucao?: string
): { sucesso: boolean; mensagem: string; chamado: Chamado | null } {
  if (!éStatusValido(novoStatusBruto)) {
    return {
      sucesso: false,
      mensagem: `Status inválido: '${novoStatusBruto}'. Os status permitidos são: ${STATUS_VALIDOS.join(", ")}.`,
      chamado: null,
    };
  }

  const chamadoAtualizado = atualizarStatusChamado({
    chamadoId,
    novoStatus: novoStatusBruto,
    ...(resolucao !== undefined ? { resolucao } : {}),
  });

  if (chamadoAtualizado === null) {
    return {
      sucesso: false,
      mensagem: `Chamado com ID '${chamadoId}' não foi localizado no sistema.`,
      chamado: null,
    };
  }

  return {
    sucesso: true,
    mensagem: `Status do chamado ${chamadoId} atualizado para ${novoStatusBruto} com sucesso.`,
    chamado: chamadoAtualizado,
  };
}

export function resetarBancoChamados(): void {
  bancoChamados.length = 0;
  contadorId = 1;
}
