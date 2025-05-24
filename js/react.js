const navElements = document.querySelectorAll(".nav_elements");
const catIcon = document.querySelector('#cat-icon');
const logo = document.querySelector('#logo');
const profile = document.querySelector("#profile");
const presentationWin = document.querySelector("#presentation-window");
const apiWin = document.querySelector('#random-api') ;
const apiContent = apiWin.querySelector('.win_content') ;
const startMenu = document.querySelector('#start_menu');
let catFolders = document.querySelectorAll('.category');
let activeFolder = null;
let buttons;
let lastHoveredButton;
// to move around windows :)
let dragZoneEls = document.querySelectorAll('.drag-zone');

updateDateTime();
setInterval(updateDateTime, 1000);
showWindow(presentationWin);

[logo, profile, startMenu].forEach(element => {
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


if (dragZoneEls) {
    dragZoneEls.forEach(el => {
        el.addEventListener('mousedown', (e) => {
            const win = el.closest('.window');
            if (!win) return;
            // Get initial mouse and window positions
            const offsetX = e.clientX - win.offsetLeft;
            const offsetY = e.clientY - win.offsetTop;

            // Function to handle moving
            const onMouseMove = (e) => {
                win.style.left = `${e.clientX - offsetX}px`;
                win.style.top = `${e.clientY - offsetY}px`;
            };

            // Function to stop moving
            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            // Attach listeners
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
}

if (catIcon) {
    catIcon.addEventListener('click', () => {
        showWindow(apiWin);
        useApi('cat');
    });
}


function adjustButtons() {
    buttons = document.querySelectorAll('.button');
    if (buttons.length > 0) {

        lastHoveredButton = buttons[0]
        lastHoveredButton.classList.add('hovered');
        Array.from(buttons).forEach(button => {
            for (let i = 0; i < 4; i++) {
                let selection = document.createElement('img');
                selection.src = '/images/selection.svg';
                button.appendChild(selection);
            }
        })
        Array.from(buttons).forEach(button => {
            /* pour le hover */
            button.addEventListener('mouseenter', handleHover);
            button.addEventListener('mouseleave', () => {
                lastHoveredButton.classList.add('hovered');
            });
        });

    }
}

function handleHover() {
    Array.from(buttons).forEach(button => button.classList.remove('hovered'));
    this.classList.add('hovered');
    lastHoveredButton = this;
}

function hideWindow(window) {
    let thisWinContent = window.querySelector('.win_content') ;
    thisWinContent.innerHTML = '';
    window.classList.remove('show');
    void window.offsetWidth;
    window.classList.add('hide');
    let currentSelectedFolder = document.querySelector('.selected');
    if (currentSelectedFolder) {
        currentSelectedFolder.classList.remove('selected');
    }
    setTimeout(() => {
        window.style.top = '50%';
        window.style.left = '50%';
        window.style.transform = 'translate(-50%, -50%)';
    }, 300);
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

function catFoldersInteract() {
    catFolders.forEach(folder => {
        let folderIcon = folder.querySelector('.minimize-folder');
        folderIcon.addEventListener('click', () => {
            checkFolderState(folderIcon, folder);
        });
        let catTitle = folder.querySelector('.cat-title');
        catTitle.addEventListener('click', () => {
            activeFolder = catTitle.id;
            changeSelectedFolder(catTitle, 'category');
        });

        let projectsTitle = folder.querySelectorAll('.project-title');
        projectsTitle.forEach(project => {
            project.addEventListener('click', () => {
                activeFolder = project.dataset.id;
                changeSelectedFolder(project, 'project');
            });
        });
    })
}

function changeSelectedFolder(folder, type) {
    let currentSelectedFolder = document.querySelector('.selected');
    if (currentSelectedFolder) {
        currentSelectedFolder.classList.remove('selected');
    }
    folder.classList.add('selected');
    if (type === 'category') {
        displayProjects();
    } else if (type === 'project') {
        let catParent = folder.closest('.category');
        let category = catParent.querySelector('.cat-title').id;
        displayProjectDetails(category);
    }

}

function checkFolderState(folderIcon, folder) {
    let projects = folder.querySelector('.projects-folders');
    if (folderIcon.classList.contains('show-more')) {
        projects.style.display = 'flex';
        folderIcon.classList.remove('show-more');
        folderIcon.classList.add('show-less');
        folderIcon.src = folderIcon.dataset.minus;
    } else {
        projects.style.display = 'none';
        folderIcon.classList.remove('show-less');
        folderIcon.classList.add('show-more');
        folderIcon.src = folderIcon.dataset.plus;
    }
}

function useApi(apiCase) {
    apiContent.innerHTML = '' ;
    switch (apiCase) {
        case 'cat':
            catApi()
            break;
        default:
            hideWindow(apiWin);
            console.log("error: unkown API");
    }
}

function catApi() {
    fetch("https://cataas.com/cat?json=true")
        .then(response => {
            if (!response.ok) {
                hideWindow(apiWin);
                throw new Error('Erreur ' + response.status + ': ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            let imgEL = document.createElement('img') ;
            imgEL.src = data.url ;
            imgEL.alt = 'random cat' ;
            apiContent.appendChild(imgEL) ;
            imgEL.classList.add('cat-img') ;
        })
        .catch(error => {
            hideWindow(apiWin);
            console.log(error);
        });
}