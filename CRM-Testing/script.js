let contacts = JSON.parse(localStorage.getItem('myCrmData')) || [];
let searchTerm = "";
let editId = null; // NEW: Track if we are editing an existing contact

const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');
const searchBar = document.getElementById('search-bar');
const toggleBtn = document.getElementById('toggle-form-btn');
const formContainer = document.getElementById('form-container');
const statTotal = document.getElementById('stat-total');
const statDone = document.getElementById('stat-done');
const submitBtn = contactForm.querySelector('button[type="submit"]');

renderContacts();

function saveToLocalStorage() {
    localStorage.setItem('myCrmData', JSON.stringify(contacts));
}

toggleBtn.addEventListener('click', () => {
    formContainer.classList.toggle('show');
    toggleBtn.classList.toggle('rotate-btn');
    if (!formContainer.classList.contains('show')) {
        resetForm(); // Reset if user closes form
    }
});

searchBar.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderContacts();
});

// UPDATED: Handles both Create and Update
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const task = document.getElementById('task-desc').value;
    const priority = document.getElementById('priority').value;

    if (editId) {
        // --- REAL EDIT LOGIC ---
        contacts = contacts.map(c => c.id === editId ? { 
            ...c, name, email, task, priority 
        } : c);
        editId = null; // Exit edit mode
        submitBtn.innerText = "Add to Pipeline";
    } else {
        // --- CREATE LOGIC ---
        const newContact = {
            id: Date.now(),
            name, email, task, priority,
            completed: false
        };
        contacts.push(newContact);
    }

    saveToLocalStorage();
    renderContacts();
    resetForm();

    if (window.innerWidth < 768) {
        formContainer.classList.remove('show');
        toggleBtn.classList.remove('rotate-btn');
    }
});

function resetForm() {
    contactForm.reset();
    editId = null;
    submitBtn.innerText = "Add to Pipeline";
}

function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        editId = id; // Set the global edit ID
        
        // Fill form
        document.getElementById('name').value = contact.name;
        document.getElementById('email').value = contact.email;
        document.getElementById('task-desc').value = contact.task;
        document.getElementById('priority').value = contact.priority;

        // Change button appearance
        submitBtn.innerText = "Update Lead";
        submitBtn.style.background = "#059669"; // Green for update

        // Open form
        formContainer.classList.add('show');
        toggleBtn.classList.add('rotate-btn');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

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
        // Highlight card if it's currently being edited
        if (person.id === editId) card.style.border = "2px solid #059669";

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
