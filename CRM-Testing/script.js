let contacts = JSON.parse(localStorage.getItem('myCrmData')) || [];

const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');

renderContacts();

function saveToLocalStorage() {
    localStorage.setItem('myCrmData', JSON.stringify(contacts));
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newContact = {
        id: Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        task: document.getElementById('task-desc').value,
        completed: false // NEW: Track task status
    };

    contacts.push(newContact);
    saveToLocalStorage();
    renderContacts();
    contactForm.reset();
});

// NEW: Function to flip the status of a task
function toggleTask(id) {
    contacts = contacts.map(contact => {
        if (contact.id === id) {
            return { ...contact, completed: !contact.completed };
        }
        return contact;
    });
    
    saveToLocalStorage();
    renderContacts();
}

function renderContacts() {
    contactList.innerHTML = ''; 

    contacts.forEach(person => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        
        // Dynamic class: Add 'completed' if person.completed is true
        const taskClass = person.completed ? 'task-tag completed' : 'task-tag';
        const taskIcon = person.completed ? '✅' : '📝';

        card.innerHTML = `
            <div class="card-header">
                <h3>${person.name}</h3>
                <button class="delete-btn" onclick="deleteContact(${person.id})">×</button>
            </div>
            <p>${person.email}</p>
            <div class="${taskClass}" onclick="toggleTask(${person.id})">
                ${taskIcon} Task: ${person.task || 'No tasks yet'}
            </div>
        `;
        
        contactList.appendChild(card);
    });
}

function deleteContact(id) {
    contacts = contacts.filter(contact => contact.id !== id);
    saveToLocalStorage();
    renderContacts();
}
