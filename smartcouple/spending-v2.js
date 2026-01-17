// Add this at the very top of your file to ensure it's defined
// Use the existing chart1 or initialize it if it doesn't exist
if (typeof chart1 === 'undefined') {
    var chart1 = null; 
}

const defaultExamples = [
    { id: 1, name: "🏠 Loyer", jean: 450, monique: 450, settled: false, recurring: true },
    { id: 2, name: "⚡ Électricité", jean: 40, monique: 40, settled: false, recurring: true },
    { id: 3, name: "🔥 Gaz & Eau", jean: 35, monique: 35, settled: false, recurring: true },
    { id: 4, name: "🌐 Internet & Mobile", jean: 25, monique: 25, settled: false, recurring: true },
    { id: 5, name: "🛡️ Assurance Habitation", jean: 15, monique: 15, settled: false, recurring: true },
    { id: 6, name: "🚗 Assurance Auto", jean: 45, monique: 45, settled: false, recurring: true }
];

let allMonthsData = JSON.parse(localStorage.getItem('smartSpending_history')) || {};
let currentMonth = localStorage.getItem('smartSpending_currentView') || new Date().toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

if (Object.keys(allMonthsData).length === 0) {
    allMonthsData[currentMonth] = [...defaultExamples];
}

let categories = allMonthsData[currentMonth];

document.addEventListener('DOMContentLoaded', () => {
    initMonthSelector();
    renderSpending();
});

// --- RESET TO DEFAULTS ---
function resetToDefaults() {
    if(confirm("Voulez-vous réinitialiser ce mois avec les exemples par défaut ? (Cela effacera vos données actuelles)")) {
        categories = JSON.parse(JSON.stringify(defaultExamples)); // Deep copy
        saveData();
        renderSpending();
    }
}

// --- DELETE CURRENT MONTH ---
function deleteCurrentMonth() {
    const months = Object.keys(allMonthsData);
    if (months.length <= 1) {
        alert("Vous ne pouvez pas supprimer le seul mois restant.");
        return;
    }
    if (confirm(`Supprimer définitivement le mois de ${currentMonth} ?`)) {
        delete allMonthsData[currentMonth];
        currentMonth = Object.keys(allMonthsData)[0];
        categories = allMonthsData[currentMonth];
        localStorage.setItem('smartSpending_currentView', currentMonth);
        saveData();
        initMonthSelector();
        renderSpending();
    }
}

// --- FULLY AUTOMATIC NEXT MONTH ---
// Corrected Date Logic (fixed the getMonth typo)
function startNewMonth() {
    const monthNames = Object.keys(allMonthsData);
    const lastMonthString = monthNames[monthNames.length - 1];
    
    const monthsFr = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    let [name, year] = lastMonthString.split(' ');
    let monthIdx = monthsFr.indexOf(name.toLowerCase());
    
    let date = new Date(parseInt(year), monthIdx, 1);
    date.setMonth(date.getMonth() + 1); // FIXED: getMonth()
    
    const nextMonthName = date.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });

    if (confirm("Passer au mois suivant : " + nextMonthName + " ?")) {
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
}

// --- REUSE PREVIOUS RENDER/UPDATE FUNCTIONS ---
function initMonthSelector() {
    const selector = document.getElementById('monthSelector');
    if (!selector) return;
    selector.innerHTML = Object.keys(allMonthsData).map(m => 
        `<option value="${m}" ${m === currentMonth ? 'selected' : ''}>${m}</option>`
    ).join('');
}

function changeMonth(selectedMonth) {
    currentMonth = selectedMonth;
    localStorage.setItem('smartSpending_currentView', currentMonth);
    categories = allMonthsData[currentMonth];
    renderSpending();
}

function saveData() {
    allMonthsData[currentMonth] = categories;
    localStorage.setItem('smartSpending_history', JSON.stringify(allMonthsData));
}

function renderSpending() {
    const container = document.getElementById('spendingGrid');
    if (!container) return;
    let html = `<div class="expense-list-header"><span>Catégorie</span><span>Jean (€)</span><span>Monique (€)</span><span>Total</span><span>Payé</span><span>Récur.</span><span></span></div>`;
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
        cat[field] = (field === 'name') ? value : parseFloat(value || 0);
        saveData();
        calculateTotals();
        const rows = document.querySelectorAll('#spendingGrid .expense-row');
        const index = categories.findIndex(c => c.id === id);
        if (rows[index]) {
            rows[index].querySelector('.total-cell').innerText = (parseFloat(cat.jean||0) + parseFloat(cat.monique||0)).toFixed(2) + " €";
        }
    }
}

function addNewCategory() {
    categories.push({ id: Date.now(), name: "Nouvelle dépense", jean: 0, monique: 0, settled: false, recurring: false });
    saveData();
    renderSpending();
}

function deleteCat(id) {
    categories = categories.filter(c => c.id !== id);
    saveData();
    renderSpending();
}

function calculateTotals() {
    // Only run if categories exists
    if (!categories) return;

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
        
        // Safety check: Only update chart if Chart.js is loaded
        if (typeof Chart !== 'undefined') {
            updateCharts(revenu, totalGlobal);
        }
    }
}

function updateCharts(revenu, totalDepenses) {
    const canvas = document.getElementById('chartRevenu');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Destroy previous chart instance safely
    if (chart1 instanceof Chart) {
        chart1.destroy();
    }
    
    const epargne = Math.max(0, revenu - totalDepenses);
    
    chart1 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Dépenses', 'Épargne'],
            datasets: [{ 
                data: [totalDepenses, epargne], 
                backgroundColor: ['#D4AF37', '#1f4e79'], 
                borderWidth: 0 
            }]
        },
        options: { 
            cutout: '80%', 
            maintainAspectRatio: false, 
            plugins: { legend: { display: false } } 
        }
    });
}

function showView(viewId, btnElement) {
    // Hide all views
    document.querySelectorAll('.dashboard-view').forEach(view => {
        view.style.display = 'none';
    });

    // Show the selected view
    document.getElementById(viewId).style.display = 'block';

    // Update active button styling
    document.querySelectorAll('.sub-nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    btnElement.classList.add('active');
    
    // If showing savings, refresh the chart to ensure it renders correctly
    if(viewId === 'view-savings') {
        calculateTotals();
    }
}

let groceryItems = JSON.parse(localStorage.getItem('smartSpending_groceries')) || [
    { id: 1, name: "Riz", price: 1.99, unit: "500g", qty: 1 },
    { id: 2, name: "Bananes (6x)", price: 2.49, unit: "lot", qty: 1 },
    { id: 3, name: "Thon (boîte)", price: 2.49, unit: "180g", qty: 1 }
];

// Initialize the view when switching
function showView(viewId, btnElement) {
    document.querySelectorAll('.dashboard-view').forEach(v => v.style.display = 'none');
    document.getElementById(viewId).style.display = 'block';
    document.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
    btnElement.classList.add('active');

    if (viewId === 'view-grocery') renderGroceries();
    if (viewId === 'view-savings') calculateTotals();
}

function renderGroceries() {
    const container = document.getElementById('groceryGrid');
    if (!container) return;

    let html = `
        <div class="grocery-header">
            <span>Produit</span>
            <span>Prix (€)</span>
            <span>Unité/Poids</span>
            <span>Quantité</span>
            <span></span>
        </div>`;
    
    html += groceryItems.map(item => `
        <div class="grocery-row">
            <div class="input-wrapper-group">
                <label class="mobile-only-label">Produit</label>
                <input type="text" value="${item.name}" placeholder="Nom du produit" onchange="updateGrocery(${item.id}, 'name', this.value)">
            </div>
            
            <div class="input-wrapper-group">
                <label class="mobile-only-label">Prix (€)</label>
                <input type="number" step="0.01" value="${item.price}" oninput="updateGrocery(${item.id}, 'price', this.value)">
            </div>

            <div class="input-wrapper-group">
                <label class="mobile-only-label">Unité/Poids</label>
                <input type="text" value="${item.unit}" placeholder="ex: 500g" onchange="updateGrocery(${item.id}, 'unit', this.value)">
            </div>

            <div class="input-wrapper-group">
                <label class="mobile-only-label">Quantité</label>
                <input type="number" value="${item.qty}" oninput="updateGrocery(${item.id}, 'qty', this.value)">
            </div>

            <button class="btn-delete-grocery" onclick="deleteGrocery(${item.id})" title="Supprimer">×</button>
        </div>
    `).join('');

    container.innerHTML = html;
    calculateGroceryTotal();
}

function updateGrocery(id, field, value) {
    const item = groceryItems.find(i => i.id === id);
    if (!item) return;
    item[field] = (field === 'name' || field === 'unit') ? value : parseFloat(value || 0);
    localStorage.setItem('smartSpending_groceries', JSON.stringify(groceryItems));
    calculateGroceryTotal();
}

function addNewGroceryItem() {
    groceryItems.push({ id: Date.now(), name: "Nouveau produit", price: 0, unit: "unité", qty: 1 });
    renderGroceries();
}

function deleteGrocery(id) {
    groceryItems = groceryItems.filter(i => i.id !== id);
    localStorage.setItem('smartSpending_groceries', JSON.stringify(groceryItems));
    renderGroceries();
}

function calculateGroceryTotal() {
    const total = groceryItems.reduce((sum, item) => {
        const price = parseFloat(String(item.price).replace(',', '.')) || 0;
        const qty = parseFloat(item.qty) || 0;
        return sum + (price * qty);
    }, 0);
    
    const display = document.getElementById('groceryTotal');
    if (display) {
        display.innerText = total.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) + " €";
    }
}
