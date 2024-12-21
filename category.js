const API_KEY = "Add your API key"; // Replace with your API key
    const API_BASE = "https://www.googleapis.com/books/v1/volumes";
    const app = document.getElementById("app");

    // Step 1: Display Categories
    const categories = [
      "Fiction",
      "Science",
      "History",
      "Technology",
      "Biography",
      "Philosophy",
      "Education",
      "Health & Fitness",
      "Travel",
      "Computers",
      "Law",
      "Foreign Language Study"
    ];
    function displayCategories() {
      app.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          ${categories
          .map(
            (category) => `
              <button 
                class="bg-blue-500 text-white p-4 rounded shadow-md hover:bg-blue-600"
                onclick="fetchBooks('${category}')"
              >
                ${category}
              </button>
            `
          )
          .join("")}
        </div>
      `;
    }


    // Step 2: Fetch and Display Books in a Category
    async function fetchBooks(category) {
      const response = await fetch(
        `${API_BASE}?q=subject:${category}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.items) {
        app.innerHTML = `
          <h2 class="text-2xl font-bold mb-4">Books in ${category}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${data.items
            .map(
              (book) => `
                <div class="bg-white shadow-md p-4 rounded">
                  <h3 class="text-xl font-semibold">${book.volumeInfo.title
                }</h3>
                  <p class="text-sm text-gray-600">${book.volumeInfo.authors?.join(", ") || "Unknown Author"
                }</p>
                  <button 
                    class="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onclick="viewBook('${book.id}')"
                  >
                    View Book
                  </button>
                </div>
              `
            )
            .join("")}
          </div>
          <button 
            class="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onclick="displayCategories()"
          >
            Back to Categories
          </button>
        `;
      } else {
        app.innerHTML = `<p class="text-red-500">No books found for this category.</p>`;
      }
    }
    async function fetchBooks(category) {
      const maxBooks = 100; // Number of books to fetch
      const batchSize = 40; // Maximum results per API request
      let books = [];

      for (let startIndex = 0; startIndex < maxBooks; startIndex += batchSize) {
        const response = await fetch(
          `${API_BASE}?q=subject:${category}&startIndex=${startIndex}&maxResults=${batchSize}&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.items) {
          books = books.concat(data.items);
        } else {
          break; // Exit the loop if no more books are available
        }
      }

      if (books.length > 0) {
        displayBooks(category, books);
      } else {
        app.innerHTML = `<p class="text-red-500">No books found for this category.</p>`;
      }
    }

    function displayBooks(category, books) {
      app.innerHTML = `
          <h2 class="text-2xl font-bold mb-4">Books in ${category} (${books.length} Results)</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            ${books
          .map(
            (book) => `
                <div class="bg-white shadow-md p-4 rounded">
                  <h3 class="text-xl font-semibold">${book.volumeInfo.title}</h3>
                  <p class="text-sm text-gray-600">${book.volumeInfo.authors?.join(", ") || "Unknown Author"}</p>
                  <button 
                    class="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onclick="viewBook('${book.id}')"
                  >
                    View Book
                  </button>
                </div>
              `
          )
          .join("")}
          </div>
          <button 
            class="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            onclick="displayCategories()"
          >
            Back to Categories
          </button>
        `;
    }


    // Step 3: Fetch and Display a Specific Book
    async function viewBook(bookId) {
      const response = await fetch(`${API_BASE}/${bookId}?key=${API_KEY}`);
      const book = await response.json();

      // Truncate description to exactly 50 words
      const description = book.volumeInfo.description || "No description available.";
      const words = description.split(/\s+/); // Split by any whitespace
      const truncatedDescription = words.length > 50 
        ? words.slice(0, 50).join(' ') + '...'
        : description;

      app.innerHTML = `
        <div class="bg-white shadow-md p-4 rounded max-w-3xl mx-auto">
          <h2 class="text-2xl font-bold mb-2">${book.volumeInfo.title}</h2>
          <div class="min-h-[100px] text-lg text-gray-700 mb-4">
            ${truncatedDescription}
          </div>
          <a 
            href="${book.volumeInfo.previewLink}" 
            target="_blank" 
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Read Full Book
          </a>
        </div>
        <button 
          class="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          onclick="displayCategories()"
        >
          Back to Categories
        </button>
      `;
    }

    // Initialize the app
    displayCategories();