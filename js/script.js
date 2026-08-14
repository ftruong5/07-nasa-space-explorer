// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

const button = document.getElementById('exploreBtn');
const gallery = document.getElementById('gallery');

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");
const modalTitle = document.getElementById("modalTitle");
const modalDate = document.getElementById("modalDate");
const modalExplanation = document.getElementById("modalExplanation");
const closeModal = document.getElementById("closeModal");

const factText = document.getElementById("factText");
const newFactButton = document.getElementById("newFactButton");

// Space facts
const spaceFacts = [
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars are so dense that a teaspoon of their material would weigh billions of tons.",
  "There are more stars in the universe than there are grains of sand on all the beaches on Earth.",
  "Jupiter is the largest planet in our solar system.",
  "One million Earths could fit inside the Sun.",
  "Saturn's rings are made mostly of ice and rock.",
  "Mars has the largest volcano in the solar system, Olympus Mons.",
  "Light from the Sun takes about 8 minutes to reach Earth.",
  "The footprints left by astronauts on the Moon could last for millions of years.",
  "Space is completely silent because there is no air to carry sound."
];

// Pick a random space fact (make sure it's different every time)
let currentFact = -1;

function showRandomFact() {
  let randomNumber;

  do {
    randomNumber = Math.floor(Math.random() * spaceFacts.length);
  } while (randomNumber === currentFact);

  currentFact = randomNumber;

  factText.textContent = spaceFacts[randomNumber];
}

newFactButton.addEventListener("click", showRandomFact);

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
      <div class="loader"></div>
      <p>Exploring the cosmos...</p>
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

      <h2><span class="title-star">✦</span>${image.title}</h2>

      <p><strong>Date:</strong> ${image.date}</p>
    `;

    // Add the card to the gallery
    gallery.appendChild(card);
  });

  // If there were no images, show a message
  if (gallery.innerHTML === "") {
    gallery.innerHTML = `
      <div class="placeholder">
        <p>No images were found for this date range.</p>
      </div>
    `;
  }
}

function openModal(image) {
  modalImage.src = image.url;
  modalImage.alt = image.title;

  modalTitle.innerHTML = `<span class="title-star">✦</span>${image.title}`;
  modalDate.textContent = "Date: " + image.date;
  modalExplanation.textContent = image.explanation;

  modal.style.display = "flex";

  setTimeout(function () {
    modal.classList.add("show");
  }, 10);
}

closeModal.addEventListener("click", function () {
  modal.classList.remove("show");

  setTimeout(function () {
    modal.style.display = "none";
  }, 250);
});

button.addEventListener("click", getSpaceImages);

showRandomFact();

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);
