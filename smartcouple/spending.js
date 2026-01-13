let chart1;
// Load data from LocalStorage or use defaults if empty
let categories = JSON.parse(localStorage.getItem('smartSpending_cats')) || [
    { id: 1, name: "🏠 Loyer", jean: 450, monique: 450, settled: false, recurring: true },
    { id: 2, name: "⚡ Électricité", jean: 40, monique: 40, settled: false, recurring: true }
];

let debts = JSON.parse(localStorage.getItem('smartSpending_debts')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderSpending();
    renderDebts();
    calculateTotals();
});

// --- SAVE TO LOCAL STORAGE ---
function saveData() {
    localStorage.setItem('smartSpending_cats', JSON.stringify(categories));
    localStorage.setItem('smartSpending_debts', JSON.stringify(debts));
}

// --- NEW MONTH LOGIC ---
function startNewMonth() {
    if (confirm("Commencer un nouveau mois ? Cela supprimera les dépenses non-récurrentes et décochera toutes les cases 'Payé'.")) {
        // 1. Keep only recurring items
        // 2. Reset the "settled" status to false for the new month
        categories = categories
            .filter(cat => cat.recurring === true)
            .map(cat => ({ ...cat, settled: false }));

        saveData();
        renderSpending();
        alert("Nouveau mois prêt ! Les dépenses récurrentes ont été conservées.");
    }
}

// --- RENDER SPENDING ---
function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if (!container) return;

    let html = `
        <div class="expense-list-header">
            <span>Catégorie</span>
            <span>Jean (€)</span>
            <span>Monique (€)</span>
            <span>Total</span>
            <span>Payé</span>
            <span>Récur.</span>
            <span></span>
        </div>
    `;

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
    if (cat) {
        if (field === 'settled' || field === 'recurring') {
            cat[field] = value;
            saveData();
            renderSpending(); 
        } else {
            cat[field] = field === 'name' ? value : parseFloat(value || 0);
            
            // Live update total cell without re-rendering (prevents cursor jump)
            const rows = document.querySelectorAll('#spendingGrid .expense-row');
            const index = categories.findIndex(c => c.id === id);
            if (rows[index]) {
                const totalCell = rows[index].querySelector('.total-cell');
                if (totalCell) {
                    totalCell.innerText = (parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2) + " €";
                }
            }
            saveData();
            calculateTotals();
        }
    }
}

// Shortcut for the HTML input
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

// --- DEBTS SECTION ---
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
    debts.push({ id: Date.now(), month: "Nouveau Mois", jeanOwes: 0, moniqueOwes: 0, settled: false });
    saveData();
    renderDebts();
}

function deleteDebt(id) {
    debts = debts.filter(d => d.id !== id);
    saveData();
    renderDebts();
}

// --- CALCULATIONS & CHART ---
function calculateTotals() {
    let valJean = categories.reduce((sum, c) => sum + parseFloat(c.jean || 0), 0);
    let valMonique = categories.reduce((sum, c) => sum + parseFloat(c.monique || 0), 0);

    const jeanDisp = document.getElementById('jeanTotalDisplay');
    const moniqueDisp = document.getElementById('moniqueTotalDisplay');
    if(jeanDisp) jeanDisp.value = valJean.toFixed(2);
    if(moniqueDisp) moniqueDisp.value = valMonique.toFixed(2);

    const totalGlobal = valJean + valMonique;
    const depDisplay = document.getElementById('totalDepensesDisplay');
    if(depDisplay) depDisplay.innerText = totalGlobal.toFixed(2) + " €";

    const revInput = document.getElementById('revenuFoyer');
    const ecoDisp = document.getElementById('economieDisplay');
    if(revInput && ecoDisp) {
        const revenu = parseFloat(revInput.value || 0);
        const economie = revenu - totalGlobal;
        ecoDisp.innerText = economie.toFixed(2) + " €";
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
