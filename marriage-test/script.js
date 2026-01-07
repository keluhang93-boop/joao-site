const venues = [
    { id: 1, name: "Château de Versailles", loc: "Paris / Versailles", type: "Château", img: "https://images.unsplash.com/photo-1590076215667-873d3121544b?auto=format&fit=crop&w=800" },
    { id: 2, name: "Le Palais de la Méditerranée", loc: "Nice", type: "Bord de mer", img: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800" },
    { id: 3, name: "Domaine des Vignes", loc: "Bordeaux", type: "Château", img: "https://images.unsplash.com/photo-1505944270255-bd2b89657434?auto=format&fit=crop&w=800" },
    { id: 4, name: "Manoir du Grand Ouest", loc: "Bretagne", type: "Château", img: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&w=800" }
];

const grid = document.getElementById('venueGrid');

function renderVenues(data) {
    grid.innerHTML = "";
    data.forEach(v => {
        const card = document.createElement('div');
        card.className = 'venue-card';
        card.innerHTML = `
            <div class="venue-img" style="background-image: url('${v.img}')"></div>
            <div class="card-info">
                <h3>${v.name}</h3>
                <p>${v.loc} • ${v.type}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterVenues() {
    const text = document.getElementById('searchInput').value.toLowerCase();
    const style = document.getElementById('styleFilter').value;
    
    const filtered = venues.filter(v => {
        const matchesText = v.name.toLowerCase().includes(text) || v.loc.toLowerCase().includes(text);
        const matchesStyle = style === "all" || v.type === style;
        return matchesText && matchesStyle;
    });
    renderVenues(filtered);
}

// Initialisation
renderVenues(venues);
