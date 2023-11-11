
let info = document.getElementById('more-info-container');
let title = document.getElementById('page-title');

// getting the heroInfo on clicking the moreinfo
let heroInfo = JSON.parse(localStorage.getItem("heroInfo"));

// changing the title name according to superhero character
title.innerHTML = heroInfo.name + " | Superhero";

window.addEventListener("load", function () {
     // getting the favouritesCharacterIDs for displaying the appropriate button accoring to the existance of character in favourites
     let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
     if (favouritesCharacterIDs == null) {
          favouritesCharacterIDs = new Map();
     } else if (favouritesCharacterIDs != null) {
          favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
     }

     // adding the information into DOM 
     info.innerHTML =
          `
               <div class="flex-row hero-name">${heroInfo.name}</div>
               <div class="flex-row heroimg-moreinfo">
                    <img id="portraitImage" class="hero-img" src="${heroInfo.portraitImage}" alt="">
                    <img style="display:none;" id="landscapeImage" src="${heroInfo.landscapeImage}" alt="">
                    <div class="flex-col more-info">
                         <div class="flex-row id">
                              <b>ID:</b><span>${heroInfo.id}</span>
                         </div>
                         <div class="flex-row comics">
                              <b>Comics:</b><span>${heroInfo.comics}</span>
                         </div>
                         <div class="flex-row series">
                              <b>Series:</b><span>${heroInfo.series}</span>
                         </div>
                         <div class="flex-row stories">
                              <b>Stories:</b><span>${heroInfo.stories}</span>
                         </div>
                    </div>
               </div>
               <div class="flex-col hero-discription">
                    <b>Description:</b>
                    <p>${heroInfo.description != "" ? heroInfo.description : "No Description Available..."}</p>
               </div>
               <div style="display:none;">
                    <span>${heroInfo.name}</span>
                    <span>${heroInfo.portraitImage}</span>
                    <span>${heroInfo.landscapeImage}</span>
                    <span>${heroInfo.id}</span>
                    <span>${heroInfo.comics}</span>
                    <span>${heroInfo.series}</span>
                    <span>${heroInfo.stories}</span>
                    <span>${heroInfo.squareImage}</span>
                    <span>${heroInfo.description}</span>
               </div>
               <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${heroInfo.id}`) ? "<i class=\"fa-solid fa-heart-circle-minus\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
          `
     addEvent();
})


// changing the character image size for different screen size and landscape image for small screen size and potrait image for bigger screen sizes
window.addEventListener('resize', function () {
     let portraitImage = document.getElementById('portraitImage');
     let landscapeImage = document.getElementById('landscapeImage');

     if (document.body.clientWidth < 678) {
          portraitImage.style.display = "none";
          landscapeImage.style.display = "block";
     } else {
          landscapeImage.style.display = "none";
          portraitImage.style.display = "block";
     }
})

//add to favourite button
function addEvent() {
     let favouriteButton = document.querySelector('.add-to-fav-btn');
     favouriteButton.addEventListener("click", addToFavourites);
}

// on clicking the favourite button creates new oject that contain relevant info and move that to favouritesArray
function addToFavourites() {
     if (this.innerHTML == '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites') {
          let heroInfo = {
               name: this.parentElement.children[3].children[0].innerHTML,
               description: this.parentElement.children[3].children[8].innerHTML,
               comics: this.parentElement.children[3].children[4].innerHTML,
               series: this.parentElement.children[3].children[5].innerHTML,
               stories: this.parentElement.children[3].children[6].innerHTML,
               portraitImage: this.parentElement.children[3].children[1].innerHTML,
               id: this.parentElement.children[3].children[3].innerHTML,
               landscapeImage: this.parentElement.children[3].children[2].innerHTML,
               squareImage: this.parentElement.children[3].children[7].innerHTML
          }

          // getting the favourite array.if the user is running website for the first time functionArray is null if not it will added to array 
          let favouritesArray = localStorage.getItem("favouriteCharacters");
          if (favouritesArray == null) {
               favouritesArray = [];
          } else {
               favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          }

          // here trying to check whether the character is already added to favourites or not.
          // if the character is already added then it will displays "Remove form favourites" instead of "Add to favourites"
          // if the character is not added to favourite it will initalize with empty map.else coverts them into map.
          // storing the new favouritecharaterID map and coverts them to string and sets the newfavouritecharacters as new character
          
          let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
          if (favouritesCharacterIDs == null) {
               favouritesCharacterIDs = new Map();
          } else {
               favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          }

          favouritesCharacterIDs.set(heroInfo.id, true);
          favouritesArray.push(heroInfo);

          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
          localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));

          // Convering the "Add to Favourites" button to "Remove from Favourites"
          this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';

          // Displaying the "Added to Favourites" notification toast to DOM
          document.querySelector(".fav-toast").setAttribute("data-visiblity","show");

          // Deleting the "Added to Favourites" notification toast from DOM after 1 seconds
          setTimeout(function(){
               document.querySelector(".fav-toast").setAttribute("data-visiblity","hide");
          },1000);
     }



     // For removing the character form favourites array
     else{

          // storing the id of character 
          let idOfCharacterToBeRemoveFromFavourites = this.parentElement.children[3].children[3].innerHTML;

          // getting the favourites array from localStorage for removing the character object which is to be removed
          let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));

          // getting the favaourites character ids array for deleting the character id from favouritesCharacterID
          let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));

          
          // will display the charcters which should be displyed after the deletion of the character to be removed
          let newFavouritesArray = [];


          // deleting the character from map 
          favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);

          // creating the new array which does not include the deleted character
          favouritesArray.forEach((favourite) => {
               if(idOfCharacterToBeRemoveFromFavourites != favourite.id){
                    newFavouritesArray.push(favourite);
               }
          });


          // Updating the new array in localStorage
          localStorage.setItem("favouriteCharacters",JSON.stringify(newFavouritesArray));
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));


          // changes the "Remove from Favourites" button to "Add to Favourites" 
          this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';


          // Displaying the "Remove from Favourites" Notification toast & 
          // removes the "remove from favourites" Notification toast after one-second
          document.querySelector(".remove-toast").setAttribute("data-visiblity","show");
          setTimeout(function(){
               document.querySelector(".remove-toast").setAttribute("data-visiblity","hide");
          },1000);
        
     }     
}

