let chart1, chart2;
let categories = [
    { id: 1, name: "🏠 Loyer", jean: 450, monique: 450, recurring: true }
];
// This was missing logic!
let debts = [
    { id: 1, month: "Janvier", jeanOwes: 0, moniqueOwes: 20, settled: false }
];

function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if(!container) return;
    container.innerHTML = '';
    categories.forEach(cat => {
        const total = (parseFloat(cat.jean || 0) + parseFloat(cat.monique || 0)).toFixed(2);
        container.innerHTML += `
            <div class="item-card">
                <button class="delete-btn" onclick="deleteCat(${cat.id})">&times;</button>
                <input type="text" class="card-name" value="${cat.name}" onchange="updateCat(${cat.id}, 'name', this.value)">
                <div class="card-inputs">
                    <div class="input-group"><label>JEAN</label><input type="number" value="${cat.jean}" oninput="updateCat(${cat.id}, 'jean', this.value)"></div>
                    <div class="input-group"><label>MONIQUE</label><input type="number" value="${cat.monique}" oninput="updateCat(${cat.id}, 'monique', this.value)"></div>
                </div>
                <div class="card-footer">
                    <span class="total-tag">${total} €</span>
                    <label class="toggle"><input type="checkbox" ${cat.recurring ? 'checked' : ''} onchange="updateCat(${cat.id}, 'recurring', this.checked)"><span class="slider"></span></label>
                </div>
            </div>`;
    });
    updateDashboard();
}

// NEW: Debt Rendering Logic
function renderDebts() {
    const container = document.getElementById('debtGrid');
    if(!container) return;
    container.innerHTML = '';
    debts.forEach(d => {
        container.innerHTML += `
            <div class="item-card border-gold">
                <input type="text" class="card-name" value="${d.month}" onchange="updateDebt(${d.id}, 'month', this.value)">
                <div class="card-inputs">
                    <div class="input-group"><label>JEAN DOIT</label><input type="number" value="${d.jeanOwes}" oninput="updateDebt(${d.id}, 'jeanOwes', this.value)"></div>
                    <div class="input-group"><label>MONIQUE DOIT</label><input type="number" value="${d.moniqueOwes}" oninput="updateDebt(${d.id}, 'moniqueOwes', this.value)"></div>
                </div>
                <div class="card-footer">
                    <span class="status-text">${d.settled ? 'Réglé ✅' : 'En attente ⏳'}</span>
                    <input type="checkbox" style="transform:scale(1.3)" ${d.settled ? 'checked' : ''} onchange="updateDebt(${d.id}, 'settled', this.checked)">
                </div>
                <button class="delete-btn" onclick="deleteDebt(${d.id})">&times;</button>
            </div>`;
    });
}

function updateDebt(id, field, value) {
    const d = debts.find(x => x.id === id);
    if(d) d[field] = value;
    renderDebts();
}

function addNewDebtMonth() {
    debts.push({ id: Date.now(), month: "Nouveau Mois", jeanOwes: 0, moniqueOwes: 0, settled: false });
    renderDebts();
}

function deleteDebt(id) {
    debts = debts.filter(d => d.id !== id);
    renderDebts();
}

// Update updateCharts to handle specific sizes
function updateCharts(revenu, budget, depenses) {
    const ctx1 = document.getElementById('chartRevenu').getContext('2d');
    const ctx2 = document.getElementById('chartBudget').getContext('2d');
    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();

    const config = (data, colors) => ({
        type: 'doughnut',
        data: { datasets: [{ data: data, backgroundColor: colors, borderWidth: 0 }] },
        options: { cutout: '75%', responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });

    chart1 = new Chart(ctx1, config([depenses, Math.max(0, revenu - depenses)], ['#D4AF37', '#1f4e79']));
    chart2 = new Chart(ctx2, config([depenses, Math.max(0, budget - depenses)], ['#D4AF37', '#e2e8f0']));
}

// Initial Call
window.onload = () => { 
    renderSpending(); 
    renderDebts(); 
};
