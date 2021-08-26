// Unsplash API
const COUNT = 10;
const API_KEY = '-I_A-lsrk0NqqskhktiGUeufPhhrOvmqLhzEes5DhAU';
const URL = `https://api.unsplash.com/photos/random/?client_id=${API_KEY}&count=${COUNT}`;

// HTML elements
const $loaderSpinner = document.getElementById('loader');
const $imageContainer = document.getElementById('image-container');

// Othe constants
const windowTotalHeight = window.innerHeight;

let photosReady = false; 
let imagesLoaded = 0;
let totalImages = 0;
let photosList = [];

// Check if each photo is loaded
function isImageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    $loaderSpinner.hidden = true;
    photosReady = true;
  }
}

// Fetch photos to the Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(URL);
    photosList = await response.json();
    displayPhotos(photosList)
  } catch (error) {
    // Catch error
  }
}

// Render each photo in the protoList array in the DOM
function displayPhotos(photosList) {
  imagesLoaded = 0;
  totalImages = photosList.length;
  
  photosList.forEach((photo, index) => {
    const {urls, alt_description, links} = photo;
    
    const a = document.createElement('a');
    a.href = links.html;
    a.target = '_blank';

    const img = document.createElement('img');
    img.alt = alt_description;
    img.title = alt_description;
    img.src = urls.regular;

    // Event listener, check when each photo is finshed loading
    img.addEventListener('load', isImageLoaded);

    a.appendChild(img);
    $imageContainer.appendChild(a);
  });
}

function isPageBottomReached(distanceScrolled, windowTotalHeight, bodyHeight) {
  return windowTotalHeight + distanceScrolled >= bodyHeight && photosReady
}

// Check to see if scrolling near bottom of page. If so, fetch more photos.
window.addEventListener('scroll', () => {
  const distanceScrolled = window.scrollY;
  const bodyHeight = document.body.offsetHeight - 1000;

  if(isPageBottomReached(distanceScrolled, windowTotalHeight, bodyHeight)) {
    getPhotos();
    photosReady = false;
  }
})

getPhotos();