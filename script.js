document.getElementById('form-curriculo').addEventListener('submit', function (e) {
  e.preventDefault();
  document.getElementById('pix-info').classList.remove('hidden');
});

document.getElementById('btn-pix').addEventListener('click', () => {
  window.open('https://livepix.gg/axt0011', '_blank');
  document.getElementById('confirmacao').classList.remove('hidden');
});

document.getElementById('btn-pago').addEventListener('click', () => {
  document.getElementById('baixarPDF').classList.remove('hidden');
});

document.getElementById('baixarPDF').addEventListener('click', () => {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const nome = document.querySelector('input[name="nome"]').value;
  const email = document.querySelector('input[name="email"]').value;
  const telefone = document.querySelector('input[name="telefone"]').value;
  const formacao = document.querySelector('textarea[name="formacao"]').value;
  const experiencias = document.querySelector('textarea[name="experiencias"]').value;

  doc.text(`Nome: ${nome}`, 10, 10);
  doc.text(`Email: ${email}`, 10, 20);
  doc.text(`Telefone: ${telefone}`, 10, 30);
  doc.text(`Formação:`, 10, 40);
  doc.text(formacao, 10, 50);
  doc.text(`Experiências:`, 10, 90);
  doc.text(experiencias, 10, 100);

  doc.save('curriculo.pdf'); // <- você pode adicionar isso para baixar o PDF automaticamente
});
