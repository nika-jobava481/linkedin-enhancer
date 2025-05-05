
function forceStyles() {
    // // Check if our style element already exists
    // let style = document.getElementById('remove-blur-style');

    // // Create it if it doesn't exist
    // if (!style) {
    //     style = document.createElement('style');
    //     style.id = 'linkedin-enhancer-custom-style';
    //     style.textContent = `
    //     * {
    //         filter: none !important;
    //         backdrop-filter: none !important;
    //     }

    //     .blurred-job-card {
    //         opacity: 1 !important;
    //     }

    //     `;
    //     document.head.appendChild(style);
    // }

    // // Handle inline styles on specific elements
    // document.querySelectorAll('.blurred-job-card').forEach(el => {
    //     el.style.opacity = '1';
    // });

    const url = window.location.href;
    const regex = /^https:\/\/www\.linkedin\.com\/in\/[^/]+\/overlay\/create-post\/$/;

    if (regex.test(url)) {
        document.querySelectorAll('.artdeco-modal__content').forEach(el => {
            el.classList.remove('artdeco-modal__content');
            el.classList.add('artdeco-modal__content-custom');
        });
    }

}

function addShortcutsList() {
    // Check if the shortcuts list already exists
    if (document.querySelector('.shortcuts-list')) {
        // console.log('Shortcuts list already added.');
        return; // Exit the function if the list already exists
    }

    // Find the target element where the shortcuts will be added before
    const targetElement = document.querySelector('.share-creation-state__text-editor');

    if (!targetElement) {
        // console.log('Target element not found!');
        return;
    }

    // Create a new div element to hold the list of shortcuts
    const shortcutsList = document.createElement('div');
    shortcutsList.classList.add('shortcuts-list'); // Optionally, add a class to style it

    // Create the content for the shortcuts
    const content = `
        <ul>
            <li><span>Ctrl + B</span> or <span>Alt + B</span> : Bold</li>
            <li><span>Ctrl + I</span> or <span>Alt + I</span> : Italic</li>
            <li><span>Ctrl + Alt + I</span> or <span>Ctrl + Alt + B</span> : Bold + Italic</li>
            <li><span>Ctrl + Q</span> or <span>Alt + Q</span> : Bullet List</li>
            <li><span>Ctrl + M</span> or <span>Alt + M</span> : Numbered List</li>
        </ul>
    `;

    // Set the innerHTML of the created div to include the shortcuts
    shortcutsList.innerHTML = content;

    // Insert the shortcuts list before the target element
    targetElement.parentNode.insertBefore(shortcutsList, targetElement);
}

setInterval(() => {
    forceStyles();
    addShortcutsList();
}, 1000);

function mapPlainToItalicUnicode(text) {
    return text.split('').map(char => italicMap[char] || char).join('');
}

function mapPlainToUnderlineUnicode(text) {
    return text.split('').map(char => underlineMap[char] || char).join('');
}

function mapPlainToBoldUnicode(text) {
    return text.split('').map(char => boldMap[char] || char).join('');
}



function applyBulletList() {
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    const items = selectedText.split("\n").map(item => item.trim()).filter(item => item !== "");

    const bulletList = items.map(item => `• ${item}`).join("\n");

    range.deleteContents();
    range.insertNode(document.createTextNode(bulletList));

}

function getStyledCodePoint(x, style) {
    const codePoint = x;

    if (style === "bold") {
        if (codePoint >= 65 && codePoint <= 90) return 119808 + (codePoint - 65); // Uppercase letters A-Z
        if (codePoint >= 97 && codePoint <= 122) return 119834 + (codePoint - 97); // Lowercase letters a-z
        if (codePoint >= 48 && codePoint <= 57) return 120782 + (codePoint - 48); // Numbers 0-9
    } else if (style === "italic") {
        if (codePoint === 72) return 119867; // Special handling for H
        if (codePoint === 104) return 8462; // Special handling for h
        if (codePoint >= 65 && codePoint <= 90) return 119860 + (codePoint - 65); // Uppercase letters A-Z
        if (codePoint >= 97 && codePoint <= 122) return 119886 + (codePoint - 97); // Lowercase letters a-z
        if (codePoint >= 48 && codePoint <= 57) return 120792 + (codePoint - 48); // Numbers 0-9
    } else if (style === "bold-italic") {
        if (codePoint >= 65 && codePoint <= 90) return 119912 + (codePoint - 65); // Uppercase letters A-Z
        if (codePoint >= 97 && codePoint <= 122) return 119938 + (codePoint - 97); // Lowercase letters a-z
        if (codePoint >= 48 && codePoint <= 57) return 120812 + (codePoint - 48); // Numbers 0-9
    }
    return codePoint;
}

function boldText(text) {
    // Split text into an array of characters



    let arr = text
        .split('')
        .filter(function (char) { return char !== ''; }) // Remove empty strings
        .map(function (char) {
            return String.fromCodePoint(getStyledCodePoint(char.charCodeAt(0), "bold")); // Apply bold styling to each character
        });

    // Remove extra consecutive newlines
    let result = [];
    let newlineCount = 0;

    arr.forEach(function (char) {
        if (char === '\n') {
            newlineCount++;
        } else {
            // If we encountered newlines, keep half of them
            if (newlineCount > 1) {
                let keep = Math.ceil(newlineCount / 2);
                for (let i = 0; i < keep; i++) {
                    result.push('\n');
                }
            }
            // Add the non-newline character to the result
            result.push(char);
            newlineCount = 0; // Reset the newline count after non-newline character
        }
    });

    // If the string ends with newlines, ensure we keep half of them
    if (newlineCount > 1) {
        let keep = Math.ceil(newlineCount / 2);
        for (let i = 0; i < keep; i++) {
            result.push('\n');
        }
    }

    // Join the result array back into a string and return
    return result.join('');
}


function applyBold() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return;
    }
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();
    const boldedText = boldText(selectedText);


    range.deleteContents();


    const newNode = document.createTextNode(boldedText);
    range.insertNode(newNode);


    const newRange = document.createRange();
    newRange.setStart(newNode, newNode.length);
    newRange.setEnd(newNode, newNode.length);

    selection.removeAllRanges();
    selection.addRange(newRange);
}


function italicText(text) {
    // Split text into an array of characters

    let arr = text
        .split('')
        .filter(function (char) { return char !== ''; }) // Remove empty strings
        .map(function (char) {
            return String.fromCodePoint(getStyledCodePoint(char.charCodeAt(0), "italic")); // Apply italic styling to each character
        });

    // Remove extra consecutive newlines
    let result = [];
    let newlineCount = 0;

    arr.forEach(function (char) {
        if (char === '\n') {
            newlineCount++;
        } else {
            // If we encountered newlines, keep half of them
            if (newlineCount > 1) {
                let keep = Math.ceil(newlineCount / 2);
                for (let i = 0; i < keep; i++) {
                    result.push('\n');
                }
            }
            // Add the non-newline character to the result
            result.push(char);
            newlineCount = 0; // Reset the newline count after non-newline character
        }
    });

    // If the string ends with newlines, ensure we keep half of them
    if (newlineCount > 1) {
        let keep = Math.ceil(newlineCount / 2);
        for (let i = 0; i < keep; i++) {
            result.push('\n');
        }
    }

    // Join the result array back into a string and return
    return result.join('');
}



function applyItalic() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return;
    }
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();


    const italicedText = italicText(selectedText)

    range.deleteContents();

    const newNode = document.createTextNode(italicedText);
    range.insertNode(newNode);

    const newRange = document.createRange();
    newRange.setStart(newNode, newNode.length);
    newRange.setEnd(newNode, newNode.length);


    selection.removeAllRanges();
    selection.addRange(newRange);
}

function boldItalicText(text) {
    // Split text into an array of characters

    let arr = text
        .split('')
        .filter(function (char) { return char !== ''; }) // Remove empty strings
        .map(function (char) {
            return String.fromCodePoint(getStyledCodePoint(char.charCodeAt(0), "bold-italic")); // Apply bold-italic styling to each character
        });

    // Remove extra consecutive newlines
    let result = [];
    let newlineCount = 0;

    arr.forEach(function (char) {
        if (char === '\n') {
            newlineCount++;
        } else {
            // If we encountered newlines, keep half of them
            if (newlineCount > 1) {
                let keep = Math.ceil(newlineCount / 2);
                for (let i = 0; i < keep; i++) {
                    result.push('\n');
                }
            }
            // Add the non-newline character to the result
            result.push(char);
            newlineCount = 0; // Reset the newline count after non-newline character
        }
    });

    // If the string ends with newlines, ensure we keep half of them
    if (newlineCount > 1) {
        let keep = Math.ceil(newlineCount / 2);
        for (let i = 0; i < keep; i++) {
            result.push('\n');
        }
    }

    // Join the result array back into a string and return
    return result.join('');
}

function applyBoldItalic() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return;
    }
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();


    const bolditalicedText = boldItalicText(selectedText)

    range.deleteContents();

    const newNode = document.createTextNode(bolditalicedText);
    range.insertNode(newNode);

    const newRange = document.createRange();
    newRange.setStart(newNode, newNode.length);
    newRange.setEnd(newNode, newNode.length);


    selection.removeAllRanges();
    selection.addRange(newRange);
}


// function applyUnderline() {
//     const selection = window.getSelection();
//     if (!selection || selection.rangeCount === 0) {
//         return;
//     }
//     const range = selection.getRangeAt(0);
//     const selectedText = selection.toString();

//     // const underlineText = mapPlainToUnderlineUnicode(selectedText);

//     const underlineText = selectedText
//         .split('\n')
//         .filter(line => line.trim() !== '')  // Remove empty strings or lines with only spaces
//         .map(line => mapPlainToUnderlineUnicode(line))
//         .join('\n');

//     range.deleteContents();

//     const newNode = document.createTextNode(underlineText);
//     range.insertNode(newNode);


//     const newRange = document.createRange();
//     newRange.setStart(newNode, newNode.length);
//     newRange.setEnd(newNode, newNode.length);


//     selection.removeAllRanges();
//     selection.addRange(newRange);
// }


const getBaseCodePoint = (x) => {
    if (x >= 119808 && x <= 119833) return 65 + (x - 119808);
    else if (x >= 119834 && x <= 119859) return 97 + (x - 119834);
    else if (x >= 120782 && x <= 120791) return 48 + (x - 120782);
    else if (x >= 119860 && x <= 119885) return 65 + (x - 119860);
    else if (x >= 119886 && x <= 119911) return 97 + (x - 119886);
    else if (x === 119867) return 72;
    else if (x === 8462) return 104;
    else if (x >= 120792 && x <= 120801) return 48 + (x - 120792);
    else if (x >= 119912 && x <= 119937) return 65 + (x - 119912);
    else if (x >= 119938 && x <= 119963) return 97 + (x - 119938);
    else if (x >= 120812 && x <= 120821) return 48 + (x - 120812);
    else return x;
};


// Function to revert styled text back to normal text (base ASCII)
function NormalText(text) {
    // Split text into an array of characters
    let arr = text
        .split('') // Split string into individual characters
        .map(function (char) {
            // Get the base Unicode code point (normal character) for each styled character
            return String.fromCodePoint(getBaseCodePoint(char.charCodeAt(0)));
        });

    // Remove extra consecutive newlines
    let result = [];
    let newlineCount = 0;

    arr.forEach(function (char) {
        if (char === '\n') {
            newlineCount++;
        } else {
            // If we encountered newlines, keep half of them
            if (newlineCount > 1) {
                let keep = Math.ceil(newlineCount / 2);
                for (let i = 0; i < keep; i++) {
                    result.push('\n');
                }
            }
            // Add the non-newline character to the result
            result.push(char);
            newlineCount = 0; // Reset the newline count after non-newline character
        }
    });

    // If the string ends with newlines, ensure we keep half of them
    if (newlineCount > 1) {
        let keep = Math.ceil(newlineCount / 2);
        for (let i = 0; i < keep; i++) {
            result.push('\n');
        }
    }

    // Join the result array back into a string and return
    return result.join('');
}

function applyNormalText() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
        return;
    }
    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();


    const normalizedText = NormalText(selectedText)

    range.deleteContents();

    const newNode = document.createTextNode(normalizedText);
    range.insertNode(newNode);

    const newRange = document.createRange();
    newRange.setStart(newNode, newNode.length);
    newRange.setEnd(newNode, newNode.length);


    selection.removeAllRanges();
    selection.addRange(newRange);
}

// function applyBulletList() {
//     const selection = window.getSelection();
//     const range = selection.getRangeAt(0);
//     const selectedText = selection.toString();

//     const items = selectedText.split("\n").map(item => item.trim()).filter(item => item !== "");

//     const bulletList = items.map(item => `• ${item}`).join("\n");

//     range.deleteContents();
//     range.insertNode(document.createTextNode(bulletList));

// }

function applyNumberList() {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedText = selection.toString();

    const lines = selectedText.split('\n').map(item => item.trim()).filter(item => item !== "");

    const numberedText = lines
        .map((line, index) => `${index + 1}. ${line}`)
        .join('\n');

    // Create a text node
    const textNode = document.createTextNode(numberedText);

    range.deleteContents();
    range.insertNode(textNode);

    // Optional: move the cursor after inserted text
    selection.removeAllRanges();
}





document.addEventListener('keydown', (event) => {
    if (event.ctrlKey && event.altKey && (event.key === 'b' || event.key === 'i')) {
        applyBoldItalic();
    }
    if (event.ctrlKey && event.key === 'b' || event.altKey && event.key === 'b') {
        applyBold();
    }
    if (event.ctrlKey && event.key === 'i' || event.altKey && event.key === 'i') {
        applyItalic();
    }
    if ((event.ctrlKey && event.key === 'q') || (event.altKey && event.key === 'q')) {
        applyBulletList();
    }
    if ((event.ctrlKey && event.key === 'm') || (event.altKey && event.key === 'm')) {
        applyNumberList();
    }
    if (event.altKey && event.key === 'n') {
        // applyNormalText();
    }
    if (event.ctrlKey && event.key === 'u') {
        // applyUnderline();
    }
});