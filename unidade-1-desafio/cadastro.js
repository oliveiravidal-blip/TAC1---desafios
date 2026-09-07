
var quantidade = prompt("Quantos alunos serão cadastrados?");
quantidade = Number(quantidade);

var totalAprovados = 0;
var totalRecuperacao = 0;
var totalReprovados = 0;

for (var i = 0; i < quantidade; i++) {
  var nome = prompt("Digite o nome do aluno " + (i + 1) + ":");
  var matricula = prompt("Digite a matrícula do aluno " + (i + 1) + ":");


  var n1 = Number(prompt("Digite a 1ª nota de " + nome + ":"));
  var n2 = Number(prompt("Digite a 2ª nota de " + nome + ":"));
  var n3 = Number(prompt("Digite a 3ª nota de " + nome + ":"));

  var freq = Number(prompt("Digite a frequência de " + nome + ":"));


  var media = (n1 + n2 + n3) / 3;


  var situacao = "";

  if (media >= 70 && freq >= 75) {
    situacao = "Aprovado";
    totalAprovados = totalAprovados + 1; 
  } 
  else if (media >= 40 && freq >= 75) {
    situacao = "Recuperação";
    totalRecuperacao = totalRecuperacao + 1;
  } 
  else {
    situacao = "Reprovado";
    totalReprovados = totalReprovados + 1;
  }

 
  console.log("Aluno: " + nome + " | Média: " + media + " | Situação: " + situacao);
}


console.log("=== RESUMO ===");
console.log("Total de Aprovados: " + totalAprovados);
console.log("Total em Recuperação: " + totalRecuperacao);
console.log("Total de Reprovados: " + totalReprovados);