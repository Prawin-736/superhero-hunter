// Public key
// bfd81a9b42d63126e70b472053322105

// Private Key
// c43a0d047c0d6dc0cfdc83eea64d051e97fc3a59

// hash
// 1c43a0d047c0d6dc0cfdc83eea64d051e97fc3a59bfd81a9b42d63126e70b472053322105
// md5(hash) = 8f92348560bfe70e203b644dce7b218d
// "https://gateway.marvel.com/v1/public/characters?ts=1&apikey=bfd81a9b42d63126e70b472053322105&hash=8f92348560bfe70e203b644dce7b218d"
// var MD5 = require("crypto-js/md5"); 
// console.log(MD5("1c43a0d047c0d6dc0cfdc83eea64d051e97fc3a59bfd81a9b42d63126e70b472053322105").toString());




 // Selecting the element from DOM
 let searchBar = document.getElementById("search-bar");
 let charListUl = document.getElementById("charListUl");
 let searchResults = document.getElementById("search-results");


function getCharacters() {
     // API call to get the data
     let char_url =  "https://gateway.marvel.com/v1/public/characters?ts=1&apikey=bfd81a9b42d63126e70b472053322105&hash=8f92348560bfe70e203b644dce7b218d";
     getCharApi(char_url);
   }
 
   getCharacters();
 
 // Fetching the data of all the characters to display on the home page
 async function getCharApi(char_url) {
   const res = await fetch(char_url);
   const data = await res.json();
   renderCharList(data.data.results);
 }
 
 // Rendering the characters list in the homepage
 function renderCharList(data) {
   const charListUl = document.getElementById("charListUl");
   charListUl.innerHTML = "";
 
   data.forEach((hero) => {
     charListUl.innerHTML += `
     <div class="flex-col card">
     <img src="${hero.thumbnail.path+'/standard_fantastic.' + hero.thumbnail.extension}" alt="">
     <span class="name">${hero.name}</span>
     <span class="id">Id : ${hero.id}</span>
     <span class="comics">Comics : ${hero.comics.available}</span>
     <span class="series">Series : ${hero.series.available}</span>
     <span class="stories">Stories : ${hero.stories.available}</span>
</div>
           `;
   });
  
 }

 
 // Adding eventListener to search bar so when stared searching character it hides the character in homepage and display search result
 searchBar.addEventListener("input", () => {
     if (searchBar.value.length > 0) {
         charListUl.style.display = "none"; // Hide charListUl
     } else {
         charListUl.style.display = "flex"; // Show charListUl 
     }
 }); 
 


// Adding eventListener to search bar to search for character
searchBar.addEventListener("input", () => searchHeros(searchBar.value));

// function for API call
async function searchHeros(textSearched) {

     // if nothing written in searchbox it does not return any search result
     if (textSearched.length == 0) {
          searchResults.innerHTML = ``;
          return;
     }

     // API call to get the data 
     await fetch(`https://gateway.marvel.com/v1/public/characters?nameStartsWith=${textSearched}&apikey=9ab871748d83ae2eb5527ffd69e034de&hash=8f92348560bfe70e203b644dce7b218d?ts=1`)
          .then(res => res.json())
          .then(data => showSearchedResults(data.data.results)) 
}

// Function for displaying the searched results in DOM
// An array is accepted as argument 
// SearchedHero is the array of objects which matches the string entered in the searched bar
function showSearchedResults(searchedHero) {


     // IDs of the character which are added in the favourites 
     // Used for displaying the appropriate button in search results i.e
     // if the id exist in this array then we display "Remove from favourites" button otherwise we display "Add to favourites button"
     // favouritesCharacterIDs is a map which contains id of character as key and true as value 
     let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");
     if(favouritesCharacterIDs == null){
          // If we did't got the favouritesCharacterIDs then we iniitalize it with empty map
          favouritesCharacterIDs = new Map();
     }
     else if(favouritesCharacterIDs != null){
          // If the we got the favouritesCharacterIDs in localStorage then parsing it and converting it to map
          favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
     }

     searchResults.innerHTML = ``;
     // count is used to count the result displayed 
     let count = 1;

     // searchs for single hero using searcbar.only one search result can be checked and searchedHero array uses loop
     for (const key in searchedHero) {
          if (count <= 5) {
               let hero = searchedHero[key];
               searchResults.innerHTML +=
                    `
               <li class="flex-row search-result">
                    <div class="flex-row img-info">
                         <img src="${hero.thumbnail.path+'/portrait_medium.' + hero.thumbnail.extension}" alt="">
                         <div class="hero-info">
                              <a class="character-info" href="./moredetail/moredetail.html">
                                   <span class="hero-name">${hero.name}</span>
                              </a>
                         </div>
                    </div>
                    <div class="flex-col buttons">
                         <!-- <button class="btn"><i class="fa-solid fa-circle-info"></i> &nbsp; More Info</button> -->
                         <button class="btn add-to-fav-btn">${favouritesCharacterIDs.has(`${hero.id}`) ? "<i class=\"fa-solid fa-heart-crack\"></i> &nbsp; Remove from Favourites" :"<i class=\"fa-solid fa-heart fav-icon\"></i> &nbsp; Add to Favourites</button>"}
                    </div>
                    <div style="display:none;">
                         <span>${hero.name}</span>
                         <span>${hero.description}</span>
                         <span>${hero.comics.available}</span>
                         <span>${hero.series.available}</span>
                         <span>${hero.stories.available}</span>
                         <span>${hero.thumbnail.path+'/portrait_uncanny.' + hero.thumbnail.extension}</span>
                         <span>${hero.id}</span>
                         <span>${hero.thumbnail.path+'/landscape_incredible.' + hero.thumbnail.extension}</span>
                         <span>${hero.thumbnail.path+'/standard_fantastic.' + hero.thumbnail.extension}</span>
                    </div>
               </li>
               `
          }
          count++;
     }
     events();
}

// Function for adding eventListener to buttons
function events() {
     let favouriteButton = document.querySelectorAll(".add-to-fav-btn");
     favouriteButton.forEach((btn) => btn.addEventListener("click", addToFavourites));

     let characterInfo = document.querySelectorAll(".character-info");
     characterInfo.forEach((character) => character.addEventListener("click", addInfoInLocalStorage))
}

// Function involvwa when "Add to Favourites" button or "Remvove from favourites" button is click and takles action according to the click
function addToFavourites() {
     //  cretates a new object containg revelent info of hero and push it into favouritesArray
     if (this.innerHTML == '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites') {
          let heroInfo = {
               name: this.parentElement.parentElement.children[2].children[0].innerHTML,
               description: this.parentElement.parentElement.children[2].children[1].innerHTML,
               comics: this.parentElement.parentElement.children[2].children[2].innerHTML,
               series: this.parentElement.parentElement.children[2].children[3].innerHTML,
               stories: this.parentElement.parentElement.children[2].children[4].innerHTML,
               portraitImage: this.parentElement.parentElement.children[2].children[5].innerHTML,
               id: this.parentElement.parentElement.children[2].children[6].innerHTML,
               landscapeImage: this.parentElement.parentElement.children[2].children[7].innerHTML,
               squareImage: this.parentElement.parentElement.children[2].children[8].innerHTML
          }

          // getting the favourites array which stores objects of character  We get null is no such array is created before
          let favouritesArray = localStorage.getItem("favouriteCharacters");
          if (favouritesArray == null) {
               favouritesArray = [];
          } else {
               favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          }



          // here we search for the characters which is already added in favourites we check that if the id of the character exist in this array then we display Remove or Add to favourites
          let favouritesCharacterIDs = localStorage.getItem("favouritesCharacterIDs");

          // if favouritesCharacterIDs did not match start with empty map and get map from local storage and convert them into map
          if (favouritesCharacterIDs == null) {
               favouritesCharacterIDs = new Map();
          } else {
               favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          }

          // setting the new favouritesCharacterIDs array and it to favouritesArray
          favouritesCharacterIDs.set(heroInfo.id, true);
          favouritesArray.push(heroInfo);


          // Updates the new arrays in localStorage
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
          localStorage.setItem("favouriteCharacters", JSON.stringify(favouritesArray));

          // Converts the "Add to Favourites" button to "Remove from Favourites"
          this.innerHTML = '<i class="fa-solid fa-heart-circle-minus"></i> &nbsp; Remove from Favourites';
          
          // Displaying the "Added to Favourites" notification toast 
          document.querySelector(".fav-toast").setAttribute("data-visiblity","show");
          // Removing the "Removed from favourites" notifocation toast
           setTimeout(function(){
               document.querySelector(".fav-toast").setAttribute("data-visiblity","hide");
          },1000);
         }



     // For removing the character form favourites array
     else{
          
          // storing the id of character 
          let idOfCharacterToBeRemoveFromFavourites = this.parentElement.parentElement.children[2].children[6].innerHTML;
          let favouritesArray = JSON.parse(localStorage.getItem("favouriteCharacters"));
          
          //  delets the character id from favouritesCharacterIDs 
          let favouritesCharacterIDs = new Map(JSON.parse(localStorage.getItem("favouritesCharacterIDs")));
          
          // will contain the characters which should be present after the deletion of the character to be removed 
          let newFavouritesArray = [];
          
          // deleting the character from map using id of character 
          favouritesCharacterIDs.delete(`${idOfCharacterToBeRemoveFromFavourites}`);
          
          favouritesArray.forEach((favourite) => {
               // if the id of the character doesn't matches match with characters in favourites creates new character in array and it does not display deleted character
               if(idOfCharacterToBeRemoveFromFavourites != favourite.id){
                    newFavouritesArray.push(favourite);
               }
          });
          
         
          
     // Updates the new arrays in localStorage
          localStorage.setItem("favouriteCharacters",JSON.stringify(newFavouritesArray));
          localStorage.setItem("favouritesCharacterIDs", JSON.stringify([...favouritesCharacterIDs]));
          
          
          // Convertes the "Remove from Favourites" button to "Add to Favourites" 
          this.innerHTML = '<i class="fa-solid fa-heart fav-icon"></i> &nbsp; Add to Favourites';
          
     // displaying the "Removed from favourites" notification toast 
     document.querySelector(".remove-toast").setAttribute("data-visiblity","show");
     // Removing the "Removed from favourites" notifocation toast
     setTimeout(function(){
               document.querySelector(".remove-toast").setAttribute("data-visiblity","hide");
          },1000);
     }     
}

// the function stores the data of the character and when user clicks the moreinfo buttonm.it opens the moreinfo page and displays the character data
function addInfoInLocalStorage() {
     let heroInfo = {
          name: this.parentElement.parentElement.parentElement.children[2].children[0].innerHTML,
          description: this.parentElement.parentElement.parentElement.children[2].children[1].innerHTML,
          comics: this.parentElement.parentElement.parentElement.children[2].children[2].innerHTML,
          series: this.parentElement.parentElement.parentElement.children[2].children[3].innerHTML,
          stories: this.parentElement.parentElement.parentElement.children[2].children[4].innerHTML,
          portraitImage: this.parentElement.parentElement.parentElement.children[2].children[5].innerHTML,
          id: this.parentElement.parentElement.parentElement.children[2].children[6].innerHTML,
          landscapeImage: this.parentElement.parentElement.parentElement.children[2].children[7].innerHTML,
          squareImage: this.parentElement.parentElement.parentElement.children[2].children[8].innerHTML
     }

     localStorage.setItem("heroInfo", JSON.stringify(heroInfo));
}

