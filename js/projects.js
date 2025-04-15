const gameIcon = document.querySelector("#game-icon") ;
const webIcon = document.querySelector("#web-icon") ;
const uxIcon = document.querySelector("#ux-icon") ;
const audiovizIcon = document.querySelector("#audioviz-icon") ;
const projectsWin = document.querySelector("#projects-window") ;

gameIcon.addEventListener('click' , ()=>{
    showWindow(projectsWin) ;
})