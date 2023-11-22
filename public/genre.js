document.getElementById("addGenreBtn").addEventListener("click", async () => {
  try {
    const genreName = document.getElementById("genreName").value;
    if (!genreName) {
      alert("Genre is required!!");
    } else {
      const data = {
        name: genreName,
      };

      const response = await fetch("/genre", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      console.log(response);  
      if (!response.ok) {
        // Check for HTTP error status
        const errorMessage = await response.text();
        if (errorMessage === "Genre already exists.") {
          alert("Genre already exists. Please choose a different name.");
          return;
        }
        throw new Error(`Failed to add genre: ${response.statusText}`);
      }

      // If the request is successful, proceed with updating the UI
      const genreDiv = document.createElement("div");
      genreDiv.innerHTML = `
      <p>${genreName}</p>
      <button class="deleteGenreBtn">Delete</button>
      `;

      document.getElementById("genreContainer").appendChild(genreDiv);
      document.getElementById("genreName").value = "";
    }
  } catch (error) {
    console.error(error.message);
  }
});

async function fetchGenres() {
  try {
    const response = await fetch("/genre/genres");
    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }
    return response.json();
  } catch (error) {
    console.error(error.message);
    return [];
  }
}

async function renderGenres() {
  const genres = await fetchGenres();
  const genreContainer = document.getElementById("genreContainer");
  genreContainer.innerHTML = ""; // Clear existing content
  genres.forEach((genre) => {
    const genreDiv = document.createElement("div");
    genreDiv.innerHTML = `
      <p>${genre.name}</p>
      <button class="deleteGenreBtn" data-genre-id="${genre._id}">Delete</button>
    `;
    genreContainer.appendChild(genreDiv);
  });
}

window.addEventListener("load", renderGenres);

async function handleDeleteButtonClick(event) {
  const genreId = event.target.dataset.genreId;
  if (!genreId){

  };

  try {
    const response = await fetch(`/genre/${genreId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete genre: ${response.statusText}`);
    }

    // Remove the deleted genre from the UI
    const deletedGenreDiv = event.target.closest("div");
    deletedGenreDiv.remove();
  } catch (error) {
    console.error(error.message);
  }
}

document.getElementById("genreContainer").addEventListener("click", (event) => {
  if (event.target.classList.contains("deleteGenreBtn")) {
    handleDeleteButtonClick(event);
  }
});