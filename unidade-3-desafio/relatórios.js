const alunos = [];
let proximoId = 1;

export function normalizarTexto(texto) {
  return typeof texto === 'string' ? texto.trim() : '';
}

export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function cadastrarAluno({ matricula, nome, email, curso, notas = [] }) {
  const matNorm = normalizarTexto(matricula);
  const nomeNorm = normalizarTexto(nome);
  const emailNorm = normalizarTexto(email).toLowerCase();
  const cursoNorm = normalizarTexto(curso);

  if (!matNorm) {
    throw new Error("A matrícula é obrigatória.");
  }
  if (alunos.some(a => a.matricula === matNorm)) {
    throw new Error(`Matrícula duplicada: ${matNorm}`);
  }
  if (nomeNorm.length < 3) {
    throw new Error(`Nome inválido ('${nomeNorm}'): deve possuir no mínimo 3 caracteres.`);
  }
  if (!validarEmail(emailNorm)) {
    throw new Error(`E-mail inválido: '${emailNorm}'.`);
  }
  if (!Array.isArray(notas) || !notas.every(n => typeof n === 'number' && n >= 0 && n <= 10)) {
    throw new Error("Notas inválidas: todas as notas devem ser números entre 0 e 10.");
  }

  const novoAluno = {
    id: proximoId++,
    matricula: matNorm,
    nome: nomeNorm,
    email: emailNorm,
    curso: cursoNorm,
    notas: [...notas]
  };

  alunos.push(novoAluno);
  return { ...novoAluno };
}

export function calcularMediaESituacao(aluno, minMedia = 6) {
  if (!aluno) return null;

  const notas = aluno.notas || [];
  const soma = notas.reduce((acc, n) => acc + n, 0);
  const media = notas.length > 0 ? Number((soma / notas.length).toFixed(2)) : 0;
  const situacao = media >= minMedia ? 'APROVADO' : 'REPROVADO';

  return {
    ...aluno,
    media,
    situacao
  };
}

export function buscarAlunoPorMatricula(matricula) {
  const matNorm = normalizarTexto(matricula);
  return alunos.find(a => a.matricula === matNorm) || null;
}

export function removerAlunoPorMatricula(matricula) {
  const matNorm = normalizarTexto(matricula);
  const index = alunos.findIndex(a => a.matricula === matNorm);
  if (index === -1) {
    return false;
  }
  alunos.splice(index, 1);
  return true;
}

export function obterAlunos() {
  return [...alunos];
}