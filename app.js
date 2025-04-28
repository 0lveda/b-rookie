const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function toggleSidebar(){
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')

  closeAllSubMenus()
}

function toggleSubMenu(button){

  if(!button.nextElementSibling.classList.contains('show')){
    closeAllSubMenus()
  }

  button.nextElementSibling.classList.toggle('show')
  button.classList.toggle('rotate')

  if(sidebar.classList.contains('close')){
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
  }
}

function closeAllSubMenus(){
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
  })
}

/*gallery*/
	const initSlider = () => {
    const imageList = document.querySelector(".slider-wrapper .image-list");
    const slideButtons = document.querySelectorAll(".slider-wrapper .slide-button");
    const sliderScrollbar = document.querySelector(".container .slider-scrollbar");
    const scrollbarThumb = sliderScrollbar.querySelector(".scrollbar-thumb");
    const maxScrollLeft = imageList.scrollWidth - imageList.clientWidth;
    
    // Handle scrollbar thumb drag
    scrollbarThumb.addEventListener("mousedown", (e) => {
        const startX = e.clientX;
        const thumbPosition = scrollbarThumb.offsetLeft;
        const maxThumbPosition = sliderScrollbar.getBoundingClientRect().width - scrollbarThumb.offsetWidth;
        
        // Update thumb position on mouse move
        const handleMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const newThumbPosition = thumbPosition + deltaX;

            // Ensure the scrollbar thumb stays within bounds
            const boundedPosition = Math.max(0, Math.min(maxThumbPosition, newThumbPosition));
            const scrollPosition = (boundedPosition / maxThumbPosition) * maxScrollLeft;
            
            scrollbarThumb.style.left = `${boundedPosition}px`;
            imageList.scrollLeft = scrollPosition;
        }

        // Remove event listeners on mouse up
        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }

        // Add event listeners for drag interaction
        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
    });

    // Slide images according to the slide button clicks
    slideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const direction = button.id === "prev-slide" ? -1 : 1;
            const scrollAmount = imageList.clientWidth * direction;
            imageList.scrollBy({ left: scrollAmount, behavior: "smooth" });
        });
    });

     // Show or hide slide buttons based on scroll position
    const handleSlideButtons = () => {
        slideButtons[0].style.display = imageList.scrollLeft <= 0 ? "none" : "flex";
        slideButtons[1].style.display = imageList.scrollLeft >= maxScrollLeft ? "none" : "flex";
    }

    // Update scrollbar thumb position based on image scroll
    const updateScrollThumbPosition = () => {
        const scrollPosition = imageList.scrollLeft;
        const thumbPosition = (scrollPosition / maxScrollLeft) * (sliderScrollbar.clientWidth - scrollbarThumb.offsetWidth);
        scrollbarThumb.style.left = `${thumbPosition}px`;
    }

    // Call these two functions when image list scrolls
    imageList.addEventListener("scroll", () => {
        updateScrollThumbPosition();
        handleSlideButtons();
    });
}

window.addEventListener("resize", initSlider);
window.addEventListener("load", initSlider);

/*Writing*/
document.querySelectorAll('.tracing-card').forEach(card => {
  const canvas = card.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const colorPicker = card.querySelector('.color-picker');
  const clearBtn = card.querySelector('.clear-btn');

  let painting = false;

  const startDraw = e => {
    painting = true;
    draw(e);
  };

  const endDraw = () => {
    painting = false;
    ctx.beginPath();
  };

  const draw = e => {
    if (!painting) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = colorPicker.value;

    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  };

  canvas.addEventListener('mousedown', startDraw);
  canvas.addEventListener('mouseup', endDraw);
  canvas.addEventListener('mouseout', endDraw);
  canvas.addEventListener('mousemove', draw);

  clearBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  });
});

/*FLASHCARDS*/
const cards = document.querySelectorAll('.card');
let centeredCard = null; // Keep track of the currently centered card
let scrollPosition = 0;   // Store scroll position when card is clicked

cards.forEach(card => {
  card.addEventListener('click', () => {
    // If the clicked card is already centered, restore scroll and remove the effect
    if (centeredCard === card) {
      // Restore the previous scroll position
      window.scrollTo(0, scrollPosition);
      
      // Remove the centered effect and dimming
      centeredCard.classList.remove('centered');
      cards.forEach(otherCard => {
        otherCard.classList.remove('dimmable');
      });

      // Reset the centered card
      centeredCard = null;
      
      // Remove the blur effect from the description
      document.body.classList.remove('card-focused');
      return; // Exit if the same card is clicked again
    }

    // If another card is already centered, reset it
    if (centeredCard) {
      centeredCard.classList.remove('centered');
      centeredCard.classList.remove('dimmable');
    }

    // Store the current scroll position before making any changes
    scrollPosition = window.scrollY;

    // Add the centered class to the clicked card
    card.classList.add('centered');
    card.classList.remove('dimmable'); // Ensure the clicked card is not dimmed

    // Dim the other cards
    cards.forEach(otherCard => {
      if (otherCard !== card) {
        otherCard.classList.add('dimmable');
      }
    });

    // Update the centered card variable
    centeredCard = card;

    // Scroll to the top of the page to center the card
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // After a brief delay to allow the scroll to finish, center the card
    setTimeout(() => {
      card.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center' // Ensures the card is horizontally centered
      });
    }, 300); // Delay to make sure the scroll to the top happens first

    // Add the blur effect to the description when a card is centered
    document.body.classList.add('card-focused');
  });
});

/*STORIES*/
let currentBook = null;
let currentPage = 0;
let pages = [];
let tabs = document.querySelectorAll('.tab'); // Get all tabs

// Show only the current page
function showPage(pageIndex) {
  pages.forEach((page, index) => {
    page.style.display = index === pageIndex ? "block" : "none";
  });
}

// Next page
function nextPage() {
  if (currentPage < pages.length - 1) {
    currentPage++;
    showPage(currentPage);
  }
}

// Previous page
function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    showPage(currentPage);
  }
}

// Toggle book cover
function toggleBookCover(el) {
  const book = el.closest('.book'); // Get the closest .book wrapper
  const bookWrapper = el.closest('.book-wrapper'); // Get the book wrapper

  // If already open, just toggle
  if (el.classList.contains('open')) {
    el.classList.remove('open');
    return;
  }

  // Close any other open books (optional but recommended)
  document.querySelectorAll('.cover.open').forEach(openCover => {
    openCover.classList.remove('open');
  });

  // Open the clicked cover
  el.classList.add('open');

  // Set currentBook and reset pages
  currentBook = bookWrapper;
  pages = book.querySelectorAll('.page');
  currentPage = 0;
  showPage(currentPage);
}

function showBook(bookNumber) {
  // Hide all books first
  const books = document.querySelectorAll('.book-wrapper');
  books.forEach(book => {
    book.classList.remove('active'); // Remove active class
    book.style.display = 'none'; // Make sure other books are hidden
  });

  // Remove active class from all tabs
  tabs.forEach(tab => tab.classList.remove('active'));

  // Show the selected book
  const selectedBook = document.getElementById('book' + bookNumber);
  selectedBook.classList.add('active');  // Make the selected book visible
  selectedBook.style.display = 'flex'; // Set display to flex to show the book

  // Add the active class to the corresponding tab
  const selectedTab = document.querySelector(`.tab:nth-child(${bookNumber})`);
  selectedTab.classList.add('active');

  // Close the cover of the book (reset the cover to its initial state)
  const bookCover = selectedBook.querySelector('.cover');
  if (bookCover.classList.contains('open')) {
    toggleBookCover(bookCover);  // This will close the cover
  }

  // Initialize the book's page system
  pages = selectedBook.querySelectorAll('.page');
  currentPage = 0;
  showPage(currentPage); // Show the first page of the selected book
}

window.onload = function() {
  // Show Book 1 by default when the page loads
  showBook(1);
};









  












