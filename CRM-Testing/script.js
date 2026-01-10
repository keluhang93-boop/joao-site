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

const toggleBtn = document.getElementById('toggle-form-btn');
const formContainer = document.getElementById('form-container');

toggleBtn.addEventListener('click', () => {
    // Toggle the 'show' class to slide the form
    formContainer.classList.toggle('show');
    
    // Rotate the button for visual feedback
    toggleBtn.classList.toggle('rotate-btn');
});

// Update the Form Submit listener to close the form after adding a lead (optional)
contactForm.addEventListener('submit', (e) => {
    // ... your existing code ...
    
    // If you want it to close automatically on mobile after adding:
    if (window.innerWidth < 768) {
        formContainer.classList.remove('show');
        toggleBtn.classList.remove('rotate-btn');
    }
});


// ... (previous variables)
const statTotal = document.getElementById('stat-total');
const statDone = document.getElementById('stat-done');

// UPDATED: Submit Listener to include priority
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newContact = {
        id: Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        task: document.getElementById('task-desc').value,
        priority: document.getElementById('priority').value, // NEW
        completed: false
    };
    contacts.push(newContact);
    saveToLocalStorage();
    renderContacts();
    contactForm.reset();
});

// NEW: Function to update stats
function updateStats() {
    statTotal.innerText = contacts.length;
    statDone.innerText = contacts.filter(c => c.completed).length;
}

// UPDATED: renderContacts to include priority tags and call updateStats
function renderContacts() {
    contactList.innerHTML = ''; 
    updateStats(); // Refresh numbers

    const filtered = contacts.filter(person => 
        person.name.toLowerCase().includes(searchTerm) || 
        person.email.toLowerCase().includes(searchTerm)
    );

    filtered.forEach(person => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        const taskClass = person.completed ? 'task-tag completed' : 'task-tag';
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${person.name} <span class="priority-tag p-${person.priority}">${person.priority}</span></h3>
                <button class="delete-btn" onclick="deleteContact(${person.id})">×</button>
            </div>
            <p>${person.email}</p>
            <div class="${taskClass}" onclick="toggleTask(${person.id})">
                ${person.completed ? '✅' : '📝'} ${person.task || 'No tasks'}
            </div>
        `;
        contactList.appendChild(card);
    });
}
