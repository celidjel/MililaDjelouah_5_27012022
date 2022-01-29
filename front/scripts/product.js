let parametres = new URL(document.location).searchParams;    //?id=8906dfda133f4c20a9d0e34f18adcf06
let productId = parametres.get('id'); //8906dfda133f4c20a9d0e34f18adcf06

function GetProduct()
{
    fetch(`http://localhost:3000/api/products/${productId}`)
    .then(function(result) {
        if (result.ok){
            return result.json();
        }
    })

    .then (function(product){      

        let itemImg = document.getElementById('product_img');
        let productImg = document.createElement("img");
        productImg.src = product.imageUrl;
        itemImg.appendChild(productImg);

        let itemName = document.getElementById('title') ;         
        itemName.innerHTML = product.name;
        
        let itemPrice = document.getElementById('price');
        itemPrice.innerText = product.price;

        let itemdescription = document.getElementById('description');
        itemdescription.innerText = product.description;
        
        let itemcolors = document.getElementById('colors') ;         
        
        for(let i = 0; i < product.colors.length; i++){
            let productColor = document.createElement("option") ;
            productColor.innerText = product.colors[i];
            productColor.value = product.colors[i];
            itemcolors.appendChild(productColor);
        }

       
    })
}








document.addEventListener("load", GetProduct());

