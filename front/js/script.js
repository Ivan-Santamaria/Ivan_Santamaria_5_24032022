// On contact l'API avec la methode Fetch avec le verbe GET afin de récupérer la liste des produits
fetch("http://localhost:3000/api/products")
  // on demande une reponse des éléments au format json
  .then((res) => res.json())
  // On recupère la reponse (tableau de produits)
  .then(function (res) {
    // On definit un variable (products) qui contient la réponse (res (tableau de produits))
    let products = res;
    // On parcourt le tableau de produits
    products.forEach(function (product) {
      const itemsSelector = document.getElementById("items");
      let productLinkSelector = document.createElement("a");
      productLinkSelector.href = "./product.html?id=" + product._id;
      itemsSelector.appendChild(productLinkSelector);

      // Creation d'un élément du type article
      let articleSelector = document.createElement("article");
      // injection de l'element "article" dans l'élément "a"
      productLinkSelector.appendChild(articleSelector);

      let imgSelector = document.createElement("img");
      imgSelector.src = product.imageUrl;
      imgSelector.alt = product.altTxt;
      articleSelector.appendChild(imgSelector);

      let productTitleSelector = document.createElement("h3");
      productTitleSelector.textContent = product.name;
      productTitleSelector.className = "productName";
      articleSelector.appendChild(productTitleSelector);

      let productDesciptionSelector = document.createElement("p");
      productDesciptionSelector.textContent = product.description;
      productDesciptionSelector.className = "productDescription";
      articleSelector.appendChild(productDesciptionSelector);
    });
  })
  // En cas d'erreur de contact de l'API un message d'erreur survient osus forme d'alerte
  .catch((error) => alert(`Erreur lors du chargement de l'API`));
