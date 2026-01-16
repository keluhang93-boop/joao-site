// components/PhotoCard.js
export function PhotoCard(title, description) {
    return `
        <div class="card">
            <h3>${title}</h3>
            <p>${description}</p>
        </div>
    `;
}
