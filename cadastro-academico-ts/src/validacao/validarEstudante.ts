export type DadosEstudanteEntrada = {
  matricula?: unknown;
  nome?: unknown;
  curso?: unknown;
  email?: unknown;
};

export interface DadosEstudanteValidados {
  readonly matricula: string;
  readonly nome: string;
  readonly curso: string;
  readonly email?: string;
}

export interface ResultadoValidacao {
  readonly valido: boolean;
  readonly erros: readonly string[];
  readonly dadosValidados: DadosEstudanteValidados | null;
}

function extrairStringValida(valor: unknown): string | null {
  if (typeof valor === "string") {
    const textoLimpo = valor.trim();
    return textoLimpo.length > 0 ? textoLimpo : null;
  }
  return null;
}

export function validarEstudante(entrada: unknown): ResultadoValidacao {
  const erros: string[] = [];

  if (typeof entrada !== "object" || entrada === null) {

    return {
      valido: false,
      erros: ["A entrada fornecida deve ser um objeto JSON válido."],
      dadosValidados: null,
    };
  }

  const dados = entrada as DadosEstudanteEntrada;

  const matriculaTexto = extrairStringValida(dados.matricula);
  let matriculaValida: string | null = null;

  if (matriculaTexto === null) {
    erros.push("A matrícula é obrigatória e deve ser um texto não vazio.");
  } else {
    const regexMatricula = /^\d{8,14}$/;
    if (!regexMatricula.test(matriculaTexto)) {
      erros.push(
        `Matrícula '${matriculaTexto}' é inválida. Deve conter entre 8 e 14 dígitos numéricos.`
      );
    } else {
      matriculaValida = matriculaTexto;
    }
  }

  const nomeTexto = extrairStringValida(dados.nome);
  let nomeValido: string | null = null;

  if (nomeTexto === null) {
    erros.push("O nome é obrigatório e deve ser um texto não vazio.");
  } else if (nomeTexto.length < 3) {
    erros.push("O nome do estudante deve conter pelo menos 3 caracteres.");
  } else {
    nomeValido = nomeTexto;
  }

  const cursoTexto = extrairStringValida(dados.curso);
  let cursoValido: string | null = null;

  if (cursoTexto === null) {
    erros.push("O curso é obrigatório e deve ser um texto não vazio.");
  } else {
    cursoValido = cursoTexto;
  }

  let emailValido: string | undefined = undefined;
  if (dados.email !== undefined && dados.email !== null) {
    const emailTexto = extrairStringValida(dados.email);
    if (emailTexto === null || !emailTexto.includes("@")) {
      erros.push("O e-mail fornecido possui formato inválido.");
    } else {
      emailValido = emailTexto;
    }
  }

  if (erros.length > 0 || !matriculaValida || !nomeValido || !cursoValido) {
    return {
      valido: false,
      erros,
      dadosValidados: null,
    };
  }

  return {
    valido: true,
    erros: [],
    dadosValidados: {
      matricula: matriculaValida,
      nome: nomeValido,
      curso: cursoValido,
      ...(emailValido !== undefined ? { email: emailValido } : {}),
    },
  };
}
