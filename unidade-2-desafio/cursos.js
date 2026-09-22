const cursos = [];

function inserirCurso(codigo, nome, cargaHoraria, ativo) {
  const novoCurso = {
    codigo: codigo,
    nome: nome,
    cargaHoraria: cargaHoraria,
    ativo: ativo
  };

  cursos.push(novoCurso);
}

function listarCursos() {
  console.log("--- LISTA DE CURSOS ---");
  
  for (let i = 0; i < cursos.length; i++) {
    const curso = cursos[i];
    console.log(curso.codigo + " - " + curso.nome + " (" + curso.cargaHoraria + "h)");
  }
}

function filtrarCursosAtivos() {
  const cursosAtivos = [];

  for (let i = 0; i < cursos.length; i++) {
    if (cursos[i].ativo === true) {
      cursosAtivos.push(cursos[i]);
    }
  }

  return cursosAtivos;
}

function calcularMediaCargaHoraria(listaDeCursosAtivos) {
  if (listaDeCursosAtivos.length === 0) {
    return 0;
  }

  let somaTotal = 0;

  for (let i = 0; i < listaDeCursosAtivos.length; i++) {
    somaTotal += listaDeCursosAtivos[i].cargaHoraria;
  }

  return somaTotal / listaDeCursosAtivos.length;
}

inserirCurso(101, "Lógica de Programação", 40, true);
inserirCurso(102, "JavaScript Básico", 60, true);
inserirCurso(103, "HTML e CSS", 30, false);

listarCursos();

const ativos = filtrarCursosAtivos();
console.log("Cursos Ativos:", ativos);

const media = calcularMediaCargaHoraria(ativos);
console.log("Média da carga horária dos ativos:", media + "h");