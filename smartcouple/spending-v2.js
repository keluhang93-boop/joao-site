// Add this at the very top of your file to ensure it's defined
// Use the existing chart1 or initialize it if it doesn't exist
if (typeof chart1 === 'undefined') {
    var chart1 = null; 
}

const defaultExamples = [
    { id: 1, name: "Loyer", jean: 450, monique: 450, settled: false, recurring: true },
    { id: 2, name: "Électricité", jean: 40, monique: 40, settled: false, recurring: true },
    { id: 3, name: "Gaz & Eau", jean: 35, monique: 35, settled: false, recurring: true },
    { id: 4, name: "Internet & Mobile", jean: 25, monique: 25, settled: false, recurring: true },
    { id: 5, name: "Assurance Habitation", jean: 15, monique: 15, settled: false, recurring: true },
    { id: 6, name: "Assurance Auto", jean: 45, monique: 45, settled: false, recurring: true }
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

// Function to get the theme colors safely
function getThemeColors() {
    const isPink = (appSettings.theme === 'pink');
    return {
        primary: isPink ? '#db2777' : '#1f4e79',   // Pink or Navy
        secondary: isPink ? '#f472b6' : '#D4AF37'  // Light Pink or Gold
    };
}

function updateCharts(revenu, totalDepenses) {
    const canvas = document.getElementById('chartRevenu');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (chart1 instanceof Chart) chart1.destroy();
    
    // THE FIX: Check for Pink, Dark, or Default (Blue)
    let colorPrimary, colorSecondary;
    const bodyClass = document.body.classList;

    if (bodyClass.contains('theme-pink')) {
        colorPrimary = '#db2777';   // Pink
        colorSecondary = '#f472b6'; // Light Pink
    } else if (bodyClass.contains('theme-dark')) {
        colorPrimary = '#1a1c23';   // Charcoal (Noir Luxe)
        colorSecondary = '#D4AF37'; // Gold
    } else {
        colorPrimary = '#1f4e79';   // Navy Blue (Classic)
        colorSecondary = '#D4AF37'; // Gold
    }

    const epargne = Math.max(0, revenu - totalDepenses);
    
    chart1 = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Dépenses', 'Épargne'],
            datasets: [{ 
                data: [totalDepenses, epargne], 
                backgroundColor: [colorSecondary, colorPrimary], 
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

let groceryItems = JSON.parse(localStorage.getItem('smartSpending_groceries')) || [
    { id: 1, name: "Riz", price: 1.99, unit: "500g", qty: 1 },
    { id: 2, name: "Bananes (6x)", price: 2.49, unit: "lot", qty: 1 },
    { id: 3, name: "Thon (boîte)", price: 2.49, unit: "180g", qty: 1 }
];

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

function showView(viewId, btnElement) {
    // Masquer tout
    document.querySelectorAll('.dashboard-view').forEach(v => v.style.display = 'none');

    // Afficher la cible
    const target = document.getElementById(viewId);
    if (target) target.style.display = 'block';

    // Boutons actifs
    document.querySelectorAll('.sub-nav-btn').forEach(b => b.classList.remove('active'));
    if (btnElement) btnElement.classList.add('active');

    // --- LOGIQUE DE CHARGEMENT ---
    if (viewId === 'view-spending') renderSpending();
    if (viewId === 'view-grocery') renderGroceries();
    if (viewId === 'view-debts') renderDebts();
    
    // C'EST CETTE LIGNE QUI DÉBLOQUE L'AFFICHAGE :
    if (viewId === 'view-analysis') renderAnalysis(); 
}

// Fonction pour fermer la notice avec la croix
function closeRelationshipNotice() {
    const notice = document.getElementById('relationshipNotice');
    if (notice) {
        // Option A: On cache simplement
        notice.style.display = 'none';
        
        // Option B (Mieux): On enregistre qu'elle a été fermée pour la session
        sessionStorage.setItem('noticeClosed', 'true');
    }
}

// Ajoutez ceci dans votre showView ou DOMContentLoaded pour qu'elle ne réapparaisse pas
function checkNoticeStatus() {
    if (sessionStorage.getItem('noticeClosed') === 'true') {
        const notice = document.getElementById('relationshipNotice');
        if (notice) notice.style.display = 'none';
    }
}

// --- DETTES LOGIC ---
let debtsHistory = JSON.parse(localStorage.getItem('smartSpending_debts')) || [];

function renderDebts() {
    const container = document.getElementById('debtsRowsContainer');
    if (!container) return;

    container.innerHTML = debtsHistory.map(debt => `
        <div class="expense-row ${debt.settled ? 'row-settled' : ''}">
            <div class="input-wrapper-group">
                <label class="mobile-only-label">Mois / Description</label>
                <input type="text" value="${debt.month}" onchange="updateDebt(${debt.id}, 'month', this.value)">
            </div>
            <div class="input-wrapper-group">
                <label class="mobile-only-label">Jean doit Monique (€)</label>
                <input type="number" value="${debt.jeanOwes}" oninput="updateDebt(${debt.id}, 'jeanOwes', this.value)">
            </div>
            <div class="input-wrapper-group">
                <label class="mobile-only-label">Monique doit Jean (€)</label>
                <input type="number" value="${debt.moniqueOwes}" oninput="updateDebt(${debt.id}, 'moniqueOwes', this.value)">
            </div>
            <div class="input-wrapper-group" style="text-align:center;">
                <label class="mobile-only-label">Statut (Réglé)</label>
                <input type="checkbox" ${debt.settled ? 'checked' : ''} onchange="updateDebt(${debt.id}, 'settled', this.checked)">
            </div>
            <button class="btn-delete-hover" onclick="deleteDebt(${debt.id})">×</button>
        </div>
    `).join('');
    calculateGlobalDebt();
}

function updateDebt(id, field, value) {
    const debt = debtsHistory.find(d => d.id === id);
    if (!debt) return;
    debt[field] = (field === 'month' || field === 'settled') ? value : parseFloat(value || 0);
    localStorage.setItem('smartSpending_debts', JSON.stringify(debtsHistory));
    if (field === 'settled') renderDebts(); else calculateGlobalDebt();
}

function addNewDebtRow() {
    debtsHistory.push({ id: Date.now(), month: "Nouveau mois", jeanOwes: 0, moniqueOwes: 0, settled: false });
    localStorage.setItem('smartSpending_debts', JSON.stringify(debtsHistory));
    renderDebts();
}

function deleteDebt(id) {
    debtsHistory = debtsHistory.filter(d => d.id !== id);
    localStorage.setItem('smartSpending_debts', JSON.stringify(debtsHistory));
    renderDebts();
}

function calculateGlobalDebt() {
    let jeanTotal = debtsHistory.filter(d => !d.settled).reduce((sum, d) => sum + d.jeanOwes, 0);
    let moniqueTotal = debtsHistory.filter(d => !d.settled).reduce((sum, d) => sum + d.moniqueOwes, 0);
    const diff = jeanTotal - moniqueTotal;
    const display = document.getElementById('globalDebtStatus');
    if (!display) return;

    if (diff > 0) display.innerText = `Jean doit ${diff.toFixed(2)} € à Monique`;
    else if (diff < 0) display.innerText = `Monique doit ${Math.abs(diff).toFixed(2)} € à Jean`;
    else display.innerText = "Les comptes sont équilibrés !";
}

let charts = {}; // Objet pour stocker les instances des graphiques

let chartsInstance = {}; // Pour éviter les bugs de superposition au clic

function renderAnalysis() {
    if (typeof Chart === 'undefined') return;

    try {
        const ctxCat = document.getElementById('chartCategories');
        const ctxPart = document.getElementById('chartPartners');
        const ctxComp = document.getElementById('chartComparison');
        if (!ctxCat || !ctxPart || !ctxComp) return;

        // --- BULLETPROOF THEME CHECK ---
        let themePrimary, themeSecondary;
        const bodyClass = document.body.classList;

        if (bodyClass.contains('theme-pink')) {
            // PINK THEME
            themePrimary = '#db2777';
            themeSecondary = '#f472b6';
        } else if (bodyClass.contains('theme-dark')) {
            // NOIR LUXE THEME
            themePrimary = '#1a1c23'; // Charcoal
            themeSecondary = '#D4AF37'; // Gold
        } else {
            // CLASSIC THEME (Default)
            themePrimary = '#1f4e79'; // Navy Blue
            themeSecondary = '#D4AF37'; // Gold
        }

        const valJean = parseFloat(document.getElementById('jeanTotalDisplay')?.value || 0);
        const valMonique = parseFloat(document.getElementById('moniqueTotalDisplay')?.value || 0);
        const totalDepenses = valJean + valMonique;
        const revenu = parseFloat(document.getElementById('revenuFoyer')?.value || 4000);

        // Clear old charts
        if (chartsInstance.categories instanceof Chart) chartsInstance.categories.destroy();
        if (chartsInstance.partners instanceof Chart) chartsInstance.partners.destroy();
        if (chartsInstance.comparison instanceof Chart) chartsInstance.comparison.destroy();

        // 1. Categories Pie
        chartsInstance.categories = new Chart(ctxCat.getContext('2d'), {
            type: 'pie',
            data: {
                labels: categories.map(c => c.name),
                datasets: [{
                    data: categories.map(c => parseFloat(c.jean || 0) + parseFloat(c.monique || 0)),
                    backgroundColor: [themePrimary, themeSecondary, '#4b5563', '#9ca3af', '#64748b', '#cbd5e1'],
                    borderWidth: 2
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // 2. Partners Doughnut
        chartsInstance.partners = new Chart(ctxPart.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: [appSettings.p1Name, appSettings.p2Name], 
                datasets: [{
                    data: [valJean, valMonique],
                    backgroundColor: [themePrimary, themeSecondary]
                }]
            },
            options: { cutout: '70%', responsive: true, maintainAspectRatio: false }
        });

        // 3. Comparison Bar
        chartsInstance.comparison = new Chart(ctxComp.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Revenu', 'Dépenses'],
                datasets: [{
                    label: 'Montant (€)',
                    data: [revenu, totalDepenses],
                    backgroundColor: [themeSecondary, themePrimary], 
                    borderRadius: 8
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

    } catch (err) {
        console.error("Analysis Error:", err);
    }
}

let objectives = JSON.parse(localStorage.getItem('smartSpending_objectives')) || [];

function openObjectiveModal() {
    document.getElementById('objectiveModal').style.display = 'flex';
}

function closeObjectiveModal() {
    document.getElementById('objectiveModal').style.display = 'none';
}

function saveObjective() {
    const name = document.getElementById('objName').value;
    const total = parseFloat(document.getElementById('objTotal').value);
    const start = document.getElementById('objStart').value;
    const end = document.getElementById('objEnd').value;
    const partJ = parseFloat(document.getElementById('objPartJean').value) || 0;
    const partM = parseFloat(document.getElementById('objPartMonique').value) || 0;

    // 1. Vérification des champs obligatoires
    if (!name || !total || !start || !end) {
        alert("Veuillez remplir les champs obligatoires.");
        return;
    }

    // 2. NOUVELLE RÈGLE : Vérification chronologique des dates
    // En JS, comparer "2026-10" > "2025-01" fonctionne directement
    if (start > end) {
        alert("Erreur : La date de début ne peut pas être après la date de fin !");
        return;
    }

    // 3. Création de l'objet
    const newObj = {
        id: Date.now(),
        name, 
        total, 
        start, 
        end, 
        partJ, 
        partM,
        currentSaved: 0 
    };

    objectives.push(newObj);
    localStorage.setItem('smartSpending_objectives', JSON.stringify(objectives));
    
    // 4. Mise à jour de l'interface et fermeture
    renderObjectives();
    closeObjectiveModal();

    // Effacer les champs pour le prochain objectif
    document.getElementById('objName').value = "";
    document.getElementById('objTotal').value = "";
}

function renderObjectives() {
    const container = document.getElementById('objectivesGrid');
    if (!container) return;

    container.innerHTML = objectives.map(obj => {
        const percent = Math.min(100, (obj.currentSaved / obj.total) * 100);
        const mensualite = (parseFloat(obj.partJ) || 0) + (parseFloat(obj.partM) || 0);

        return `
            <div class="objective-card">
                <div class="obj-header">
                    <span class="obj-name">${obj.name}</span>
                    <button class="btn-delete-obj" onclick="deleteObjective(${obj.id})" title="Supprimer">×</button>
                </div>
                
                <div class="obj-details">
                    <span>${obj.currentSaved.toFixed(0)} € sur ${obj.total} €</span>
                    <span>${Math.round(percent)}%</span>
                </div>
                
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${percent}%"></div>
                </div>

                <div class="obj-actions-row">
                    <div class="obj-mini-info">
                        <strong>+${mensualite}€</strong> /mois
                    </div>
                    <button class="btn-feed" onclick="feedObjective(${obj.id})">
                        ALIMENTER
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function deleteObjective(id) {
    if(confirm("Supprimer cet objectif ?")) {
        objectives = objectives.filter(o => o.id !== id);
        localStorage.setItem('smartSpending_objectives', JSON.stringify(objectives));
        renderObjectives();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initMonthSelector();
    renderSpending();
    renderObjectives(); // <--- Ajoutez cette ligne ici
});

// Ajouter l'appel au rendu dans votre fonction showView existante
// if (viewId === 'view-savings') { renderObjectives(); }

// Fonction pour ajouter l'épargne mensuelle
function feedObjective(id) {
    const obj = objectives.find(o => o.id === id);
    if (!obj) return;

    // On ajoute la somme des deux partenaires
    const montantAAjouter = (parseFloat(obj.partJ) || 0) + (parseFloat(obj.partM) || 0);
    
    if (obj.currentSaved >= obj.total) {
        alert("Objectif déjà atteint ! Félicitations !");
        return;
    }

    obj.currentSaved += montantAAjouter;
    
    // Sauvegarde et mise à jour visuelle
    localStorage.setItem('smartSpending_objectives', JSON.stringify(objectives));
    renderObjectives();
}

// Fonction pour supprimer
function deleteObjective(id) {
    if (confirm("Voulez-vous vraiment supprimer cet objectif ?")) {
        objectives = objectives.filter(o => o.id !== id);
        localStorage.setItem('smartSpending_objectives', JSON.stringify(objectives));
        renderObjectives();
    }
}

// Load or Init Settings
let appSettings = JSON.parse(localStorage.getItem('smartSpending_settings')) || {
    p1Name: "Jean",
    p2Name: "Monique",
    theme: "classic"
};

function applyTheme(themeName) {
    const root = document.documentElement;
    const body = document.body;

    body.classList.remove('theme-pink', 'theme-dark');

    if (themeName === 'pink') {
        body.classList.add('theme-pink');
        root.style.setProperty('--primary-color', '#db2777');
        root.style.setProperty('--secondary-color', '#f472b6');
    } 
    else if (themeName === 'dark') {
        body.classList.add('theme-dark');
        // Primary is now the Dark Charcoal, Secondary is the Gold
        root.style.setProperty('--primary-color', '#1a1c23'); 
        root.style.setProperty('--secondary-color', '#C5A028');
    } 
    else {
        root.style.setProperty('--primary-color', '#1f4e79'); 
        root.style.setProperty('--secondary-color', '#D4AF37');
    }

    appSettings.theme = themeName;
    
    if (typeof calculateTotals === 'function') calculateTotals();
    if (typeof renderAnalysis === 'function') renderAnalysis();
    if (typeof renderSpending === 'function') renderSpending();
}

function saveSettings() {
    const newP1 = document.getElementById('settingP1').value;
    const newP2 = document.getElementById('settingP2').value;
    
    if(newP1) appSettings.p1Name = newP1;
    if(newP2) appSettings.p2Name = newP2;
    
	localStorage.setItem('smartSpending_settings', JSON.stringify(appSettings));
    
    applyTheme(appSettings.theme);
    updateUINames();
    
    // REDRAW EVERYTHING IMMEDIATELY
    calculateTotals(); // This refreshes the dashboard chart
    renderAnalysis();  // This refreshes the analysis charts
    renderSpending();  // This refreshes buttons/colors in the grid
    
    alert("Paramètres enregistrés !");
}

function updateUINames() {
    // This looks for any element with the class 'p1-name' and updates the text
    document.querySelectorAll('.p1-name').forEach(el => el.innerText = appSettings.p1Name);
    document.querySelectorAll('.p2-name').forEach(el => el.innerText = appSettings.p2Name);
}

// Call this in your initial load function
document.addEventListener('DOMContentLoaded', () => {
    applyTheme(appSettings.theme);
    updateUINames();
    
    // Fill the inputs in settings view if they exist
    if(document.getElementById('settingP1')) {
        document.getElementById('settingP1').value = appSettings.p1Name;
        document.getElementById('settingP2').value = appSettings.p2Name;
    }
});
