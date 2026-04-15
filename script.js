// ── ELEMENTOS ──
const form = document.getElementById("form-curriculo");
const acoesPagamento = document.getElementById("acoes-pagamento");
const btnLiberar = document.getElementById("btn-liberar");
const btnBaixar = document.getElementById("baixarPDF");
const btnLimpar = document.getElementById("btn-limpar");
const curriculoPreview = document.getElementById("curriculo-preview");
const progressFill = document.getElementById("progress-fill");
const progressPercent = document.getElementById("progress-percent");

// ── CAMPOS OBRIGATÓRIOS ──
const CAMPOS_OBRIGATORIOS = ["nome", "email", "telefone", "resumo", "experiencias", "formacao", "habilidades"];
const MENSAGENS_ERRO = {
  nome: "Por favor, informe seu nome completo.",
  email: "Informe um e-mail válido.",
  telefone: "Informe um telefone válido.",
  resumo: "Adicione um breve resumo profissional.",
  experiencias: "Informe pelo menos uma experiência.",
  formacao: "Informe sua formação acadêmica.",
  habilidades: "Informe pelo menos uma habilidade.",
};

// ── MÁSCARA TELEFONE ──
const campoTelefone = document.getElementById("telefone");
campoTelefone.addEventListener("input", function () {
  let v = this.value.replace(/\D/g, "").substring(0, 11);
  if (v.length > 6) {
    v = `(${v.substring(0,2)}) ${v.substring(2,7)}-${v.substring(7)}`;
  } else if (v.length > 2) {
    v = `(${v.substring(0,2)}) ${v.substring(2)}`;
  } else if (v.length > 0) {
    v = `(${v}`;
  }
  this.value = v;
});

// ── CONTADORES DE CARACTERES ──
function setupContador(campoId, contadorId, max) {
  const campo = document.getElementById(campoId);
  const contador = document.getElementById(contadorId);
  if (!campo || !contador) return;
  campo.addEventListener("input", () => {
    const len = campo.value.length;
    contador.textContent = `${len}/${max}`;
    contador.classList.toggle("quase", len > max * 0.8 && len < max);
    contador.classList.toggle("cheio", len >= max);
  });
}
setupContador("objetivo", "contador-objetivo", 300);
setupContador("resumo", "contador-resumo", 500);

// ── BARRA DE PROGRESSO ──
const TODOS_CAMPOS = ["nome","email","telefone","cidade","linkedin","objetivo","resumo","experiencias","formacao","cursos","habilidades","idiomas","referencias"];

function atualizarProgresso() {
  const total = TODOS_CAMPOS.length;
  let preenchidos = 0;
  TODOS_CAMPOS.forEach(id => {
    const el = document.getElementById(id);
    if (el && el.value.trim() !== "") preenchidos++;
  });
  const pct = Math.round((preenchidos / total) * 100);
  progressFill.style.width = pct + "%";
  progressPercent.textContent = pct + "%";
}

// ── VALIDAÇÃO ──
function validarCampo(id) {
  const campo = document.getElementById(id);
  const erroEl = document.getElementById(`erro-${id}`);
  if (!campo) return true;

  let valido = true;
  const val = campo.value.trim();

  if (id === "email") {
    valido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  } else {
    valido = val !== "";
  }

  campo.classList.toggle("invalido", !valido);
  campo.classList.toggle("valido", valido);
  if (erroEl) erroEl.textContent = valido ? "" : MENSAGENS_ERRO[id] || "Campo obrigatório.";
  return valido;
}

function validarFormulario() {
  let tudoValido = true;
  CAMPOS_OBRIGATORIOS.forEach(id => {
    if (!validarCampo(id)) tudoValido = false;
  });
  return tudoValido;
}

// ── FOTO DE PERFIL ──
const fotoInput = document.getElementById("foto-input");
const fotoPreview = document.getElementById("foto-preview");
const btnRemoverFoto = document.getElementById("btn-remover-foto");
const cvFotoContainer = document.getElementById("cv-foto-container");
const cvFoto = document.getElementById("cv-foto");
let fotoDataUrl = null;

fotoInput.addEventListener("change", function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    fotoDataUrl = e.target.result;
    fotoPreview.innerHTML = `<img src="${fotoDataUrl}" alt="Foto">`;
    cvFoto.src = fotoDataUrl;
    cvFotoContainer.style.display = "block";
    btnRemoverFoto.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

btnRemoverFoto.addEventListener("click", function () {
  fotoDataUrl = null;
  fotoInput.value = "";
  fotoPreview.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
  cvFotoContainer.style.display = "none";
  btnRemoverFoto.classList.add("hidden");
});

// ── HELPERS ──
function transformarEmLista(texto) {
  return texto.split(",").map(i => i.trim()).filter(i => i !== "");
}

function preencherLista(idLista, itens, pillStyle = false) {
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

function mostrarBloco(idBloco, mostrar) {
  const bloco = document.getElementById(idBloco);
  if (bloco) bloco.style.display = mostrar ? "" : "none";
}

// ── ATUALIZAR PREVIEW ──
function atualizarPreview() {
  const nome = document.getElementById("nome").value.trim() || "Seu Nome";
  const email = document.getElementById("email").value.trim() || "seuemail@email.com";
  const telefone = document.getElementById("telefone").value.trim() || "(00) 00000-0000";
  const cidade = document.getElementById("cidade").value.trim() || "Sua cidade";
  const linkedin = document.getElementById("linkedin").value.trim();
  const objetivo = document.getElementById("objetivo").value.trim();
  const resumo = document.getElementById("resumo").value.trim() || "Seu resumo aparecerá aqui.";

  document.getElementById("preview-nome").textContent = nome;
  document.getElementById("preview-contato").textContent = `${email} • ${telefone} • ${cidade}`;
  document.getElementById("preview-resumo").innerHTML = resumo.replace(/\n/g, "<br>");

  // LinkedIn
  const linkedinEl = document.getElementById("preview-linkedin");
  if (linkedin) {
    linkedinEl.textContent = "🔗 " + linkedin;
    linkedinEl.classList.remove("hidden");
  } else {
    linkedinEl.classList.add("hidden");
  }

  // Objetivo
  if (objetivo) {
    document.getElementById("preview-objetivo").textContent = objetivo;
    mostrarBloco("bloco-objetivo", true);
  } else {
    mostrarBloco("bloco-objetivo", false);
  }

  // Listas
  preencherLista("preview-experiencias", transformarEmLista(document.getElementById("experiencias").value));
  preencherLista("preview-formacao", transformarEmLista(document.getElementById("formacao").value));

  const cursos = transformarEmLista(document.getElementById("cursos").value);
  preencherLista("preview-cursos", cursos);
  mostrarBloco("bloco-cursos", cursos.length > 0);

  preencherLista("preview-habilidades", transformarEmLista(document.getElementById("habilidades").value), true);

  const idiomas = transformarEmLista(document.getElementById("idiomas").value);
  preencherLista("preview-idiomas", idiomas);
  mostrarBloco("bloco-idiomas", idiomas.length > 0);

  const referencias = transformarEmLista(document.getElementById("referencias").value);
  preencherLista("preview-referencias", referencias);
  mostrarBloco("bloco-referencias", referencias.length > 0);

  atualizarProgresso();
}

// ── SALVAR RASCUNHO ──
const CAMPOS_SALVAR = ["nome","email","telefone","cidade","linkedin","objetivo","resumo","experiencias","formacao","cursos","habilidades","idiomas","referencias"];

function salvarRascunho() {
  const dados = {};
  CAMPOS_SALVAR.forEach(id => {
    const el = document.getElementById(id);
    if (el) dados[id] = el.value;
  });
  try { localStorage.setItem("curriculo_rascunho", JSON.stringify(dados)); } catch(e) {}
}

function carregarRascunho() {
  try {
    const salvo = localStorage.getItem("curriculo_rascunho");
    if (!salvo) return;
    const dados = JSON.parse(salvo);
    CAMPOS_SALVAR.forEach(id => {
      const el = document.getElementById(id);
      if (el && dados[id]) el.value = dados[id];
    });
    atualizarPreview();
    // Atualizar contadores manualmente
    ["objetivo","resumo"].forEach(id => {
      const el = document.getElementById(id);
      const max = id === "objetivo" ? 300 : 500;
      const contador = document.getElementById(`contador-${id}`);
      if (el && contador) contador.textContent = `${el.value.length}/${max}`;
    });
  } catch(e) {}
}

// ── LIMPAR TUDO ──
btnLimpar.addEventListener("click", function () {
  if (!confirm("Tem certeza que quer limpar todos os dados?")) return;
  CAMPOS_SALVAR.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = "";
  });
  // Limpar foto
  fotoDataUrl = null;
  fotoInput.value = "";
  fotoPreview.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>`;
  cvFotoContainer.style.display = "none";
  btnRemoverFoto.classList.add("hidden");
  // Limpar validações
  CAMPOS_OBRIGATORIOS.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove("invalido","valido"); }
    const erroEl = document.getElementById(`erro-${id}`);
    if (erroEl) erroEl.textContent = "";
  });
  try { localStorage.removeItem("curriculo_rascunho"); } catch(e) {}
  acoesPagamento.classList.add("hidden");
  atualizarPreview();
});

// ── SUBMIT ──
form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validarFormulario()) {
    const primeiroErro = form.querySelector(".invalido");
    if (primeiroErro) primeiroErro.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  atualizarPreview();
  acoesPagamento.classList.remove("hidden");
  acoesPagamento.scrollIntoView({ behavior: "smooth" });
});

// ── LIBERAR PDF ──
btnLiberar.addEventListener("click", function () {
  btnBaixar.classList.remove("hidden");
  btnBaixar.scrollIntoView({ behavior: "smooth" });
});

// ── BAIXAR PDF ──
btnBaixar.addEventListener("click", function () {
  const marcaDagua = curriculoPreview.querySelector(".marca-dagua");
  if (marcaDagua) marcaDagua.style.display = "none";

  const opcoes = {
    margin: 0.5,
    filename: "curriculo.pdf",
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: "cm", format: "a4", orientation: "portrait" }
  };

  html2pdf().from(curriculoPreview).set(opcoes).save().then(() => {
    if (marcaDagua) marcaDagua.style.display = "block";
  });
});

// ── LISTENERS GERAIS ──
document.querySelectorAll("input, textarea").forEach(campo => {
  campo.addEventListener("input", () => {
    atualizarPreview();
    salvarRascunho();
    if (CAMPOS_OBRIGATORIOS.includes(campo.id) && campo.value.trim() !== "") {
      validarCampo(campo.id);
    }
  });
  campo.addEventListener("blur", () => {
    if (CAMPOS_OBRIGATORIOS.includes(campo.id)) validarCampo(campo.id);
  });
});

// ── INIT ──
carregarRascunho();
atualizarPreview();
