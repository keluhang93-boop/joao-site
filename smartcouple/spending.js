let chart1;
let categories = [
    { id: 1, name: "🏠 Loyer", jean: 450, monique: 450 },
    { id: 2, name: "⚡ Électricité", jean: 40, monique: 40 },
    { id: 3, name: "🔥 Gaz & Eau", jean: 30, monique: 30 },
    { id: 4, name: "🚗 Assurance Auto", jean: 50, monique: 50 },
    { id: 5, name: "🌐 Internet/TV", jean: 20, monique: 20 }
];

let debts = [];

function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if (!container) return;

    let html = `
        <div class="expense-list-header">
            <span>Catégorie</span>
            <span>Jean (€)</span>
            <span>Monique (€)</span>
            <span>Total</span>
            <span></span>
        </div>
    `;

    html += categories.map(cat => `
        <div class="expense-row">
            <input type="text" value="${cat.name}" onchange="updateCat(${cat.id}, 'name', this.value)">
            <input type="number" value="${cat.jean}" oninput="updateCat(${cat.id}, 'jean', this.value)">
            <input type="number" value="${cat.monique}" oninput="updateCat(${cat.id}, 'monique', this.value)">
            <span class="total-cell">${(parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2)} €</span>
            <button class="btn-delete-icon" onclick="deleteCat(${cat.id})">🗑️</button>
        </div>
    `).join('');

    container.innerHTML = html;
    calculateTotals();
}

function updateCat(id, field, value) {
    const cat = categories.find(c => c.id === id);
    if (cat) {
        cat[field] = (field === 'name') ? value : parseFloat(value || 0);
    }
    // We don't re-render everything while typing (to keep cursor focus), 
    // just update the values in the background and the dashboard.
    calculateTotals();
    
    // Update the specific row's total cell without re-rendering the whole list
    const rows = document.querySelectorAll('.expense-row');
    const index = categories.findIndex(c => c.id === id);
    if (index !== -1 && rows[index]) {
        const totalCell = rows[index].querySelector('.total-cell');
        totalCell.innerText = (parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2) + " €";
    }
}

function calculateTotals() {
    const totalJean = categories.reduce((sum, c) => sum + parseFloat(c.jean || 0), 0);
    const totalMonique = categories.reduce((sum, c) => sum + parseFloat(c.monique || 0), 0);
    const totalGlobal = totalJean + totalMonique;

    // Update Top Cards
    document.getElementById('jeanTotalDisplay').value = totalJean.toFixed(2);
    document.getElementById('moniqueTotalDisplay').value = totalMonique.toFixed(2);
    
    // Update Performance Section
    document.getElementById('totalDepensesDisplay').innerText = totalGlobal.toFixed(2) + " €";
    
    const revenu = parseFloat(document.getElementById('revenuFoyer').value || 0);
    document.getElementById('economieDisplay').innerText = (revenu - totalGlobal).toFixed(2) + " €";

    updateCharts(revenu, totalGlobal);
}

function addNewCategory() {
    categories.push({ id: Date.now(), name: "Nouvelle ligne", jean: 0, monique: 0 });
    renderSpending(); // Re-render to show the new row
}

function deleteCat(id) {
    categories = categories.filter(c => c.id !== id);
    renderSpending();
}

// Ensure the Nouveau Mois logic works
function addNewDebtMonth() {
    debts.push({ id: Date.now(), month: "Mois", jeanOwes: 0, moniqueOwes: 0 });
    renderDebts();
}

function renderDebts() {
    const container = document.getElementById('debtGrid');
    if (!container) return;
    container.innerHTML = debts.map(d => `
        <div class="expense-row" style="border-left: 4px solid #D4AF37">
            <input type="text" value="${d.month}" oninput="d.month = this.value">
            <input type="number" placeholder="Jean doit" oninput="d.jeanOwes = this.value">
            <input type="number" placeholder="Monique doit" oninput="d.moniqueOwes = this.value">
            <span></span>
            <button class="btn-delete-icon" onclick="deleteDebt(${d.id})">🗑️</button>
        </div>
    `).join('');
}

function deleteDebt(id) {
    debts = debts.filter(d => d.id !== id);
    renderDebts();
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
});
