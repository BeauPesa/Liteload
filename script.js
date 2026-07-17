(function () {
  const dropzone = document.getElementById('dropzone');
  const fileInput = document.getElementById('fileInput');
  const filepanel = document.getElementById('filepanel');
  const convertBtn = document.getElementById('convertBtn');
  const cancelBtn = document.getElementById('cancelBtn');

  let files = [];
  let idCounter = 0;

  function formatSize(bytes) {
    const mb = bytes / (1024 * 1024);
    if (mb >= 1) return mb.toFixed(1) + 'MB';
    return Math.max(1, Math.round(bytes / 1024)) + 'KB';
  }

  function extOf(name) {
    const parts = name.split('.');
    return parts.length > 1 ? parts.pop().toLowerCase() : 'file';
  }

  function render() {
    if (files.length === 0) {
      filepanel.classList.add('empty');
      filepanel.innerHTML = '<p class="empty-label">NOTHING HERE YET</p>';
      convertBtn.disabled = true;
      return;
    }

    filepanel.classList.remove('empty');
    filepanel.innerHTML = '';

    files.forEach((f) => {
      const row = document.createElement('div');
      row.className = 'file-row';
      row.innerHTML = `
        <span class="file-badge">${f.ext.toUpperCase()}</span>
        <div class="file-info">
          <div class="file-name">${f.name}</div>
          <div class="file-bar-track"><div class="file-bar-fill" style="width:${f.progress}%"></div></div>
          <div class="file-size">${formatSize(f.loaded)} / ${formatSize(f.size)}</div>
        </div>
        <span class="file-check ${f.progress >= 100 ? 'show' : ''}">&#10003;</span>
        <button class="file-remove" type="button" data-id="${f.id}" aria-label="Remove ${f.name}">&times;</button>
      `;
      filepanel.appendChild(row);
    });

    filepanel.querySelectorAll('.file-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        files = files.filter((f) => f.id !== Number(btn.dataset.id));
        render();
      });
    });

    convertBtn.disabled = !files.every((f) => f.progress >= 100);
  }

  function animateProgress(entry) {
    const duration = 800 + Math.random() * 600;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      entry.progress = pct;
      entry.loaded = entry.size * (pct / 100);
      render();
      if (pct < 100) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function addFiles(fileList) {
    const accepted = ['pdf', 'jpg', 'jpeg'];
    Array.from(fileList).forEach((file) => {
      const ext = extOf(file.name);
      if (!accepted.includes(ext)) return;
      const entry = {
        id: idCounter++,
        name: file.name,
        size: file.size,
        loaded: 0,
        progress: 0,
        ext,
      };
      files.push(entry);
      animateProgress(entry);
    });
    render();
  }

  // Click / keyboard activation opens the native file picker
  fileInput.addEventListener('change', (e) => addFiles(e.target.files));

  // Drag hover state
  ['dragenter', 'dragover'].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add('drag-over');
    });
  });

  ['dragleave', 'drop'].forEach((evt) => {
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove('drag-over');
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files.length) {
      addFiles(e.dataTransfer.files);
    }
  });

  cancelBtn.addEventListener('click', () => {
    files = [];
    fileInput.value = '';
    render();
  });

  convertBtn.addEventListener('click', () => {
    if (convertBtn.disabled) return;
    // Hook point: wire this up to the real parser/backend call.
    console.log('Begin Document Conversion clicked with files:', files);
  });

  render();
})();
