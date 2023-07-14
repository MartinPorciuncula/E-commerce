async function getProduct() {
    try {
        const data = await fetch("https://services-academlo-shopping.onrender.com")
        const resp = await data.json()
        window.localStorage.setItem("products", JSON.stringify(resp))
        return resp
    } catch (error) {
    }
}

function printProducts(dbs) {
    const productsHTML = document.querySelector(".products")

    let htmlpr = ""

    for (const product of dbs.products) {

        htmlpr += `<div class= "product ${product.category}">

        <div class="productIMG"> 
        <img src="${product.image}" alt="img"/>
        </div>
        <div class="productINF"> 
        <h3 class="name" id="${product.id}"> ${product.name} / <span><b>Stock</b>:${product.quantity}</span> </h3>
        <h4>${product.price}
        <p>${product.quantity ? `<i class='bx bx-cart-add' id="${product.id}"></i>` : "<div><p>Sold Out</p></div>"}</p></h4>    
        </div>


        </div>`
    }
    productsHTML.innerHTML = htmlpr
}

function cartListOnOff() {
    const showcart = document.querySelector(".bxs-cart")
    showcart.addEventListener("click", () => { document.querySelector(".cartlist").classList.toggle("cartlist-show") })
}

function productId(dbs) {
    const addproduct = document.querySelector(".products")
    addproduct.addEventListener("click", (e) => {
        if (e.target.classList.contains("bx-cart-add")) {
            let id = Number(e.target.id)
            let saveproduct = dbs.products.find(product => product.id === id)
            if (dbs.cart[saveproduct.id]) {
                if (dbs.cart[id].amount === dbs.cart[id].quantity) {
                    Swal.fire({
                        icon: 'Ups!',
                        title: 'This item is',
                        text: 'Sold out!',
                        footer: '<a href="#" class="otherproducts">Try others products ;)</a>'
                    })
                }

                else { dbs.cart[id].amount++ }
            }
            else {
                dbs.cart[saveproduct.id] = { ...saveproduct, amount: 1 }
            }
            window.localStorage.setItem("dbs-cart", JSON.stringify(dbs.cart))
            PrintInCart(dbs)
            unitsAndPrice(dbs)
            HandlePrintAmountProducts(dbs)
        }
    })
}

function PrintInCart(dbs) {
    const printIncarts = document.querySelector(".product-cartlist")

    let productsBuyed = ""
    for (const printed in dbs.cart) {

        productsBuyed += `<div class= "printerDad">  
        <i class='bx bxs-minus-circle' id="${dbs.cart[printed].id}"></i>
        <div class="cart__product-img">
        <img src="${dbs.cart[printed].image}">
        </div>
        <div class="Cart__product-body">
        <p class ="Product-name"> ${dbs.cart[printed].name} </p>
        <p class="Product-price"> Price: ${dbs.cart[printed].price} </p>
        <div class="Cart__product-body-op">
        <i class='bx bxs-caret-up-circle'  id="${dbs.cart[printed].id}"></i>
        <p class="Amount"> Amount ${dbs.cart[printed].amount}     
        <i class='bx bxs-caret-down-circle'  id="${dbs.cart[printed].id}"></i> </p>
        <p> Quantity ${dbs.cart[printed].quantity} </p>
        <p> Subtotal: ${dbs.cart[printed].amount * dbs.cart[printed].price} </p>
        </div>
        </div>
        </div>`
    }
    printIncarts.innerHTML = productsBuyed
}

function removeItems(dbs) {
    const removeItem = document.querySelector(".product-cartlist")
    removeItem.addEventListener("click", (e) => {
        if (e.target.classList.contains("bxs-minus-circle")) {
            const id = Number(e.target.id)
            delete dbs.cart[id]
        }
        window.localStorage.setItem("dbs-cart", JSON.stringify(dbs.cart))
        PrintInCart(dbs)
        ResetCounters()
    })
}

function confirmBuy(dbs) {
    const buyConfirm = document.querySelector(".buyButton")
    buyConfirm.addEventListener("click", () => {
        if (!Object.values(dbs.cart).length) return alert("Debes agregar algo al carrito!")
        const response = confirm("Seguro que quieres comprar?")
        if (!response) return
        let arraymod = []
        dbs.products.forEach(product => {
            if (dbs.cart[product.id]) {
                arraymod.push({ ...product, quantity: product.quantity - dbs.cart[product.id].amount })

            }
            else {
                arraymod.push(product)
            }
        });
        dbs.products = arraymod
        dbs.cart = {}
        window.localStorage.setItem("dbs-cart", JSON.stringify(dbs.cart))
        window.localStorage.setItem("products", JSON.stringify(dbs.products))
        PrintInCart(dbs)
        printProducts(dbs)
        HandlePrintAmountProducts(dbs)
        unitsAndPrice(dbs)
        ResetCounters() 
          
    })
}

function addAndRemoveProducts(dbs) {
    const Cart__products = document.querySelector(".product-cartlist")

    Cart__products.addEventListener("click", (e) => {
        if (e.target.classList.contains("bxs-caret-up-circle")) {
            const id = Number(e.target.id)
            let saveproduct = dbs.products.find(product => product.id === id)
            if (dbs.cart[saveproduct.id]) {
                if (dbs.cart[id].amount === dbs.cart[id].quantity) {
                    Swal.fire({
                        icon: 'Ups!',
                        title: 'This item is',
                        text: 'Sold out!',
                        footer: '<a href="">Try others products ;)</a>'
                    })
                }

                else { dbs.cart[id].amount++ }
            }
        }
        if (e.target.classList.contains("bxs-caret-down-circle")) {
            const id = Number(e.target.id)
            if (dbs.cart[id].amount === 1) {
                const response = confirm("Estas seguro quieres eliminar esto? :(")
                if (!response) return
                delete dbs.cart[id]
            } else { dbs.cart[id].amount-- }
        }

        window.localStorage.setItem("dbs-cart", JSON.stringify(dbs.cart))
        PrintInCart(dbs)
        unitsAndPrice(dbs)
        HandlePrintAmountProducts(dbs)
    })
}

function unitsAndPrice(dbs) {
    const infoTotal = document.querySelector(".info__total")
    const infoAmount = document.querySelector(".info__amount")
    let totalProducts = 0
    let amountProducts = 0

    for (const product in dbs.cart) {
        const { amount, price } = dbs.cart[product]
        totalProducts += price * amount
        amountProducts += amount
    }

    infoTotal.textContent = "$" + totalProducts + ".00"
    infoAmount.textContent = amountProducts + "units"

    window.localStorage.setItem("dbs-cart", JSON.stringify(dbs.cart))
    PrintInCart(dbs)
}

function HandlePrintAmountProducts(dbs) {
    const amountProducts = document.querySelector(".amountProducts")

    let amount = 0

    for (const product in dbs.cart) {

        amount += dbs.cart[product].amount

        amountProducts.textContent = amount
    }
    window.localStorage.setItem("dbs-cart", JSON.stringify(dbs.cart))
    PrintInCart(dbs)

}

function ToggleDarkMode() {
    const darkmodebutton = document.querySelector(".darkmode-icon")
    function AdminDarkmode() {
     if (document.body.classList.contains("darkmode")) {
        document.body.classList.remove("darkmode")
        darkmodebutton.innerHTML = '<i class="bx bxs-moon"></i>'
        localStorage.removeItem("darkmode")
     } else{document.body.classList.add("darkmode")
     darkmodebutton.innerHTML =  '<i class="bx bx-sun"></i>'
     localStorage.setItem("darkmode", true)
    } 
    }
    darkmodebutton.addEventListener("click", () =>  AdminDarkmode())

    let validationDarkmode = window.localStorage.getItem("darkmode")
    if (validationDarkmode) {
        document.body.classList.add("darkmode")
        darkmodebutton.innerHTML = '<i class="bx bx-sun"></i>'
    } else{
        darkmodebutton.innerHTML ='<i class="bx bxs-moon"></i>'
    }
}

function ResetCounters() {
    const resetcounter = document.querySelector(".amountProducts")

    resetcounter.textContent = 0
}

function NavScroll() {
    window.addEventListener("scroll", () => {
        if (window.scrollY > 150) {
            document.querySelector(".header-class").classList.add("Header-effect")
        } else {
            document.querySelector(".header-class").classList.remove("Header-effect")
        }
    })
}

function MixProducts() {
    let mixer = mixitup(".products", {
        selectors: {
            target: '.product'
        },
        animation: {
            duration: 300
        }
    });

}

function Loader() {
    window.addEventListener('load', function () {
        document.querySelector('body').classList.add("loaded")
    });
}

function Modals(dbs) {
    const product = document.querySelector(".products")
    const modal = document.querySelector(".modals")
    let htmlmodal = ""
    product.addEventListener("click", (e) => {
        if (e.target.classList.contains("name")) {
            const id = Number(e.target.id)
            const foundId = dbs.products.find(product => product.id === id)
            htmlmodal = `<div class="single__modal">
            <i class='bx bx-x-circle'></i>
        <div class="productIMGmod"> 
        <img src="${foundId.image}" alt="img"/>
        </div>
        <div class="productINFmod">
        <h3 class="namemod"> ${foundId.name} - <span>${foundId.category}</span> </h3>
        </div>
        <div class="descriptionINFmod"
        <p><a>${foundId.description}</a></p> <h4>Price:${foundId.price}</h4>    
        </div>
        <div class="Quantitymod"
        <div class="Quantitymod2">Price:${foundId.quantity}</div>
        <p>${foundId.quantity ? `<i class='bx bx-cart-add bx-modal' id="${foundId.id}"></i>` : "<div><p class=`soldOut_mod`>Sold Out</p></div>"}</p>    
        </div>`
        }
        modal.innerHTML = htmlmodal
    })
}

function ModalShowandQuit() {
    const products = document.querySelector(".products")
    const modal = document.querySelector(".modals")
    products.addEventListener("click", (e) => {
        if (e.target.classList.contains("name")) {
            document.querySelector(".modals").classList.add("modals_show")
        }
    })
    modal.addEventListener("click", (e) => {
        if (e.target.classList.contains("bx-x-circle")) {
            document.querySelector(".modals").classList.remove("modals_show")
        }
    })
}

function ModalFunction(dbs) {
    const addproductmodal = document.querySelector(".modals")
    addproductmodal.addEventListener("click", (e) => {
        let id = Number(e.target.id)
        let foundId = dbs.products.find(product => (product.id === id))
        if (e.target.classList.contains("bx-cart-add")) {
            if (dbs.cart[foundId.id]) {
                if (dbs.cart[id].amount === dbs.cart[id].quantity) {
                    Swal.fire({
                        icon: 'Ups!',
                        title: 'This item is',
                        text: 'Sold out!',
                        footer: '<a href="#" class="otherproducts">Try others products ;)</a>'
                    })
                }
                else {
                    dbs.cart[id].amount++
                }
            }
            else { dbs.cart[foundId.id] = { ...foundId, amount: 1 } }
            window.localStorage.setItem("dbs-cart", JSON.stringify(dbs.cart))
            PrintInCart(dbs)
            HandlePrintAmountProducts(dbs)
            unitsAndPrice(dbs)

        }
    })
}

async function main() {
    const dbs = {
        products: JSON.parse(window.localStorage.getItem("products")) || await getProduct(),
        cart: JSON.parse(window.localStorage.getItem("dbs-cart")) || {},
    }

    printProducts(dbs)
    cartListOnOff()
    productId(dbs)
    PrintInCart(dbs)
    removeItems(dbs)
    confirmBuy(dbs)
    addAndRemoveProducts(dbs)
    unitsAndPrice(dbs)
    HandlePrintAmountProducts(dbs)
    ToggleDarkMode()
    MixProducts()
    NavScroll()
    Loader()
    Modals(dbs)
    ModalShowandQuit()
    ModalFunction(dbs)
}
main()