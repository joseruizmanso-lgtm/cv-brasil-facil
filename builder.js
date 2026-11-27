document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Lógica de los pasos del formulario ---
  let currentStep = 1;
  const totalSteps = 4;
  const prevBtn = document.getElementById('prev-step');
  const nextBtn = document.getElementById('next-step');
  const stepTitle = document.getElementById('step-title');
  const progressPercent = document.getElementById('progress-percent');
  const progressFill = document.getElementById('progress-fill');

  function updateSteps() {
    // Ocultar todos los pasos y mostrar el actual
    document.querySelectorAll('.form-step').forEach(step => {
      step.classList.remove('active');
      if (parseInt(step.getAttribute('data-step')) === currentStep) {
        step.classList.add('active');
      }
    });

    // Actualizar textos y barra
    const titles = ["Información personal", "Formación académica", "Experiencia profesional", "Idiomas, habilidades y carta"];
    stepTitle.innerText = `Paso ${currentStep} de ${totalSteps} · ${titles[currentStep - 1]}`;
    
    const percent = (currentStep / totalSteps) * 100;
    progressPercent.innerText = `${percent}%`;
    progressFill.style.width = `${percent}%`;

    // Habilitar/Deshabilitar botones
    prevBtn.disabled = currentStep === 1;
    if (currentStep === totalSteps) {
      nextBtn.innerText = "Finalizar ✓";
      nextBtn.style.backgroundColor = "#2dd4bf"; // Color verde
    } else {
      nextBtn.innerText = "Continuar →";
      nextBtn.style.backgroundColor = ""; // Color original
    }
  }

  nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
      currentStep++;
      updateSteps();
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
      currentStep--;
      updateSteps();
    }
  });

  // --- 2. Lógica para actualizar la vista previa en tiempo real ---
  const inputs = document.querySelectorAll('#cv-form input, #cv-form textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      const fieldId = input.id;
      const value = input.value;

      // Mapeo de campos a elementos de la vista previa
      switch (fieldId) {
        case 'fullName':
          document.getElementById('preview-name').innerText = value || 'Tu nombre';
          document.getElementById('letter-signature-name').innerText = value || 'Su nombre';
          break;
        case 'headline':
          document.getElementById('preview-headline').innerText = value || 'Cargo objetivo';
          break;
        case 'email':
          document.getElementById('preview-email').innerText = value || 'email@exemplo.com';
          break;
        case 'phone':
          document.getElementById('preview-phone').innerText = value || '+55 00 00000-0000';
          break;
        case 'city':
          document.getElementById('preview-city').innerText = value || 'Ciudad, estado';
          break;
        case 'summary':
          const summaryEl = document.getElementById('preview-summary');
          summaryEl.innerText = value || 'Su resumen profesional aparecerá aquí.';
          summaryEl.classList.toggle('doc-empty', !value);
          break;
        case 'jobTitle':
          document.getElementById('preview-job-title').innerText = value || 'Cargo';
          break;
        case 'company':
          document.getElementById('preview-company').innerText = value || 'Empresa';
          break;
        case 'jobDescription':
          document.getElementById('preview-job-description').innerText = value || 'Descripción de responsabilidades y resultados.';
          break;
        case 'degree':
          document.getElementById('preview-degree').innerText = value || 'Curso';
          break;
        case 'institution':
          document.getElementById('preview-institution').innerText = value || 'Institución';
          break;
        case 'skills':
          document.getElementById('preview-skills').innerText = value || 'Habilidades';
          break;
        case 'letter':
          document.getElementById('letter-body').innerText = value || 'Escriba aquí su carta de presentación breve y objetiva.';
          break;
      }
    });
  });

  // --- 3. Lógica de las pestañas (Currículum / Carta) ---
  const tabs = document.querySelectorAll('.preview-tab');
  const cvContent = document.getElementById('cv-content');
  const letterContent = document.getElementById('letter-content');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (tab.getAttribute('data-document') === 'cv') {
        cvContent.hidden = false;
        letterContent.hidden = true;
      } else {
        cvContent.hidden = true;
        letterContent.hidden = false;
      }
    });
  });

  // --- 4. Lógica para Descargar PDF ---
  const docElement = document.getElementById('document');
  const downloadWatermarkBtn = document.getElementById('download-watermark');
  const downloadCleanBtn = document.getElementById('download-clean');
  const checkoutModal = document.getElementById('checkout-modal');
  const closeModalBtn = document.getElementById('close-modal');
  const continuePixBtn = document.getElementById('continue-pix');

// Opciones de configuración del PDF (MEJORADAS PARA MÓVILES)
const pdfOptions = {
  margin: 0.5,
  filename: 'CV_Brasil_Facil.pdf',
  image: { type: 'jpeg', quality: 0.98 },
  html2canvas: { 
    scale: 2, 
    useCORS: true,
    scrollY: 0, // Evita que el PDF salga vacío si bajaste en la página
    windowWidth: 800 // Fuerza un ancho fijo para que no se rompa en el celular
  },
  jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
};

// Descargar con marca de agua
downloadWatermarkBtn.addEventListener('click', () => {
  // Un pequeño retraso para asegurar que todo esté cargado
  setTimeout(() => {
    html2pdf().set(pdfOptions).from(docElement).save();
  }, 100);
});

// Abrir modal para versión limpia
downloadCleanBtn.addEventListener('click', () => {
  checkoutModal.showModal();
});

// Cerrar modal
closeModalBtn.addEventListener('click', () => {
  checkoutModal.close();
});

// Simular pago y descargar limpio
continuePixBtn.addEventListener('click', () => {
  docElement.classList.remove('watermarked');
  
  setTimeout(() => {
    html2pdf().set(pdfOptions).from(docElement).save().then(() => {
      docElement.classList.add('watermarked');
      checkoutModal.close();
    });
  }, 100);
});