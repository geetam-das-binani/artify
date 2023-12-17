import { generateImages } from "./model/model.js";
const section = document.querySelector(".section");
const nav__items = Array.from(document.getElementsByTagName("li"));
const favourites = document.querySelector("#favourites");

import { saveFavourites, generatePhotosOnNavClick } from "./model/model.js";

generateImages(); // populating images on page load

nav__items.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    if (e.target.innerHTML === "Favourites") return;
    generatePhotosOnNavClick(e.target.innerHTML);
  });
});

favourites.addEventListener("click", () => {
  section.innerHTML =
    saveFavourites?.length > 0
      ? saveFavourites
          ?.map(
            (item) =>
              ` <div id=${item?.id} class="card">
      <img
        src=${item?.urls?.small || ""}
        alt="image"
       
      />

     
     
    </div>`
          )
          .join("")
      : "No Favourites added yet";
});
