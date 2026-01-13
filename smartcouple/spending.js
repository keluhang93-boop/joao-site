let chart1;
let categories = [
    { id: 1, name: "🏠 Loyer", jean: 450, monique: 450, settled: false },
    { id: 2, name: "⚡ Électricité", jean: 40, monique: 40, settled: false },
    { id: 3, name: "🔥 Gaz & Eau", jean: 30, monique: 30, settled: false },
    { id: 4, name: "🚗 Assurance Auto", jean: 50, monique: 50, settled: false },
    { id: 5, name: "🌐 Internet/TV", jean: 20, monique: 20, settled: false }
];

let debts = [
    { id: Date.now(), month: "Exemple: Janvier", jeanOwes: 10, moniqueOwes: 0, settled: false }
];
let manualTotals = { jean: null, monique: null };

// --- RENDERING SPENDING LIST ---
function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if (!container) return;

    let html = `
        <div class="expense-list-header">
            <span>Catégorie</span>
            <span>Jean (€)</span>
            <span>Monique (€)</span>
            <span>Total</span>
            <span>Règlement</span>
            <span></span>
        </div>
    `;

    html += categories.map(cat => `
        <div class="expense-row ${cat.settled ? 'row-settled' : ''}">
            <input type="text" value="${cat.name}" onchange="updateCat(${cat.id}, 'name', this.value)">
            <input type="number" value="${cat.jean}" oninput="updateCat(${cat.id}, 'jean', this.value)">
            <input type="number" value="${cat.monique}" oninput="updateCat(${cat.id}, 'monique', this.value)">
            <span class="total-cell">${(parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2)} €</span>
            <div class="settle-col">
                <input type="checkbox" ${cat.settled ? 'checked' : ''} onchange="updateCat(${cat.id}, 'settled', this.checked)">
            </div>
            <button class="btn-delete-hover" onclick="deleteCat(${cat.id})">×</button>
        </div>
    `).join('');

    container.innerHTML = html;
    calculateTotals();
}

function updateCat(id, field, value) {
    const cat = categories.find(c => c.id === id);
    if (cat) {
        // Logic for checkboxes vs numbers
        cat[field] = (field === 'name' || field === 'settled' || field === 'recurring') ? value : parseFloat(value || 0);
        
        // RE-RENDER is required here to apply the .row-recurring or .row-settled CSS classes
        if(field === 'settled' || field === 'recurring') {
            renderSpending(); 
        } else {
            // Just update the totals without full re-render for speed
            calculateTotals();
        }
    }
}
    
    // Only update the total cell and dashboard to keep the keyboard open on mobile
    const rows = document.querySelectorAll('#spendingGrid .expense-row');
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1 && rows[index]) {
        const totalCell = rows[index].querySelector('.total-cell');
        if(totalCell) totalCell.innerText = (parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2) + " €";
    }
    
    // If we toggle "Settled", we re-render to apply the CSS gray-out effect
    if(field === 'settled') renderSpending();
    
    calculateTotals();
}

// --- DEBT LOGIC ---
function renderDebts() {
    const container = document.getElementById('debtGrid');
    if (!container) return;
    
    let html = `
        <div class="expense-list-header">
            <span>Mois</span>
            <span>Jean doit Monique</span>
            <span>Monique doit Jean</span>
            <span>Règlement</span>
            <span></span>
        </div>
    `;

    html += debts.map(d => `
        <div class="expense-row ${d.settled ? 'row-settled' : ''}">
            <input type="text" value="${d.month}" onchange="updateDebt(${d.id}, 'month', this.value)">
            <input type="number" value="${d.jeanOwes}" oninput="updateDebt(${d.id}, 'jeanOwes', this.value)">
            <input type="number" value="${d.moniqueOwes}" oninput="updateDebt(${d.id}, 'moniqueOwes', this.value)">
            <div class="settle-col">
                <input type="checkbox" ${d.settled ? 'checked' : ''} onchange="updateDebt(${d.id}, 'settled', this.checked)">
            </div>
            <button class="btn-delete-hover" onclick="deleteDebt(${d.id})">×</button>
        </div>
    `).join('');
    container.innerHTML = html;
}

function updateDebt(id, field, value) {
    const d = debts.find(x => x.id === id);
    if (d) {
        d[field] = (field === 'month' || field === 'settled') ? value : parseFloat(value || 0);
        if(field === 'settled') renderDebts();
    }
}

function addNewCategory() {
    categories.push({ id: Date.now(), name: "Nouvelle ligne", jean: 0, monique: 0, settled: false });
    renderSpending();
}

function deleteCat(id) {
    categories = categories.filter(c => c.id !== id);
    renderSpending();
}

function addNewDebtMonth() {
    debts.push({ id: Date.now(), month: "Nouveau Mois", jeanOwes: 0, moniqueOwes: 0, settled: false });
    renderDebts();
}

function deleteDebt(id) {
    debts = debts.filter(d => d.id !== id);
    renderDebts();
}

// --- CALCULATIONS & DASHBOARD ---
function setManualTotal(user, val) {
    manualTotals[user] = val === "" ? null : parseFloat(val);
    calculateTotals();
}

function calculateTotals() {
    let calcJean = categories.reduce((sum, c) => sum + parseFloat(c.jean || 0), 0);
    let calcMonique = categories.reduce((sum, c) => sum + parseFloat(c.monique || 0), 0);

    const valJean = manualTotals.jean !== null ? manualTotals.jean : calcJean;
    const valMonique = manualTotals.monique !== null ? manualTotals.monique : calcMonique;

    const jeanDisp = document.getElementById('jeanTotalDisplay');
    const moniqueDisp = document.getElementById('moniqueTotalDisplay');
    if(jeanDisp) jeanDisp.value = valJean.toFixed(2);
    if(moniqueDisp) moniqueDisp.value = valMonique.toFixed(2);
    
    const totalGlobal = valJean + valMonique;
    const totalDisp = document.getElementById('totalDepensesDisplay');
    if(totalDisp) totalDisp.innerText = totalGlobal.toFixed(2) + " €";
    
    const revInput = document.getElementById('revenuFoyer');
    const ecoDisp = document.getElementById('economieDisplay');
    if(revInput && ecoDisp) {
        const revenu = parseFloat(revInput.value || 0);
        ecoDisp.innerText = (revenu - totalGlobal).toFixed(2) + " €";
        updateCharts(revenu, totalGlobal);
    }
}

function updateDashboard() { calculateTotals(); }

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
            datasets: [{
                data: [totalDepenses, epargne],
                backgroundColor: ['#D4AF37', '#1f4e79'],
                hoverOffset: 4,
                borderWidth: 0
            }]
        },
        options: {
            cutout: '80%',
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // <--- THIS FIXES THE DOUBLE LABELS
                },
                tooltip: {
                    callbacks: {
                        label: (item) => ` ${item.label}: ${item.raw.toFixed(2)} €`
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderSpending();
    renderDebts();
});
