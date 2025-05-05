document.getElementById("last1hour").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = new URL(tabs[0].url);
        url.searchParams.set("f_TPR", "r3600");
        chrome.tabs.update(tabs[0].id, { url: url.toString() });
    });
});

document.getElementById("last6hours").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = new URL(tabs[0].url);
        url.searchParams.set("f_TPR", "r21600");
        chrome.tabs.update(tabs[0].id, { url: url.toString() });
    });
});

// Handle applying custom time with days, hours, and minutes
document.getElementById("applyCustomTime").addEventListener("click", () => {
    const days = document.getElementById("days").value || 0;
    const hours = document.getElementById("hours").value || 0;
    const minutes = document.getElementById("minutes").value || 0;

    // Convert the time into seconds
    const totalSeconds = (days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60);

    if (totalSeconds > 0) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            const url = new URL(tabs[0].url);
            url.searchParams.set("f_TPR", `r${totalSeconds}`);
            chrome.tabs.update(tabs[0].id, { url: url.toString() });
        });
    } else {
        alert("Please enter a valid time.");
    }
});
