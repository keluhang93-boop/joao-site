let chart1;
// Added your requested categories here
let categories = [
    { id: 1, name: "🏠 Loyer", jean: 450, monique: 450 },
    { id: 2, name: "⚡ Électricité", jean: 40, monique: 40 },
    { id: 3, name: "🔥 Gaz & Eau", jean: 30, monique: 30 },
    { id: 4, name: "🚗 Assurance Auto", jean: 50, monique: 50 },
    { id: 5, name: "🌐 Internet/TV", jean: 20, monique: 20 }
];
let debts = [];
let manualTotals = { jean: null, monique: null };

function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if (!container) return;
    
    container.innerHTML = categories.map(cat => `
        <div class="item-card">
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
                <span class="total-tag">Total: ${(parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2)} €</span>
                <button class="delete-btn" onclick="deleteCat(${cat.id})">Supprimer</button>
            </div>
        </div>
    `).join('');
    updateDashboard();
}

// Fixed Add Function
function addNewCategory() {
    const newId = Date.now();
    categories.push({ id: newId, name: "Nouvelle catégorie", jean: 0, monique: 0 });
    renderSpending();
}

// Fixed Delete Function
function deleteCat(id) {
    categories = categories.filter(c => c.id !== id);
    renderSpending();
}

function updateCat(id, field, value) {
    const cat = categories.find(c => c.id === id);
    if (cat) {
        cat[field] = field === 'name' ? value : parseFloat(value || 0);
    }
    renderSpending();
}

// ... (keep your existing updateDashboard and updateCharts functions) ...

document.addEventListener('DOMContentLoaded', () => {
    renderSpending();
    renderDebts();
});
