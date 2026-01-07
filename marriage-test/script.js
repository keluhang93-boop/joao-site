const venueData = [
    { id: 1, name: "Amalfi Serenity", loc: "Italy", style: "Beach", img: "https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=800" },
    { id: 2, name: "Royal Highland", loc: "Scotland", style: "Castle", img: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?auto=format&fit=crop&w=800" },
    { id: 3, name: "The Glass Pavilion", loc: "New York", style: "Modern", img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800" },
    { id: 4, name: "Santorini Dreams", loc: "Greece", style: "Beach", img: "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=800" }
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
    if(!date) return alert("Please select a wedding date.");
    alert("Inquiry Sent. Lumina Concierge will contact you shortly.");
    closeModal();
}

// Initial Load
render(venueData);
