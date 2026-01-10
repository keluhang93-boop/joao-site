let contacts = JSON.parse(localStorage.getItem('myCrmData')) || [];
let searchTerm = ""; // New: Keep track of search

const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');
const searchBar = document.getElementById('search-bar');

renderContacts();

function saveToLocalStorage() {
    localStorage.setItem('myCrmData', JSON.stringify(contacts));
}

// NEW: Listener for the search bar
searchBar.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderContacts(); // Re-render every time the user types
});

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newContact = {
        id: Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        task: document.getElementById('task-desc').value,
        completed: false
    };
    contacts.push(newContact);
    saveToLocalStorage();
    renderContacts();
    contactForm.reset();
});

function toggleTask(id) {
    contacts = contacts.map(c => c.id === id ? {...c, completed: !c.completed} : c);
    saveToLocalStorage();
    renderContacts();
}

function deleteContact(id) {
    contacts = contacts.filter(c => c.id !== id);
    saveToLocalStorage();
    renderContacts();
}

// UPDATED: Now filters the list before drawing it
function renderContacts() {
    contactList.innerHTML = ''; 

    // Filter logic: Check if name or email includes the searchTerm
    const filtered = contacts.filter(person => 
        person.name.toLowerCase().includes(searchTerm) || 
        person.email.toLowerCase().includes(searchTerm)
    );

    filtered.forEach(person => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        const taskClass = person.completed ? 'task-tag completed' : 'task-tag';
        const taskIcon = person.completed ? '✅' : '📝';

        card.innerHTML = `
            <div class="card-header">
                <h3>${person.name}</h3>
                <button class="delete-btn" onclick="deleteContact(${person.id})">×</button>
            </div>
            <p>${person.email}</p>
            <div class="${taskClass}" onclick="toggleTask(${person.id})">
                ${taskIcon} ${person.task || 'No tasks'}
            </div>
        `;
        contactList.appendChild(card);
    });
}
