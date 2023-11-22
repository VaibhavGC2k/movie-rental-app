window.addEventListener("load", renderMoviesAndGenres);
let movieCounter = 1;
const genreDropdown = document.getElementById("gf");
genreDropdown.addEventListener("change", function () {
  const selectedGenre = genreDropdown.value;
  renderMoviesByGenre(selectedGenre);
});

async function fetchMovies() {
  try {
    const response = await fetch("/movie/movies");
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

async function fetchAndRenderGenres() {
  try {
    const genres = await fetchGenres(); 
    // updateGenreDropdown1(genres);
    updateGenreDropdown2(genres);
  } catch (error) {
    console.error(error);
  }
}

async function renderMoviesAndGenres() {
  await fetchAndRenderGenres(); // Fetch and render genres first
  await renderMovies(); // Then render movies
}

function renderMoviesByGenre(selectedGenre) {
  const movieTableBody = document.getElementById("movieTableBody");
  movieTableBody.innerHTML = ""; // Clear existing content
  // Otherwise, fetch and render movies based on the selected genre
  fetchMoviesByGenre(selectedGenre);
}

async function renderMovies() {
  const movies = await fetchMovies();
  const movieTableBody = document.getElementById("movieTableBody");
  movieTableBody.innerHTML = ""; // Clear existing content
  movies.forEach((movie) => {
    const movieRow = document.createElement("tr");
    movieRow.innerHTML = `
    <td>${movieCounter}</td>
    <td>${movie.title}</td>
    <td>${movie.genre}</td>
    <td>${movie.dailyRentalRate}</td>
    <td>${movie.IMDBRating}</td>
    <td><button class="rentMovieBtn">RENT</button></td>
  `;
    movieTableBody.appendChild(movieRow);
    movieCounter++;
  });
}

async function fetchMoviesByGenre(selectedGenre) {
  let movieCounter = 1;
  try {
    const response = await fetch(`/movie/movies?genre=${selectedGenre}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch movies for genre ${selectedGenre}`);
    }
    const movies = await response.json();
    const movieTableBody = document.getElementById("movieTableBody");
    movieTableBody.innerHTML = ""; // Clear existing content
    movies.forEach((movie) => {
      if (movie.genre == selectedGenre) {
        const movieRow = document.createElement("tr");
        movieRow.innerHTML = `
        <td>${movieCounter}</td>
        <td>${movie.title}</td>
        <td>${movie.genre}</td>
        <td>${movie.dailyRentalRate}</td>
        <td>${movie.IMDBRating}</td>
        <td><button class="rentMovieBtn">RENT</button></td>
        `;
        movieTableBody.appendChild(movieRow);
        movieCounter++;
      }
    });
  } catch (error) {
    console.error(error);
  }
}

function createMovieRow(movie) {
  const movieRow = document.createElement("tr");
  movieRow.innerHTML = `
    <td>${movieCounter}</td>
    <td>${movie.title}</td>
    <td>${movie.genre}</td>
    <td>${movie.dailyRentalRate}</td>
    <td>${movie.IMDBRating}</td>
    <td><button class="rentMovieBtn">RENT</button></td>
  `;
  return movieRow;
}

// Assuming you have a fetchGenres function defined
async function fetchGenres() {
  try {
    const response = await fetch("/genre/genres");
    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

function updateGenreDropdown1(genres) {
  const genreDropdown1 = document.getElementById("genre");

  // Clear existing options
  genreDropdown1.innerHTML = "";

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Genre";
  genreDropdown1.appendChild(defaultOption);

  // Add new options based on fetched genres
  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.name;
    option.textContent = genre.name;
    genreDropdown1.appendChild(option);
  });
}

function updateGenreDropdown2(genres) {
  const genreDropdown2 = document.getElementById("gf");

  genreDropdown2.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select Genre";
  genreDropdown2.appendChild(defaultOption);

  genres.forEach((genre) => {
    const option = document.createElement("option");
    option.value = genre.name;
    option.textContent = genre.name;
    genreDropdown2.appendChild(option);
  });
}


document.getElementById('movieTableBody').addEventListener('click', async function(event) {
  try{
    if (event.target.classList.contains('rentMovieBtn')) {
      let row = event.target.closest('tr');
      var Title = row.cells[1].innerHTML;
      var Genre = row.cells[2].innerHTML;
      var drr = row.cells[3].innerHTML;
      var imdbRating = row.cells[4].innerHTML;
    }
    const data = {
      title : Title,
      genre : Genre,
      dailyRentalRate : drr,
      IMDBRating:imdbRating
    }
    const response = await fetch("/rental", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to add rental: ${response.statusText}`);
    }
    alert('Movie Rented Successfully!!')
  }catch(error){
    console.log(error.message)
  }
});


const addMovieBtn = document.getElementById('addMovieBtn')
if(addMovieBtn){

  addMovieBtn.addEventListener("click", async () => {
    try {
      const movieName = document.getElementById("movieName").value;
      const genre = document.getElementById("genre").value;
      const drr = document.getElementById("drr").value;
      const imdb = document.getElementById("imdb").value;
      if (!movieName || !genre || !drr || !imdb) {
        alert("Please Enter Details!!");
      }
      const data = {
        title: movieName,
        genre: genre,
        dailyRentalRate: drr,
        IMDBRating: imdb,
      };
      const response = await fetch("/movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        // Check for HTTP error status
        const errorMessage = await response.text();
        if (errorMessage === "Movie already exists.") {
          alert("Movie already exists. Please choose a different Details.");
          return;
        } else {
          throw new Error(`Failed to add movie: ${response.statusText}`);
        }
      }
      document.getElementById("movieName").value = "";
      document.getElementById("genre").value = "";
      document.getElementById("drr").value = "";
      document.getElementById("imdb").value = "";
    } catch (error) {
      console.error(error.message);
    }
  });
}