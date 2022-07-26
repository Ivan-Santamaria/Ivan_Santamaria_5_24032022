// Récupération du local storage et le déclarer dans la variable fullCart
let fullCart = JSON.parse(localStorage.getItem("product"));
// On déclare un variable pour le ciblage de la la validation de commande
let orderValidation = document.getElementById("order");
// Déclaration de variable pour l'indicateur de panier vide
const emptyCartMessage = function () {
  let emptyCartMessageDisplay = document.getElementById("cart__items");
  emptyCartMessageDisplay.innerHTML =
    "Votre panier est vide, vous pouvez retourner sur notre boutique en <a href='index.html'> cliquant ici </a>";
  emptyCartMessageDisplay.style.fontSize = "1.15em";
  emptyCartMessageDisplay.style.fontWeight = "500";
};

//
//
//----------------------------------------------------------------------//
//---------------------------------------------------------------------//
//----------------- Mise à jour panier & localStorage ----------------//
//-------------------------------------------------------------------//
//------------------------------------------------------------------//
//
//

// faire un contôle sur la variable fullcart, afin d'afficher un message en cas de panier vide
if (fullCart === null || fullCart === undefined || fullCart.length === 0) {
  emptyCartMessage();
} else {
  calculateProductPriceInCart();
  fullCart.forEach((cartProductDetails) => {
    fetch("http://localhost:3000/api/products/" + cartProductDetails.productId)
      // on demande une reponse deséléments au format json
      .then((res) => res.json())
      // ON recupère la reponse (tableau de produits)
      .then((res) => {
        let product = res;

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
          cartProductDetails.productId,
          cartProductDetails.productColor
        );
        calculateProductQuantityInCart();
      })
      .catch((error) => alert(`Erreur lors du chargement de l'API`));
  });
}

//
//
//----------------------------------------------------------------------//
//---------------------------------------------------------------------//
//------------------- Fonction de Mise à jour Panier -----------------//
//-------------------------------------------------------------------//
//------------------------------------------------------------------//
//
//

// Fonction de mise à jour de quantité du produit
function updateProductQuantity(
  cartItemQuantitySelection,
  productId,
  productColor
) {
  cartItemQuantitySelection.addEventListener("change", function () {
    let productQuantity = cartItemQuantitySelection.value;
    fullCart.forEach((cartProductDetails, key) => {
      if (
        cartProductDetails.productId == productId &&
        productColor == cartProductDetails.productColor
      ) {
        fullCart[key]["productQuantity"] = productQuantity;
        localStorage.setItem("product", JSON.stringify(fullCart));
        fullCart = JSON.parse(localStorage.getItem("product"));
      }
    });
    calculateProductQuantityInCart();
    calculateProductPriceInCart();
  });
}
// Fonction de calcul de produit totaux
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
}
// Fonction de calcul du prix total
function calculateProductPriceInCart() {
  let totalProductPrice = 0;
  let totalProductPriceInCart = document.getElementById("totalPrice");
  // faire un foreach sur fullCart et pour chaque produit dans le panier
  fullCart = JSON.parse(localStorage.getItem("product"));

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
        });
    });
  }
}
// Fonction de suppression de produit
// Faire une écoute sur le bouton supprimer
function deleteProduct(deleteItem) {
  deleteItem.addEventListener("click", () => {
    let choice = confirm("Souhaitez-vous vraiment supprimer cet article?");
    // Si oui, aller chercher l'id et la couleur
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
      cartItemSelector.remove();
      calculateProductQuantityInCart();
      calculateProductPriceInCart();
      fullCart = JSON.parse(localStorage.getItem("product"));

      //Si Aucun produits n'est présent, supprimer le local storage
      if (fullCart.length === 0) {
        localStorage.clear();
        emptyCartMessage();
        return;
      }
    }
  });
}

//
//
//----------------------------------------------------------------------//
//---------------------------------------------------------------------//
//---------------------------- Formulaire ----------------------------//
//-------------------------------------------------------------------//
//------------------------------------------------------------------//
//
//

// On cible les élements du formulaire dans le HTML & on déclare tout les éléments dans une variable de type objet
let form = {
  firstNameForm: document.getElementById("firstName"),
  lastNameForm: document.getElementById("lastName"),
  addressForm: document.getElementById("address"),
  cityForm: document.getElementById("city"),
  emailForm: document.getElementById("email"),
};

//  Liste des RegExp déclarés dans un objet
let RegExp = {
  emailRegExp: /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,3}$/i,
  nameRegex: /^[a-zA-Z\-\’]+$/,
  addressRegex:
    /^[0-9]{1,8}\s+((allée|avenue|av|boulevard|bd|carrefour|car|chemin|che|cours|crs|descente|dsc|domaine|dom|esplanade|esp|grande rue|gr|hameau|ham|lieu-dit|ld|lotissement|lot|montée|mte|passage|pas|place|pl|promenade|pro|parvis|prv|quartier|qua|quai|résidence|res|ruelle|rle|route|rte|rue|villa|vla|village|vlge))\s\w*/iu,
  cityRegex: /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]+$/,
};

// Écoute des modifications du formulaire
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

// Condition de validation: Prénom
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
// Condition de validation: Nom
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
// Condition de validation: Adresse
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
// Condition de validation: Ville
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
// Condition de validation: E-mail
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

//
//
//----------------------------------------------------------------------//
//---------------------------------------------------------------------//
//----------------------------- Validation ---------------------------//
//-------------------------------------------------------------------//
//------------------------------------------------------------------//
//
//
// Validation de commande
orderValidation.addEventListener("click", function (e) {
  e.preventDefault();
  if (fullCart != null || fullCart != undefined) {
    if (fullCart.length >= 1) {
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
        let contact = {
          firstName: document.getElementById("firstName").value,
          lastName: document.getElementById("lastName").value,
          address: document.getElementById("address").value,
          city: document.getElementById("city").value,
          email: document.getElementById("email").value,
        };

        let products = [];
        fullCart.forEach((cartProductDetails) => {
          products.push(cartProductDetails.productId);
        });
        let order = {
          contact: contact,
          products: products,
        };
        const sendOrder = fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(order),
        })
          .then((res) => res.json())

          .then(function (res) {
            document.location.href = `confirmation.html?orderid=${res.orderId}`;
            localStorage.clear();
          });
        orderValidation.value = "Commande effectuée !";
        orderValidation.style.color = "#00B600";
        orderValidation.style.textShadow = "0px 0px 3px black";
        setTimeout(function () {
          orderValidation.value = "Commander !";
          orderValidation.style.color = "unset";
          orderValidation.style.textShadow = "unset";
        }, 750);
      }
    } else {
      alert("Votre panier est vide !");
      return;
    }
  } else {
    alert("Votre panier est vide !");
    return;
  }
});
