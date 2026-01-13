let chart1, chart2;
let categories = [
    { id: 1, name: "🏠 Loyer", jean: 450, monique: 450, recurring: true }
];
let debts = [
    { id: 1, month: "Janvier", jeanOwes: 0, moniqueOwes: 20, settled: false }
];

function renderSpending() {
    const container = document.getElementById('spendingGrid');
    container.innerHTML = '';
    categories.forEach(cat => {
        const total = (parseFloat(cat.jean) + parseFloat(cat.monique)).toFixed(2);
        container.innerHTML += `
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
                    <div class="total-tag">${total} €</div>
                    <label class="toggle">
                        <input type="checkbox" ${cat.recurring ? 'checked' : ''} onchange="updateCat(${cat.id}, 'recurring', this.checked)">
                        <span class="slider"></span>
                    </label>
                </div>
            </div>
        `;
    });
    updateDashboard();
}

function updateCat(id, field, value) {
    const cat = categories.find(c => c.id === id);
    cat[field] = value;
    renderSpending();
}

function addNewCategory() {
    categories.push({ id: Date.now(), name: "Nouvelle", jean: 0, monique: 0, recurring: false });
    renderSpending();
}

function updateDashboard() {
    let totalJean = categories.reduce((sum, c) => sum + parseFloat(c.jean || 0), 0);
    let totalMonique = categories.reduce((sum, c) => sum + parseFloat(c.monique || 0), 0);
    let total = totalJean + totalMonique;
    
    document.getElementById('jeanTotalDisplay').innerText = totalJean.toFixed(2) + " €";
    document.getElementById('moniqueTotalDisplay').innerText = totalMonique.toFixed(2) + " €";
    document.getElementById('totalDepensesDisplay').innerText = total.toFixed(2) + " €";

    const revenu = parseFloat(document.getElementById('revenuFoyer').value || 0);
    const budget = parseFloat(document.getElementById('mainBudgetTarget').value || 0);
    document.getElementById('economieDisplay').innerText = (revenu - total).toFixed(2) + " €";

    updateCharts(revenu, budget, total);
}

function updateCharts(revenu, budget, depenses) {
    const ctx1 = document.getElementById('chartRevenu').getContext('2d');
    const ctx2 = document.getElementById('chartBudget').getContext('2d');
    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();

    const config = (data, colors) => ({
        type: 'doughnut',
        data: { datasets: [{ data: data, backgroundColor: colors, borderWidth: 0 }] },
        options: { cutout: '80%', plugins: { legend: { display: false } } }
    });

    chart1 = new Chart(ctx1, config([depenses, revenu - depenses], ['#D4AF37', '#1f4e79']));
    chart2 = new Chart(ctx2, config([depenses, Math.max(0, budget - depenses)], ['#D4AF37', '#e0e0e0']));
}

window.onload = () => { renderSpending(); };
