let contacts = JSON.parse(localStorage.getItem('myCrmData')) || [];
let searchTerm = "";
let editId = null;

const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');
const searchBar = document.getElementById('search-bar');
const toggleBtn = document.getElementById('toggle-form-btn');
const formContainer = document.getElementById('form-container');
const statTotal = document.getElementById('stat-total');
const statDone = document.getElementById('stat-done');
const submitBtn = contactForm.querySelector('button[type="submit"]');
const cancelBtn = document.getElementById('cancel-edit-btn');

// Initial Load
renderContacts();

function saveToLocalStorage() {
    localStorage.setItem('myCrmData', JSON.stringify(contacts));
}

// --- FORM LOGIC ---
toggleBtn.addEventListener('click', () => {
    formContainer.classList.toggle('show');
    toggleBtn.classList.toggle('rotate-btn');
});

cancelBtn.addEventListener('click', resetForm);

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        job: document.getElementById('job-title').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        task: document.getElementById('task-desc').value,
        priority: document.getElementById('priority').value
    };

    if (editId) {
        contacts = contacts.map(c => c.id === editId ? { ...c, ...data } : c);
    } else {
        contacts.push({ 
            id: Date.now(), 
            ...data, 
            completed: false 
        });
    }

    saveToLocalStorage();
    resetForm();
    renderContacts();
});

function resetForm() {
    contactForm.reset();
    editId = null;
    submitBtn.innerText = "Add to Pipeline";
    submitBtn.style.background = ""; 
    
    // Hide it again using setProperty
    cancelBtn.style.setProperty('display', 'none', 'important');
}

function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        editId = id;
        
        // --- DATA LOGIC: This fills the boxes with current data ---
        document.getElementById('name').value = contact.name;
        document.getElementById('job-title').value = contact.job || "";
        document.getElementById('email').value = contact.email;
        document.getElementById('phone').value = contact.phone || "";
        document.getElementById('task-desc').value = contact.task || "";
        document.getElementById('priority').value = contact.priority;

        // --- UI LOGIC: Updates the buttons ---
        submitBtn.innerText = "Update Lead";
        submitBtn.style.background = "#059669"; 
        
        // This overrides the CSS to show the Cancel button
        cancelBtn.style.setProperty('display', 'block', 'important');

        // Open the panel so the user sees the filled data
        formContainer.classList.add('show');
        toggleBtn.classList.add('rotate-btn');
        
        // Scroll to top so the user sees the form immediately
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function toggleTask(id) {
    contacts = contacts.map(c => c.id === id ? {...c, completed: !c.completed} : c);
    saveToLocalStorage();
    renderContacts();
}

function deleteContact(id) {
    // This creates a popup with "OK" and "Cancel"
    const confirmed = confirm("Are you sure you want to delete this lead? This action cannot be undone.");
    
    if (confirmed) {
        // Only runs if the user clicks "OK"
        contacts = contacts.filter(c => c.id !== id);
        saveToLocalStorage();
        renderContacts();
    }
}

function clearAllContacts() {
    if (confirm("Delete all data?")) {
        contacts = [];
        saveToLocalStorage();
        renderContacts();
    }
}

searchBar.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderContacts();
});

// --- THE RENDER FUNCTION (The Core) ---
function renderContacts() {
    contactList.innerHTML = ''; 
    
    // Update Stats
    statTotal.innerText = contacts.length;
    statDone.innerText = contacts.filter(c => c.completed).length;

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
                <div class="header-info">
                    <h3>${person.name}</h3>
                    <small>${person.job || 'No Title'}</small>
                </div>
                <div class="card-actions">
                    <button class="edit-btn" onclick="editContact(${person.id})">✎</button>
                    <button class="delete-btn" onclick="deleteContact(${person.id})">×</button>
                </div>
            </div>
            <div class="contact-details">
                <p>📧 ${person.email}</p>
                <p>📞 ${person.phone || 'No Phone'}</p>
            </div>
            <span class="priority-tag p-${person.priority}">${person.priority}</span>
            <div class="${taskClass}" onclick="toggleTask(${person.id})">
                ${person.completed ? '✅' : '📝'} ${person.task || 'No task'}
            </div>
        `;
        contactList.appendChild(card);
    });
}
