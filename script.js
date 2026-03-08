const form = document.getElementById("form-curriculo");
const acoesPagamento = document.getElementById("acoes-pagamento");
const btnLiberar = document.getElementById("btn-liberar");
const btnBaixar = document.getElementById("baixarPDF");
const curriculoPreview = document.getElementById("curriculo-preview");

function transformarEmLista(texto) {
  return texto
    .split(",")
    .map(item => item.trim())
    .filter(item => item !== "");
}

function preencherLista(idLista, itens) {
  const lista = document.getElementById(idLista);
  lista.innerHTML = "";

  if (itens.length === 0) {
    const li = document.createElement("li");
    li.textContent = "Não informado.";
    lista.appendChild(li);
    return;
  }

  itens.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    lista.appendChild(li);
  });
}

function atualizarPreview() {
  const nome = document.getElementById("nome").value.trim() || "Seu Nome";
  const email = document.getElementById("email").value.trim() || "seuemail@email.com";
  const telefone = document.getElementById("telefone").value.trim() || "(00) 00000-0000";
  const cidade = document.getElementById("cidade").value.trim() || "Sua cidade";
  const objetivo = document.getElementById("objetivo").value.trim() || "Seu objetivo aparecerá aqui.";
  const resumo = document.getElementById("resumo").value.trim() || "Seu resumo aparecerá aqui.";

  document.getElementById("preview-nome").textContent = nome;
  document.getElementById("preview-contato").textContent = `${email} • ${telefone} • ${cidade}`;
  document.getElementById("preview-objetivo").textContent = objetivo;
  document.getElementById("preview-resumo").innerHTML = resumo.replace(/\n/g, "<br>");

  preencherLista("preview-experiencias", transformarEmLista(document.getElementById("experiencias").value));
  preencherLista("preview-formacao", transformarEmLista(document.getElementById("formacao").value));
  preencherLista("preview-cursos", transformarEmLista(document.getElementById("cursos").value));
  preencherLista("preview-habilidades", transformarEmLista(document.getElementById("habilidades").value));
}

document.querySelectorAll("input, textarea").forEach(campo => {
  campo.addEventListener("input", atualizarPreview);
});

form.addEventListener("submit", function(e) {
  e.preventDefault();
  atualizarPreview();
  acoesPagamento.classList.remove("hidden");
  acoesPagamento.scrollIntoView({ behavior: "smooth" });
});

btnLiberar.addEventListener("click", function() {
  btnBaixar.classList.remove("hidden");
});

btnBaixar.addEventListener("click", function() {
  const marcaDagua = curriculoPreview.querySelector(".marca-dagua");

  if (marcaDagua) {
    marcaDagua.style.display = "none";
  }

  const opcoes = {
    margin: 0.5,
    filename: "curriculo.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "cm", format: "a4", orientation: "portrait" }
  };

  html2pdf().from(curriculoPreview).set(opcoes).save().then(() => {
    if (marcaDagua) {
      marcaDagua.style.display = "block";
    }
  });
});

atualizarPreview();
