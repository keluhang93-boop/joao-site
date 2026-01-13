let chart1;
let currentMonth = new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

// 1. Load data from LocalStorage
let allMonthsData = JSON.parse(localStorage.getItem('smartSpending_history')) || {};
let debts = JSON.parse(localStorage.getItem('smartSpending_debts')) || [];

// 2. Initialize the first month if history is empty
if (Object.keys(allMonthsData).length === 0) {
    allMonthsData[currentMonth] = [
        { id: 1, name: "🏠 Loyer", jean: 450, monique: 450, settled: false, recurring: true },
        { id: 2, name: "⚡ Électricité", jean: 40, monique: 40, settled: false, recurring: true }
    ];
} else if (!allMonthsData[currentMonth]) {
    // If we have history but not for THIS month, default to the most recent month's recurring items
    const lastMonth = Object.keys(allMonthsData).pop();
    allMonthsData[currentMonth] = allMonthsData[lastMonth]
        .filter(cat => cat.recurring)
        .map(cat => ({ ...cat, id: Date.now() + Math.random(), settled: false }));
}

let categories = allMonthsData[currentMonth];

document.addEventListener('DOMContentLoaded', () => {
    initMonthSelector();
    renderSpending();
    renderDebts();
});

// --- MONTH NAVIGATION ---
function initMonthSelector() {
    const selector = document.getElementById('monthSelector');
    if (!selector) return;
    selector.innerHTML = Object.keys(allMonthsData).map(m => 
        `<option value="${m}" ${m === currentMonth ? 'selected' : ''}>${m}</option>`
    ).join('');
}

function changeMonth(selectedMonth) {
    currentMonth = selectedMonth;
    categories = allMonthsData[currentMonth];
    renderSpending();
}

function startNewMonth() {
    const nextMonthName = prompt("Nom du nouveau mois (ex: Février 2026) :");
    if (!nextMonthName || allMonthsData[nextMonthName]) return;

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

function saveData() {
    allMonthsData[currentMonth] = categories;
    localStorage.setItem('smartSpending_history', JSON.stringify(allMonthsData));
    localStorage.setItem('smartSpending_debts', JSON.stringify(debts));
}

// --- RENDERING ---
function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if (!container) return;

    let html = `<div class="expense-list-header">
        <span>Catégorie</span><span>Jean (€)</span><span>Monique (€)</span><span>Total</span><span>Payé</span><span>Récur.</span><span></span>
    </div>`;

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
        cat[field] = field === 'name' ? value : parseFloat(value || 0);
        saveData();
        calculateTotals();
        // Update the row total text without refreshing the input
        const rows = document.querySelectorAll('#spendingGrid .expense-row');
        const index = categories.findIndex(c => c.id === id);
        if (rows[index]) {
            rows[index].querySelector('.total-cell').innerText = (parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2) + " €";
        }
    }
}

function updateDashboard() { calculateTotals(); saveData(); }

function addNewCategory() {
    categories.push({ id: Date.now(), name: "Nouvelle ligne", jean: 0, monique: 0, settled: false, recurring: false });
    saveData();
    renderSpending();
}

function deleteCat(id) {
    categories = categories.filter(c => c.id !== id);
    saveData();
    renderSpending();
}

// --- DEBTS ---
function renderDebts() {
    const container = document.getElementById('debtGrid');
    if (!container) return;
    let html = `<div class="expense-list-header"><span>Mois</span><span>Jean doit</span><span>Monique doit</span><span>Payé</span><span></span></div>`;
    html += debts.map(d => `
        <div class="expense-row ${d.settled ? 'row-settled' : ''}">
            <input type="text" value="${d.month}" onchange="updateDebt(${d.id}, 'month', this.value)">
            <input type="number" value="${d.jeanOwes}" oninput="updateDebt(${d.id}, 'jeanOwes', this.value)">
            <input type="number" value="${d.moniqueOwes}" oninput="updateDebt(${d.id}, 'moniqueOwes', this.value)">
            <input type="checkbox" ${d.settled ? 'checked' : ''} onchange="updateDebt(${d.id}, 'settled', this.checked)">
            <button class="btn-delete-hover" onclick="deleteDebt(${d.id})">×</button>
        </div>
    `).join('');
    container.innerHTML = html;
}

function updateDebt(id, field, value) {
    const d = debts.find(x => x.id === id);
    if (d) {
        d[field] = (field === 'month' || field === 'settled') ? value : parseFloat(value || 0);
        saveData();
        if(field === 'settled') renderDebts();
    }
}

function addNewDebtMonth() {
    debts.push({ id: Date.now(), month: "Note de dette", jeanOwes: 0, moniqueOwes: 0, settled: false });
    saveData();
    renderDebts();
}

function deleteDebt(id) {
    debts = debts.filter(d => d.id !== id);
    saveData();
    renderDebts();
}

// --- TOTALS & CHART ---
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
