let selectedElement = null;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.element').forEach(el => {
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData("type", e.target.dataset.type);
    });
  });

  document.getElementById('propertiesForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (!selectedElement) return;

    const data = new FormData(this);
    if (selectedElement.tagName === 'DIV' || selectedElement.tagName === 'BUTTON') {
      selectedElement.textContent = data.get('text');
      selectedElement.style.fontSize = data.get('fontSize') + "px";
      selectedElement.style.color = data.get('color');
    } else if (selectedElement.tagName === 'IMG') {
      selectedElement.src = data.get('src');
      selectedElement.style.width = data.get('width') + "px";
      selectedElement.style.height = data.get('height') + "px";
    }
  });

  document.getElementById('deleteElement').addEventListener('click', () => {
    if (selectedElement) {
      selectedElement.remove();
      selectedElement = null;
      document.getElementById('formFields').innerHTML = '';
      document.getElementById('deleteElement').disabled = true;
    }
  });
});

function allowDrop(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const type = e.dataTransfer.getData("type");
  let el;

  switch (type) {
    case 'text':
      el = document.createElement('div');
      el.textContent = "Edit me";
      el.style.fontSize = "16px";
      el.style.cursor = "pointer";
      break;
    case 'image':
      el = document.createElement('img');
      el.src = "https://via.placeholder.com/300x200";
      el.style.width = "300px";
      el.style.height = "auto";
      el.style.cursor = "pointer";
      el.alt = "Editable Image";
      break;
    case 'button':
      el = document.createElement('button');
      el.textContent = "Click Me";
      el.className = "btn btn-secondary";
      el.style.cursor = "pointer";
      break;
  }

  el.classList.add('dropped', 'm-2');
  el.setAttribute('tabindex', '0');
  el.addEventListener('click', () => selectElement(el));
  document.getElementById('canvas').appendChild(el);
}

function selectElement(el) {
  if (selectedElement) {
    selectedElement.classList.remove('border', 'border-primary');
  }
  selectedElement = el;
  el.classList.add('border', 'border-primary');
  document.getElementById('deleteElement').disabled = false;
  showProperties(el);
}

function showProperties(el) {
  const formFields = document.getElementById('formFields');
  formFields.innerHTML = '';

  if (el.tagName === 'DIV' || el.tagName === 'BUTTON') {
    formFields.innerHTML = `
      <label class="form-label">Text</label>
      <input type="text" name="text" class="form-control mb-2" value="${el.textContent}" />
      <label class="form-label">Font Size</label>
      <input type="number" name="fontSize" class="form-control mb-2" value="${parseInt(el.style.fontSize) || 16}" />
      <label class="form-label">Color</label>
      <input type="color" name="color" class="form-control form-control-color mb-2" value="${el.style.color || '#000000'}" />
    `;
  } else if (el.tagName === 'IMG') {
    formFields.innerHTML = `
      <label class="form-label">Image URL</label>
      <input type="text" name="src" class="form-control mb-2" value="${el.src}" />
      <label class="form-label">Width (px)</label>
      <input type="number" name="width" class="form-control mb-2" value="${parseInt(el.style.width) || el.width}" />
      <label class="form-label">Height (px)</label>
      <input type="number" name="height" class="form-control mb-2" value="${parseInt(el.style.height) || el.height}" />
    `;
  }
}