const navElements = document.querySelectorAll(".nav_elements");
const logo = document.querySelector('#logo');
const profile = document.querySelector("#profile");
const presentationWin = document.querySelector("#presentation-window");

updateDateTime();
setInterval(updateDateTime, 1000);
showWindow(presentationWin);

[logo, profile].forEach(element => {
    element.addEventListener('click', () => {
        showWindow(presentationWin);
    });
});

navElements.forEach(element => {
    element.querySelectorAll('*').forEach(child => {
        child.addEventListener("click", () => {
            const window = child.closest('.window');
            hideWindow(window);
        })
    });
});

function hideWindow(window) {
    window.classList.remove('show');
    void window.offsetWidth;
    window.classList.add('hide');
}

function showWindow(window) {
    window.classList.remove('hide');
    void window.offsetWidth;
    window.style.display = 'flex';
    window.classList.add('show');
}


function updateDateTime() {
    const timeEl = document.getElementById("time");
    const dateEl = document.getElementById("date");

    const now = new Date();

    const time = now.toLocaleTimeString('en-GB');

    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const date = `${day}/${month}/${year}`;

    if (timeEl) timeEl.textContent = time;
    if (dateEl) dateEl.textContent = date;
}