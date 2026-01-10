// Initializing an empty array for our data
let contacts = [];

const contactForm = document.getElementById('contact-form');
const contactList = document.getElementById('contact-list');

// Function to handle the form submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Stop page refresh

    // 1. Create the new contact object
    const newContact = {
        id: Date.now(),
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        task: document.getElementById('task-desc').value
    };

    // 2. Add to our array
    contacts.push(newContact);

    // 3. Update the UI
    renderContacts();

    // 4. Clear the form
    contactForm.reset();
});

// Function to draw the cards on the screen
function renderContacts() {
    contactList.innerHTML = ''; // Clear current list

    contacts.forEach(person => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        
        card.innerHTML = `
            <h3>${person.name}</h3>
            <p>${person.email}</p>
            <div class="task-tag">📝 Task: ${person.task || 'No tasks yet'}</div>
        `;
        
        contactList.appendChild(card);
    });
}

// ... (previous code above stays the same)

// Function to draw the cards on the screen
function renderContacts() {
    contactList.innerHTML = ''; 

    contacts.forEach(person => {
        const card = document.createElement('div');
        card.className = 'contact-card';
        
        // Notice the onclick calling our new deleteContact function
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

// NEW: Function to delete a contact
function deleteContact(id) {
    // Filter the array: keep only contacts whose ID does NOT match the one clicked
    contacts = contacts.filter(contact => contact.id !== id);
    
    // Redraw the UI
    renderContacts();
}
