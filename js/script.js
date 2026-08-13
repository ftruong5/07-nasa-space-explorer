// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

const button = document.querySelector('button');
const gallery = document.getElementById('gallery');

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalExplanation = document.getElementById("modalExplanation");
const closeModal = document.getElementById("closeModal");

// My NASA API key
const API_KEY = "jsWCAEExdm9CYwMx5IA1O9zk9c9Iv7TN85A833Kh";

// Get space images from NASA
async function getSpaceImages() {
  
  // Get dates selected by user
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Make sure both dates selected
  if (!startDate || !endDate) {
    gallery.innerHTML = `
      <div class="placeholder">
        <p>Please select a start date and an end date.</p>
      </div>
    `;
    return;
  }

  // Loading Message
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔭</div>
      <p>Loading space images...</p>
    </div>
  `;

  // Create the NASA API URL
  const url =
    `https://api.nasa.gov/planetary/apod` +
    `?api_key=${API_KEY}` +
    `&start_date=${startDate}` +
    `&end_date=${endDate}`;

  try {

    // Ask NASA for the images
    const response = await fetch(url);

    // Check if the request worked
    if (!response.ok) {
      throw new Error("Something went wrong with the NASA API.");
    }

    // Turn NASA's response into JavaScript data
    const data = await response.json();

    // Show the images in the gallery
    displayImages(data);

  } catch (error)  {

    // Show error message if something went wrong
    console.error(error);

    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">⚠️</div>
        <p>Sorry, we couldn't load the space images.</p>
      </div>
    `;
  }
}

// Create gallery cards
function displayImages(images) {
  // Clear the old gallery content
  gallery.innerHTML = "";

  // Go through every image NASA gave us
  images.forEach(function (image) {

    // Only display images
    if (image.media_type !== "image") {
      return;
    }

    // Create a new gallery card
    const card = document.createElement("div");
    card.className = "gallery-item";

    // Open modal
    card.addEventListener("click", function () {
      openModal(image);
    });

    // Add the image, title, date, and explanation
    card.innerHTML = `
      <img src="${image.url}" alt="${image.title}">

      <h2>${image.title}</h2>

      <p><strong>Date:</strong> ${image.date}</p>
    `;

    // Add the card to the gallery
    gallery.appendChild(card);
  });

  // If there were no images, show a message
  if (gallery.innerHTML === "") {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🌌</div>
        <p>No images were found for this date range.</p>
      </div>
    `;
  }
}

function openModal(image) {
  modalImage.src = image.url;
  modalImage.alt = image.title;

  modalTitle.textContent = image.title;
  modalDate.textContent = "Date: " + image.date;
  modalExplanation.textContent = image.explanation;

  modal.style.display = "block";
}

closeModal.addEventListener("click", function () {
  modal.style.display = "none";
});

button.addEventListener("click", getSpaceImages);

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);
