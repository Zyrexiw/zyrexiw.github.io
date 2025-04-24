// script.js
'use strict';
const STORAGE_KEY = 'rapports';
const HISTORY_KEY = 'rapports_history';

function notify(msg) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.style.display = 'block';
  setTimeout(() => n.style.display = 'none', 2000);
}

function getRapports() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveRapport(r, i = null) {
  const a = getRapports();
  if (i != null) a[i] = r;
  else a.push(r);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
}

function deleteRapport(i) {
  const a = getRapports();
  a.splice(i, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
}

function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
}

function saveHistory(entry) {
  const h = getHistory();
  h.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h));
}

let editIndex = null;

document.getElementById('report-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const r = {
    date: new Date(),
    redacteur: { nom: f['redacteur-nom'].value, rio: f['redacteur-rio'].value, grade: f['redacteur-grade'].value },
    tutore: { nom: f['tutore-nom'].value, rio: f['tutore-rio'].value, grade: f['tutore-grade'].value },
    evaluations: { radio: f['critere-radio'].value, conduite: f['critere-conduite'].value, adaptation: f['critere-adaptation'].value },
    commentaire: document.getElementById('commentaire').innerHTML
  };
  saveRapport(r, editIndex);
  // record history for create or modify
  if (editIndex == null) {
    saveHistory({action: 'créé', index: getRapports().length, date: new Date()});
    notify('Rapport créé !');
  } else {
    saveHistory({action: 'modifié', index: editIndex + 1, date: new Date()});
    notify('Rapport mis à jour !');
  }
  openReport(r);
  editIndex = null;
  renderRapportsList();
  renderHistorique();
  f.reset();
  document.getElementById('commentaire').innerHTML = '';
});

document.querySelectorAll('.toolbar button').forEach(btn => btn.addEventListener('click', () => {
  document.execCommand(btn.dataset.cmd, false, null);
}));

document.getElementById('color-picker').addEventListener('input', () => {
  document.execCommand('foreColor', false, document.getElementById('color-picker').value);
});

Array.from(document.querySelectorAll('.menu-item')).forEach(item => item.addEventListener('click', () => {
  document.querySelector('.menu-item.active').classList.remove('active');
  item.classList.add('active');
  document.querySelector('.tab-content.active').classList.remove('active');
  document.getElementById(item.dataset.tab).classList.add('active');
}));

function renderHistorique() {
  const ul = document.getElementById('historique-list');
  ul.innerHTML = '';
  getHistory().forEach(entry => {
    const li = document.createElement('li');
    const icon = entry.action === 'créé' ? 'fa-file-alt' : entry.action === 'modifié' ? 'fa-edit' : 'fa-trash';
    li.innerHTML = `<i class="fas ${icon}"></i><span>Rapport #${entry.index} ${entry.action} le ${new Date(entry.date).toLocaleString()}</span>`;
    ul.appendChild(li);
  });
}

function renderRapportsList() {
  const ul = document.getElementById('rapport-list');
  ul.innerHTML = '';
  getRapports().forEach((r, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>#${i+1} - ${r.tutore.nom}</span>
      <div>
        <span class="action-btn" onclick="viewReport(${i})"><i class="fas fa-eye"></i></span>
        <span class="action-btn" onclick="editReport(${i})"><i class="fas fa-edit"></i></span>
        <span class="action-btn" onclick="removeReport(${i})"><i class="fas fa-trash"></i></span>
      </div>`;
    ul.appendChild(li);
  });
}

function viewReport(i) { openReport(getRapports()[i]); }

function editReport(i) { openEditModal(i); }

function removeReport(i) {
  deleteRapport(i);
  saveHistory({action: 'supprimé', index: i+1, date: new Date()});
  notify('Rapport supprimé !');
  renderRapportsList();
  renderHistorique();
}

function openEditModal(i) {
  const r = getRapports()[i];
  const modal = document.getElementById('edit-modal');
  const form = document.getElementById('edit-form');
  editIndex = i;
  // populate fields
  form['redacteur-nom'].value = r.redacteur.nom;
  form['redacteur-rio'].value = r.redacteur.rio;
  form['redacteur-grade'].value = r.redacteur.grade;
  form['tutore-nom'].value = r.tutore.nom;
  form['tutore-rio'].value = r.tutore.rio;
  form['tutore-grade'].value = r.tutore.grade;
  form['critere-radio'].value = r.evaluations.radio;
  form['critere-conduite'].value = r.evaluations.conduite;
  form['critere-adaptation'].value = r.evaluations.adaptation;
  document.getElementById('edit-commentaire').innerHTML = r.commentaire;
  modal.classList.remove('hidden');
}

document.getElementById('cancel-edit').addEventListener('click', () => {
  document.getElementById('edit-modal').classList.add('hidden');
  editIndex = null;
});

document.getElementById('edit-form').addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  const r = {
    date: new Date(),
    redacteur: { nom: f['redacteur-nom'].value, rio: f['redacteur-rio'].value, grade: f['redacteur-grade'].value },
    tutore: { nom: f['tutore-nom'].value, rio: f['tutore-rio'].value, grade: f['tutore-grade'].value },
    evaluations: { radio: f['critere-radio'].value, conduite: f['critere-conduite'].value, adaptation: f['critere-adaptation'].value },
    commentaire: document.getElementById('edit-commentaire').innerHTML
  };
  saveRapport(r, editIndex);
  saveHistory({action: 'modifié', index: editIndex+1, date: new Date()});
  document.getElementById('edit-modal').classList.add('hidden');
  renderRapportsList();
  renderHistorique();
  notify('Rapport mis à jour !');
});

function openReport(r) {
  const w = window.open();
  w.document.write(generateReportHTML(r));
  w.document.close();
}

// initialize
renderRapportsList();
renderHistorique();

// sidebar toggle
const toggleBtn = document.getElementById('toggle-sidebar');
toggleBtn.addEventListener('click', () => { document.querySelector('.sidebar').classList.toggle('open'); });
toggleBtn.addEventListener('dblclick', () => { document.querySelector('.sidebar').classList.toggle('collapsed'); });