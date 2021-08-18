class Book 
{
    constructor(auth, name, pages, read){
        this.title = name;
        this.author = auth;
        this.pageCount = pages;
        this.beenRead = read;
    }
    info() {
        return this.title + "," + this.author + "," + this.pageCount + "," + this.beenRead;
    }

}
  
let myLibrary = [] ;
let sample = new Book ("EJM", "A Hero's Rise", 486, false);
let selectionId = null;
console.log(sample);
console.log(sample.info());
addBookToLibrary(sample);

// make a function that adds library to storage in a firebase back end. .. 
  let firebaseConfig = {
    apiKey: "AIzaSyBIiOEXE8C8tGQokchZR3HNIDhl8NZlVjI",
    authDomain: "fairytale-library.firebaseapp.com",
    projectId: "fairytale-library",
    storageBucket: "fairytale-library.appspot.com",
    messagingSenderId: "889453050718",
    appId: "1:889453050718:web:ae0ab68590ed522bcaadcf"
  };
firebase.initializeApp(firebaseConfig);


function saveLibrary() {
    // Add library to firebase database 

    let libraryReference = firebase.firestore.doc("books/test"); 
    let docRef = firestore.collection("library").doc("turkey").set({
        myLibrary
    }).then(() => { console.log('saved shit to the cloud!'); }
    ).catch( (error) => {
        console.log('Errored out somehow');
    });
   // return firebase.firestore().collection(myLibrary).add({
       //db is not defined error ..is db firebase>??? 
       //now firebas is not defined .... not imported!!!  ..> need to import shit to do this. 
  }

/* original book constructor now replaced with class at begining for practice per odin assignment
function Book(auth, name, pages, read)
{
    this.title = name;
    this.author = auth;
    this.pageCount = pages;
    this.beenRead = read;
    this.info = function ()
    {
        return this.title + "," + this.author + "," + this.pageCount + "," + this.beenRead;
    }
    console.log("Book that was added to library: " + this.info());

/* old function replaced with prototype funtion for learning experience
    this.toggleRead =  function()
    {
        if(this.beenRead == false)
        {
           this.beenRead = true;
        }
        else if(this.beenRead == true)
        {
            this.beenRead = false;
        }
        else
        {
            console.log("brain implosion");
        }
    } 

}  */

function addBookToLibrary(book) 
{
    let bookPlacement = myLibrary.length;
    myLibrary[bookPlacement] = book;

}

displayLibrary();
function displayLibrary()
{

    for (let bookLocation = 0; bookLocation <= myLibrary.length-1; bookLocation++) // for each book in library
    {
        let bookInfoArray = myLibrary[bookLocation].info().split(',');
        let newRow = document.getElementById("books").insertRow();
        newRow.setAttribute("id", [bookLocation]);  // sets dom ID

            for (bookInfo = 0; bookInfo <= bookInfoArray.length-1; bookInfo ++ )// for each element in each book
            { 
                newRow.insertCell().textContent = bookInfoArray[bookInfo];

            }
            // add book options buttons to table
           let readIt = document.createElement('button');
           readIt.className = "table-button";
           readIt.textContent = "Read It";
           readIt.setAttribute("onclick", `changeReadStatus( ${newRow.id})`); 
           newRow.insertCell().appendChild(readIt);

           let remove = document.createElement('button'); 
           remove.textContent = "Delete this book";
           remove.className = "table-button";

           remove.setAttribute("onclick", `deleteBook( ${newRow.id})`); 
           newRow.insertCell().appendChild(remove);

    }
}

function newBook ()
{
  let auth = document.querySelector("div.bookentry-popup input[name='author']").value;
  let title = document.querySelector("div.bookentry-popup #booktitle").value;
  let pages = document.querySelector("div.bookentry-popup #pagecount").value;
  let beenRead = document.querySelector("div.bookentry-popup #yep").checked; 
  const newBook = new Book(auth, title, pages, beenRead) 
  addBookToLibrary(newBook);
  clearDisplay();
  displayLibrary();
}

function openForm() 
    {
    document.getElementById("bookentry").style.display = "block";
    }
  
  function closeForm() 
    {
    document.getElementById("bookentry").style.display = "none";
    }

function clearDisplay ()
{
        while (document.getElementById("books").lastChild)
            {
                document.getElementById("books").lastChild.remove();  
            }

}

function deleteBook (bookId) 
{
    document.getElementById(bookId).remove(); //remove from page display and dom
    myLibrary.splice(bookId, 1);        // remove from library
    clearDisplay();             // clear screen 
    displayLibrary();           // reassigns correct DOM ID and ensures page is shown correctly
     
} 


function deleteSelection ()
{

    if(selectionId === null) // no books selected
    {
      alert("Please select a book to delete first!");
    }
    else
    {
    document.getElementById(selectionId).remove(); //remove from page display and dom
    myLibrary.splice(selectionId, 1);        // remove from library
    clearDisplay();                 // clear screen 
    displayLibrary();           // reassigns correct DOM ID and ensures page is shown correctly
    selectionId = null;              // reset selector ID 
    }

}

Book.prototype.toggleRead = function()
    {
        if(this.beenRead == false)
        {
            return this.beenRead = true;
        }
        else if (this.beenRead == true)
        {
            return this.beenRead = false;
        }
        else
        {
            return "didnt do jack";
        }
    }


function changeReadStatus (bookId)
    {
    myLibrary[bookId].toggleRead();
    clearDisplay();
    displayLibrary();
    }

function changeSelectionStatus ()
    {
    myLibrary[selectionId].toggleRead();
    clearDisplay();
    displayLibrary();
    }

document.getElementById("books").addEventListener('click', function (e)
{

    if (selectionId == null)
    {
        selectionId = (e.target.parentElement.id);
        e.target.parentElement.className = "bookSelection";

    }
    else 
    {
        let prevSelection = selectionId;
        selectionId = (e.target.parentElement.id);
        e.target.parentElement.className = "bookSelection";
        document.getElementById(prevSelection).className = "notSelected"; // prompting error when selecting a button but functions correctly
    }

});

function checkFormValidity (){
    let title = document.getElementById('booktitle');
    let author = document.getElementById('author');
    let pages = document.getElementById('pagecount');

    if(title.checkValidity() && author.checkValidity() && pages.checkValidity()){
    newBook();
    closeForm();
    }
    else {
    alert ("Please Fill out all fields");
    }
}

