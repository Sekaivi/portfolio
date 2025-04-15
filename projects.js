const gameIcon = document.querySelector("#game-icon") ;
const webIcon = document.querySelector("#web-icon") ;
const uxIcon = document.querySelector("#ux-icon") ;
const audiovizIcon = document.querySelector("#audioviz-icon") ;
const projectsWin = document.querySelector("#projects-window") ;

let uxData ;
let audiovizData ;
let gamesData ;
let webData ;

fetch('/json/projets.json')
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    uxData = data.UXUI ;
    audiovizData = data.audiovisuelle ;
    gamesData = data.games; 
    webData = data.web ;
    updateProjects(gamesData) ;
  })
  .catch(error => {
    console.error("There was a problem with the fetch:", error);
  });


gameIcon.addEventListener('click' , ()=>{
    showWindow(projectsWin) ;
})

function updateProjects(data){
    let container = projectsWin.querySelector(".noir") ;
    data.forEach(project => {
        let title = document.createElement('p') ;
        title.textContent = project.project_name ;
        container.appendChild(title) ;
    });
}