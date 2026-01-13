let chart1;
let categories = [{ id: 1, name: "🏠 Loyer", jean: 450, monique: 450, recurring: true }];
let debts = []; // Start empty to test the button
let manualTotals = { jean: null, monique: null };

function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if (!container) return;
    container.innerHTML = categories.map(cat => `
        <div class="item-card">
            <input type="text" class="card-name" value="${cat.name}" onchange="updateCat(${cat.id}, 'name', this.value)">
            <div class="card-inputs">
                <div class="input-group"><label>JEAN</label><input type="number" value="${cat.jean}" oninput="updateCat(${cat.id}, 'jean', this.value)"></div>
                <div class="input-group"><label>MONIQUE</label><input type="number" value="${cat.monique}" oninput="updateCat(${cat.id}, 'monique', this.value)"></div>
            </div>
            <div class="card-footer">
                <span class="total-tag">${(parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2)} €</span>
                <button class="delete-btn" onclick="deleteCat(${cat.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
    updateDashboard();
}

function renderDebts() {
    const container = document.getElementById('debtGrid');
    if (!container) return;
    container.innerHTML = debts.map(d => `
        <div class="item-card" style="border-left: 5px solid var(--yellow)">
            <input type="text" class="card-name" value="${d.month}" onchange="updateDebt(${d.id}, 'month', this.value)">
            <div class="card-inputs">
                <div class="input-group"><label>JEAN DOIT</label><input type="number" value="${d.jeanOwes}" oninput="updateDebt(${d.id}, 'jeanOwes', this.value)"></div>
                <div class="input-group"><label>MONIQUE DOIT</label><input type="number" value="${d.moniqueOwes}" oninput="updateDebt(${d.id}, 'moniqueOwes', this.value)"></div>
            </div>
            <button class="delete-btn" onclick="deleteDebt(${d.id})">Supprimer</button>
        </div>
    `).join('');
}

function addNewDebtMonth() {
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    const currentMonth = months[new Date().getMonth()];
    debts.push({ id: Date.now(), month: currentMonth, jeanOwes: 0, moniqueOwes: 0 });
    renderDebts();
}

function setManualTotal(user, val) {
    manualTotals[user] = val;
    updateDashboard();
}

function updateDashboard() {
    let calcJean = categories.reduce((sum, c) => sum + parseFloat(c.jean || 0), 0);
    let calcMonique = categories.reduce((sum, c) => sum + parseFloat(c.monique || 0), 0);

    const valJean = manualTotals.jean !== null ? manualTotals.jean : calcJean;
    const valMonique = manualTotals.monique !== null ? manualTotals.monique : calcMonique;

    document.getElementById('jeanTotalDisplay').value = valJean;
    document.getElementById('moniqueTotalDisplay').value = valMonique;
    
    const total = parseFloat(valJean) + parseFloat(valMonique);
    document.getElementById('totalDepensesDisplay').innerText = total.toFixed(2) + " €";

    const revenu = parseFloat(document.getElementById('revenuFoyer').value || 0);
    document.getElementById('economieDisplay').innerText = (revenu - total).toFixed(2) + " €";

    updateCharts(revenu, total);
}

function updateCharts(revenu, depenses) {
    const ctx = document.getElementById('chartRevenu').getContext('2d');
    if (chart1) chart1.destroy();

    chart1 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [depenses, Math.max(0, revenu - depenses)],
                backgroundColor: ['#D4AF37', '#1f4e79'],
                borderWidth: 0
            }]
        },
        options: { cutout: '80%', maintainAspectRatio: false, plugins: { legend: { display: false } } }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderSpending();
    renderDebts();
});
