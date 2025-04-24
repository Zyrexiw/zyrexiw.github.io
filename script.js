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

function getRapports() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
function saveRapport(r, i = null) {
  const a = getRapports(); if (i != null) a[i] = r; else a.push(r);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(a));
}
function deleteRapport(i) { const a = getRapports(); a.splice(i, 1); localStorage.setItem(STORAGE_KEY, JSON.stringify(a)); }
function getHistory() { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
function saveHistory(entry) { const h = getHistory(); h.unshift(entry); localStorage.setItem(HISTORY_KEY, JSON.stringify(h)); }

let editIndex = null;

// Toolbar commands
function applyCommand(cmd) { document.execCommand(cmd, false, null); }
function applyColor(color) { document.execCommand('foreColor', false, color); }

document.querySelectorAll('.toolbar button').forEach(btn => btn.addEventListener('click', () => applyCommand(btn.dataset.cmd)));
document.querySelectorAll('input[type=color]').forEach(p => p.addEventListener('input', e => applyColor(e.target.value)));

// Tabs
Array.from(document.querySelectorAll('.menu-item')).forEach(item => item.addEventListener('click', () => {
  document.querySelector('.menu-item.active').classList.remove('active'); item.classList.add('active');
  document.querySelector('.tab-content.active').classList.remove('active'); document.getElementById(item.dataset.tab).classList.add('active');
}));

// Handle form submissions
function handleFormSubmit(formId, commentaireId, isEdit) {
  const form = document.getElementById(formId);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const r = {
      date: new Date(),
      redacteur: { nom: f['redacteur-nom'].value, rio: f['redacteur-rio'].value, grade: f['redacteur-grade'].value },
      tutore: { nom: f['tutore-nom'].value, rio: f['tutore-rio'].value, grade: f['tutore-grade'].value },
      evaluations: { radio: f['critere-radio'].value, conduite: f['critere-conduite'].value, adaptation: f['critere-adaptation'].value },
      commentaire: document.getElementById(commentaireId).innerHTML
    };
    saveRapport(r, editIndex);
    if (!isEdit) saveHistory({action: 'créé', index: getRapports().length, date: new Date()}), notify('Rapport créé !');
    else saveHistory({action: 'modifié', index: editIndex+1, date: new Date()}), notify('Rapport mis à jour !');
    document.getElementById('edit-modal').classList.add('hidden');
    openReport(r);
    editIndex = null; renderRapportsList(); renderHistorique();
    form.reset(); document.getElementById(commentaireId).innerHTML = '';
  });
}
handleFormSubmit('report-form', 'commentaire', false);
handleFormSubmit('edit-form', 'edit-commentaire', true);

// Render
function renderHistorique() {
  const ul = document.getElementById('historique-list'); ul.innerHTML = '';
  getHistory().forEach(entry => {
    const li = document.createElement('li');
    const icon = entry.action==='créé'?'fa-file-alt':entry.action==='modifié'?'fa-edit':'fa-trash';
    li.innerHTML = `<i class="fas ${icon}"></i><span>Rapport #${entry.index} ${entry.action} le ${new Date(entry.date).toLocaleString()}</span>`;
    ul.appendChild(li);
  });
}
function renderRapportsList() {
  const ul = document.getElementById('rapport-list'); ul.innerHTML = '';
  getRapports().forEach((r,i) => {
    const li = document.createElement('li');
    li.innerHTML = `<span>#${i+1} - ${r.tutore.nom}</span><div><span class=\"action-btn\" onclick=\"viewReport(${i})\"><i class=\"fas fa-eye\"></i></span><span class=\"action-btn\" onclick=\"editReport(${i})\"><i class=\"fas fa-edit\"></i></span><span class=\"action-btn\" onclick=\"removeReport(${i})\"><i class=\"fas fa-trash\"></i></span></div>`;
    ul.appendChild(li);
  });
}

// Actions
function viewReport(i) { openReport(getRapports()[i]); }
function editReport(i) { openEditModal(i); }
function removeReport(i) { deleteRapport(i); saveHistory({action:'supprimé',index:i+1,date:new Date()}); notify('Rapport supprimé !'); renderRapportsList(); renderHistorique(); }

// Edit modal
function openEditModal(i) {
  const r = getRapports()[i]; editIndex = i;
  const f = document.getElementById('edit-form');
  ['redacteur-nom','redacteur-rio','redacteur-grade'].forEach(id => f[id].value = r.redacteur[id.split('-')[1]]);
  ['tutore-nom','tutore-rio','tutore-grade'].forEach(id => f[id].value = r.tutore[id.split('-')[1]]);
  ['critere-radio','critere-conduite','critere-adaptation'].forEach(id => f[id].value = r.evaluations[id.split('-')[1]]);
  document.getElementById('edit-commentaire').innerHTML = r.commentaire;
  document.getElementById('edit-modal').classList.remove('hidden');
}
document.getElementById('cancel-edit').addEventListener('click', () => { document.getElementById('edit-modal').classList.add('hidden'); editIndex = null; });

// Generate report HTML
function generateReportHTML(r) {
  return `<!DOCTYPE html><html lang=\"fr\"><head><meta charset=\"UTF-8\"><title>Rapport</title><link href=\"https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap\" rel=\"stylesheet\"/><style>body{margin:0;display:flex;align-items:center;justify-content:center;background:#1A202C;font-family:'Montserrat',sans-serif}.letter{background:#FFF;width:600px;padding:40px;box-shadow:0 2px 10px rgba(0,0,0,.2);line-height:1.6;white-space:pre-wrap;word-break:break-word;position:relative}.download-wrapper{position:absolute;top:20px;right:20px}.download-btn{background:#38B2AC;color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer}.download-btn:hover{background:#2C5282}</style></head><body><div class=\"download-wrapper\"><button class=\"download-btn\" id=\"download-btn\"><i class=\"fas fa-download\"></i> Télécharger</button></div><div class=\"letter\"><h2>Rapport d'évaluation</h2><h3>Agent Rédacteur</h3><p>Nom: ${r.redacteur.nom}</p><p>RIO: ${r.redacteur.rio}</p><p>Grade: ${r.redacteur.grade}</p><h3>Agent Tutoré</h3><p>Nom: ${r.tutore.nom}</p><p>RIO: ${r.tutore.rio}</p><p>Grade: ${r.tutore.grade}</p><h3>Évaluations</h3><ul><li>Radio: ${r.evaluations.radio||'Non évalué'}</li><li>Conduite: ${r.evaluations.conduite||'Non évalué'}</li><li>Adaptation: ${r.evaluations.adaptation||'Non évalué'}</li></ul><h3>Commentaire</h3><blockquote>${r.commentaire||'Aucun commentaire'}</blockquote></div><script src=\"https://html2canvas.hertzen.com/dist/html2canvas.min.js\"></script><script>document.getElementById('download-btn').addEventListener('click',function(){html2canvas(document.querySelector('.letter'),{scale:2,useCORS:true}).then(c=>c.toBlob(b=>{let l=document.createElement('a');l.href=URL.createObjectURL(b);l.download='rapport.png';l.click();URL.revokeObjectURL(l.href);},'image/png'));});</script></body></html>`;
}

function openReport(r) { const w = window.open(); w.document.write(generateReportHTML(r)); w.document.close(); }

// Initialize and sidebar toggle
renderRapportsList(); renderHistorique(); const toggleBtn = document.getElementById('toggle-sidebar'); toggleBtn.addEventListener('click', () => document.querySelector('.sidebar').classList.toggle('open')); toggleBtn.addEventListener('dblclick', () => document.querySelector('.sidebar').classList.toggle('collapsed'));
