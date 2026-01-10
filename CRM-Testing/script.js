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
// CORRIGIDO: Aspas fechadas corretamente abaixo
const submitBtn = contactForm.querySelector('button[type="submit"]'); 
const cancelBtn = document.getElementById('cancel-edit-btn');

// Carregamento Inicial
renderContacts();

function saveToLocalStorage() {
    localStorage.setItem('myCrmData', JSON.stringify(contacts));
}

// --- LÓGICA DO FORMULÁRIO ---
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
                text: taskInput || "Novo contacto adicionado", 
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

// --- LÓGICA DO ACTIVITY LOG (MULTIPLE TASKS) ---

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
    const note = prompt("Descreva a nova atividade ou nota:");
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
    if (confirm("Tens a certeza que queres eliminar este contacto?")) {
        contacts = contacts.filter(c => c.id !== id);
        saveToLocalStorage();
        renderContacts();
    }
}

function clearAllContacts() {
    if (confirm("Apagar todos os dados permanentemente?")) {
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
    let completedCount = 0;
    contacts.forEach(c => {
        if(c.tasks) completedCount += c.tasks.filter(t => t.completed).length;
    });
    statDone.innerText = completedCount;

    const filtered = contacts.filter(person => 
        person.name.toLowerCase().includes(searchTerm) || 
        person.email.toLowerCase().includes(searchTerm)
    );

    filtered.forEach(person => {
        const card = document.createElement('div');
        card.className = 'contact-card';

const tasksHTML = (person.tasks || []).map(t => `
    <div class="task-item">
        <span class="task-text ${t.completed ? 'completed' : ''}" 
              onclick="toggleSubTask(${person.id}, ${t.id})" 
              ondblclick="renameSubTask(${person.id}, ${t.id})"
              title="Click to check, Double-click to rename">
            ${t.completed ? '✅' : '○'} ${t.text}
        </span>
        <span class="delete-task-btn" onclick="deleteSubTask(${person.id}, ${t.id})">×</span>
    </div>
`).join('');
        
        card.innerHTML = `
            <div class="card-header">
                <div class="header-info">
                    <h3>${person.name}</h3>
                    <small>${person.job || 'Sem Título'}</small>
                </div>
                <div class="card-actions">
                    <button class="edit-btn" onclick="editContact(${person.id})">✎</button>
                    <button class="delete-btn" onclick="deleteContact(${person.id})">×</button>
                </div>
            </div>
            
            <div class="contact-details">
                <p>📧 ${person.email}</p>
                <p>📞 ${person.phone || 'Sem Telefone'}</p>
            </div>

            <div class="tasks-container">
                <div class="tasks-header">
                    <strong>Activity Log</strong>
                    <button class="add-subtask-btn" onclick="addNewSubTask(${person.id})">+</button>
                </div>
                ${tasksHTML}
            </div>

            <span class="priority-tag p-${person.priority}">${person.priority}</span>
        `;
        contactList.appendChild(card);
    });
}

// Rename a task on double-click
function renameSubTask(contactId, taskId) {
    const contact = contacts.find(c => c.id === contactId);
    const task = contact.tasks.find(t => t.id === taskId);
    
    const newText = prompt("Rename activity:", task.text);
    if (newText && newText.trim() !== "") {
        contacts = contacts.map(c => {
            if (c.id === contactId) {
                c.tasks = c.tasks.map(t => t.id === taskId ? {...t, text: newText} : t);
            }
            return c;
        });
        saveToLocalStorage();
        renderContacts();
    }
}

// Delete a single task from the log
function deleteSubTask(contactId, taskId) {
    if (confirm("Delete this activity note?")) {
        contacts = contacts.map(c => {
            if (c.id === contactId) {
                c.tasks = c.tasks.filter(t => t.id !== taskId);
            }
            return c;
        });
        saveToLocalStorage();
        renderContacts();
    }
}
