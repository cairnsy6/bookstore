window.addEventListener("hashchange", updateMain);

function updateMain() {
  const path = window.location.hash;
  main.innerHTML = "";
  switch (path) {
    case "":
      renderHomePage();
      break;
    case "#":
      renderHomePage();
      break;
    case "#discounts":
      renderDiscountPage();
      break;
    default:
      render404();
      break;
  }
}

updateMain();
