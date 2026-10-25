import {
  cadastrarEstudante,
  buscarEstudantePorMatricula,
  registrarNota,
  calcularMediaEstudante,
  obterDesempenhoEstudante,
} from "./servicos/estudanteS.js";

import {
  abrirChamado,
  atualizarStatusChamado,
  atualizarStatusComValidacao,
  listarChamados,
} from "./servicos/chamadoS.js";

import {
  criarTurma,
  matricularEstudanteEmTurma,
  gerarRelatorioTurma,
} from "./servicos/turmaS.js";

import { validarEstudante } from "./validacao/validarEstudante.js";

function cabecalho(titulo: string): void {
  console.log("\n" + "=".repeat(70));
  console.log(`  ${titulo}`);
  console.log("=".repeat(70));
}

function executarDemonstracao(): void {
  cabecalho("IFRN - CADASTRO ACADÊMICO (MIGRAÇÃO TYPESCRIPT STRICT)");

  cabecalho("1. Validação de Entrada Externa (Estreitamento de tipo 'unknown')");

  const entradasBrutasExternas: unknown[] = [
    {
      matricula: "202310140001",
      nome: "Maria Alice Fernandes",
      curso: "TADS",
      email: "maria.alice@ifrn.edu.br",
    },
    {
      matricula: "202310140002",
      nome: "João Pedro Silva",
      curso: "Engenharia de Software",
    },
    {
      matricula: "MAT-INVALIDA",
      nome: "Ana",
      curso: "",
    },
    "string aleatoria em vez de objeto JSON",
  ];

  entradasBrutasExternas.forEach((entrada, index) => {
    console.log(`\n--- Processando Payload Bruto #${index + 1} ---`);
    const resultado = validarEstudante(entrada);

    if (resultado.valido && resultado.dadosValidados !== null) {
      console.log("✅ Entrada Validadas com Sucesso!");
      const d = resultado.dadosValidados;
      const novo = cadastrarEstudante(d.matricula, d.nome, d.curso, d.email);
      console.log(`   Estudante Cadastrado: ${novo.nome} (${novo.matricula}) - ${novo.curso}`);
    } else {
      console.log("❌ Rejeitado pela Validação de Tipos/Formato:");
      resultado.erros.forEach((err) => console.log(`   - ${err}`));
    }
  });

  cabecalho("2. Operações de Domínio & Verificação Estrita de Nulos (strictNullChecks)");

  const matMaria = "202310140001";
  
  registrarNota(matMaria, 8.5);
  registrarNota(matMaria, 9.0);
  registrarNota(matMaria, 7.5);

  const mediaMaria = calcularMediaEstudante(matMaria);
  if (mediaMaria !== null) {
    console.log(`\n📊 Média Calculada de Maria Alice: ${mediaMaria}`);
  }

  const desempenho = obterDesempenhoEstudante(matMaria);
  if (desempenho !== null) {
    console.log(`📋 Relatório de Desempenho:`, desempenho);
  }

  const matriculaInexistente = "999999999999";
  const estudanteNulo = buscarEstudantePorMatricula(matriculaInexistente);
  
  if (estudanteNulo === null) {
    console.log(`\n🔍 Busca por '${matriculaInexistente}': Retornou null com segurança tipada!`);
  }

  cabecalho("3. Gestão de Chamados e Tipos União Literal (StatusChamado)");

  const novoChamado = abrirChamado({
    matriculaEstudante: matMaria,
    categoria: "ACADEMICO",
    titulo: "Solicitação de Aproveitamento de Disciplina",
    descricao: "Deseja solicitar aproveitamento da disciplina de Programação Web.",
  });

  if (novoChamado !== null) {
    console.log(`\n🎫 Chamado Criado: ID ${novoChamado.id} | Status: ${novoChamado.status}`);

    atualizarStatusChamado({
      chamadoId: novoChamado.id,
      novoStatus: "EM_ATENDIMENTO",
      resolucao: "Em análise pela coordenação do curso de TADS.",
    });

    console.log(`🔄 Status atualizado para 'EM_ATENDIMENTO' com sucesso.`);
  }

  console.log("\n🧪 Testando atualização com valores de status externos:");
  
  const tentativaInv = atualizarStatusComValidacao(
    novoChamado?.id ?? "CHM-0001",
    "STATUS_INVENTADO_ERRADO"
  );
  console.log(`  Resultado para status inválido:`, tentativaInv.mensagem);

  const tentativaValida = atualizarStatusComValidacao(
    novoChamado?.id ?? "CHM-0001",
    "FINALIZADO",
    "Aproveitamento deferido no SUAP."
  );
  console.log(`  Resultado para status válido:`, tentativaValida.mensagem);

  console.log("\n📋 Chamados cadastrados no sistema:");
  console.log(listarChamados());

  cabecalho("4. Gestão de Turmas Acadêmicas");

  const turmaTads = criarTurma(
    "TURMA-2023-TADS",
    "TADS001",
    "Desenvolvimento Orientado a Objetos",
    "2023.2",
    "VESPERTINO",
    2
  );

  console.log(`\n🏫 Turma criada: ${turmaTads.nomeComponente} (Vagas: ${turmaTads.capacidadeMaxima})`);

  const mat1 = matricularEstudanteEmTurma(turmaTads.id, "202310140001");
  console.log(`  Matrícula 1: ${mat1.mensagem}`);

  const mat2 = matricularEstudanteEmTurma(turmaTads.id, "202310140002");
  console.log(`  Matrícula 2: ${mat2.mensagem}`);

  const matExcedente = matricularEstudanteEmTurma(turmaTads.id, "202310140001");
  console.log(`  Matrícula Duplicada/Excedente: ${matExcedente.mensagem}`);

  const relatorioTurma = gerarRelatorioTurma(turmaTads.id);
  console.log("\n📈 Relatório da Turma:", relatorioTurma);

  cabecalho("SISTEMA CONSOLIDADO COM SUCESSO - MODO ESTREITO E SEGURO");
}

executarDemonstracao();
