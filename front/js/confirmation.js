// Recherche du numéro de commande dans l'URl//
const orderParams = new URLSearchParams(location.search);

let orderNumber = orderParams.get(`orderid`);
let orderTicket = document.getElementById("orderId");

// Si un ticket orderId est trouvé l'afficher dans le html à l'endroit prévu, saut de ligne et colorisation pour plus de lisibilité //
if (orderTicket != null) {
  // Saut de ligne pour améliorer la lisibilité
  orderTicket.innerHTML = `<br/ >${orderNumber}`;
  // Amélioration de la couleur et de la taille de police
  orderTicket.style.color = "#B50016";
  orderTicket.style.fontSize = "large";
  orderTicket.style.textShadow = "0px 0px 0px black";
}
