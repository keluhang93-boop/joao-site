let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    editor.addEventListener('input', () => {
        const text = editor.innerText || "";
        const words = text.trim().split(/\s+/).filter(w => w.length > 0).length;
        wordCountDisplay.innerText = words;
    });
};

function formatDoc(cmd, value = null) {
    document.execCommand(cmd, false, value);
    editor.focus();
}

/**
 * FIXED SIZE LOGIC
 */
function changeFontSize(size) {
    if (!size) return;
    
    // Tell the browser to use CSS (px) instead of HTML (1-7)
    document.execCommand("styleWithCSS", false, true);
    
    // Apply the size
    document.execCommand("fontSize", false, "7"); 
    
    // Find that specific change and set it to the exact pixels
    const fontTags = editor.querySelectorAll('span, font');
    fontTags.forEach(tag => {
        if (tag.getAttribute('size') === "7" || tag.style.fontSize === "xxx-large") {
            tag.removeAttribute("size");
            tag.style.fontSize = size + "px";
        }
    });
    
    editor.focus();
}
