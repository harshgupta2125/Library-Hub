async function searchBooks() {
    const searchTerm = document.getElementById("searchInput").value;
    const resultsDiv = document.getElementById("results");

    resultsDiv.innerHTML = "";

    if (!searchTerm.trim()) {
      resultsDiv.innerHTML =
        "<p class='text-center text-white py-4'>Please enter a search term.</p>";
      return;
    }

    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.totalItems === 0) {
        resultsDiv.innerHTML =
          "<p class='text-center text-white py-4'>No books found.</p>";
        return;
      }
      data.items.slice(0, Math.min(data.totalItems, 50)).forEach((item) => {
        const volumeInfo = item.volumeInfo;
        const title = volumeInfo.title || "Title not available";
        const authors = volumeInfo.authors
          ? volumeInfo.authors.join(", ")
          : "Author not available";
        
        const fullDescription = volumeInfo.description || "Description not available";
        const words = fullDescription.split(/\s+/);
        const description = words.length > 50 
          ? words.slice(0, 50).join(' ') + '...'
          : fullDescription;

        const imageLinks = volumeInfo.imageLinks;
        const thumbnail = imageLinks
          ? imageLinks.thumbnail
          : "https://via.placeholder.com/128";

        const bookContainer = document.createElement("div");
        bookContainer.className = "book-container bg-white shadow-md p-4 rounded max-w-3xl mx-auto mb-4";

        const imageElement = document.createElement("img");
        imageElement.className = "book-image w-32 h-auto";
        imageElement.src = thumbnail;
        imageElement.alt = title;
        bookContainer.appendChild(imageElement);

        const bookInfo = document.createElement("div");
        bookInfo.className = "book-info ml-4";
        bookInfo.innerHTML = `
          <h3 class="text-xl font-semibold mb-2">${title}</h3>
          <p class="mb-2"><strong>Author(s):</strong> ${authors}</p>
          <div class="description min-h-[100px] text-lg text-gray-700">${description}</div>
        `;
        
        bookContainer.appendChild(bookInfo);

        const infoLink = volumeInfo.infoLink || "#";
        bookContainer.addEventListener("click", () => {
          window.open(infoLink, "_blank");
        });
        resultsDiv.appendChild(bookContainer);
      });
    } catch (error) {
      console.error("Error fetchingbooks:", error);
      resultsDiv.innerHTML =
        "<p class='text-center text-white py-4'>An error occurred while searching.</p>";
    }
  }


// Mobile menu functionality
const mobileMenuButton = document.getElementById('mobile-menu-button');
const closeMenuButton = document.getElementById('close-menu');
  const mobileMenu = document.getElementById('mobile-menu');

  mobileMenuButton.addEventListener('click', () => {
      mobileMenu.classList.add('active');
  });

  closeMenuButton.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('active') && 
          !mobileMenu.contains(e.target) && 
          !mobileMenuButton.contains(e.target)) {
          mobileMenu.classList.remove('active');
      }
  });