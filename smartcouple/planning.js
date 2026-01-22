let currentViewDate = new Date(2026, 0, 1);
let currentWeekDate = new Date(2026, 0, 5); // Start of first full week 2026
let isMonthly = true;
let activeCategory = 'ACCUEIL'; // Change from 'ALL' to 'ACCUEIL'

// 1. Data & Labels
let events = JSON.parse(localStorage.getItem('smartEvents')) || [
    { date: "2026-01-15", title: "Dégustation", desc: "Test des vins au château", category: "PARTNER-TIME" }
];

const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];

const categoryLabels = {
    'ALL': 'un événement',
    'TO-DO': 'un à-faire',
    'PARTNER-TIME': 'un moment ensemble',
    'SPECIAL-DAYS': 'un jour important'
};

const categoryFrenchLabels = {
    'TO-DO': 'À-FAIRE',
    'PARTNER-TIME': 'MOMENTS ENSEMBLE',
    'SPECIAL-DAYS': 'JOURS IMPORTANTS',
    'DEFAULT': 'AUTRE'
};

function getCategoryColor(cat) {
    if (cat === 'TO-DO') return '#cc9900';       // Gold
    if (cat === 'PARTNER-TIME') return '#dc3545'; // Red
    if (cat === 'SPECIAL-DAYS') return '#90ee90'; // Green
    return '#4B0082'; // Violet
}

let homeWeekDate = new Date(2026, 0, 5); // Initialization for the Accueil view

function switchPlanningTab(cat, btn) {
    activeCategory = cat;

    // UI Highlights
    document.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Re-run render to update all visibility and data
    render(); 
}

function render() {
    const grid = document.getElementById('calendarGrid');
    const timeline = document.getElementById('timelineList');
    if(!grid || !timeline) return;
    
    // Clear previous content
    grid.innerHTML = ""; 
    timeline.innerHTML = "";

    const monthlyCard = document.getElementById('monthlyViewCard');
    const weeklyCard = document.getElementById('weeklyViewCard');
    const homeCard = document.getElementById('homeWeeklyViewCard');
    const addBtn = document.getElementById('dynamicAddBtn');
    const viewToggle = document.getElementById('viewToggle');

    // 1. DASHBOARD LOGIC (ACCUEIL)
    if (activeCategory === 'ACCUEIL') {
        homeCard.style.display = 'block';
        monthlyCard.style.display = 'none';
        weeklyCard.style.display = 'none';
        timeline.style.display = 'none'; 
        
        // Ensure buttons are hidden on ACCUEIL
        if(addBtn) addBtn.style.display = 'none';
        if(viewToggle) viewToggle.style.display = 'none';
        
        renderHomeWeekly(); 
    } 
    // 2. SETTINGS Logic (Blocked/Inactive)
    else if (activeCategory === 'SETTINGS') {
        homeCard.style.display = 'none';
        monthlyCard.style.display = 'none';
        weeklyCard.style.display = 'none';
        timeline.style.display = 'none';
        if(addBtn) addBtn.style.display = 'none';
        if(viewToggle) viewToggle.style.display = 'none';
    }
    // 3. CALENDAR LOGIC (ALL or SPECIFIC CATEGORIES)
    else {
        homeCard.style.display = 'none';
        timeline.style.display = 'block'; 
        
        // Show toggle button ONLY for the general CALENDRIER (ALL)
        if(viewToggle) viewToggle.style.display = (activeCategory === 'ALL') ? 'inline-block' : 'none';
        
        // Show add button ONLY for specific categories (TO-DO, etc.)
        if(addBtn) {
            if (activeCategory === 'ALL') {
                addBtn.style.display = 'none';
            } else {
                addBtn.style.display = 'inline-block';
                addBtn.innerText = `+ Ajouter ${categoryLabels[activeCategory]}`;
            }
        }

        // Handle Monthly vs Weekly View
        if (isMonthly) {
            monthlyCard.style.display = 'block';
            weeklyCard.style.display = 'none';
            renderMonthly();
        } else {
            monthlyCard.style.display = 'none';
            weeklyCard.style.display = 'block';
            renderWeekly();
        }

        // Render the text list below
        let displayEvents = activeCategory === 'ALL' 
            ? events 
            : events.filter(e => e.category === activeCategory);

        displayEvents.sort((a,b) => new Date(a.date) - new Date(b.date));
        renderTimeline(timeline, displayEvents);
    }
}

// NEW: Helper function to render the special Accueil blocks
function renderHomeWeekly() {
    const grid = document.getElementById('homeWeeklyGrid');
    if (!grid) return;
    grid.innerHTML = "";
    const days = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    
    for (let i = 0; i < 7; i++) {
        let d = new Date(homeWeekDate);
        d.setDate(homeWeekDate.getDate() + i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        
        const dayEvents = events.filter(e => e.date === dateStr);
        
        let col = document.createElement('div');
        col.className = 'home-day-col';
        col.innerHTML = `
            <small style="color:#888; text-transform:uppercase; font-size:0.6rem;">${days[i]}</small>
            <div class="home-date-circle">${d.getDate()}</div>
            <small style="font-size:0.6rem; color:#999; margin-bottom:10px;">${monthNames[d.getMonth()]}</small>
        `;

        dayEvents.forEach(ev => {
            let block = document.createElement('div');
            block.className = 'home-event-block';
            block.style.backgroundColor = getCategoryColor(ev.category);
            block.innerHTML = `<div style="font-weight:bold; font-size:0.65rem;">${ev.title}</div>`;
            col.appendChild(block);
        });
        grid.appendChild(col);
    }

    let end = new Date(homeWeekDate);
    end.setDate(homeWeekDate.getDate() + 6);
    document.getElementById('homeWeekTitle').innerText = 
        `${homeWeekDate.getDate()} ${monthNames[homeWeekDate.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]} 2026`;
}

// Separate helper for timeline to keep code clean
function renderTimeline(container, list) {
    list.forEach((e) => {
        const realIdx = events.indexOf(e);
        const c = getCategoryColor(e.category);
        const displayLabel = categoryFrenchLabels[e.category] || e.category;
        container.innerHTML += `
            <div class="event" id="event-${e.date}" style="border-left: 5px solid ${c}; padding: 15px; margin-bottom: 10px; background: #fff;">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <small style="color:${c}; font-weight:bold;">${displayLabel}</small>
                        <h4 style="margin: 5px 0;">${e.title}</h4>
                        <p style="margin:0; font-size:0.8rem; color:#666;">${e.date}</p>
                    </div>
                    <div><button onclick="openEditModal(${realIdx})" style="color:#007bff; background:none; border:none; cursor:pointer;">Modifier</button></div>
                </div>
            </div>`;
    });
}

function toggleView() {
    isMonthly = !isMonthly;
    document.getElementById('monthlyViewCard').style.display = isMonthly ? "block" : "none";
    document.getElementById('weeklyViewCard').style.display = isMonthly ? "none" : "block";
    document.getElementById('viewToggle').innerText = isMonthly ? "Voir par Semaine" : "Voir par Mois";
    render();
}

function changeHomeWeek(s) {
    homeWeekDate.setDate(homeWeekDate.getDate() + (s * 7));
    render();
}

function renderMonthly() {
    const grid = document.getElementById('calendarGrid');
    const year = currentViewDate.getFullYear();
    const month = currentViewDate.getMonth();
    document.getElementById('monthTitle').innerText = `${monthNames[month]} ${year}`;

    grid.innerHTML = "";
    ["L", "M", "M", "J", "V", "S", "D"].forEach(d => grid.innerHTML += `<div class="day-name">${d}</div>`);
    
    const firstDay = new Date(year, month, 1).getDay();
    const offset = (firstDay === 0) ? 6 : firstDay - 1;
    for(let i=0; i<offset; i++) grid.innerHTML += `<div></div>`;

    for(let d=1; d <= new Date(year, month + 1, 0).getDate(); d++) {
    const dateStr = `${year}-${String(month+1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    
    // THIS LINE IS KEY: It filters the dots on the calendar
    const ev = events.find(e => e.date === dateStr && (activeCategory === 'ALL' || e.category === activeCategory));

    const color = ev ? getCategoryColor(ev.category) : 'transparent';
    grid.innerHTML += `
        <div class="day" onclick="jumpToEvent('${dateStr}')" style="display:flex; justify-content:center;">
            <span style="background:${color}; color:${ev?'white':'black'}; width:30px; height:30px; border-radius:50%; display:flex; align-items:center; justify-content:center;">${d}</span>
        </div>`;
	}
}

function renderWeekly() {
    const grid = document.getElementById('weeklyGrid');
    if(!grid) return;
    grid.innerHTML = "";
    
    ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].forEach(d => grid.innerHTML += `<div class="day-name">${d}</div>`);
    
    for (let i = 0; i < 7; i++) {
        let d = new Date(currentWeekDate); 
        d.setDate(currentWeekDate.getDate() + i);
        const dateStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        
        // FILTER LOGIC: Apply same category filter to weekly view
        const ev = events.find(e => {
            const matchesDate = e.date === dateStr;
            const matchesCategory = (activeCategory === 'ALL' || e.category === activeCategory);
            return matchesDate && matchesCategory;
        });

        const color = ev ? getCategoryColor(ev.category) : 'transparent';
        
        grid.innerHTML += `
            <div class="day" onclick="jumpToEvent('${dateStr}')" style="height:80px; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                <span style="background:${color}; color:${ev?'white':'black'}; width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">${d.getDate()}</span>
                <small style="color:#999">${monthNames[d.getMonth()]}</small>
            </div>`;
    }
    
    let end = new Date(currentWeekDate); 
    end.setDate(currentWeekDate.getDate() + 6);
    document.getElementById('weekTitle').innerText = `${currentWeekDate.getDate()} ${monthNames[currentWeekDate.getMonth()]} - ${end.getDate()} ${monthNames[end.getMonth()]} 2026`;
}

// 4. Modal & CRUD Functions
function openModalWithCategory() {
    document.getElementById('editIndex').value = "-1";
    document.getElementById('eventFullDate').value = "";
    document.getElementById('eventTitle').value = "";
    document.getElementById('eventDesc').value = "";
    
    const catSelect = document.getElementById('eventCategory');
    catSelect.value = activeCategory;
    catSelect.disabled = true;
    
    document.getElementById('modalTitle').innerText = `Nouveau: ${categoryLabels[activeCategory]}`;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() { document.getElementById('modal').style.display = 'none'; }

function saveEvent() {
    const dVal = document.getElementById('eventFullDate').value;
    const tVal = document.getElementById('eventTitle').value;
    const editIdx = parseInt(document.getElementById('editIndex').value);

    if (dVal.length === 10 && tVal) {
        const p = dVal.split('/');
        const newEv = { 
            date: `${p[2]}-${p[1]}-${p[0]}`, 
            title: tVal, 
            desc: document.getElementById('eventDesc').value, 
            category: document.getElementById('eventCategory').value 
        };
        
        if(editIdx > -1) events[editIdx] = newEv;
        else events.push(newEv);

        localStorage.setItem('smartEvents', JSON.stringify(events));
        render();
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
    document.getElementById('eventCategory').disabled = false;
    document.getElementById('editIndex').value = idx;
    document.getElementById('modalTitle').innerText = "Modifier";
    document.getElementById('modal').style.display = 'flex';
}

function jumpToEvent(dateStr) {
    const element = document.getElementById('event-' + dateStr);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.style.backgroundColor = "#fff9c4";
        setTimeout(() => element.style.backgroundColor = "#fff", 1500);
    }
}

function changeMonth(s) { currentViewDate.setMonth(currentViewDate.getMonth() + s); render(); }
function changeWeek(s) { currentWeekDate.setDate(currentWeekDate.getDate() + (s * 7)); render(); }
function confirmDelete(idx) { if(confirm("Supprimer ?")) { events.splice(idx, 1); localStorage.setItem('smartEvents', JSON.stringify(events)); render(); } }

// Date Mask
document.getElementById('eventFullDate').addEventListener('input', function (e) {
    let v = e.target.value.replace(/\D/g, '').substring(0, 8);
    let d = v.substring(0, 2); let m = v.substring(2, 4); let y = v.substring(4, 8);
    if (d && parseInt(d) > 31) d = "31"; if (m && parseInt(m) > 12) m = "12";
    let res = d; if (v.length > 2) res += '/' + m; if (v.length > 4) res += '/' + y;
    e.target.value = res;
});

// Start
render();
