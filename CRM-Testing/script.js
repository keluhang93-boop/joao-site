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
// FIXED: Added the missing closing quote below
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
    
    const taskInput = document.getElementById('task-desc').value;

    const data = {
        name: document.getElementById('name').value,
        job: document.getElementById('job-title').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        priority: document.getElementById('priority').value,
    };

    if (editId) {
        contacts = contacts.map(c => {
            if (c.id === editId) {
                return { ...c, ...data };
            }
            return c;
        });
    } else {
        contacts.push({ 
            id: Date.now(), 
            ...data, 
            tasks: [{ 
                id: Date.now(), 
                text: taskInput || "New Lead added", 
                completed: false 
            }]
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
    cancelBtn.style.setProperty('display', 'none', 'important');
    // We don't automatically close the form here so you can add multiple leads
}

function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        editId = id;
        document.getElementById('name').value = contact.name;
        document.getElementById('job-title').value = contact.job || "";
        document.getElementById('email').value = contact.email;
        document.getElementById('phone').value = contact.phone || "";
        document.getElementById('task-desc').value = ""; 
        document.getElementById('priority').value = contact.priority;

        submitBtn.innerText = "Update Lead";
        submitBtn.style.background = "#059669"; 
        cancelBtn.style.setProperty('display', 'block', 'important');

        formContainer.classList.add('show');
        toggleBtn.classList.add('rotate-btn');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// --- ACTIVITY LOG LOGIC ---

function toggleSubTask(contactId, taskId) {
    contacts = contacts.map(c => {
        if (c.id === contactId) {
            c.tasks = c.tasks.map(t => t.id === taskId ? {...t, completed: !t.completed} : t);
        }
        return c;
    });
    saveToLocalStorage();
    renderContacts();
}

function addNewSubTask(contactId) {
    const note = prompt("Enter new activity or task:");
    if (note) {
        contacts = contacts.map(c => {
            if (c.id === contactId) {
                if(!c.tasks) c.tasks = [];
                c.tasks.push({ id: Date.now(), text: note, completed: false });
            }
            return c;
        });
        saveToLocalStorage();
        renderContacts();
    }
}

function deleteContact(id) {
    if (confirm("Are you sure you want to delete this lead?")) {
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

function renderContacts() {
    contactList.innerHTML = ''; 
    
    statTotal.innerText = contacts.length;
