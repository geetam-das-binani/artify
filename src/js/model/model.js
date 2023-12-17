import { createApi } from "unsplash-js";
const section = document.querySelector(".section");
const unsplash = createApi({
  accessKey: "a1u-YdKXRbWQcBpVTt1rn5HS4ved1xyYVCqbCmTyO0E",
});

export const saveFavourites = JSON.parse(localStorage.getItem("saved")) || [];


export const generateImages = () => {
  unsplash.search
    .getPhotos({
      query: "Modern Art",
      page: 1,
      perPage: 12,
      orientation: "portrait",
    })
    .then((res) => {
      if (res.type === "success") {
        const photos = res.response.results;

        section.innerHTML = photos
          .map(
            (item) =>
              ` <div id=${item.id} class="card">
            <img
              src=${item.urls.small}
              alt="image"
              id=${item.id}
              
            />
            
            <i  id=${item.id} class="fa-solid fa-heart"></i> 
          
          </div>`
          )
          .join("");
      }
      attachEvent(); // attach events to images and heart icons after dom has been painted
    })
    .catch((e) => console.log(e));
};

export function generatePhotosOnNavClick(navtext) {
  unsplash.search
    .getPhotos({
      query: `${navtext}`,
      page: 1,
      perPage: 12,
      orientation: "portrait",
    })
    .then((res) => {
      if (res.type === "success") {
        const photos = res.response.results;

        section.innerHTML = photos
          .map(
            (item) =>
              ` <div id=${item.id} class="card">
              <img
            src=${item.urls.small}
           alt="image"
           id=${item.id}
            />

        <i id=${item.id} class="fa-solid fa-heart"></i> 
   
       </div>`
          )
          .join("");
      }
      attachEvent(); // attach events to images and heart icons after dom has been painted with new photos after clicking on nav
    })
    .catch((e) => console.log(e));
}

function attachEvent() {
  // attach click  event to images
  document.querySelectorAll("img").forEach((elem) => {
    elem.addEventListener("click", async (e) => {
      const photoId = e.target.id;
      unsplash.photos
        .get({ photoId })
        .then((res) => {
          if (res.type === "success") {
            const photoDetails = res.response;

            showDetails(photoDetails); // upon clicking images takes the photoId and show some details
          } else {
            console.error("Error fetching photo details:", res.errors);
          }
        })
        .catch((error) => {
          section.innerHTML = "Image and details are currently unavailable";
        });
    });
  });

  // attach click  event to heart icons
  document.querySelectorAll(".fa-heart").forEach((elem) => {
    elem.addEventListener("click", (e) => {
      const photoId = e.target.id;

      e.target.style.color = "red";
      e.target.style.transform = "scale(1.1)";
      unsplash.photos.get({ photoId }).then((res) => {
        if (res.type === "success") {
          const photoDetails = res.response;

          saveFavourites.push(photoDetails);
          localStorage.setItem("saved", JSON.stringify(saveFavourites)); // upon clicking heart icons get details and save locally
        }
      });
    });
  });
}


function convertToUpperCase(text){
  return text? text.charAt(0).toUpperCase()+text.slice(1):""
}
function showDetails(details) {
  section.innerHTML = "";

  section.innerHTML = `<div class="details">
      <img src=${details?.urls?.small || ""} alt="image">
      <div >
        <p>
          ${details?.description || details.topics[0].title || ""}
        </p>
        <p>Likes-${details?.likes || details?.views}</p>
        <p>User-${details?.user?.name}</p>
        <p>Downloads-${details?.downloads || ""}</p>
        <p>Tag-${convertToUpperCase(details?.tags_preview[0]?.title) || ""}</p>
        <p>Created at-${new Date(details.created_at).toLocaleDateString()}</p>
      

      </div>
    </div>`;
}
