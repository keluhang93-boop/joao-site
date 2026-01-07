let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    // Robust Word Counter
    editor.addEventListener('input', () => {
        const text = editor.innerText || "";
        const count = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        wordCountDisplay.innerText = count;
    });
};

function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editor.focus();
}

function changeFontSize(size) {
    if (!size) return;

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        // 1. Tell browser to use CSS
        document.execCommand("styleWithCSS", false, true);
        
        // 2. Apply a temporary unique size
        document.execCommand("fontSize", false, "7");

        // 3. Find the tags and clean them
        const fontTags = editor.querySelectorAll("font, span");
        fontTags.forEach(tag => {
            if (tag.getAttribute("size") === "7" || tag.style.fontSize === "xxx-large") {
                tag.removeAttribute("size");
                
                // Reset any nested font sizes to prevent the "jumping" bug
                const nested = tag.querySelectorAll("span");
                nested.forEach(n => n.style.fontSize = "inherit");
                
                // Apply exact size
                tag.style.fontSize = size + "px";
            }
        });
    }
    editor.focus();
}
