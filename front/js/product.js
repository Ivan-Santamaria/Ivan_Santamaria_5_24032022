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
    console.log(product);
    // product.name; √
    // product.imageUrl;
    // product.price; √
    // product.description; √
    // product.colors;
    // product.altTxt;
    document.getElementById(`description`).innerHTML = product.description;
    document.getElementById(`title`).innerHTML = product.name;
    document.getElementById(`price`).innerHTML = product.price;
    // document.getElementsByTagName("option").innerHTML = product.colors;
    let imageOfProduct = document.createElement(`img`);
    imageOfProduct.src = product.imageUrl;
    imageOfProduct.alt = product.altTxt;
    console.log();
  });
//   .catch((error) => alert(`Erreur lors du chargement de l'API`));
