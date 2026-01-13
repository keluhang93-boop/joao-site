let chart1, chart2;
let categories = [{ id: 1, name: "🏠 Loyer", jean: 450, monique: 450, recurring: true }];
let debts = [{ id: 1, month: "Janvier", jeanOwes: 0, moniqueOwes: 20, settled: false }];

// State to track if user manually edited the top totals
let manualTotals = { jean: null, monique: null };

function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if (!container) return;
    container.innerHTML = categories.map(cat => `
        <div class="item-card">
            <button class="delete-btn" onclick="deleteCat(${cat.id})">&times;</button>
            <input type="text" class="card-name" value="${cat.name}" onchange="updateCat(${cat.id}, 'name', this.value)">
            <div class="card-inputs">
                <div class="input-group">
                    <label>JEAN</label>
                    <input type="number" value="${cat.jean}" oninput="updateCat(${cat.id}, 'jean', this.value)">
                </div>
                <div class="input-group">
                    <label>MONIQUE</label>
                    <input type="number" value="${cat.monique}" oninput="updateCat(${cat.id}, 'monique', this.value)">
                </div>
            </div>
            <div class="card-footer">
                <span class="total-tag">${(parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2)} €</span>
                <label class="toggle">
                    <input type="checkbox" ${cat.recurring ? 'checked' : ''} onchange="updateCat(${cat.id}, 'recurring', this.checked)">
                    <span class="slider"></span>
                </label>
            </div>
        </div>
    `).join('');
    updateDashboard();
}

function renderDebts() {
    const container = document.getElementById('debtGrid');
    if (!container) return;
    container.innerHTML = debts.map(d => `
        <div class="item-card" style="border-left: 4px solid var(--yellow)">
            <input type="text" class="card-name" value="${d.month}" onchange="updateDebt(${d.id}, 'month', this.value)">
            <div class="card-inputs">
                <div class="input-group"><label>JEAN DOIT</label><input type="number" value="${d.jeanOwes}" oninput="updateDebt(${d.id}, 'jeanOwes', this.value)"></div>
                <div class="input-group"><label>MONIQUE DOIT</label><input type="number" value="${d.moniqueOwes}" oninput="updateDebt(${d.id}, 'moniqueOwes', this.value)"></div>
            </div>
            <div class="card-footer">
                <span class="status-text">${d.settled ? 'RÉGLÉ ✅' : 'ATTENTE ⏳'}</span>
                <input type="checkbox" ${d.settled ? 'checked' : ''} onchange="updateDebt(${d.id}, 'settled', this.checked)">
            </div>
            <button class="delete-btn" onclick="deleteDebt(${d.id})">&times;</button>
        </div>
    `).join('');
}

function updateDashboard() {
    let calcJean = categories.reduce((sum, c) => sum + parseFloat(c.jean || 0), 0);
    let calcMonique = categories.reduce((sum, c) => sum + parseFloat(c.monique || 0), 0);

    // If no manual edit, use calculated. If edited, use manual value.
    const displayJean = manualTotals.jean !== null ? manualTotals.jean : calcJean;
    const displayMonique = manualTotals.monique !== null ? manualTotals.monique : calcMonique;

    document.getElementById('jeanTotalDisplay').value = displayJean;
    document.getElementById('moniqueTotalDisplay').value = displayMonique;
    
    const total = parseFloat(displayJean) + parseFloat(displayMonique);
    document.getElementById('totalDepensesDisplay').innerText = total.toFixed(2) + " €";

    const revenu = parseFloat(document.getElementById('revenuFoyer').value || 0);
    const budget = parseFloat(document.getElementById('mainBudgetTarget').value || 0);
    document.getElementById('economieDisplay').innerText = (revenu - total).toFixed(2) + " €";

    updateCharts(revenu, budget, total);
}

// Logic to let you edit the top totals
function setManualTotal(user, val) {
    manualTotals[user] = val;
    updateDashboard();
}

function updateCharts(revenu, budget, depenses) {
    const canvas1 = document.getElementById('chartRevenu');
    const canvas2 = document.getElementById('chartBudget');
    if (!canvas1 || !canvas2) return;

    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();

    const opt = { cutout: '80%', maintainAspectRatio: false, plugins: { legend: { display: false } } };

    chart1 = new Chart(canvas1.getContext('2d'), {
        type: 'doughnut',
        data: { datasets: [{ data: [depenses, Math.max(0, revenu - depenses)], backgroundColor: ['#D4AF37', '#1f4e79'], borderWidth: 0 }] },
        options: opt
    });

    chart2 = new Chart(canvas2.getContext('2d'), {
        type: 'doughnut',
        data: { datasets: [{ data: [depenses, Math.max(0, budget - depenses)], backgroundColor: ['#D4AF37', '#e2e8f0'], borderWidth: 0 }] },
        options: opt
    });
}

// Bug Fix: Initialization
document.addEventListener('DOMContentLoaded', () => {
    renderSpending();
    renderDebts();
});
