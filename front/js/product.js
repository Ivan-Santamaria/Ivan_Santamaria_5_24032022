// Recupérer l'identifiant du produit via l'url https://developer.mozilla.org/fr/docs/Web/API/URL/searchParams
// contacter l'API via fetch en lui passant l'identifiant du produits, afin de récuperer les infos sur le produit
//http://localhost:3000/api/products/productid
//cibler chaque éléments (titre, decription , img ...) en injectant l'information à l'interieur de l'élément

// let urlData = new URL(`http://localhost:3000/api/products`);
// console.log(urlData);

const params = new URLSearchParams(location.search);
// console.log(location.search);
let productId = params.get(`id`);
// console.log(productId);

fetch(`http://localhost:3000/api/products/${productId}`)
  .then((res) => res.json())
  .then(function (res) {
    let product = res;

    // console.log("res:", res);

    document.getElementById(`description`).innerHTML = product.description;
    document.getElementById(`title`).innerHTML = product.name;
    document.getElementById(`price`).innerHTML = product.price;

    product.colors.forEach((color) => {
      let colorOptionSelector = document.createElement(`option`);
      colorOptionSelector.value = color;
      colorOptionSelector.textContent = color;

      document.getElementById(`colors`).appendChild(colorOptionSelector);
    });

    let productImage = document.createElement("img");
    let imageLoc = document.querySelector(`article div`);
    productImage.src = product.imageUrl;
    productImage.alt = product.altTxt;
    imageLoc.appendChild(productImage);
    // l'afficher

    document.getElementById(`addToCart`).addEventListener("click", function () {
      addToCart(product);
    });
  })
  // .then( )
  .catch((error) => alert(`Erreur lors du chargement de l'API`));

function addToCart(product) {
  // code d'ajout au panier
  // Verifier la quantité entre 1-100
  // Verifier la couleur
  console.log(product);

  let colorSelector = document.getElementById(`colors`);
  let quantitySelector = document.getElementById(`quantity`);

  if (colorSelector.value == "" || colorSelector.value == undefined) {
    alert("Veuillez sélectionner une couleur disponible!");
  } else if (quantitySelector.value < 1 || quantitySelector.value > 100) {
    alert("Veuillez sélectionner une quantité comprise entre 1 et 100");
  } else {
    document.getElementById("addToCart").innerText =
      "Article(s) ajouté(s) au panier";

    //---------------------------------------- Local Storage ----------------------------------------

    // let productInLocalStorage = JSON.parse(localStorage.getItem(`product`));


  } //---------------------------------------- Local Storage ----------------------------------------
}

// Creer une ecoute d'evenement sur le bouton ajouter au panier
// au clic (Ajouter au panier) verifier si une couleur est selectionée, envoyer une alerte lorsque aucune couleur n'est secelctionée.
// verifier si la quantité est valide, envoyer une alerte si non-valide
// En cas de validation couleur/quantité: (recherche utilisation local storage)
