// Starting function 1
fetchData();

// fetch data from json has to be a asynic function to wait until data is received before moving ot next step. Without this sorting will happen to early
async function fetchData() {
  try {
    loaded = disable(true);
    // this fetches all the data for each image
    const response = await fetch('../data/galleryID.json'); 
    const data = await response.json();
    let fileTag = []
    // this sorts all the data out into name,tags,description
    for(let i = 0; i < data.length; i++) {
      let ObjData = data[i];
      fileName.push(ObjData.file);
      fileTag.push(ObjData.tags[0]);
      fileTags.push(fileTag[i].year+' '+fileTag[i].attributes);
      fileDesc.push(ObjData.description)
    }
    loaded = disable(false);
  }
  catch(error){console.log(error);}
}
// ensure data is fetched before allowing the page to work
function disable(boolean) {
  let button = document.getElementsByClassName('btn-secondary');
  for(let i = 0; i < button.length; i++) {
    let currentButton = button[i];
    if(boolean===true) {
      currentButton.disabled = true;
      return false;
    }
    else{currentButton.disabled = false;return true;}
  }
}
// all global vars
const fileName = [];
const fileTags = [];
const fileDesc = [];
const showDiv = document.getElementById('showdiv');
var loaded = false;
var globalFilter = undefined;
var globalEntrie = undefined;
var globalPageNo = undefined;
var globalTotalPage = undefined;
// starting function 2
initialise('all', 24, 1)

// This is the function that all buttons call 
function initialise(filter, entrie, pageNo) {
  disable(true);
  // checks if fetchData has gotten the data in json file
  if(loaded===false){setTimeout(() => {console.log('Not Loaded');initialise(filter, entrie, pageNo);}, 250);return;}
  // does starting checks and clears console and the div that all img are in
  if(pageNo===0){pageNo=1;}if(pageNo>globalTotalPage){pageNo-=1}
  console.clear();
  showDiv.replaceChildren();

  let popDivs = document.querySelectorAll('.pop');
  let popNum = undefined;
  popDivs.forEach(Element => Element.removeEventListener('click'));

  globalTotalPage = 0;
  globalFilter = filter;
  globalEntrie = entrie;
  globalPageNo = pageNo;

  let filterName = filterSelection(filter);
  let printDivObj = entries(entrie, filterName);
  printDiv(printDivObj, pageNo);
  pagination();

  popDivs = document.querySelectorAll('.pop');
  popDivs.forEach(Element => Element.addEventListener('click', event => {
    popNum = (event.target.getAttribute("data-Num").replace(/^\D+/g, '').replace('.jpg', '') - 1);
    popUp(popNum);
  }));
  disable(false);
}

// this function takes an the current filter and compares it to all the files tags
function filterSelection(filter) {
  console.log('Filter: '+filter);
  let filterName = [];
  let i = 0;
  // if the filter is 'all' it skips all the checks and just allows all to be printed
  if(filter==='all') {
    console.log('Items found: ' + fileName.length);
    return fileName;
  }
  // if not 'all' then it will cycle through each tag to check which one matches the current filter. If one tag matches it will be placed in filtername[] 
  for(let element of fileTags) {
    i += 1;
    if(element.includes(filter)) {
      filterName.push(fileName[i]);
    }
  }
  // the console logs are to manually check if page is working
  console.log('Items found: ' + filterName.length);
  return filterName;
}

// this function will only allow 'entrie' amount of imgs to be shown in 1 page.
function entries(entrie, filterName) {
  console.log('Entries: '+entrie);
  document.getElementById('item_perpage').textContent = entrie + ' items per page';
  let showEntry = [];
  let printDivObj = [];
  let itemNum = filterName.length;

  for(let i = 0; i < itemNum; i++) {
    showEntry.push(filterName[i]);

    if(showEntry.length===entrie || (i===(itemNum-1) && i % entrie !== 0)) {
      globalTotalPage += 1;
      console.log('page ' + globalTotalPage + ' has ' + showEntry.length + ' elements');
      printDivObj.push(showEntry);
      showEntry = [];
    }
  }
  return printDivObj;
}

function printDiv(printDivObj, pageNo) {
  // only create page for current page
  pageNo -= 1
  let printName = printDivObj[pageNo]

  for(let i = 0; i < printName.length; i++) {
    // Create parent div of img
    let newDiv = document.createElement('div');
    newDiv.setAttribute('class', 'col-4 pop');
    // Create img and all attributes for it
    let newImg = document.createElement('img');
    newImg.setAttribute('class', 'img-fluid rounded img-thumbnail');
    newImg.setAttribute('data-Num', printName[i])
    newImg.setAttribute('src', '../img/gallery_imgs/' + printName[i]);
    newImg.setAttribute('alt', fileTags[i])
    // append the img to created div
    // and append all that to the showDiv in html file.
    newDiv.appendChild(newImg);
    showDiv.appendChild(newDiv);
  }
}

// creates a dynamic pagination base on the number of pages image/entrie
function pagination() {
  let paginationStarting = document.getElementById('pageinStart');
  let paginationDiv = document.getElementById('paginationDiv');
  let clear = document.getElementsByClassName('clear');
  // to clear current pagination
  for(let element of clear) {
    setTimeout(() => {
      element.remove()
    }, 5);
  }
  // if there is only one page there will be no pagination (However due to the number of images i currently have this will never happen. It was written when i only had 13 images thus the default of 24 allowed me to not have any pagination)
  if(globalTotalPage === 1) {
    paginationDiv.style.display = 'none'; 
    return;
  }
  // creating the elements for the pagination
  for(let i = globalTotalPage; i > 0; i--) {
    let newList = document.createElement('li');
    newList.setAttribute('class','page-item pagination_item clear');

    let newA = document.createElement('a');
    newA.textContent = (i);
    newA.setAttribute('class','page-link');
    newA.setAttribute('onclick', 'initialise(globalFilter, globalEntrie, '+i+')');

    newList.appendChild(newA);
    paginationStarting.insertAdjacentElement('afterend', newList);
    paginationDiv.style.display = 'block';
  }
}

// this function will allow each image to be expanded after clicking to enlarge it and show its discrption
function popUp(popNum) {
  splitedtag = fileTags[popNum].split(' ')
  let modalHead = document.getElementById('label');
  let modalBody = document.getElementById('modalContent');
  // after the first use this is important so i can clear the image shown before it
  modalBody.replaceChildren();
  modalHead.textContent = fileTags[popNum];
  // the model is empty at the start so needs to create all the elements
  let img = document.createElement('img');
  let txt = document.createElement('p');
  let desctxt = document.createElement('p');
  img.setAttribute('src', '../img/gallery_imgs/' + fileName[popNum]);
  img.setAttribute('class', 'w-100');
  txt.textContent = 'This photo was taken during the ' + splitedtag[1] + ' ' + splitedtag[0] + ' event'
  txt.setAttribute('class', 'pt-5');
  desctxt.textContent = fileDesc[popNum]
  modalBody.appendChild(img);
  modalBody.appendChild(txt);
  modalBody.appendChild(desctxt);

  const myModal = new bootstrap.Modal(document.getElementById('imgmodel'));
  myModal.show();
}