// Création des variables de récupération d'identifiant
const params = new URLSearchParams(location.search);
let productId = params.get(`id`);

// Récupération via l'url de l'id du produit sélectionné
fetch(`http://localhost:3000/api/products/${productId}`)
  // Demande une réponse au format .json  (fiche produit)
  .then((res) => res.json())
  .then(function (res) {
    // On donne un nom à notre fiche produit pour plus de lisibilité
    let product = res;

    // Ciblage et importation des informations produit
    document.getElementById(`description`).innerHTML = product.description;
    document.getElementById(`title`).innerHTML = product.name;
    document.getElementById(`price`).innerHTML = product.price;

    // Création des élément d'affichage produits(Image)
    let productImage = document.createElement("img");
    let imageLoc = document.querySelector(`article div`);
    productImage.src = product.imageUrl;
    productImage.alt = product.altTxt;
    imageLoc.appendChild(productImage);

    // Boucle sur le tableau des couleurs du produit
    product.colors.forEach((color) => {
      // Création de l'espace de sélection des couleurs (option)
      let colorOptionSelector = document.createElement(`option`);
      colorOptionSelector.value = color;
      colorOptionSelector.textContent = color;
      // Injection des valeurs du tableau dans le HTML
      document.getElementById(`colors`).appendChild(colorOptionSelector);
    });

    // Validation du produit et mise au panier voir fonction Ligne 52
    document.getElementById(`addToCart`).addEventListener("click", function () {
      addToCart(product);
    });
  })
  // En cas d'erreur de contact de l'API un message d'erreur survient sous forme d'alerte
  .catch((error) => alert(`Erreur lors du chargement de l'API`));

//
//
//----------------------------------------------------------------------//
//---------------------------------------------------------------------//
//------------------------- Ajout au Panier --------------------------//
//-------------------------------------------------------------------//
//------------------------------------------------------------------//
//
//

// Fonction de condition pour validation d'ajout au panier
function addToCart(product) {
  // Initialisation d'une variable ciblant la zone d'importation des données de couleurs et quantités
  let colorSelector = document.getElementById(`colors`);
  let quantitySelector = document.getElementById(`quantity`);

  // Initialisation d'une variable contenant les valeurs de couleurs & quantités ainsi que l'id
  let productToCart = {
    productId: product._id,
    productColor: colorSelector.value,
    productQuantity: quantitySelector.value,
  };
  // Condition de selection de couleurs et de quantité minimale et maximale
  if (colorSelector.value == "" || colorSelector.value == undefined) {
    alert("Veuillez sélectionner une couleur disponible!");
  } else if (quantitySelector.value < 1 || quantitySelector.value > 100) {
    alert("Veuillez sélectionner une quantité comprise entre 1 et 100");
  } else {
    // Récupération du localStorage en cas de succes
    let cart = JSON.parse(localStorage.getItem("product"));
    // Vérification si localStorage == vide
    if (cart == null) {
      // Initialisation d'un taleaux vide
      cart = [];
    }
    let findProductInCart = false;

    for (let i = 0; i < cart.length; i++) {
      if (
        cart[i].productId == product._id &&
        cart[i].productColor == colorSelector.value
      ) {
        if (
          parseInt(cart[i].productQuantity) + parseInt(quantitySelector.value) <
          100
        ) {
          cart[i].productQuantity =
            parseInt(cart[i].productQuantity) +
            parseInt(quantitySelector.value);
        } else {
          return alert(
            "Veuillez ne pas dépasser 100 articles pour la même référence produit"
          );
        }
        findProductInCart = true;
      }
    }
    if (!findProductInCart) {
      // Mis à jour du localStorage en ajoutant le produit
      cart.push(productToCart);
    }

    localStorage.setItem("product", JSON.stringify(cart));

    // Création d'un témoin de validation
    document.getElementById("addToCart").innerText =
      "Article(s) ajouté(s) au panier";
    setTimeout(function () {
      document.getElementById("addToCart").innerText = "Ajouter au panier";
    }, 750);
  }
}
