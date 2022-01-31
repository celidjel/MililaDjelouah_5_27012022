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
        productImg.id = "pImage";
        productImg.src = product.imageUrl;
        productImg.alt = product.altTxt;
        itemImg.appendChild(productImg);

        let itemName = document.getElementById('title') ;         
        itemName.innerText = product.name;
        
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

function addToCart(){

     let storedProducts = JSON.parse(localStorage.getItem("products")); // Récupérer la liste des produits présents dans le localstorage     

    let selectColor = document.getElementById('colors');   // récupérer l'élément html select
    let indexColor = selectColor.selectedIndex;  // récupérer l'index de l'option choisie

    let color = selectColor[indexColor].value;  // récupérer la valeur de l'option choisie   
    
    let product = {
        pId : productId,       
        pQuantity : document.getElementById('quantity').value,
        pColor : color        
    };

    let productsArray = [];

    if(storedProducts === null)
    {
        productsArray.push(product);
        localStorage.setItem("products", JSON.stringify(productsArray));
    }
    else
    {  
        productsArray = storedProducts;
        let productExists = false;    
        for(let i = 0 ; i < productsArray.length ; i++)
        {
            if(productsArray[i].pId === product.pId && productsArray[i].pColor === product.pColor)
            {
                productsArray[i].pQuantity = parseInt(productsArray[i].pQuantity) + parseInt(product.pQuantity);
                productExists = true;                
                break;
            }
        }  
        
        if(productExists === false)
        {
            productsArray.push(product);            
        }

        localStorage.setItem("products", JSON.stringify(productsArray));        
    } 
}

document.addEventListener("load", GetProduct());
document.getElementById("addToCart").addEventListener("click", addToCart);

