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


// start Firebase code 
var bookConverter = {
    toFirestore: function(book) {
        return {
            title: book.title,
            author: book.author,
            pageCount: book.pageCount,
            beenRead: book.beenRead
            };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new Book(data.author, data.title, data.pageCount, data.beenRead);
    }
};

let libRef= db.collection("books").withConverter(bookConverter);
//let query = firebaseLibrary.where("title", "==", true);
console.log(libRef);

libRef.get().then((doc) => {
    if (doc.exists) {
        console.log("Document data:");
         let storedBook = doc.data();
         console.log(storedBook);
    }else { console.log("Cant FIND DATA");
    }
}).catch((error) => { console.log('Error'); });


function saveLibrary() {
    for (x = 0; x < myLibrary.length; x++){
        let nameValue = myLibrary[x].title;
        let authValue = myLibrary[x].author;
        let pageValue = myLibrary[x].pageCount;
        let readValue = myLibrary[x].beenRead;
        db.collection("books").doc(myLibrary[x].title).set({
            title: nameValue,
            author: authValue,
            pageCount: pageValue,
            beenRead: readValue
    }).then(() => { console.log('saved shit to the cloud'); 
    }).catch( (error) => { 
        console.log ('ERROR!'); });
  }
}


// end firebase firestore main code
let myLibrary = [] ;
let sample = new Book ("EJM", "A Hero's Rise", 486, false);
let selectionId = null;
addBookToLibrary(sample);

function addBookToLibrary(book) 
{
    let bookPlacement = myLibrary.length;
    myLibrary[bookPlacement] = book;
    saveLibrary();

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

