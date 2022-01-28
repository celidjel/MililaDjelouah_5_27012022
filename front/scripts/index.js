function GetProducts(){
    fetch("http://localhost:3000/api/products")
    .then(function(result) {
        if (result.ok){
            return result.json();
        }
    })
    .then(function(products){ 
        let itemsDOM = document.getElementById('items');
        for (let product in products){          
            // ajout d'une balise a cliquable
            let Link = document.createElement("a");
            Link.href =  "product.html?id=" + products[product]._id;
            itemsDOM.appendChild(Link);

            let article = document.createElement("article");
            Link.appendChild(article);
            
            let productImg = document.createElement("img");
            productImg.src = products[product].imageUrl;
            productImg.alt = products[product].altTxt;
            article.appendChild(productImg);

            let productName = document.createElement("h3");
            productName.innerText = products[product].name;
            productName.classList.add("productName");
            article.appendChild(productName);

            let productDescription = document.createElement("p");
            productDescription.innerText = products[product].description;
            productDescription.classList.add("productDescription");
            article.appendChild(productDescription);


        }
       
    })
    .catch(function(err) {
        // Une erreur est survenue
      });
}

document.addEventListener("load", GetProducts());