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
        contacts.push({ id: Date.now(), ...data, completed: false });
    }

    saveToLocalStorage();
    renderContacts();
    resetForm();
});

function resetForm() {
    contactForm.reset();
    editId = null;
    submitBtn.innerText = "Add to Pipeline";
    submitBtn.style.background = ""; 
    cancelBtn.style.display = "none";
    renderContacts();
}

function editContact(id) {
    const contact = contacts.find(c => c.id === id);
    if (contact) {
        editId = id;
        document.getElementById('name').value = contact.name;
        document.getElementById('job-title').value = contact.job || "";
        document.getElementById('email').value = contact.email;
        document.getElementById('phone').value = contact.phone || "";
        document.getElementById('task-desc').value = contact.task;
        document.getElementById('priority').value = contact.priority;

        submitBtn.innerText = "Update Lead";
        submitBtn.style.background = "#059669"; 
        cancelBtn.style.display = "block";

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
    if (confirm("Are you sure?")) {
        contacts = [];
        saveToLocalStorage();
        renderContacts();
    }
}
