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
getBooksFromFirebase();
let selectionId = null;
let prevSelection = null;
// let sample = new Book ("EJM", "A Hero's Rise", 486, false); < ... old code remove after firebase done
//addBookToLibrary(sample);     < ... old code remove after firebase done

// start Firebase firestore code 
var bookConverter = {
    toFirestore: function(book) {
        return {
            title: book.title,
            author: book.author,
            pageCount: book.pages,
            beenRead: book.beenRead
            };
    },
    fromFirestore: function(snapshot, options){
        const data = snapshot.data(options);
        return new Book(data.author, data.title, data.pageCount, data.beenRead);
    }
};

function getBooksFromFirebase () {
let storedLibrary = []; 
    let libRef = db.collection("library").withConverter(bookConverter);
    libRef.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
            storedLibrary.push(doc.data());

    });
    myLibrary = storedLibrary;
    clearDisplay();
    displayLibrary();
    return true;
    }).catch((error) => { console.log('Error is:', error); });
}


function saveBookToFirestore(titleValue, authValue, pageValue, readValue) {
    db.collection("library").doc(titleValue).set({
            title: titleValue,
            author: authValue,
            pageCount: pageValue,
            beenRead: readValue,
    }).then(() => { console.log('saved data to the cloud'); 
}).catch( (error) => { 
    console.log ('ERROR!'); });
}


function changeBookReadStatusTrue(titleValue) {
    db.collection("library").doc(titleValue).update({
            beenRead: "True",
    }).then(() => { console.log('saved data to the cloud'); 
}).catch( (error) => { 
    console.log ('ERROR!'); });
}

function changeBookReadStatusFalse(titleValue) {
    db.collection("library").doc(titleValue).update({
            beenRead: "False",
    }).then(() => { console.log('saved data to the cloud'); 
}).catch( (error) => { 
    console.log ('ERROR!'); });
}

//works 
function deleteBookFromFirestore(bookId){
    db.collection("library").doc(bookId).delete().then(() => {
        console.log("Document successfully deleted!");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
}


// end firebase firestore code

/* <... remove code after firestore revamp is done 
function addBookToLibrary(book)         
{
    let bookPlacement = myLibrary.length;
    myLibrary[bookPlacement] = book;
}*/

function displayLibrary()
{

    for (let bookLocation = 0; bookLocation <= myLibrary.length-1; bookLocation++) // for each book in library
    {   
                //quick rework for firestore learning experience...>  add the info to objects to stay true to old doc? 
        let bookInfoArray = [
            myLibrary[bookLocation].title, 
            myLibrary[bookLocation].author, 
            myLibrary[bookLocation].pageCount.toString(), 
            myLibrary[bookLocation].beenRead.toString() 
        ];
        //let bookInfoArray = myLibrary[bookLocation].info().split(','); old code before fireStore 
        let newRow = document.getElementById("books").insertRow();
        
        let bookTitleId = myLibrary[bookLocation].title.toString() // < .. test 

        newRow.setAttribute("id", bookTitleId);  // sets dom ID  // need to make To book name myLibrary[bookLocation].title

            for (bookInfo = 0; bookInfo <= bookInfoArray.length-1; bookInfo ++ )// for each element in each book
            { 
                newRow.insertCell().textContent = bookInfoArray[bookInfo];

            }
            /*
           let readIt = document.createElement('button');
           readIt.className = "table-button";
           readIt.textContent = "Read It";
           readIt.setAttribute("onclick", `changeReadStatus( ${newRow.id})`); 
           newRow.insertCell().appendChild(readIt);

           let remove = document.createElement('button'); 
           remove.textContent = "Delete this book";
           remove.className = "table-button";
            console.log(newRow.id);
           remove.setAttribute("onclick", `deleteBook( ${newRow.id})`);  // < ... need to adjust to book name for firebase ? 
           newRow.insertCell().appendChild(remove); */
    }
}

function newBook ()
{
  let auth = document.querySelector("div.bookentry-popup input[name='author']").value;
  let title = document.querySelector("div.bookentry-popup #booktitle").value;
  let pages = document.querySelector("div.bookentry-popup #pagecount").value;
  let beenRead = document.querySelector("div.bookentry-popup #yep").checked; 
  const newBook = new Book(auth, title, pages, beenRead) 
 // addBookToLibrary(newBook); <.. part of old local library code
  saveBookToFirestore(title, auth, pages, beenRead);
  clearDisplay();
  getBooksFromFirebase(); // adds book to display local library 
  selectionId = null;      // resets selection ID in case a book was selected before clicking new book. 
  //displayLibrary(); // < .. no longer needed has beet ut into get books form firebase 
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


/*  taking out old redundant code
function deleteBook (bookId) 
{
    console.log(bookId);
    //document.getElementById(bookId).remove(); //remove from page display and dom
    //myLibrary.splice(bookId, 1);        // remove from library  <... doesnt work if we use title needs to be re written 
   deleteBookFromFirestore(bookId); //
    //remove from firebase 
    clearDisplay();             // clear screen 
    displayLibrary();           // reassigns correct DOM ID and ensures page is shown correctly
}  */


function deleteSelection ()
{

    if(selectionId === null) // no books selected
    {
      alert("Please select a book to delete first!");
    }
    else
    {
    document.getElementById(selectionId).remove(); //remove from page display and dom
    //myLibrary.splice(selectionId, 1);        // r<.... remove reference to this and just use full firestore?? 
    deleteBookFromFirestore(selectionId);
    clearDisplay();                 // clear screen 
    getBooksFromFirebase();
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

/*  <.... remove code when Firestore revamp is done
function changeReadStatus (bookId)
    {
   myLibrary[bookId].toggleRead(); 
    clearDisplay();
    displayLibrary();
    }*/

function readIt ()
    {
    document.getElementById(selectionId)
    changeBookReadStatusTrue(selectionId);
    //myLibrary[selectionId].toggleRead(); // <... old code remove when Firestore revamp is done
    clearDisplay();
    getBooksFromFirebase();
    displayLibrary();
    selectionId = null;      
    }

    function havntReadIt ()
    {
    document.getElementById(selectionId)
    changeBookReadStatusFalse(selectionId);
    //myLibrary[selectionId].toggleRead(); // <... <... old code remove when Firestore revamp is done
    clearDisplay();
    getBooksFromFirebase();
    displayLibrary();
    selectionId = null;      
    }

document.getElementById("books").addEventListener('click', function (e)
{
    if (selectionId == null){
        selectionId = (e.target.parentElement.id);
        e.target.parentElement.className = "bookSelection";
    }else if (selectionId === (e.target.parentElement.id) && e.target.parentElement.className == "bookSelection" ){
            // if only selection is the same as the new selection and className is already set to selected do nothing. 
    }else{
        prevSelection = selectionId;
        selectionId = (e.target.parentElement.id);
        e.target.parentElement.className = "bookSelection";
        document.getElementById(prevSelection).className = "notSelected"; 
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

