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
    
    // Make sure these IDs match the HTML exactly!
    const name = document.getElementById('name').value;
    const job = document.getElementById('job-title').value; // Match ID
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;   // Match ID
    const task = document.getElementById('task-desc').value;
    const priority = document.getElementById('priority').value;

    if (editId) {
        // Edit existing
        contacts = contacts.map(c => c.id === editId ? { 
            ...c, name, job, email, phone, task, priority 
        } : c);
    } else {
        // Create new
        const newContact = {
            id: Date.now(),
            name, job, email, phone, task, priority,
            completed: false
        };
        contacts.push(newContact);
    }

    saveToLocalStorage();
    renderContacts();
    resetForm();
});

    if (window.innerWidth < 768) {
        formContainer.classList.remove('show');
        toggleBtn.classList.remove('rotate-btn');
    }
});

function resetForm() {
    contactForm.reset();
    editId = null;
    submitBtn.innerText = "Add to Pipeline";
    submitBtn.style.background = ""; // Returns to primary purple
    cancelBtn.style.display = "none"; // Hides red cancel button
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
        submitBtn.style.background = "#059669"; // GREEN for saving/updating
        cancelBtn.style.display = "block";      // SHOW the dark red cancel button

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
        
        // UPDATED: Added Job and Phone to the display
        card.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 style="margin:0;">${person.name}</h3>
                    <small style="color: #64748b;">${person.job || 'No Title'}</small>
                </div>
                <div class="card-actions">
                    <button class="edit-btn" onclick="editContact(${person.id})">✎</button>
                    <button class="delete-btn" onclick="deleteContact(${person.id})">×</button>
                </div>
            </div>
            
            <div style="margin: 10px 0; font-size: 0.85rem; color: #475569;">
                <p style="margin: 2px 0;">📧 ${person.email}</p>
                <p style="margin: 2px 0;">📞 ${person.phone || 'No phone'}</p>
            </div>

            <span class="priority-tag p-${person.priority}">${person.priority}</span>

            <div class="${taskClass}" onclick="toggleTask(${person.id})">
                ${person.completed ? '✅' : '📝'} ${person.task || 'No tasks'}
            </div>
        `;
        contactList.appendChild(card);
    });
}

// UPDATED: Submit Listener
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const data = {
        name: document.getElementById('name').value,
        job: document.getElementById('job-title').value, // NEW
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value, // NEW
        task: document.getElementById('task-desc').value,
        priority: document.getElementById('priority').value
    };

    if (editId) {
        contacts = contacts.map(c => c.id === editId ? { ...c, ...data } : c);
    } else {
        contacts.push({ id: Date.now(), ...data, completed: false });
    }

    saveToLocalStorage();
    renderContacts();
    resetForm();
});

// UPDATED: editContact function
function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        editId = id;
        document.getElementById('name').value = contact.name;
        document.getElementById('job-title').value = contact.job || ""; // NEW
        document.getElementById('email').value = contact.email;
        document.getElementById('phone').value = contact.phone || ""; // NEW
        document.getElementById('task-desc').value = contact.task;
        document.getElementById('priority').value = contact.priority;

        submitBtn.innerText = "Update Lead";
        submitBtn.style.background = "#059669";
        cancelBtn.style.display = "block";
        formContainer.classList.add('show');
    }
}

// UPDATED: renderContacts HTML structure
// Inside your filtered.forEach loop:
card.innerHTML = `
    <div class="card-header">
        <h3>${person.name} <span class="priority-tag p-${person.priority}">${person.priority}</span></h3>
        <div class="card-actions">
            <button class="edit-btn" onclick="editContact(${person.id})">✎</button>
            <button class="delete-btn" onclick="deleteContact(${person.id})">×</button>
        </div>
    </div>
    <div class="contact-details">
        <p><strong>${person.job || 'No Title'}</strong></p>
        <p>📧 ${person.email}</p>
        <p>📞 ${person.phone || 'No Phone'}</p>
    </div>
    <div class="${taskClass}" onclick="toggleTask(${person.id})">
        ${person.completed ? '✅' : '📝'} ${person.task || 'No active task'}
    </div>
`;
