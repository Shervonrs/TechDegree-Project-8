const $employee = $("#employee")[0];
const $closeBtn = $('.closeBtn')[0];
const $modalHTML = $('.modalHTML')[0];
const $modal = $("#modal")[0];
let info =[];
let employeeFullName =[]
let namesHTML;
let index;

// ====================================//
// ====================================//
// ==============Fetch=================//
// ====================================//

// Fetches content from randomuser api, generates html
fetch('https://randomuser.me/api/?results=12&nat=us&info')
// fetch('https://randomuser.me/api/?results=12&inc=picture,name,email,location&nat=us&info')
  .then(response => response.json())
  .then(data => generateHTML(data.results))
  .catch(err => {
    $employee.innerHTML ='<h2>Looks like something went wrong</h2>';
    console.log(err);
  })

// ====================================//
// ====================================//
// ==============Functions============//
// ====================================//

//Generates html for data from api
function generateHTML(data) {
  info = data;
  data.forEach((person, index) => {
    const div = document.createElement('div');
    $(div).addClass('employee-container');
    $(div).attr("data-index", index)
    $employee.appendChild(div);
    div.innerHTML = `
      <img src=${person.picture.large} class="avatar">
      <div class= "contact-info">
        <h3 class="names">${person.name.first} ${person.name.last}</h3>
        <p class="email"> ${person.email}</p>
        <p class="city"> ${person.location.city}</p>
      </div>
      `;
      // finds and stores all employee "names" html in variable namesHTML
    namesHTML =$.find('.names');
  })
  // filters first and last name from employee data
  // then pushes combined name into employeeFullName array
  info.filter(name => {
    let fullName = name.name.first + " " + name.name.last;
    employeeFullName.push(fullName)
  })
}

 //Using index from Employee Container, function creates and displays modal overlay
function modalContent (index){
  let number = info[index]
  let date = new Date(number.dob.date);
  let day = date.getDate();
  let year = date.getFullYear();
  // let months =['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  let month = date.getMonth() +1;
  let state = abbrState(number.location.state, 'abbr');

  $modalHTML.innerHTML = `
  <span class="next">&#10095;</span>
  <span class="previous">&#10094;</span>

  <div class= "modal-contact-info">
  <img src=${number.picture.large} class="avatarModal">
    <h3 class="names">${number.name.first} ${number.name.last}</h3>
    <p class="email"> ${number.email}</p>
    <p class="city"> ${number.location.city}</p>
  </div>
  <div class="moreInfo">
    <p class="cellphone"> ${number.cell}</p>
    <p class="address"> ${number.location.street}, ${state} ${number.location.postcode} </p>
    <p class="dob"> Birthday: ${month}/${day}/${year}</p>
  </div>
  `;
   $modal.style.display="block";

   // Selects Next and Previous Arrows and triggers eventlisteners
   // to change employee-container
   const $next = $('.next');
   const $previous = $('.previous');
   $next.on('click', next)
   $previous.on('click', previous)
   window.addEventListener('keydown', checkKey)
}

// Changes employee modal of based on keyboard input
function checkKey(e) {
  e=e|| window.event;
  if(e.keyCode === 37) {
    previous();
  }  else if (e.keyCode === 39) {
  next();
}
}

//Grabs index from container when clicked
function getContainerIndex(e) {
  const btn = e.target.closest('.employee-container');
  index = btn.getAttribute("data-index")
  if(index) {
    modalContent(index)
  }
}

// triggers function that changes the employee information in the modal
// based on index
function getIndex() {
  modalContent(index)
}

 //reduces value of index, changing the employee card displayed in modal
const previous= () => {
  if(index === 0){
    return false
  } else {
    index--;
    getIndex()
  }
}

//increases the value of index, changing the employee card displayed in modal
const next= () => {
  if(index === 11){
    return false
  }else {
    index++;
    getIndex()
  }
}

// function to close modal
function closeModal() {
  $modal.style.display = "none";
}

// function to close modal if clicked oustide
function clickOutside(e) {
  if(e.target === $modal){
  $modal.style.display = "none";
  }
}

// Turns US State names into Abbreviations
function abbrState(input, to){

    let states = [
        ['Arizona', 'AZ'],
        ['Alabama', 'AL'],
        ['Alaska', 'AK'],
        ['Arizona', 'AZ'],
        ['Arkansas', 'AR'],
        ['California', 'CA'],
        ['Colorado', 'CO'],
        ['Connecticut', 'CT'],
        ['Delaware', 'DE'],
        ['Florida', 'FL'],
        ['Georgia', 'GA'],
        ['Hawaii', 'HI'],
        ['Idaho', 'ID'],
        ['Illinois', 'IL'],
        ['Indiana', 'IN'],
        ['Iowa', 'IA'],
        ['Kansas', 'KS'],
        ['Kentucky', 'KY'],
        ['Kentucky', 'KY'],
        ['Louisiana', 'LA'],
        ['Maine', 'ME'],
        ['Maryland', 'MD'],
        ['Massachusetts', 'MA'],
        ['Michigan', 'MI'],
        ['Minnesota', 'MN'],
        ['Mississippi', 'MS'],
        ['Missouri', 'MO'],
        ['Montana', 'MT'],
        ['Nebraska', 'NE'],
        ['Nevada', 'NV'],
        ['New Hampshire', 'NH'],
        ['New Jersey', 'NJ'],
        ['New Mexico', 'NM'],
        ['New York', 'NY'],
        ['North Carolina', 'NC'],
        ['North Dakota', 'ND'],
        ['Ohio', 'OH'],
        ['Oklahoma', 'OK'],
        ['Oregon', 'OR'],
        ['Pennsylvania', 'PA'],
        ['Rhode Island', 'RI'],
        ['South Carolina', 'SC'],
        ['South Dakota', 'SD'],
        ['Tennessee', 'TN'],
        ['Texas', 'TX'],
        ['Utah', 'UT'],
        ['Vermont', 'VT'],
        ['Virginia', 'VA'],
        ['Washington', 'WA'],
        ['West Virginia', 'WV'],
        ['Wisconsin', 'WI'],
        ['Wyoming', 'WY'],
    ];

    if (to == 'abbr'){
        input = input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
        for(i = 0; i < states.length; i++){
            if(states[i][0] == input){
                return(states[i][1]);
            }
        }
    } else if (to == 'name'){
        input = input.toUpperCase();
        for(i = 0; i < states.length; i++){
            if(states[i][1] == input){
                return(states[i][0]);
            }
        }
    }
}

// ====================================//
// ====================================//
// ============EventListeners==========//
// ====================================/

$employee.addEventListener('click', getContainerIndex)
$closeBtn.addEventListener('click', closeModal)
window.addEventListener('click', clickOutside)

// Iterates over Employee Container displaying containers with matching
//search values
$('#search').on('keyup', () => {
  const input = $('#search').val().toLowerCase();
  employeeFullName.forEach((name,i) => {
    // Grabs container holding the name of each employee
    const h3ContactWrapper = namesHTML[i].closest('.employee-container');
    //Displays the inner contents of each HTML to show individualNames
    const h3IndividualName = namesHTML[i].innerText.toLowerCase();
    if(h3IndividualName.indexOf(input)> -1) {
      h3ContactWrapper.style.display = '';
    } else {
      h3ContactWrapper.style.display = 'none';
    }
  })
})
