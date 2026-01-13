/* --- INITIAL DATA --- */
let categories = [
    { id: 1, name: 'Loyer / Hypothèque', jean: 800, monique: 0, settled: false, recurring: true },
    { id: 2, name: 'Courses Alimentaires', jean: 150, monique: 150, settled: false, recurring: false }
];

document.addEventListener('DOMContentLoaded', () => {
    renderSpending();
});

/* --- RENDER THE LIST --- */
function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if (!container) return;

    // Header with 7 columns
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

    // Rows
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

/* --- UPDATE LOGIC --- */
function updateCat(id, field, value) {
    const cat = categories.find(c => c.id === id);
    if (cat) {
        // Handle numbers vs booleans vs text
        if (field === 'settled' || field === 'recurring') {
            cat[field] = value;
            renderSpending(); // Refresh to show gray background or line-through
        } else if (field === 'name') {
            cat[field] = value;
        } else {
            cat[field] = parseFloat(value || 0);
            calculateTotals(); // Just update numbers for speed
        }
    }
}

/* --- CALCULATION LOGIC --- */
function calculateTotals() {
    let jeanTotal = 0;
    let moniqueTotal = 0;

    categories.forEach(cat => {
        jeanTotal += parseFloat(cat.jean || 0);
        moniqueTotal += parseFloat(cat.monique || 0);
    });

    // Update the Dashboard Boxes
    const jeanDisplay = document.getElementById('jeanTotalDisplay');
    const moniqueDisplay = document.getElementById('moniqueTotalDisplay');
    
    if (jeanDisplay) jeanDisplay.value = jeanTotal.toFixed(2);
    if (moniqueDisplay) moniqueDisplay.value = moniqueTotal.toFixed(2);

    // Update the Performance Section
    const totalExpenses = jeanTotal + moniqueTotal;
    const expenseText = document.querySelector('.stats-side p strong'); // "Dépenses Actuelles"
    if (expenseText) expenseText.innerText = totalExpenses.toFixed(2) + " €";
}

function deleteCat(id) {
    categories = categories.filter(c => c.id !== id);
    renderSpending();
}

function addExpense() {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    categories.push({ id: newId, name: 'Nouvelle dépense', jean: 0, monique: 0, settled: false, recurring: false });
    renderSpending();
}
