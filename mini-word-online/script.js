let editor;
let wordCountDisplay;

window.onload = () => {
    editor = document.getElementById('editor');
    wordCountDisplay = document.getElementById('wordCount');

    // Word Counter
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

// Fixed Exact Font Size function
function changeFontSize(size) {
    if (!size) return;
    
    // We use a temporary command to create a span we can target
    document.execCommand("fontSize", false, "7"); // '7' is a dummy value
    
    // Find the font tag the browser just created and swap it for a styled span
    const fontElements = editor.getElementsByTagName("font");
    for (let i = 0; i < fontElements.length; i++) {
        if (fontElements[i].size === "7") {
            fontElements[i].removeAttribute("size");
            fontElements[i].style.fontSize = size + "px";
        }
    }
    editor.focus();
}
