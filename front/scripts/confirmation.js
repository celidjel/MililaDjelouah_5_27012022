let parametres = new URL(document.location).searchParams;   
let orderId = parametres.get('id');
let numCommande = document.getElementById("orderId");
numCommande.innerHTML = orderId;