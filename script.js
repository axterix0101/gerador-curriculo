
const form = document.getElementById("form-curriculo");
const botaoBaixar = document.getElementById("baixarPDF");

let dadosCurriculo = {};

form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    dadosCurriculo = {
        nome: formData.get("nome"),
        email: formData.get("email"),
        telefone: formData.get("telefone"),
        formacao: formData.get("formacao"),
        experiencias: formData.get("experiencias"),
    };
    document.getElementById("pix-info").style.display = "block";
});

function liberarDownload() {
    document.getElementById("baixarPDF").style.display = "inline";
}

botaoBaixar.addEventListener("click", function () {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text(`Currículo de ${dadosCurriculo.nome}`, 10, 10);
    doc.text(`E-mail: ${dadosCurriculo.email}`, 10, 20);
    doc.text(`Telefone: ${dadosCurriculo.telefone}`, 10, 30);
    doc.text(`Formação: ${dadosCurriculo.formacao}`, 10, 40);
    doc.text(`Experiências: ${dadosCurriculo.experiencias}`, 10, 60);

    doc.save("curriculo.pdf");
});
