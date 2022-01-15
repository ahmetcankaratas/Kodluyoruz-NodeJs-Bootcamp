// Gusto & RemoteTeam Node.js Bootcamp
// assignment # 1
// Ahmet Can Karataş

// DOM'dan oyuncu classını seçelim
const players = document.querySelectorAll('.player');
// The Document method querySelector() returns the first Element within the document that matches the specified selector

// Seçilen classa listener atayalım

players.forEach(player => {
  player.addEventListener('dragstart', dragStart);
}
)

// Evente atanan fonksiyonu tanımlayalım

function dragStart(e){
    e.dataTransfer.setData('text/plain', e.target.id)
// The DataTransfer object is used to hold the data that is being dragged during a drag and drop operation.
// The dataTransfer.setData() method sets the data type and the value of the dragged data
  console.log( e.target.id)
  setTimeout(() => {
    e.target.classList.add('hide');
  }, 0);  
// best practice
}

// Drag eventleri için css rulesları hazırlayalım

const teams = document.querySelectorAll('.team');

teams.forEach(team => {
    team.addEventListener('dragenter', dragEnter)
    team.addEventListener('dragover', dragOver);
    team.addEventListener('dragleave', dragLeave);
    team.addEventListener('drop', drop);
});

// Fonksiyonları tanımlayalım

function dragEnter(e) {
  e.preventDefault();
  e.target.classList.add('drag-over');
}

// The preventDefault() method of the Event interface tells the user agent that if the event does not get explicitly handled, its default action should not be taken as it normally would be.

function dragOver(e) {
  e.preventDefault();
  e.target.classList.add('drag-over');
}

function dragLeave(e) {
  e.target.classList.remove('drag-over');
}

function drop(e){
  e.target.classList.remove('drag-over');

  // Drag yaptığımız elementi seçelim

const id = e.dataTransfer.getData('text/plain');
// The DataTransfer.getData() method retrieves drag data (as a DOMString) for the specified type. If the drag operation does not include data, this method returns an empty string.

const draggable = document.getElementById(id);

// player classi sürüklediğimiz targeta tanımlayalım
e.target.appendChild(draggable);

// classi tekrar görünür kılalım
draggable.classList.remove('hide');
}


// Kaynakça
//https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/mozItemCount
//https://www.w3schools.com/html/html5_draganddrop.asp
//https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
//https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
//https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/getData