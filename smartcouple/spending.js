let chart1;

const defaultExamples = [
    { id: 1, name: "🏠 Loyer", jean: 450, monique: 450, settled: false, recurring: true },
    { id: 2, name: "⚡ Électricité", jean: 40, monique: 40, settled: false, recurring: true },
    { id: 3, name: "🔥 Gaz & Eau", jean: 35, monique: 35, settled: false, recurring: true },
    { id: 4, name: "🌐 Internet & Mobile", jean: 25, monique: 25, settled: false, recurring: true },
    { id: 5, name: "🛡️ Assurance Habitation", jean: 15, monique: 15, settled: false, recurring: true },
    { id: 6, name: "🚗 Assurance Auto", jean: 45, monique: 45, settled: false, recurring: true }
];

let allMonthsData = JSON.parse(localStorage.getItem('smartSpending_history')) || {};
let currentMonth = localStorage.getItem('smartSpending_currentView') || new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

if (Object.keys(allMonthsData).length === 0) {
    allMonthsData[currentMonth] = [...defaultExamples];
}

let categories = allMonthsData[currentMonth];

document.addEventListener('DOMContentLoaded', () => {
    initMonthSelector();
    renderSpending();
});

// --- RESET TO DEFAULTS ---
function resetToDefaults() {
    if(confirm("Voulez-vous réinitialiser ce mois avec les exemples par défaut ? (Cela effacera vos données actuelles)")) {
        categories = JSON.parse(JSON.stringify(defaultExamples)); // Deep copy
        saveData();
        renderSpending();
    }
}

// --- DELETE CURRENT MONTH ---
function deleteCurrentMonth() {
    const months = Object.keys(allMonthsData);
    if (months.length <= 1) {
        alert("Vous ne pouvez pas supprimer le seul mois restant.");
        return;
    }
    if (confirm(`Supprimer définitivement le mois de ${currentMonth} ?`)) {
        delete allMonthsData[currentMonth];
        currentMonth = Object.keys(allMonthsData)[0];
        categories = allMonthsData[currentMonth];
        localStorage.setItem('smartSpending_currentView', currentMonth);
        saveData();
        initMonthSelector();
        renderSpending();
    }
}

// --- FULLY AUTOMATIC NEXT MONTH ---
function startNewMonth() {
    const monthNames = Object.keys(allMonthsData);
    const lastMonthString = monthNames[monthNames.length - 1];
    
    const monthsFr = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    let [name, year] = lastMonthString.split(' ');
    let monthIdx = monthsFr.indexOf(name.toLowerCase());
    
    let date = new Date(parseInt(year), monthIdx, 1);
    date.setMonth(date.getMonth() + 1);
    
    const nextMonthName = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

    if (confirm(`Créer automatiquement le budget pour ${nextMonthName.toUpperCase()} ?`)) {
        const newMonthCats = categories
            .filter(cat => cat.recurring)
            .map(cat => ({ ...cat, id: Date.now() + Math.random(), settled: false }));

        allMonthsData[nextMonthName] = newMonthCats;
        currentMonth = nextMonthName;
        categories = allMonthsData[currentMonth];
        
        saveData();
        initMonthSelector();
        renderSpending();
    }
}

// --- REUSE PREVIOUS RENDER/UPDATE FUNCTIONS ---
function initMonthSelector() {
    const selector = document.getElementById('monthSelector');
    if (!selector) return;
    selector.innerHTML = Object.keys(allMonthsData).map(m => 
        `<option value="${m}" ${m === currentMonth ? 'selected' : ''}>${m}</option>`
    ).join('');
}

function changeMonth(selectedMonth) {
    currentMonth = selectedMonth;
    localStorage.setItem('smartSpending_currentView', currentMonth);
    categories = allMonthsData[currentMonth];
    renderSpending();
}

function saveData() {
    allMonthsData[currentMonth] = categories;
    localStorage.setItem('smartSpending_history', JSON.stringify(allMonthsData));
}

function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if (!container) return;
    let html = `<div class="expense-list-header"><span>Catégorie</span><span>Jean (€)</span><span>Monique (€)</span><span>Total</span><span>Payé</span><span>Récur.</span><span></span></div>`;
    html += categories.map(cat => `
        <div class="expense-row ${cat.settled ? 'row-settled' : ''} ${cat.recurring ? 'row-recurring' : ''}">
            <input type="text" value="${cat.name}" onchange="updateCat(${cat.id}, 'name', this.value)">
            <input type="number" value="${cat.jean}" oninput="updateCat(${cat.id}, 'jean', this.value)">
            <input type="number" value="${cat.monique}" oninput="updateCat(${cat.id}, 'monique', this.value)">
            <span class="total-cell">${(parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2)} €</span>
            <input type="checkbox" ${cat.settled ? 'checked' : ''} onchange="updateCat(${cat.id}, 'settled', this.checked)">
            <input type="checkbox" ${cat.recurring ? 'checked' : ''} onchange="updateCat(${cat.id}, 'recurring', this.checked)">
            <button class="btn-delete-hover" onclick="deleteCat(${cat.id})">×</button>
        </div>
    `).join('');
    container.innerHTML = html;
    calculateTotals();
}

function updateCat(id, field, value) {
    const cat = categories.find(c => c.id === id);
    if (!cat) return;
    if (field === 'settled' || field === 'recurring') {
        cat[field] = value;
        saveData();
        renderSpending();
    } else {
        cat[field] = (field === 'name') ? value : parseFloat(value || 0);
        saveData();
        calculateTotals();
        const rows = document.querySelectorAll('#spendingGrid .expense-row');
        const index = categories.findIndex(c => c.id === id);
        if (rows[index]) {
            rows[index].querySelector('.total-cell').innerText = (parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2) + " €";
        }
    }
}

function addNewCategory() {
    categories.push({ id: Date.now(), name: "Nouvelle dépense", jean: 0, monique: 0, settled: false, recurring: false });
    saveData();
    renderSpending();
}

function deleteCat(id) {
    categories = categories.filter(c => c.id !== id);
    saveData();
    renderSpending();
}

function calculateTotals() {
    let valJean = categories.reduce((sum, c) => sum + parseFloat(c.jean || 0), 0);
    let valMonique = categories.reduce((sum, c) => sum + parseFloat(c.monique || 0), 0);
    if(document.getElementById('jeanTotalDisplay')) document.getElementById('jeanTotalDisplay').value = valJean.toFixed(2);
    if(document.getElementById('moniqueTotalDisplay')) document.getElementById('moniqueTotalDisplay').value = valMonique.toFixed(2);
    const totalGlobal = valJean + valMonique;
    if(document.getElementById('totalDepensesDisplay')) document.getElementById('totalDepensesDisplay').innerText = totalGlobal.toFixed(2) + " €";
    const revInput = document.getElementById('revenuFoyer');
    if(revInput) {
        const revenu = parseFloat(revInput.value || 0);
        const economie = revenu - totalGlobal;
        if(document.getElementById('economieDisplay')) document.getElementById('economieDisplay').innerText = economie.toFixed(2) + " €";
        updateCharts(revenu, totalGlobal);
    }
}

function updateCharts(revenu, totalDepenses) {
    const canvas = document.getElementById('chartRevenu');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (chart1) chart1.destroy();
    const epargne = Math.max(0, revenu - totalDepenses);
    chart1 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Dépenses', 'Épargne'],
            datasets: [{ data: [totalDepenses, epargne], backgroundColor: ['#D4AF37', '#1f4e79'], borderWidth: 0 }]
        },
        options: { cutout: '80%', maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}
