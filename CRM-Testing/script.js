// Replace your script.js with this
let contacts = JSON.parse(localStorage.getItem('myCrmData')) || [];
let searchTerm = "";

const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');
const searchBar = document.getElementById('search-bar');
const toggleBtn = document.getElementById('toggle-form-btn');
const formContainer = document.getElementById('form-container');
const statTotal = document.getElementById('stat-total');
const statDone = document.getElementById('stat-done');

// Initial load
renderContacts();

function saveToLocalStorage() {
    localStorage.setItem('myCrmData', JSON.stringify(contacts));
}

// Toggle Form Logic
toggleBtn.addEventListener('click', () => {
    formContainer.classList.toggle('show');
    toggleBtn.classList.toggle('rotate-btn');
});

// Search Logic
searchBar.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderContacts();
});

// Combined Submit Logic
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newContact = {
        id: Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        task: document.getElementById('task-desc').value,
        priority: document.getElementById('priority').value,
        completed: false
    };

    contacts.push(newContact);
    saveToLocalStorage();
    renderContacts();
    contactForm.reset();

    // Responsive: auto-close form on mobile
    if (window.innerWidth < 768) {
        formContainer.classList.remove('show');
        toggleBtn.classList.remove('rotate-btn');
    }
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

function updateStats() {
    if (statTotal && statDone) {
        statTotal.innerText = contacts.length;
        statDone.innerText = contacts.filter(c => c.completed).length;
    }
}

function renderContacts() {
    contactList.innerHTML = ''; 
    updateStats();

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

// Add these to your script.js

// 1. CLEAR ALL FUNCTION
function clearAllContacts() {
    // Browser confirmation dialog
    const confirmed = confirm("Are you sure you want to delete ALL leads? This cannot be undone.");
    
    if (confirmed) {
        contacts = [];
        saveToLocalStorage();
        renderContacts();
    }
}

// 2. EDIT FUNCTION
function editContact(id) {
    // Find the contact
    const contactToEdit = contacts.find(c => c.id === id);
    
    if (contactToEdit) {
        // Fill the form with existing data
        document.getElementById('name').value = contactToEdit.name;
        document.getElementById('email').value = contactToEdit.email;
        document.getElementById('task-desc').value = contactToEdit.task;
        document.getElementById('priority').value = contactToEdit.priority;

        // Open the form if it's closed
        formContainer.classList.add('show');
        toggleBtn.classList.add('rotate-btn');

        // Remove the old version (the user will "re-add" it when they hit submit)
        // This is the simplest way to 'update' in this basic version
        deleteContact(id);
        
        // Scroll to the top so the user sees the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 3. UPDATE RENDER FUNCTION
// Locate your filtered.forEach loop in renderContacts and update the innerHTML:
function renderContacts() {
    contactList.innerHTML = ''; 
    updateStats();

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
                <div class="card-actions">
                    <button class="edit-btn" onclick="editContact(${person.id})">✎</button>
                    <button class="delete-btn" onclick="deleteContact(${person.id})">×</button>
                </div>
            </div>
            <p>${person.email}</p>
            <div class="${taskClass}" onclick="toggleTask(${person.id})">
                ${person.completed ? '✅' : '📝'} ${person.task || 'No tasks'}
            </div>
        `;
        contactList.appendChild(card);
    });
}
