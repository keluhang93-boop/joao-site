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

renderContacts();

function saveToLocalStorage() {
    localStorage.setItem('myCrmData', JSON.stringify(contacts));
}

// --- FORM LOGIC ---

toggleBtn.addEventListener('click', () => {
    formContainer.classList.toggle('show');
    toggleBtn.classList.toggle('rotate-btn');
    if (!formContainer.classList.contains('show')) resetForm();
});

cancelBtn.addEventListener('click', resetForm);

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const task = document.getElementById('task-desc').value;
    const priority = document.getElementById('priority').value;

    if (editId) {
        contacts = contacts.map(c => c.id === editId ? { ...c, name, email, task, priority } : c);
    } else {
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
    submitBtn.style.background = ""; // Returns to your CSS primary purple
    cancelBtn.style.display = "none";
    renderContacts();
}

function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        editId = id;
        document.getElementById('name').value = contact.name;
        document.getElementById('email').value = contact.email;
        document.getElementById('task-desc').value = contact.task;
        document.getElementById('priority').value = contact.priority;

        // Visual Updates for Edit Mode
        submitBtn.innerText = "Update Lead";
        submitBtn.style.background = "#991b1b"; // DARK RED color
        cancelBtn.style.display = "block";      // Show the styled cancel button

        formContainer.classList.add('show');
        toggleBtn.classList.add('rotate-btn');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        renderContacts();
    }
}

// --- PIPELINE ACTIONS ---

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

function clearAllContacts() {
    if (confirm("Are you sure you want to delete ALL data?")) {
        contacts = [];
        saveToLocalStorage();
        renderContacts();
    }
}

// --- CSV EXPORT FUNCTION ---

function exportToCSV() {
    if (contacts.length === 0) return alert("No data to export!");

    // Create the header row
    let csvContent = "Name,Email,Task,Priority,Status\n";

    // Add data rows
    contacts.forEach(c => {
        let status = c.completed ? "Done" : "Pending";
        csvContent += `${c.name},${c.email},${c.task},${c.priority},${status}\n`;
    });

    // Create a hidden link and "click" it to download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "my_crm_leads.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- UI RENDERING ---

searchBar.addEventListener('input', (e) => {
    searchTerm = e.target.value.toLowerCase();
    renderContacts();
});

function updateStats() {
    statTotal.innerText = contacts.length;
    statDone.innerText = contacts.filter(c => c.completed).length;
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
