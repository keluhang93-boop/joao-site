const venues = [
    { id: 1, name: "Château de Versailles", loc: "Paris / Versailles", type: "Château", img: "https://images.unsplash.com/photo-1585642910443-39d7fc214bc5?auto=format&fit=crop&w=800" },
    { id: 2, name: "Le Palais de la Méditerranée", loc: "Nice", type: "Bord de mer", img: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800" },
    { id: 3, name: "Domaine des Vignes", loc: "Bordeaux", type: "Château", img: "https://images.unsplash.com/photo-1505944270255-bd2b89657434?auto=format&fit=crop&w=800" },
    { id: 4, name: "Manoir Breton", loc: "Bretagne", type: "Château", img: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&w=800" }
];

const grid = document.getElementById('venueGrid');
const countLabel = document.getElementById('itemsCount');

// Fonction pour afficher avec un effet de cascade (Plus interactif)
function renderVenues(data) {
    grid.innerHTML = "";
    countLabel.innerText = `${data.length} lieu(x) trouvé(s)`;

    data.forEach((v, index) => {
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

        // Effet de délai pour l'apparition des cartes
        setTimeout(() => {
            card.classList.add('visible');
        }, index * 150);
    });
}

// Recherche interactive
function handleSearch() {
    const text = document.getElementById('searchInput').value.toLowerCase();
    const style = document.getElementById('styleFilter').value;
    
    const filtered = venues.filter(v => {
        const matchesText = v.name.toLowerCase().includes(text) || v.loc.toLowerCase().includes(text);
        const matchesStyle = style === "all" || v.type === style;
        return matchesText && matchesStyle;
    });
    
    renderVenues(filtered);
}

// Ecouteurs d'événements
document.getElementById('searchBtn').addEventListener('click', handleSearch);
document.getElementById('searchInput').addEventListener('keyup', (e) => {
    if(e.key === "Enter") handleSearch();
});
document.getElementById('styleFilter').addEventListener('change', handleSearch);

// Animation au défilement (Scroll Reveal simple)
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = "rgba(26, 26, 26, 0.95)";
        navbar.style.padding = "20px 8%";
    } else {
        navbar.style.background = "transparent";
        navbar.style.padding = "35px 8%";
    }
});

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    renderVenues(venues);
});
