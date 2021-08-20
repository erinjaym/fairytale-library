class Book {
  constructor(auth, name, pages, read) {
    this.title = name;
    this.author = auth;
    this.pageCount = pages;
    this.beenRead = read;
  }
  info() {
    return (
      this.title +
      "," +
      this.author +
      "," +
      this.pageCount +
      "," +
      this.beenRead
    );
  }
}

let myLibrary = [];
getBooksFromFirebase();
let selectionId = null;
let prevSelection = null;

// start main firebase firestore functions
var bookConverter = {
  toFirestore: function (book) {
    return {
      title: book.title,
      author: book.author,
      pageCount: book.pages,
      beenRead: book.beenRead,
    };
  },
  fromFirestore: function (snapshot, options) {
    const data = snapshot.data(options);
    return new Book(data.author, data.title, data.pageCount, data.beenRead);
  },
};

function getBooksFromFirebase() {
  let storedLibrary = [];
  let libRef = db.collection("library").withConverter(bookConverter);
  libRef
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        storedLibrary.push(doc.data());
      });
      myLibrary = storedLibrary;
      clearDisplay();
      displayLibrary();
      return true;
    })
    .catch((error) => {
      console.log("Error is:", error);
    });
}

function saveBookToFirestore(titleValue, authValue, pageValue, readValue) {
  db.collection("library")
    .doc(titleValue)
    .set({
      title: titleValue,
      author: authValue,
      pageCount: pageValue,
      beenRead: readValue,
    })
    .then(() => {
      console.log("saved data to the cloud");
    })
    .catch((error) => {
      console.log("ERROR!");
    });
}

function changeBookReadStatusTrue(titleValue) {
  db.collection("library")
    .doc(titleValue)
    .update({
      beenRead: "True",
    })
    .then(() => {
      console.log("saved data to the cloud");
    })
    .catch((error) => {
      console.log("ERROR!");
    });
}

function changeBookReadStatusFalse(titleValue) {
  db.collection("library")
    .doc(titleValue)
    .update({
      beenRead: "False",
    })
    .then(() => {
      console.log("saved data to the cloud");
    })
    .catch((error) => {
      console.log("ERROR!");
    });
}

function deleteBookFromFirestore(bookId) {
  db.collection("library")
    .doc(bookId)
    .delete()
    .then(() => {
      console.log("Document successfully deleted!");
    })
    .catch((error) => {
      console.error("Error removing document: ", error);
    });
}

//end main firebase firestore functions

function displayLibrary() {
  for (
    let bookLocation = 0;
    bookLocation <= myLibrary.length - 1;
    bookLocation++ // for each book in library
  ) {
    let bookInfoArray = [
      myLibrary[bookLocation].title,
      myLibrary[bookLocation].author,
      myLibrary[bookLocation].pageCount.toString(),
      myLibrary[bookLocation].beenRead.toString(),
    ];
    let newRow = document.getElementById("books").insertRow();

    let bookTitleId = myLibrary[bookLocation].title.toString(); // < .. test

    newRow.setAttribute("id", bookTitleId);

    for (bookInfo = 0; bookInfo <= bookInfoArray.length - 1; bookInfo++) {
      newRow.insertCell().textContent = bookInfoArray[bookInfo];
    }
    /*  -- Old Code for individual book buttons -- 
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

function newBook() {
  let auth = document.querySelector(
    "div.bookentry-popup input[name='author']"
  ).value;
  let title = document.querySelector("div.bookentry-popup #booktitle").value;
  let pages = document.querySelector("div.bookentry-popup #pagecount").value;
  let beenRead = document.querySelector("div.bookentry-popup #yep").checked;
  const newBook = new Book(auth, title, pages, beenRead);
  saveBookToFirestore(title, auth, pages, beenRead);
  clearDisplay();
  getBooksFromFirebase(); // adds book to display local library
  selectionId = null;
  //displayLibrary(); // < .. no longer needed has beet ut into get books form firebase
}

function openForm() {
  document.getElementById("bookentry").style.display = "block";
}

function closeForm() {
  document.getElementById("bookentry").style.display = "none";
}

function clearDisplay() {
  while (document.getElementById("books").lastChild) {
    document.getElementById("books").lastChild.remove();
  }
}

function deleteSelection() {
  if (selectionId === null) {
    alert("Please select a book to delete first!");
  } else {
    document.getElementById(selectionId).remove(); //remove from page display and dom
    deleteBookFromFirestore(selectionId);
    clearDisplay();
    getBooksFromFirebase();
    displayLibrary();
    selectionId = null; // reset selector ID
  }
}

Book.prototype.toggleRead = function () {
  if (this.beenRead == False) {
    return (this.beenRead = True);
  } else if (this.beenRead == True) {
    return (this.beenRead = False);
  } else {
    return "didnt do jack";
  }
};

function readIt() {
  document.getElementById(selectionId);
  changeBookReadStatusTrue(selectionId);
  clearDisplay();
  getBooksFromFirebase();
  displayLibrary();
  selectionId = null;
}

function havntReadIt() {
  document.getElementById(selectionId);
  changeBookReadStatusFalse(selectionId);
  clearDisplay();
  getBooksFromFirebase();
  displayLibrary();
  selectionId = null;
}

document.getElementById("books").addEventListener("click", function (e) {
  if (selectionId == null) {
    selectionId = e.target.parentElement.id;
    e.target.parentElement.className = "bookSelection";
  } else if (
    selectionId === e.target.parentElement.id &&
    e.target.parentElement.className == "bookSelection"
  ) {
  } else {
    prevSelection = selectionId;
    selectionId = e.target.parentElement.id;
    e.target.parentElement.className = "bookSelection";
    document.getElementById(prevSelection).className = "notSelected";
  }
});

function checkFormValidity() {
  let title = document.getElementById("booktitle");
  let author = document.getElementById("author");
  let pages = document.getElementById("pagecount");

  if (
    title.checkValidity() &&
    author.checkValidity() &&
    pages.checkValidity()
  ) {
    newBook();
    closeForm();
  } else {
    alert("Please Fill out all fields");
  }
}
