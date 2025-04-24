'use strict';

const STORAGE_KEY = 'rapports';
const HISTORY_KEY = 'rapports_history';

const LOGO_BASE64 = 'data:image/png;base64,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RERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERERKLxX5uLKu/1ZkFXAAAAAElFTkSuQmCC';  


function notify(msg) {
  const n = document.getElementById('notification');
  n.textContent = msg;
  n.style.display = 'block';
  setTimeout(() => n.style.display = 'none', 2000);
}

function getRapports() { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
function saveRapport(r, index = null) {
  const rapports = getRapports();
  if (index !== null) rapports[index] = r;
  else rapports.push(r);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rapports));
}
function deleteRapport(index) {
  const rapports = getRapports();
  rapports.splice(index, 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rapports));
}

function getHistory() { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
function saveHistory(entry) {
  const history = getHistory();
  history.unshift(entry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}
function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
  renderHistorique();
  notify("Historique vidé !");
}

let editIndex = null;


function applyCommand(cmd) { document.execCommand(cmd, false, null); }
function applyColor(color) { document.execCommand('foreColor', false, color); }
document.querySelectorAll('.toolbar button').forEach(btn => btn.addEventListener('click', () => applyCommand(btn.dataset.cmd)));
document.querySelectorAll('input[type=color]').forEach(p => p.addEventListener('input', e => applyColor(e.target.value)));


document.getElementById('toggle-sidebar').addEventListener('click', () => {
  document.querySelector('.sidebar').classList.toggle('open');
});


document.querySelectorAll('.menu-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelector('.menu-item.active').classList.remove('active');
    item.classList.add('active');
    document.querySelector('.tab-content.active').classList.remove('active');
    document.getElementById(item.dataset.tab).classList.add('active');
    if (window.innerWidth <= 768) document.querySelector('.sidebar').classList.remove('open');
  });
});

// Vider historique
document.getElementById('clear-history').addEventListener('click', clearHistory);

function handleFormSubmit(formId, commentId, isEdit) {
  const form = document.getElementById(formId);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target;
    const r = {
      date: new Date(f[ isEdit ? 'edit-report-date' : 'report-date' ].value),
      redacteur: {
        nom: f[ isEdit ? 'edit-redacteur-nom' : 'redacteur-nom' ].value,
        grade: f[ isEdit ? 'edit-redacteur-grade' : 'redacteur-grade' ].value
      },
      tutore: {
        nom: f[ isEdit ? 'edit-tutore-nom' : 'tutore-nom' ].value,
        grade: f[ isEdit ? 'edit-tutore-grade' : 'tutore-grade' ].value
      },
      evaluations: {
        radio: f[ isEdit ? 'edit-critere-radio' : 'critere-radio' ].value,
        conduite: f[ isEdit ? 'edit-critere-conduite' : 'critere-conduite' ].value,
        adaptation: f[ isEdit ? 'edit-critere-adaptation' : 'critere-adaptation' ].value,
        comportement: f[ isEdit ? 'edit-critere-comportement' : 'critere-comportement' ].value
      },
      commentaire: document.getElementById(commentId).innerHTML
    };
    saveRapport(r, editIndex);
    saveHistory({
      action: isEdit ? 'modifié' : 'créé',
      index: isEdit ? editIndex+1 : getRapports().length,
      date: new Date()
    });
    notify(isEdit ? 'Rapport mis à jour !' : 'Rapport créé !');
    document.getElementById('edit-modal').classList.add('hidden');
    openReport(r);
    editIndex = null;
    renderRapportsList();
    renderHistorique();
    form.reset();
    document.getElementById(commentId).innerHTML = '';
  });
}
handleFormSubmit('report-form', 'commentaire', false);
handleFormSubmit('edit-form',    'edit-commentaire', true);


document.getElementById('cancel-edit')
  .addEventListener('click', () => document.getElementById('edit-modal').classList.add('hidden'));


function renderHistorique() {
  const ul = document.getElementById('historique-list');
  ul.innerHTML = '';
  getHistory().forEach(e =>
    ul.innerHTML +=
      `<li><i class="fas ${
         e.action==='créé'  ? 'fa-file-alt' :
         e.action==='modifié'? 'fa-edit'    :
                               'fa-trash'
       }"></i>
       Rapport #${e.index} ${e.action} le ${new Date(e.date).toLocaleString()}</li>`
  );
}


function renderRapportsList() {
  const ul = document.getElementById('rapport-list');
  ul.innerHTML = '';
  getRapports().forEach((r,i) => {
    const dateTime = new Date(r.date)
      .toLocaleString('fr-FR', { dateStyle:'short', timeStyle:'short' });
    ul.innerHTML +=
      `<li><span>#${i+1} - ${r.tutore.nom} (${dateTime})</span><div>` +
        `<span class="action-btn" onclick="viewReport(${i})"><i class="fas fa-eye"></i></span>` +
        `<span class="action-btn" onclick="editReport(${i})"><i class="fas fa-edit"></i></span>` +
        `<span class="action-btn" onclick="removeReport(${i})"><i class="fas fa-trash"></i></span>` +
      `</div></li>`;
  });
}


function viewReport(i) { openReport(getRapports()[i]); }
function editReport(i) { openEditModal(i);    }
function removeReport(i) {
  deleteRapport(i);
  saveHistory({ action:'supprimé', index:i+1, date:new Date() });
  notify('Rapport supprimé !');
  renderRapportsList();
  renderHistorique();
}


function generateReportHTML(r) {
  const dateFR = new Date(r.date)
    .toLocaleString('fr-FR', {
      day:'2-digit', month:'2-digit', year:'numeric',
      hour:'2-digit', minute:'2-digit'
    });

  return `<!DOCTYPE html><html lang="fr"><head><meta charset="UTF-8"><title>Rapport</title>` +
    `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet"/>` +
    `<style>body{margin:0;display:flex;align-items:center;justify-content:center;background:#1A202C;` +
    `font-family:'Montserrat',sans-serif}.letter{background:#FFF;width:600px;padding:40px;` +
    `box-shadow:0 2px 10px rgba(0,0,0,.2);line-height:1.6;white-space:pre-wrap;` +
    `word-break:break-word;position:relative}.download-wrapper{position:absolute;top:20px;right:20px}` +
    `.download-btn{background:#38B2AC;color:#fff;padding:8px 12px;border:none;border-radius:4px;cursor:pointer}` +
    `.download-btn:hover{background:#2C5282}.logo{display:block;margin:0 auto 20px;max-width:150px;height:auto}` +
    `</style><script defer src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script></head><body>` +
    `<div class="download-wrapper"><button class="download-btn" id="download-btn">` +
    `<i class="fas fa-download"></i> Télécharger</button></div><div class="letter">` +
    `<img src="${LOGO_BASE64}" alt="Logo Police" class="logo"/>` +
    `<h2>Rapport d'évaluation</h2>` +
    `<p><strong>Date et heure de la vacation :</strong> ${dateFR}</p>` +
    `<h3>Agent Rédacteur</h3><p>Nom: ${r.redacteur.nom}</p><p>Grade: ${r.redacteur.grade}</p>` +
    `<h3>Agent Tutoré</h3><p>Nom: ${r.tutore.nom}</p><p>Grade: ${r.tutore.grade}</p>` +
    `<h3>Évaluations</h3><ul><li>Radio: ${r.evaluations.radio||'Non évalué'}</li>` +
    `<li>Conduite: ${r.evaluations.conduite||'Non évalué'}</li>` +
    `<li>Adaptation: ${r.evaluations.adaptation||'Non évalué'}</li>` +
    `<li>Comportement: ${r.evaluations.comportement||'Non évalué'}</li></ul>` +
    `<h3>Commentaire</h3><blockquote>${r.commentaire||'Aucun commentaire'}</blockquote></div>` +
    `<script>document.getElementById('download-btn').addEventListener('click',function(){` +
    `html2canvas(document.querySelector('.letter'),{scale:2,useCORS:true,allowTaint:true})` +
    `.then(c=>c.toBlob(b=>{const l=document.createElement('a');l.href=URL.createObjectURL(b);` +
    `l.download='rapport.png';l.click();URL.revokeObjectURL(l.href);},'image/png'))` +
    `.catch(err=>console.error('html2canvas error:',err));});</script></body></html>`;
}


function openEditModal(i) {
  const r = getRapports()[i];
  editIndex = i;
  const f = document.getElementById('edit-form');
  f['edit-report-date'].value = new Date(r.date).toISOString().slice(0,16);
  ['nom','grade'].forEach(field => {
    f[`edit-redacteur-${field}`].value = r.redacteur[field];
    f[`edit-tutore-${field}`].value   = r.tutore[field];
  });
  ['radio','conduite','adaptation','comportement'].forEach(field => {
    f[`edit-critere-${field}`].value = r.evaluations[field];
  });
  document.getElementById('edit-commentaire').innerHTML = r.commentaire;
  document.getElementById('edit-modal').classList.remove('hidden');
}


function openReport(r) {
  const w = window.open();
  w.document.write(generateReportHTML(r));
  w.document.close();
}


(function(){
  renderRapportsList();
  renderHistorique();
})();