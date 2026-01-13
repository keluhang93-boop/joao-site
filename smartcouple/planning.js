let currentViewDate = new Date(2026, 0, 1);
let currentWeekDate = new Date(2026, 0, 5);
let isMonthly = true;

let events = JSON.parse(localStorage.getItem('smartEvents')) || [
    { date: "2026-01-15", title: "Dégustation", desc: "Test des vins au château", category: "ENSEMBLE" }
];

const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

function getCategoryColor(cat) {
    if (cat === 'ENSEMBLE') return '#cc9900';
    if (cat === 'IMPORTANT') return '#dc3545';
    if (cat === 'FAMILLE') return '#90ee90';
    return '#4B0082';
}

function jumpToEvent(dateStr) {
    const element = document.getElementById('event-' + dateStr);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-flash');
        setTimeout(() => element.classList.remove('highlight-flash'), 1500);
    }
}

function render() {
    const grid = document.getElementById('calendarGrid');
    const timeline = document.getElementById('timelineList');
    if(!grid || !timeline) return;
    
    grid.innerHTML = ""; timeline.innerHTML = "";
    
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    document.getElementById('monthTitle').innerText = `${monthNames[month]} ${year}`;

    ["L", "M", "M", "J", "V", "S", "D"].forEach(d => grid.innerHTML += `<div class="day-name">${d}</div>`);
    const firstDay = new Date(year, month, 1).getDay();
    const offset = (firstDay === 0) ? 6 : firstDay - 1;
    for(let i=0; i<offset; i++) grid.innerHTML += `<div></div>`;

    for(let d=1; d <= new Date(year, month + 1, 0).getDate(); d++) {
        const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const ev = events.find(e => e.date === dateStr);
        const color = ev ? getCategoryColor(ev.category) : 'transparent';
        grid.innerHTML += `<div class="day" onclick="jumpToEvent('${dateStr}')" style="display:flex; justify-content:center;"><span style="background:${color}; color:${ev?'white':'black'}; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center;">${d}</span></div>`;
    }

    events.sort((a,b) => new Date(a.date) - new Date(b.date)).forEach((e, idx) => {
        const c = getCategoryColor(e.category);
        const d = new Date(e.date);
        timeline.innerHTML += `
            <div class="event" id="event-${e.date}" style="--cat-color: ${c};">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <small style="color:${c}; font-weight:bold; text-transform: uppercase;">${e.category || 'Événement'}</small>
                        <h4 style="margin: 5px 0;">${e.title}</h4>
                        <p style="margin: 0; font-size: 0.85rem; color: #666;">${d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="openEditModal(${idx})" style="border:none; background:none; color:#007bff; cursor:pointer; font-size:0.9rem; font-weight:bold;">MODIFIER</button>
                        <button onclick="confirmDelete(${idx})" style="border:none; background:none; color:#ccc; cursor:pointer; font-size:1.4rem;">&times;</button>
                    </div>
                </div>
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #eee; color: #444; font-size: 0.9rem;">
                    ${e.desc || '<span style="color:#ccc;">Pas de description</span>'}
                </div>
            </div>`;
    });
}

function renderWeekly() {
    const grid = document.getElementById('weeklyGrid');
    if(!grid) return;
    grid.innerHTML = "";
    ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].forEach(d => grid.innerHTML += `<div class="day-name">${d}</div>`);
    for (let i = 0; i < 7; i++) {
        let d = new Date(currentWeekDate); d.setDate(currentWeekDate.getDate() + i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        const ev = events.find(e => e.date === dateStr);
        const color = ev ? getCategoryColor(ev.category) : 'transparent';
        grid.innerHTML += `<div class="day" onclick="jumpToEvent('${dateStr}')" style="height:80px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
            <span style="background:${color}; color:${ev?'white':'black'}; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">${d.getDate()}</span>
            <small style="color:#999">${monthNames[d.getMonth()]}</small>
        </div>`;
    }
    let end = new Date(currentWeekDate); end.setDate(currentWeekDate.getDate() + 6);
    document.getElementById('weekTitle').innerText = `${currentWeekDate.getDate()} ${monthNames[currentWeekDate.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]} 2026`;
}

function saveEvent() {
    const dVal = document.getElementById('eventFullDate').value;
    const tVal = document.getElementById('eventTitle').value;
    const editIdx = parseInt(document.getElementById('editIndex').value);

    if (dVal.length === 10 && tVal) {
        const p = dVal.split('/');
        const newEv = { date: `${p[2]}-${p[1]}-${p[0]}`, title: tVal, desc: document.getElementById('eventDesc').value, category: document.getElementById('eventCategory').value };
        
        if(editIdx > -1) events[editIdx] = newEv;
        else events.push(newEv);

        localStorage.setItem('smartEvents', JSON.stringify(events));
        render(); if(!isMonthly) renderWeekly();
        closeModal();
    } else { alert("Données invalides"); }
}

function openEditModal(idx) {
    const e = events[idx];
    const p = e.date.split('-');
    document.getElementById('eventFullDate').value = `${p[2]}/${p[1]}/${p[0]}`;
    document.getElementById('eventTitle').value = e.title;
    document.getElementById('eventDesc').value = e.desc;
    document.getElementById('eventCategory').value = e.category;
    document.getElementById('editIndex').value = idx;
    document.getElementById('modalTitle').innerText = "Modifier l'événement";
    openModal();
}

function openModal() { 
    if(document.getElementById('editIndex').value == "-1") {
        document.getElementById('modalTitle').innerText = "Nouvel Événement";
        document.getElementById('eventFullDate').value = "";
        document.getElementById('eventTitle').value = "";
        document.getElementById('eventDesc').value = "";
    }
    document.getElementById('modal').style.display = 'block'; 
}

function closeModal() { 
    document.getElementById('modal').style.display = 'none'; 
    document.getElementById('editIndex').value = "-1";
}

function confirmDelete(idx) { if(confirm("Supprimer ?")) { events.splice(idx, 1); localStorage.setItem('smartEvents', JSON.stringify(events)); render(); if(!isMonthly) renderWeekly(); } }
function toggleView() { isMonthly = !isMonthly; document.getElementById('monthlyViewCard').style.display = isMonthly ? "block" : "none"; document.getElementById('weeklyViewCard').style.display = isMonthly ? "none" : "block"; document.getElementById('viewToggle').innerText = isMonthly ? "Voir par Semaine" : "Voir par Mois"; if(isMonthly) render(); else renderWeekly(); }
function changeMonth(s) { currentViewDate.setMonth(currentViewDate.getMonth() + s); render(); }
function changeWeek(s) { currentWeekDate.setDate(currentWeekDate.getDate() + (s * 7)); renderWeekly(); }

// Date Input Mask
document.getElementById('eventFullDate').addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '').substring(0, 8);
    let d = v.substring(0, 2); let m = v.substring(2, 4); let y = v.substring(4, 8);
    if (d && parseInt(d) > 31) d = "31"; if (m && parseInt(m) > 12) m = "12";
    let res = d; if (v.length > 2) res += '/' + m; if (v.length > 4) res += '/' + y;
    e.target.value = res;
});

// Initial Render
render();
