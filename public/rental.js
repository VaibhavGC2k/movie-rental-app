window.addEventListener("load", renderRentals);

async function fetchRentals() {
  try {
    const response = await fetch("/rental/rentals");
    if (!response.ok) {
      throw new Error("Failed to fetch movies");
    }
    return response.json();
  } catch (error) {
    console.error(error);
  }
}

async function renderRentals() {
  let rentalCounter = 1;
  const rentals = await fetchRentals();
  const rentalTableBody = document.getElementById("rentalTableBody");
  rentalTableBody.innerHTML = ""; // Clear existing content
  rentals.forEach((rental) => {
    const rentalRow = document.createElement("tr");
    rentalRow.innerHTML = `
    <td>${rentalCounter}</td>
    <td>${rental.title}</td>
    <td>${rental.genre}</td>
    <td>${rental.dailyRentalRate}</td>
    <td>${rental.user}</td>
    <td>${rental.email}</td>
    <td>${rental.dateout}</td>
    <td>${rental.dateIn}</td>
    <td>${rental.rentalFee}</td>
    <td></td>
    <td></td>
    <td>
        <button class="updateMovieBtn">UPDATE</button>
        <button class="deleteMovieBtn">DELETE</button>
    </td>
  `;
    rentalTableBody.appendChild(rentalRow);
    rentalCounter++;
  });
}

document
  .getElementById("rentalTableBody")
  .addEventListener("click", async function (event) {
    //Update data using Delete Button
    if (event.target.classList.contains("updateMovieBtn")) {
      let row = event.target.closest("tr");
      let rentalId =  row.querySelector("td:first-child").innerHTML
      let ID = rentalId-1
      console.log(ID)
      try{
        const rentals = await fetchRentals();
        const data = {
          _id:rentals[ID]._id,
          dailyRentalRate:rentals[ID].dailyRentalRate
        }
        console.log("this is sent data",data)
        const response = await fetch("/rental", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`Failed to update rental: ${response.statusText}`);
        }
        alert('Rented Movie Updated Successfully')
      }catch(error){
        console.log(error.message)
      }
    }
    //Delete data using Delete Button
    else if (event.target.classList.contains("deleteMovieBtn")) {
      // Delete button clicked
      let row = event.target.closest("tr");
      let rentalId =  row.querySelector("td:first-child").innerHTML
      let ID = rentalId-1
      console.log(ID)
      try {
        const rentals = await fetchRentals();
        console.log(ID)
        const data = {
          _id: rentals[ID]._id
        };
        const response = await fetch("/rental", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(`Failed to delete rental: ${response.statusText}`);
        }
        row.remove();
        alert('Rented Movie Removed Successfully')
      } catch (error) {
        console.log(error.message);
      }
    }
  });
