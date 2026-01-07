const venueData = [
    { id: 1, name: "Château de Versailles", loc: "Paris / Versailles", style: "Château", img: "https://images.unsplash.com/photo-1585642910443-39d7fc214bc5?auto=format&fit=crop&w=800" },
    { id: 2, name: "Le Palais de la Méditerranée", loc: "Nice", style: "Bord de mer", img: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800" },
    { id: 3, name: "Domaine des Vignes", loc: "Bordeaux", style: "Château", img: "https://images.unsplash.com/photo-1505944270255-bd2b89657434?auto=format&fit=crop&w=800" },
    { id: 4, name: "Manoir Breton", loc: "Bretagne", style: "Urbain Chic", img: "https://images.unsplash.com/photo-1560124341-3b890832128b?auto=format&fit=crop&w=800" }
];

const grid = document.getElementById('venueGrid');

function render(venues) {
    grid.innerHTML = venues.map(v => `
        <div class="venue-card" onclick="openBooking(${v.id})">
            <div class="venue-image" style="background-image: url('${v.img}')"></div>
            <div class="card-overlay">
                <h3>${v.name}</h3>
                <p>${v.loc} • ${v.style}</p>
            </div>
        </div>
    `).join('');
}

function filterVenues() {
    const text = document.getElementById('searchInput').value.toLowerCase();
    const style = document.getElementById('styleFilter').value;
    
    const filtered = venueData.filter(v => {
        const matchesText = v.name.toLowerCase().includes(text) || v.loc.toLowerCase().includes(text);
        const matchesStyle = style === "all" || v.style === style;
        return matchesText && matchesStyle;
    });
    render(filtered);
}

function openBooking(id) {
    const venue = venueData.find(v => v.id === id);
    document.getElementById('modalTitle').innerText = venue.name;
    document.getElementById('modalLocation').innerText = venue.loc;
    document.getElementById('modalImage').style.backgroundImage = `url('${venue.img}')`;
    document.getElementById('bookingModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('bookingModal').style.display = 'none';
}

function confirmBooking() {
    const date = document.getElementById('bookingDate').value;
    if(!date) return alert("Veuillez choisir une date pour votre mariage.");
    alert("Demande envoyée ! Notre conciergerie vous contactera sous 24h.");
    closeModal();
}

render(venueData);
