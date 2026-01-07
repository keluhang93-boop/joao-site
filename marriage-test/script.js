// 1. Data Object (In a real app, this comes from a Database)
const venues = [
    { id: 1, name: "Sunset Beach Resort", location: "Maldives", style: "Beach", price: "$$$", color: "#a2d2ff" },
    { id: 2, name: "The Grand Castle", location: "Scotland", style: "Historic", price: "$$$$", color: "#b7b7a4" },
    { id: 3, name: "Garden of Eden", location: "Italy", style: "Garden", price: "$$", color: "#ccd5ae" },
    { id: 4, name: "Mountain View Chapel", location: "Switzerland", style: "Mountain", price: "$$$", color: "#d8e2dc" },
    { id: 5, name: "Urban Loft", location: "New York", style: "Modern", price: "$$", color: "#e5e5e5" }
];

const venueGrid = document.getElementById('venueGrid');

// 2. Function to build the website
function displayVenues(data) {
    venueGrid.innerHTML = ""; // Clear current list
    
    data.forEach(venue => {
        const card = document.createElement('div');
        card.className = 'venue-card';
        card.innerHTML = `
            <div class="venue-img" style="background-color: ${venue.color}"></div>
            <div class="venue-info">
                <h3>${venue.name}</h3>
                <p>📍 ${venue.location} | <b>${venue.style}</b></p>
                <p>Price: ${venue.price}</p>
                <button class="book-btn" onclick="openModal('${venue.name}')">Book Now</button>
            </div>
        `;
        venueGrid.appendChild(card);
    });
}

// 3. Search Filter Logic
function filterVenues() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filtered = venues.filter(v => 
        v.name.toLowerCase().includes(query) || 
        v.style.toLowerCase().includes(query) ||
        v.location.toLowerCase().includes(query)
    );
    displayVenues(filtered);
}

// 4. Interactive Modal Logic
function openModal(name) {
    document.getElementById('modalTitle').innerText = "Inquiry for " + name;
    document.getElementById('bookingModal').style.display = "block";
}

function closeModal() {
    document.getElementById('bookingModal').style.display = "none";
}

function confirmBooking() {
    const date = document.getElementById('bookingDate').value;
    if(!date) return alert("Please select a date!");
    alert("Great news! That date is available. Our agent will contact you soon.");
    closeModal();
}

// Initial display
displayVenues(venues);
