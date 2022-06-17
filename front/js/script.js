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
      // On recupère l'Id #items dans le HTML
      const itemsSelector = document.getElementById("items");
      // On créer un élément a
      let productLinkSelector = document.createElement("a");
      // On recupère le lien des produits stocké sur le serveur ainsi que son identifiant
      productLinkSelector.href = "./product.html?id=" + product._id;
      itemsSelector.appendChild(productLinkSelector);

      // Creation d'un élément du type article
      let articleSelector = document.createElement("article");
      // injection de l'element "article" dans l'élément "a"
      productLinkSelector.appendChild(articleSelector);

      // Creation d'un élément du type image
      let imgSelector = document.createElement("img");
      imgSelector.src = product.imageUrl;
      imgSelector.alt = product.altTxt;
      // injection de l'element "photo" et "altTxt" dans l'élément
      articleSelector.appendChild(imgSelector);

      // Création de l'élément h3 servant a délimiter le nom des articles récupérés
      let productTitleSelector = document.createElement("h3");
      productTitleSelector.textContent = product.name;
      // Création d'une class et injection des noms d'articles dans leurs espaces créés
      productTitleSelector.className = "productName";
      articleSelector.appendChild(productTitleSelector);

      // Création de l'espace de description du produit
      let productDesciptionSelector = document.createElement("p");
      productDesciptionSelector.textContent = product.description;
      productDesciptionSelector.className = "productDescription";
      articleSelector.appendChild(productDesciptionSelector);
    });
  })
  // En cas d'erreur de contact de l'API un message d'erreur survient sous forme d'alerte
  .catch((error) => alert(`Erreur lors du chargement de l'API`));
