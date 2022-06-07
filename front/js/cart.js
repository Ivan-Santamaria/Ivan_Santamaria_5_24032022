// on récupère le local storage
let fullCart = JSON.parse(localStorage.getItem("product"));
console.log("fullCart:", fullCart);

// faire un contôle sur la variable fullcart, afin d'afficher un message en cas de panier vide
if (fullCart === null || fullCart.length <= 0) {
  document.getElementById("cart__items").innerText =
    "Votre panier est vide :( ";
} else {
  calculateProductPriceInCart();
  fullCart.forEach((cartProductDetails) => {
    fetch("http://localhost:3000/api/products/" + cartProductDetails.productId)
      // on demande une reponse deséléments au format json
      .then((res) => res.json())
      // ON recupère la reponse (tableau de produits)
      .then((res) => {
        let product = res;
        // console.log("product:", product);

        let cartItems = document.getElementById("cart__items");
        let cartArticleData = document.createElement("article");
        cartArticleData.className = "cart__item";
        cartArticleData.dataset.id = cartProductDetails.productId;
        cartArticleData.dataset.color = cartProductDetails.productColor;
        cartItems.appendChild(cartArticleData);

        let cartArticleImageContainer = document.createElement("div");
        cartArticleImageContainer.className = "cart__item__img";
        cartArticleData.appendChild(cartArticleImageContainer);
        let cartArticleImage = document.createElement("img");
        // Lier l'image stocké dans l'api avec le produit séléctionné
        cartArticleImage.src = product.imageUrl;
        cartArticleImage.alt = product.altTxt;
        cartArticleImageContainer.appendChild(cartArticleImage);

        let cartArticleContentContainer = document.createElement("div");
        cartArticleContentContainer.className = "cart__item__content";
        cartArticleData.appendChild(cartArticleContentContainer);

        let cartArticleContentDescription = document.createElement("div");
        cartArticleContentDescription.className =
          "cart__item__content__description";
        cartArticleContentContainer.appendChild(cartArticleContentDescription);
        let cartArticleContentName = document.createElement("h2");
        cartArticleContentName.textContent = product.name;
        cartArticleContentDescription.appendChild(cartArticleContentName);
        let cartArticleContentColor = document.createElement("p");
        cartArticleContentColor.textContent = cartProductDetails.productColor;
        cartArticleContentDescription.appendChild(cartArticleContentColor);
        let cartArticleContentprice = document.createElement("p");
        cartArticleContentprice.textContent = product.price + " €";
        cartArticleContentDescription.appendChild(cartArticleContentprice);

        let cartItemContentSettings = document.createElement("div");
        cartItemContentSettings.className = "cart__item__content__settings";
        cartArticleContentContainer.appendChild(cartItemContentSettings);

        let cartItemQuantity = document.createElement("div");
        cartItemQuantity.className = "cart__item__content__settings__quantity";
        cartItemContentSettings.appendChild(cartItemQuantity);
        let cartItemQuantityDisplay = document.createElement("p");
        cartItemQuantityDisplay.textContent = "Qté";
        cartItemQuantity.appendChild(cartItemQuantityDisplay);
        let cartItemQuantitySelection = document.createElement("input");
        cartItemQuantitySelection.setAttribute("name", "itemQuantity");
        cartItemQuantitySelection.setAttribute("type", "number");
        cartItemQuantitySelection.setAttribute("min", 1);
        cartItemQuantitySelection.setAttribute("max", 100);
        cartItemQuantitySelection.setAttribute(
          "value",
          cartProductDetails.productQuantity
        );
        cartItemQuantitySelection.className = "itemQuantity";
        cartItemQuantity.appendChild(cartItemQuantitySelection);

        let deleteItemContainer = document.createElement("div");
        deleteItemContainer.className = "cart__item__content__settings__delete";
        cartItemContentSettings.appendChild(deleteItemContainer);

        let deleteItem = document.createElement("p");
        deleteItem.className = "deleteItem";
        deleteItem.textContent = " Supprimer";
        deleteItemContainer.appendChild(deleteItem);

        deleteProduct(deleteItem);

        updateProductQuantity(
          cartItemQuantitySelection,
          cartProductDetails.productId
        );
        calculateProductQuantityInCart();
      });
  });
  //   .catch((error) => alert(`Erreur lors du chargement de l'API`));
}
function updateProductQuantity(cartItemQuantitySelection, productId) {
  cartItemQuantitySelection.addEventListener("change", function () {
    // console.log(cartItemQuantitySelection.value);
    let productQuantity = cartItemQuantitySelection.value;
    fullCart.forEach((cartProductDetails, key) => {
      // console.log("key:", key);

      if (cartProductDetails.productId == productId) {
        fullCart[key]["productQuantity"] = productQuantity;
        localStorage.setItem("product", JSON.stringify(fullCart));
        fullCart = JSON.parse(localStorage.getItem("product"));
      }
    });
    calculateProductQuantityInCart();
    calculateProductPriceInCart();
    //   !!!! Source Problème 1 removeItem();
  });
}

function calculateProductQuantityInCart() {
  let totalProductQuantity = 0;
  let totalQuantityInCart = document.getElementById("totalQuantity");
  // faire un foreach sur fullCart et pour chaque produit dans le panier
  fullCart = JSON.parse(localStorage.getItem("product"));
  fullCart.forEach((cartProductDetails, key) => {
    totalProductQuantity =
      totalProductQuantity + parseInt(cartProductDetails["productQuantity"]);
  });

  // Mise a Jour de la quantité
  totalQuantityInCart.innerHTML = totalProductQuantity;
  console.log("totalProductQuantity:", totalProductQuantity);
}

function calculateProductPriceInCart() {
  let totalProductPrice = 0;
  let totalProductPriceInCart = document.getElementById("totalPrice");
  // faire un foreach sur fullCart et pour chaque produit dans le panier
  fullCart = JSON.parse(localStorage.getItem("product"));

  console.log("fullCart:", fullCart);
  if (fullCart.length == 0) {
    totalProductPriceInCart.innerHTML = totalProductPrice;
  } else {
    fullCart.forEach((cartProductDetails, key) => {
      fetch(
        "http://localhost:3000/api/products/" + cartProductDetails.productId
      )
        // on demande une reponse deséléments au format json
        .then((res) => res.json())
        // ON recupère la reponse (tableau de produits)
        .then((res) => {
          let product = res;

          totalProductPrice =
            totalProductPrice +
            parseInt(cartProductDetails["productQuantity"]) *
              parseInt(product.price);
          // Affichage du montant total
          totalProductPriceInCart.innerHTML = totalProductPrice;
          console.log("totalProductPrice:", totalProductPrice);

          // Essayer de garder uniquement le resultat final
        });
    });
  }
}

function deleteProduct(deleteItem) {
  deleteItem.addEventListener("click", () => {
    let choice = confirm("Souhaitez-vous vraiment supprimer cet article?");
    if (choice == true) {
      let cartItemSelector =
        deleteItem.parentNode.parentNode.parentNode.parentNode;
      let productId = cartItemSelector.getAttribute("data-id");
      let productColor = cartItemSelector.getAttribute("data-color");
      fullCart = JSON.parse(localStorage.getItem("product"));

      fullCart.forEach((cartProductDetails, key) => {
        if (
          cartProductDetails.productId == productId &&
          cartProductDetails.productColor == productColor
        ) {
          fullCart.splice(key, 1);
        }
      });
      localStorage.setItem("product", JSON.stringify(fullCart));
      removeItem();
      fullCart = JSON.parse(localStorage.getItem("product"));
      if (fullCart === null || fullCart.length <= 0) {
        document.getElementById("cart__items").innerText =
          "Votre panier est vide :( ";
      }
    }
  });
}

function removeItem() {
  let item = document.querySelector("article");
  item.remove();
  calculateProductQuantityInCart();
  calculateProductPriceInCart();

  console.log("item:", item);
}
// Faire des recherches sur les expressions régulières(RegExp) en js
//!!!!  Problème 1 ! la fiche produit disparait après incrémentation de l'article via le modude le selection de quantité

//---------------------------- Formulaire ----------------------------//
let form = {
  firstNameForm: document.getElementById("firstName"),
  lastNameForm: document.getElementById("lastName"),
  addressForm: document.getElementById("address"),
  cityForm: document.getElementById("city"),
  emailForm: document.getElementById("email"),
};
let orderValidation = document.getElementById("order");
let RegExp = {
  emailRegExp: /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,3}$/i,
  nameRegex: /^[a-zA-Z\-\’]+$/,
  addressRegex:
    /^[0-9]{1,8}\s+((allée|avenue|av|boulevard|bd|carrefour|car|chemin|che|cours|crs|descente|dsc|domaine|dom|esplanade|esp|grande rue|gr|hameau|ham|lieu-dit|ld|lotissement|lot|montée|mte|passage|pas|place|pl|promenade|pro|parvis|prv|quartier|qua|quai|résidence|res|ruelle|rle|route|rte|rue|villa|vla|village|vlge))\s\w*/iu,
  cityRegex: /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]+$/,
};

form.firstNameForm.addEventListener("change", function () {
  validFirstName(this);
});
form.lastNameForm.addEventListener("change", function () {
  validLastName(this);
});
form.addressForm.addEventListener("change", function () {
  validAddress(this);
});
form.cityForm.addEventListener("change", function () {
  validCity(this);
});
form.emailForm.addEventListener("change", function () {
  validEmail(this);
});

const validFirstName = function (inputFirstName) {
  let firstNameMsg = document.getElementById("firstNameErrorMsg");
  let testFirstName = RegExp.nameRegex.test(inputFirstName.value);

  if (testFirstName == true) {
    firstNameMsg.innerHTML = `&#9989;` + " OK";
    firstNameMsg.style.color = "#00B600";
    firstNameMsg.style.textShadow = "0px 0px 3px black";
    return true;
  } else {
    firstNameMsg.innerHTML = `&#10060;` + " Veuillez renseigner un prénom";
    firstNameMsg.style.color = "#FE0000";
    firstNameMsg.style.textShadow = "0px 0px 1px black";
    return false;
  }
};
const validLastName = function (inputLastName) {
  let lastNameMsg = document.getElementById("lastNameErrorMsg");
  let testLastName = RegExp.nameRegex.test(inputLastName.value);

  if (testLastName == true) {
    lastNameMsg.innerHTML = `&#9989;` + " OK";
    lastNameMsg.style.color = "#00B600";
    lastNameMsg.style.textShadow = "0px 0px 3px black";
    return true;
  } else {
    lastNameMsg.innerHTML = `&#10060;` + " Veuillez renseigner un nom";
    lastNameMsg.style.color = "#FE0000";
    lastNameMsg.style.textShadow = "0px 0px 1px black";
    return false;
  }
};
const validAddress = function (inputAddress) {
  let addressMsg = document.getElementById("addressErrorMsg");
  let testAddress = RegExp.addressRegex.test(inputAddress.value);

  if (testAddress == true) {
    addressMsg.innerHTML = `&#9989;` + " OK";
    addressMsg.style.color = "#00B600";
    addressMsg.style.textShadow = "0px 0px 3px black";
    return true;
  } else {
    addressMsg.innerHTML =
      `&#10060;` +
      " Veuillez renseigner une adresse valide" +
      "<br />Exemple: 234 rue de la montée interminable";
    addressMsg.style.color = "#FE0000";
    addressMsg.style.textShadow = "0px 0px 1px black";
    return false;
  }
};
const validCity = function (inputCity) {
  let cityMsg = document.getElementById("cityErrorMsg");
  let testCity = RegExp.cityRegex.test(inputCity.value);

  if (testCity == true) {
    cityMsg.innerHTML = `&#9989;` + " OK";
    cityMsg.style.color = "#00B600";
    cityMsg.style.textShadow = "0px 0px 3px black";
    return true;
  } else {
    cityMsg.innerHTML = `&#10060;` + " Veuillez renseigner une ville";
    cityMsg.style.color = "#FE0000";
    cityMsg.style.textShadow = "0px 0px 1px black";
    return false;
  }
};
const validEmail = function (inputEmail) {
  let emailMsg = document.getElementById("emailErrorMsg");
  let testEmail = RegExp.emailRegExp.test(inputEmail.value);

  if (testEmail == true) {
    emailMsg.innerHTML = `&#9989;` + " Email valide";
    emailMsg.style.color = "#00B600";
    emailMsg.style.textShadow = "0px 0px 3px black";
    return true;
  } else {
    emailMsg.innerHTML =
      `&#10060;` + " Veuillez renseigner une adresse Email valide";
    emailMsg.style.color = "#FE0000";
    emailMsg.style.textShadow = "0px 0px 1px black";
    return false;
  }
};

orderValidation.addEventListener("click", function (e) {
  e.preventDefault();
  let firstNameConfirmation = validFirstName(form.firstNameForm);
  let lastNameConfirmation = validLastName(form.lastNameForm);
  let addressConfirmation = validAddress(form.addressForm);
  let cityConfirmation = validCity(form.cityForm);
  let emailConfirmation = validEmail(form.emailForm);
  if (
    firstNameConfirmation &&
    lastNameConfirmation &&
    addressConfirmation &&
    cityConfirmation &&
    emailConfirmation
  ) {
    let orderCheck = document.getElementById("order");
    orderCheck.value = "Commande effectuée !";
    orderCheck.style.color = "#00B600";
    orderCheck.style.textShadow = "0px 0px 3px black";
    setTimeout(function () {
      orderCheck.value = "Commander !";
      orderCheck.style.color = "unset";
      orderCheck.style.textShadow = "unset";
    }, 750);
  }
});
