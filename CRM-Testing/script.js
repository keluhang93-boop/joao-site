// 1. LOAD DATA: Try to get data from storage; if empty, use an empty array
let contacts = JSON.parse(localStorage.getItem('myCrmData')) || [];

const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');

// Initial render to show saved data immediately on page load
renderContacts();

// Function to save the current state to Local Storage
function saveToLocalStorage() {
    localStorage.setItem('myCrmData', JSON.stringify(contacts));
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newContact = {
        id: Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        task: document.getElementById('task-desc').value
    };

    contacts.push(newContact);
    
    // SAVE & RENDER
    saveToLocalStorage();
    renderContacts();
    
    contactForm.reset();
});

function renderContacts() {
    contactList.innerHTML = ''; 

    contacts.forEach(person => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        
        card.innerHTML = `
            <div class="card-header">
                <h3>${person.name}</h3>
                <button class="delete-btn" onclick="deleteContact(${person.id})">×</button>
            </div>
            <p>${person.email}</p>
            <div class="task-tag">📝 Task: ${person.task || 'No tasks yet'}</div>
        `;
        
        contactList.appendChild(card);
    });
}

function deleteContact(id) {
    contacts = contacts.filter(contact => contact.id !== id);
    
    // SAVE & RENDER
    saveToLocalStorage();
    renderContacts();
}
