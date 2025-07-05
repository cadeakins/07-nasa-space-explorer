// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

//Find button element on page
const getImagesButton = document.getElementById('getImagesButton');
const gallery = document.getElementById('gallery');

const apiKey = 'HOSHGsx4HT19ThGnfPWyiw05aadQfQmgSP7TGJVS';

// Create a modal element and add it to the page
const modal = document.createElement('div');
modal.id = 'imageModal';
modal.style.display = 'none'; // Hide by default
modal.innerHTML = `
  <div class="modal-content">
    <span class="modal-close">&times;</span>
    <img class="modal-img" src="" alt="">
    <h2 class="modal-title"></h2>
    <p class="modal-date"></p>
    <hr class="modal-divider"> <!-- Divider line -->
    <p class="modal-explanation"></p>
  </div>
`;
document.body.appendChild(modal);

// Get modal elements for later use
const modalImg = modal.querySelector('.modal-img');
const modalTitle = modal.querySelector('.modal-title');
const modalDate = modal.querySelector('.modal-date');
const modalExplanation = modal.querySelector('.modal-explanation');
const modalClose = modal.querySelector('.modal-close');

// Close modal when X is clicked
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Close modal when clicking outside modal content
modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

//Listen for button clicks
getImagesButton.addEventListener('click', async () => {
  //Loading message
  gallery.innerHTML = `<p> 🔄 Loading space photos…<\p>`;

  //Get the start and end dates from the input fields
  const startDate = startInput.value;
  const endDate = endInput.value;

  //Build NASA APOD API URL with the selected date range
  const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;

  //Log for debugging
  console.log(`Fetching images from ${startDate} to ${endDate}...`);
  console.log(`API URL: ${apiUrl}`);

  try { 
    //Fetch dates from NASA's APOD API
    const response = await fetch(apiUrl);
    //Parse the JSON response
    const data = await response.json();

    //Clear the gallery before adding new images
    gallery.innerHTML = '';

    //Loop through each item in data array
    data.forEach(item => {
      //Only display if item is an image
      if (item.media_type === 'image') {
        //Create div for each image and its info
        const imageCard = document.createElement('div');
        imageCard.className = 'gallery-item';

        //Create the image element
        const img = document.createElement('img');
        img.src = item.url;
        img.alt = item.title;

        //Create the title element
        const title = document.createElement('h3');
        title.textContent = item.title;

        //Format the date to "Month Day, Year"
        const dateObj = new Date(item.date);
        const day = dateObj.getDate();
        //Function to get correct suffix
        function getDaySuffix(day) {
          if (day > 3 && day < 21) return 'th';
          switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
          }
        }
        const month = dateObj.toLocaleString('default', { month: 'long' });
        const year = dateObj.getFullYear();
        const formattedDate = `${month} ${day}${getDaySuffix(day)}, ${year}`;

        //Create the date element
        const dateElement = document.createElement('p');
        dateElement.textContent = formattedDate;

        //Add image, title, and date to card
        imageCard.appendChild(img);
        imageCard.appendChild(title);
        imageCard.appendChild(dateElement);

        //Add card to the gallery
        gallery.appendChild(imageCard);

        // Add a click event to each gallery item to open the modal
        imageCard.addEventListener('click', () => {
          // Set modal image, title, date, and explanation
          modalImg.src = item.url;
          modalImg.alt = item.title;
          modalTitle.textContent = item.title;
          modalDate.textContent = formattedDate;
          modalExplanation.textContent = item.explanation;
          modal.style.display = 'flex'; // Show the modal
        });
      }
    });

    //If no images found, show message
    if (gallery.innerHTML === '') {
      gallery.textContent = 'No images found for this date range';
    }

  } catch (error) {
    console.error(`Error fetching images: ${error.message}`);
  }
});