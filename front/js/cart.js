// on récupère le local storage
let fullCart = JSON.parse(localStorage.getItem("product"));
console.log("fullCart:", fullCart);

// faire un contôle sur la variable fullcart, afin d'afficher un message en cas de panier vide
if (fullCart === null) {
  document.getElementById("cart__items").innerText =
    "Votre panier est vide :( ";
} else {
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

        // console.log("cartProductDetails:", cartProductDetails);
        // console.log("cartItems:", cartItems);
      });
  });
  //   .catch((error) => alert(`Erreur lors du chargement de l'API`));
}
