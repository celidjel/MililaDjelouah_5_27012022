function GetCart(){
    
        let storedProducts = JSON.parse(localStorage.getItem("products"));

        let cartProducts = [];
        let totalPrice = 0;
        let totalProductsNbr = 0;
        
        for(let i = 0 ; i < storedProducts.length ; i++)
        {
            fetch(`http://localhost:3000/api/products/${storedProducts[i].pId}`)
                .then(function(result) {
                    if (result.ok){
                        return result.json();
                    }
                })

                .then (function(product){ 
                    let productInfos = {
                        productId : product._id,
                        color : storedProducts[i].pColor,
                        quantity : storedProducts[i].pQuantity,
                        name : product.name,
                        productImg : product.imageUrl,
                        imgAlt : product.altTxt,
                        price : product.price
                    };

                    cartProducts.push(productInfos);

                    totalPrice += (productInfos.price * productInfos.quantity);
                    totalProductsNbr += parseInt(productInfos.quantity);

                    let cartItems = document.getElementById('cart__items');
                    let article = document.createElement("article");
                    article.classList.add("cart__item");
                    article.dataset.id = storedProducts[i].pId;
                    article.dataset.color = storedProducts[i].pColor;
                    cartItems.appendChild(article);
   
                    let divImg = document.createElement("div");
                    divImg.classList.add("cart__item__img");
                    let img = document.createElement("img");
                    img.src = product.imageUrl;
                    img.alt = product.altTxt;
                    divImg.appendChild(img);
                    article.appendChild(divImg);

                    let divContent = document.createElement("div");
                    divContent.classList.add("cart__item__content");
                    let divDescription = document.createElement("div");
                    divDescription.classList.add("cart__item__content__description");
                    let h2 = document.createElement("h2");
                    h2.innerText = product.name;
                    let paragraphColor = document.createElement("p");
                    paragraphColor.innerText = storedProducts[i].pColor;
                    let paragraphPrice = document.createElement("p");
                    paragraphPrice.innerText = product.price + "€";
                    divDescription.appendChild(h2);
                    divDescription.appendChild(paragraphColor);
                    divDescription.appendChild(paragraphPrice);
                    divContent.appendChild(divDescription);

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

                    let divDelete = document.createElement("div");
                    divDelete.classList.add("cart__item__content__settings__delete");
                    let paragraphDelete = document.createElement("p");
                    paragraphDelete.classList.add("deleteItem");
                    paragraphDelete.innerText = "Supprimer";
                    divSettings.appendChild(paragraphDelete);

                    article.appendChild(divContent);
                    article.appendChild(divSettings);   
                    
                    let totalPriceDOM = document.getElementById("totalPrice");
                    totalPriceDOM.innerText = totalPrice;

                    let nbrProducts = document.getElementById("totalQuantity");
                    nbrProducts.innerText = totalProductsNbr;
                 })                
        }  

        console.log(cartProducts);
}

document.addEventListener("load", GetCart());