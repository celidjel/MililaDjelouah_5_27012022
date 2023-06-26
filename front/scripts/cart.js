// Récupération des infos produits présentes dans le local storage
let storedProducts = JSON.parse(localStorage.getItem("products"));

function GetCart() {

    if (storedProducts !== null) {
        let productsTotalNbr = 0;
        let productsTotalPrice = 0;
        let productsPrice = []; //un tableau qui contient des objets de types (productId, price)

        for (let i = 0; i < storedProducts.length; i++) {
            //Appel de l'api pour récupérer les infos détaillé du produit
            fetch(`http://localhost:3000/api/products/${storedProducts[i].pId}`)
                .then(function (result) {
                    if (result.ok) {
                        return result.json();
                    }
                })
                .then(function (productApi) {

                    let price = {
                        pId : storedProducts[i].pId,
                        pPrice : productApi.price
                    };

                    productsPrice.push(price);

                    //Ajout des éléments dans le DOM de façon dynamique
                    let cartItems = document.getElementById('cart__items');
                    let article = document.createElement("article");
                    article.classList.add("cart__item");
                    article.dataset.id = storedProducts[i].pId;
                    article.dataset.color = storedProducts[i].pColor;
                    cartItems.appendChild(article);

                    //Partie image du produit
                    let divImg = document.createElement("div");
                    divImg.classList.add("cart__item__img");
                    let img = document.createElement("img");
                    img.src = productApi.imageUrl;
                    img.alt = productApi.altTxt;
                    divImg.appendChild(img);
                    article.appendChild(divImg);

                    //Partie détail du produit
                    let divContent = document.createElement("div");
                    divContent.classList.add("cart__item__content");
                    let divDescription = document.createElement("div");
                    divDescription.classList.add("cart__item__content__description");
                    let h2 = document.createElement("h2");
                    h2.innerText = productApi.name;
                    let paragraphColor = document.createElement("p");
                    paragraphColor.innerText = storedProducts[i].pColor;
                    let paragraphPrice = document.createElement("p");
                    paragraphPrice.innerText = productApi.price + "€";
                    divDescription.appendChild(h2);
                    divDescription.appendChild(paragraphColor);
                    divDescription.appendChild(paragraphPrice);
                    divContent.appendChild(divDescription);

                    //Partie modification de la quantité du produit
                    let divSettings = document.createElement("div");
                    divSettings.classList.add("cart__item__content__settings");
                    let divQuantity = document.createElement("div");
                    divQuantity.classList.add("cart__item__content__settings__quantity");
                    let paragraphQuantity = document.createElement("p");
                    paragraphQuantity.innerText = "Qté : ";
                    let input = document.createElement("input");
                    input.classList.add("itemQuantity");
                    input.type = "number";
                    input.name = "itemQuantity";
                    input.min = "1";
                    input.max = "100";
                    input.value = storedProducts[i].pQuantity;
                    divQuantity.appendChild(paragraphQuantity);
                    divQuantity.appendChild(input);
                    divSettings.appendChild(divQuantity);

                    input.addEventListener("change", (e) => {
                        //On modifie la quantité du produit dans le local storage
                        let cartItem = e.target.closest(".cart__item");
                        let cartProductId = cartItem.getAttribute('data-id'); // on récupère l'id du produit
                        let cartProductColor =  cartItem.getAttribute('data-color'); // on récupère la couleur du produit
                        for(const product of storedProducts)
                        {
                            if(product.pId === cartProductId && product.pColor === cartProductColor)
                            {
                                product.pQuantity = parseInt(e.target.value);
                                break;
                            }
                        } 
                        //Mise à jour du local storage
                        localStorage.setItem("products", JSON.stringify(storedProducts));
                        //Mise à jour du total
                        UpdateTotal(storedProducts, productsPrice);
                    });


                    let divDelete = document.createElement("div");
                    divDelete.classList.add("cart__item__content__settings__delete");
                    let paragraphDelete = document.createElement("p");
                    paragraphDelete.classList.add("deleteItem");
                    paragraphDelete.innerText = "Supprimer";
                    divDelete.appendChild(paragraphDelete);
                    divSettings.appendChild(divDelete);

                    paragraphDelete.addEventListener("click",() => {
                        //Suppression du produit
                        storedProducts.splice(i, 1);  // splice supprime un élément d'un tableau (premier param : index de l'elt à suprimer, deuxième param : nbr d'elt à supprimer)                                          
                        //Mise à jour du local storage
                        localStorage.setItem("products", JSON.stringify(storedProducts));
                        //Suppression de l'article du DOM
                        paragraphDelete.closest(".cart__item").remove();
                        //Mise à jour du total avec la nouvelle quantité et le nouveau prix total
                        //Mise à jour du local storage
                        UpdateTotal(storedProducts, productsPrice);
                    }); 


                    article.appendChild(divContent);
                    article.appendChild(divSettings);

                    //Calcul du nombre total des produits
                    productsTotalNbr = productsTotalNbr + parseInt(storedProducts[i].pQuantity);
                    let divTotal = document.getElementById("totalQuantity");
                    divTotal.innerText = productsTotalNbr;            
                    //Calcul du prix total des produits
                    productsTotalPrice = productsTotalPrice + (parseInt(storedProducts[i].pQuantity) * parseInt(productApi.price));
                    let divTotalPrice = document.getElementById("totalPrice");
                    divTotalPrice.innerText = productsTotalPrice;       
                })

        }

    }
}


function UpdateTotal(storedProducts, productsPrice){
    let productsTotalNbr = 0 ;
    let productsTotalPrice = 0;
    for(let i = 0; i < storedProducts.length; i++){
        //Récupérer le prix du produit dans notre array productsPrice
        let pPrice = productsPrice.find(price => price.pId == storedProducts[i].pId).pPrice;
         //Calcul du nombre total des produits
         productsTotalNbr = productsTotalNbr + parseInt(storedProducts[i].pQuantity);
         let divTotal = document.getElementById("totalQuantity");
         divTotal.innerText = productsTotalNbr;            
         //Calcul du prix total des produits
         productsTotalPrice = productsTotalPrice + (parseInt(storedProducts[i].pQuantity) * parseInt(pPrice));
         let divTotalPrice = document.getElementById("totalPrice");
         divTotalPrice.innerText = productsTotalPrice;   
    }        
}




// Partie passage de commande
function Order(event) {
    event.preventDefault();

    let firstname = document.getElementById("firstName").value;
    let lastname = document.getElementById("lastName").value;
    let address = document.getElementById("address").value;
    let city = document.getElementById("city").value;
    let email = document.getElementById("email").value;

    let firstNameIsValid = CheckFirstNameValidity(firstname);
    if (firstNameIsValid == false) {
        let firstNameErrorMsg = document.getElementById("firstNameErrorMsg");
        firstNameErrorMsg.innerHTML = "veuillez entrer un prénom valide !";
    }

    let lastNameIsValid = CheckLastNameValidity(lastname);
    if (lastNameIsValid == false) {
        let lastNameErrorMsg = document.getElementById("lastNameErrorMsg");
        lastNameErrorMsg.innerHTML = "veuillez entrer un nom valide !";
    }

    let addressIsValid = CheckAddressValidity(address);
    if (addressIsValid == false) {
        let addressErrorMsg = document.getElementById("addressErrorMsg");
        addressErrorMsg.innerHTML = "veuillez entrer une adresse valide !";
    }

    let cityIsValid = CheckCityValidity(city);
    if (cityIsValid == false) {
        let cityErrorMsg = document.getElementById("cityErrorMsg");
        cityErrorMsg.innerHTML = "veuillez entrer un nom de ville valide !";
    }

    let emailIsValid = CheckEmailValidity(email);
    if (emailIsValid == false) {
        let emailErrorMsg = document.getElementById("emailErrorMsg");
        emailErrorMsg.innerHTML = "veuillez entrer une adresse mail valide !";
    }

    if (firstNameIsValid && lastNameIsValid && addressIsValid && cityIsValid && emailIsValid) {
        let contact = {
            firstName: firstname,
            lastName: lastname,
            address: address,
            city: city,
            email: email
        };

        let storedProducts = JSON.parse(localStorage.getItem("products"));
        let products = [];
        for (let i = 0; i < storedProducts.length; i++) {
            if (i == 0) {
                products.push(storedProducts[i].pId);
            }
            else (products.includes(storedProducts[i].pId) == false)
            {
                products.push(storedProducts[i].pId);
            }
        }

        fetch(`http://localhost:3000/api/products/order`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contact, products })
        })
            .then(result => result.json())
            .then(order => {
                window.location.href = "confirmation.html?id=" + order.orderId;
            });
    }




}
function CheckFirstNameValidity(firstname) {
    let regex = new RegExp("^[a-z ,.'-]+$");
    return regex.test(firstname);
}
function CheckLastNameValidity(lastname) {
    let regex = new RegExp("^[a-z ,.'-]+$");
    return regex.test(lastname);
}
function CheckAddressValidity(address) {
    let regex = new RegExp("^.{5,}$");
    return regex.test(address);
}
function CheckCityValidity(city) {
    let regex = new RegExp("^[a-z ,.'-]+$");
    return regex.test(city);
}
function CheckEmailValidity(email) {
    let regex = new RegExp("^[^\s@]+@[^\s@]+\.[^\s@]+$");
    return regex.test(email);
}



document.getElementById("order").addEventListener("click", Order);
document.addEventListener("load", GetCart());
