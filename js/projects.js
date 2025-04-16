const gameIcon = document.querySelector("#game-icon");
const webIcon = document.querySelector("#web-icon");
const uxIcon = document.querySelector("#ux-icon");
const audiovizIcon = document.querySelector("#audioviz-icon");
const projectsWin = document.querySelector("#projects-window");
const winContent = document.querySelector("#win_content");


[gameIcon, webIcon, uxIcon, audiovizIcon].forEach(icon => {
  icon.addEventListener("click", () => {
    showWindow(projectsWin);
    activeFolder = icon.dataset.id
    let folder = document.querySelector(`#${activeFolder}`);
    changeSelectedFolder(folder, 'category');

  });
});


fetch('/json/projets.json')
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => {
    updateProjects(data);
    catFoldersInteract();
  })
  .catch(error => {
    console.error("There was a problem with the fetch:", error);
  });


function updateProjects(data) {
  Object.entries(data).forEach(([category, projects]) => {
    let catTitle = document.querySelector(`#${category}`);
    let catEl = catTitle.closest('.category');
    let projectsFolder = catEl.querySelector('.projects-folders');
    for (let i = 0; i < projects.length; i++) {
      let project = projects[i];
      let projectEl = document.createElement('div');
      projectEl.dataset.id = i;
      projectEl.classList.add('project-title');
      let projectimg = document.createElement('img');
      projectimg.classList.add('folder');
      projectimg.src = "/images/folder.svg";
      projectimg.alt = "folder icon";
      let projectTitle = document.createElement('p');
      projectTitle.textContent = project.project_name;
      projectEl.appendChild(projectimg);
      projectEl.appendChild(projectTitle);
      projectsFolder.appendChild(projectEl);
    }
  });
}


// fonction qui gere l'affichage des projets sans detauks
async function displayProjects() {
  winContent.innerHTML = '';
  let projectsData = await fetchDataProjects(activeFolder);
  let projectsContainer = document.createElement('div');
  projectsContainer.classList.add('projects-teaser');
  projectsData.forEach((project, index) => {
    let projectTeaser = document.createElement('div');
    projectTeaser.title = project.project_name;
    projectTeaser.classList.add('project-teaser');
    projectTeaser.id = index;
    projectTeaser.dataset.category = activeFolder;
    let projectCover = document.createElement('img');
    projectCover.src = project.cover;
    project.alt = project.project_name;
    projectName = document.createElement('p');
    projectName.textContent = project.project_name;
    projectTeaser.appendChild(projectCover);
    projectTeaser.appendChild(projectName);
    projectsContainer.appendChild(projectTeaser);

    projectTeaser.addEventListener('click', () => {
      activeFolder = index;
      let categoryP = projectTeaser.dataset.category;
      displayProjectDetails(categoryP);
    });
  })
  winContent.appendChild(projectsContainer);
}


async function displayProjectDetails(category) {
  let projectData = await fetchProject(category, activeFolder); // mettre le truc en param
  winContent.innerHTML = '';
  let projectContainer = document.createElement('div');
  projectContainer.classList.add('project-details');
  winContent.appendChild(projectContainer)
  // making the head
  let projectHead = document.createElement('div');
  projectContainer.appendChild(projectHead);
  projectHead.classList.add('project-head');
  // project date
  projectDate = document.createElement('p');
  projectHead.appendChild(projectDate);
  projectDate.classList.add('project-date');
  projectDate.textContent = projectData.date;
  // project tags
  let tagsContainer = document.createElement('div');
  projectHead.appendChild(tagsContainer);
  tagsContainer.classList.add('tags');
  let tags = projectData.tags;
  tags.forEach(tag => {
    let outerBorder = document.createElement('div');
    tagsContainer.appendChild(outerBorder);
    outerBorder.classList.add('tagOuterBorder');
    let innerBorder = document.createElement('div');
    outerBorder.appendChild(innerBorder);
    innerBorder.classList.add('tagInnerBorder');
    innerBorder.textContent = tag;
  })
  // content of project
  let detailsContainer = document.createElement('div');
  projectContainer.appendChild(detailsContainer);
  detailsContainer.classList.add('project-content');
  // cover
  let coverContainer = document.createElement('div');
  detailsContainer.appendChild(coverContainer);
  coverContainer.classList.add('project-cover');
  let coverImg = document.createElement('img');
  coverContainer.appendChild(coverImg);
  coverImg.src = projectData.cover;
  coverImg.alt = "Visuel de " + projectData.project_name;
  //presentation
  let presContainer = document.createElement('div');
  detailsContainer.appendChild(presContainer);
  presContainer.classList.add('project-presentation');
  // title
  let titleP = document.createElement('p');
  presContainer.appendChild(titleP);
  titleP.classList.add('details-title');
  titleP.textContent = projectData.project_name;
  // text
  let projectText = document.createElement('p');
  presContainer.appendChild(projectText);
  projectText.classList.add('project-text');
  projectText.textContent = projectData.description;
  //tools and links
  let tools_links = document.createElement('div');
  detailsContainer.appendChild(tools_links);
  tools_links.classList.add('tools-links');
  // links 
  let linksContainer = document.createElement('div');
  tools_links.appendChild(linksContainer);
  linksContainer.classList.add('links');
  let links = projectData.links;
  links.forEach(link => {
    let button = document.createElement('div');
    linksContainer.appendChild(button);
    button.classList.add('button');
    let linkContainer = document.createElement('a');
    button.appendChild(linkContainer);
    linkContainer.href = link.link_url;
    linkContainer.target = '_blank';
    let span = document.createElement('span');
    linkContainer.appendChild(span);
    span.textContent = link.link_name;
  });
  adjustButtons(); // pour ajouter les petits anim :D
  // tools
  let toolsContainer = document.createElement('div');
  tools_links.appendChild(toolsContainer);
  toolsContainer.classList.add('tools');
  let tools = projectData.tools;
  tools.forEach(tool => {
    let toolIcon = document.createElement('img');
    toolsContainer.appendChild(toolIcon);
    toolIcon.src = tool.tool_path;
    toolIcon.alt = tool.tool_name;
    toolIcon.title = tool.tool_name ;
  });
  //video container
  let videoContainer = document.createElement('div');
  detailsContainer.appendChild(videoContainer);
  videoContainer.classList.add('video-container');

  // Create iframe container
  let iframe = document.createElement('iframe');
  iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
  iframe.allowFullscreen = true;
  iframe.frameBorder = "0";

  // Assume `projectData.video` contains the YouTube *video ID* or full link
  let videoId = "";
  if (projectData.video.includes("youtube.com") || projectData.video.includes("youtu.be")) {
    // Extract ID from full YouTube link
    const match = projectData.video.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (match) {
      videoId = match[1];
    }
  } else {
    // Already just the video ID
    videoId = projectData.video;
  }

  if (videoId) {
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
  } else {
    // Fallback if ID couldn't be found or video is missing
    iframe.src = "/videos/fallback.html"; // or fallback video embed
    console.warn("Invalid or missing video ID. Fallback loaded.");
  }

  videoContainer.appendChild(iframe);



}



async function fetchDataProjects(query) {
  try {
    const response = await fetch('/json/projets.json');
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data[query];
  } catch (error) {
    console.error("There was a problem with the fetch:", error);
  }
}

async function fetchProject(query, index) {
  try {
    const response = await fetch('/json/projets.json');
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data[query][index];
  } catch (error) {
    console.error("There was a problem with the fetch:", error);
  }
}


