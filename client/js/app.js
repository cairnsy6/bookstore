const main = document.querySelector("#main");
const basketList = document.createElement("ul");
const url = "http://localhost:3000/books";
let total = 0;
const totalInfo = document.createElement("h1");

function makeNavigation() {
  const homeButton = document.createElement("a");
  const discountsButton = document.createElement("a");
  homeButton.textContent = "Home";
  discountsButton.textContent = "Discounts";
  homeButton.href = "#";
  discountsButton.href = "#discounts";
  main.appendChild(homeButton);
  main.appendChild(discountsButton);
}

async function renderHomePage() {
  makeNavigation();
  window.location.hash = "#";
  const homeTitle = document.createElement("h1");
  const authorTitle = document.createElement("h3");
  const bookForm = await renderBookForm();
  authorTitle.textContent = "By Rhys Cairns";
  homeTitle.textContent = "Welcome to Bally's Bookstore";
  main.appendChild(homeTitle);
  main.appendChild(authorTitle);
  main.appendChild(bookForm);
  main.appendChild(basketList);
}

async function renderBookForm() {
  const bookForm = document.createElement("form");
  const bookNameLabel = document.createElement("label");
  const submitBookButton = document.createElement("button");
  submitBookButton.classList = "btn btn-primary btn-lg";
  bookNameLabel.textContent = "Please choose a book ";
  submitBookButton.textContent = "Add To Basket";
  submitBookButton.addEventListener("click", addToBasket);
  bookForm.appendChild(bookNameLabel);
  let bookSelections = await createBookSelectionOptions();
  bookForm.appendChild(bookSelections);
  bookForm.appendChild(submitBookButton);
  return bookForm;
}

async function createBookSelectionOptions() {
  const bookSelect = document.createElement("select");
  bookSelect.classList = "form-select";
  const initialOption = document.createElement("option");
  initialOption.textContent = "Books Currently Available";
  initialOption.value = null;
  bookSelect.appendChild(initialOption);
  bookSelect.id = "booksInfo";
  const response = await fetch(url);
  const books = await response.json();
  const bookNames = books.books;
  for (i in bookNames) {
    let bookId = bookNames[i]["id"];
    let bookName = bookNames[i]["name"];
    let bookCost = bookNames[i]["cost"].toFixed(2);
    let bookYearPublished = bookNames[i]["year_published"];
    const discountOptions = await getDiscountInfo();
    for (i in discountOptions) {
      let type = discountOptions[i].discount_type;
      let threshold = discountOptions[i].discount_threshold;
      let percentage_change = discountOptions[i].discount_percentage;
      if (type === "Before" && bookYearPublished < threshold) {
        bookCost = bookCost - bookCost * (percentage_change / 100);
      } else if (type === "After" && bookYearPublished > threshold) {
        bookCost = bookCost - bookCost * (percentage_change / 100);
      }
    }
    let bookOption = document.createElement("option");
    bookOption.value = bookName + " " + bookId;
    bookOption.id = bookId;
    bookOption.textContent =
      bookName + " (" + bookYearPublished + ")   £" + bookCost;
    bookSelect.appendChild(bookOption);
  }
  return bookSelect;
}

function addToBasket(e) {
  e.preventDefault();
  let newBook = document.createElement("li");
  let newBookName = document.getElementById("booksInfo");
  let bookValue = newBookName.value;
  let lastIndex = bookValue.lastIndexOf(" ");
  let bookId = parseInt(bookValue.split(" ").pop());
  if (isNaN(bookId)) {
    alert("This is not an option");
  } else {
    bookValue = bookValue.substring(0, lastIndex);
    newBook.textContent = bookValue;
    basketList.appendChild(newBook);
    getTotal(bookId);
  }
}

async function getTotal(id) {
  const idUrl = `http://localhost:3000/books/${id}`;
  const response = await fetch(idUrl);
  const bookInformation = await response.json();
  console.log(bookInformation.cost);
  total = total + bookInformation.cost;
  total = await calculateDiscount(total);
  totalInfo.textContent = "Total: £" + total.toFixed(2);

  main.appendChild(totalInfo);
  console.log(total);
}

async function calculateDiscount(total) {
  const discountOptions = await getDiscountInfo();
  for (i in discountOptions) {
    let type = discountOptions[i].discount_type;
    console.log(type);
    let threshold = discountOptions[i].discount_threshold;
    console.log(threshold);
    let percentage_change = discountOptions[i].discount_percentage;
    if (type === "Over" && total > threshold) {
      total = total - total * (percentage_change / 100);
    }
  }
  return total;
}

async function getDiscountInfo() {
  const discountUrl = `http://localhost:3000/discounts`;
  const response = await fetch(discountUrl);
  const discounts = await response.json();
  const discountChoices = discounts.discounts;
  return discountChoices;
}

async function renderDiscountPage() {
  makeNavigation();
  const discountsHeading = document.createElement("h1");
  discountsHeading.textContent = "Discounts Available";
  main.appendChild(discountsHeading);
  const discountsAvailable = await getDiscountInfo();
  console.log(discountsAvailable);
  discountsAvailable.forEach((discount) => buildDiscountCard(discount));
  const addDiscountOption = await createAddDiscountForm();
  main.appendChild(addDiscountOption);
}

function buildDiscountCard(discount) {
  let discountName = discount.discount_name;
  let discountPercentage = discount.discount_percentage;
  let discountOptionName = document.createElement("h2");
  discountOptionName.textContent =
    "Name: " + discountName + " - Percentage: " + discountPercentage + "%";
  main.appendChild(discountOptionName);
  createDeleteDiscountButton(discount.id);
}

function createDeleteDiscountButton(id) {
  let deleteDiscountButton = document.createElement("button");
  deleteDiscountButton.classList = "btn btn-primary btn-lg";
  deleteDiscountButton.textContent = "Delete Discount";
  deleteDiscountButton.id = id;
  deleteDiscountButton.addEventListener("click", () => {
    if (confirm("Are you sure you would like to delete this habit?")) {
      deleteDiscount(deleteDiscountButton.id);
    }
  });
  main.appendChild(deleteDiscountButton);
}

async function deleteDiscount(discountId) {
  const options = {
    method: "DELETE",
  };
  await fetch(`http://localhost:3000/discounts/${discountId}`, options);
  window.location.reload();
}

async function createAddDiscountForm(e) {
  const addForm = document.createElement("form");
  addForm.type = "submit";
  const choiceOfDiscountLabel = document.createElement("label");
  choiceOfDiscountLabel.textContent = "Add a New Discount ";
  const choiceOfDiscountOption = document.createElement("select");
  choiceOfDiscountOption.classList = "form-select";
  const overOption = document.createElement("option");
  overOption.textContent = "Over";
  overOption.value = "Over";
  const afterOption = document.createElement("option");
  afterOption.textContent = "After";
  afterOption.value = "After";
  const beforeOption = document.createElement("option");
  beforeOption.textContent = "Before";
  beforeOption.value = "Before";
  choiceOfDiscountOption.appendChild(overOption);
  choiceOfDiscountOption.appendChild(beforeOption);
  choiceOfDiscountOption.appendChild(afterOption);
  const inputNumber = document.createElement("input");
  inputNumber.classList = "form-control";
  inputNumber.type = "number";
  inputNumber.id = "inputNumber";
  inputNumber.required = true;
  inputNumber.placeholder =
    "Please input the year or amount you wish to be the threshold";
  const percentageNumber = document.createElement("input");
  percentageNumber.classList = "form-control";
  percentageNumber.type = "number";
  percentageNumber.id = "percentageNumber";
  percentageNumber.required = true;
  percentageNumber.placeholder =
    "Please input the percentage you wish to discount";

  const discountOptionButton = document.createElement("button");
  discountOptionButton.classList = "btn btn-primary btn-lg";
  discountOptionButton.textContent = "Add Discount";
  discountOptionButton.type = "submit";
  discountOptionButton.addEventListener("click", (e) => {
    e.preventDefault();
    addDiscountOption(
      choiceOfDiscountOption.value,
      document.getElementById("inputNumber").value,
      document.getElementById("percentageNumber").value
    );
    window.location.reload();
  });
  addForm.appendChild(choiceOfDiscountLabel);
  addForm.appendChild(choiceOfDiscountOption);
  addForm.appendChild(inputNumber);
  addForm.appendChild(percentageNumber);
  addForm.appendChild(discountOptionButton);
  return addForm;
}

async function addDiscountOption(
  discountOption,
  discountThreshold,
  discountPercentage
) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      discount_name: discountOption + " " + discountThreshold,
      discount_type: discountOption,
      discount_threshold: Number(discountThreshold),
      discount_percentage: Number(discountPercentage),
    }),
  };
  console.log(options);
  const result = await fetch(`http://localhost:3000/discounts`, options);
  const data = await result.json();
  return data;
}

function render404() {
  const incorrect = document.createElement("h1");
  incorrect.textContent = "This page does not exist";
  main.appendChild(incorrect);
}
