let chart1, chart2;

function addRow(tableId, isSpending, isDebt = false) {
    const tbody = document.getElementById(tableId);
    const row = document.createElement('tr');
    
    if (isSpending) {
        row.innerHTML = `
            <td><input type="text" class="editable-name" value="Nouvelle Catégorie"></td>
            <td><input type="number" class="amount-input" value="0" oninput="calcTotal(this)"></td>
            <td><input type="number" class="amount-input" value="0" oninput="calcTotal(this)"></td>
            <td><span class="row-total">0</span> €</td>
            <td><label class="switch"><input type="checkbox"><span class="slider"></span></label></td>
        `;
    } else if (isDebt) {
        row.innerHTML = `
            <td><input type="text" class="editable-name" value="Mois"></td>
            <td><input type="number" class="amount-input" value="0"></td>
            <td><input type="number" class="amount-input" value="0"></td>
            <td style="text-align: center;"><input type="checkbox" style="transform: scale(1.5); accent-color: #4B0082;"></td>
        `;
    }
    tbody.appendChild(row);
}

function calcTotal(input) {
    const row = input.closest('tr');
    const amounts = row.querySelectorAll('input[type="number"]');
    const totalCell = row.querySelector('.row-total');
    let sum = 0;
    amounts.forEach(a => sum += parseFloat(a.value || 0));
    totalCell.innerText = sum.toFixed(2);
    updateDashboard();
}

function updateDashboard() {
    let totalDepenses = 0;
    let totalJean = 0;
    let totalMonique = 0;

    // Calculate totals from spending table
    document.querySelectorAll('#spendingBody tr').forEach(row => {
        const inputs = row.querySelectorAll('.amount-input');
        if(inputs.length >= 2) {
            totalJean += parseFloat(inputs[0].value || 0);
            totalMonique += parseFloat(inputs[1].value || 0);
        }
        const span = row.querySelector('.row-total');
        if(span) totalDepenses += parseFloat(span.innerText || 0);
    });

    // Update Top Cards
    document.getElementById('jeanTotalDisplay').value = totalJean.toFixed(2);
    document.getElementById('moniqueTotalDisplay').value = totalMonique.toFixed(2);
    
    // Update Economy Section
    document.getElementById('totalDepensesDisplay').innerText = totalDepenses.toFixed(2);
    
    const budgetCible = parseFloat(document.getElementById('mainBudgetTarget').value || 0);
    document.getElementById('budgetCibleDisplay').innerText = budgetCible.toFixed(2);

    const revenu = parseFloat(document.getElementById('revenuFoyer').value || 0);
    const economie = revenu - totalDepenses;
    document.getElementById('economieDisplay').innerText = economie.toFixed(2);

    updateCharts(revenu, budgetCible, totalDepenses);
}

function updateCharts(revenu, budget, depenses) {
    const ctx1 = document.getElementById('chartRevenu').getContext('2d');
    const ctx2 = document.getElementById('chartBudget').getContext('2d');
    
    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();

    const options = { 
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }, 
        scales: { y: { display: false }, x: { grid: { display: false } } } 
    };

    chart1 = new Chart(ctx1, {
        type: 'bar',
        data: { labels: ['Revenu', 'Dép.'], datasets: [{ data: [revenu, depenses], backgroundColor: ['#4B0082', '#D4AF37'] }] },
        options: options
    });

    chart2 = new Chart(ctx2, {
        type: 'bar',
        data: { labels: ['Budget', 'Dép.'], datasets: [{ data: [budget, depenses], backgroundColor: ['#1f4e79', '#D4AF37'] }] },
        options: options
    });
}

// Initial call
window.onload = updateDashboard;
