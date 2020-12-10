//https://ajaxclass-1ca34.firebaseio.com/verox/orders/.json
//https://ajaxclass-1ca34.firebaseio.com/verox/items/.json
/*formulario para cargar más productos,
  category debe ser alguna de las siguientes opciones:
  category:"fruit","vegetable", "meat", "miscelaneous"
  unit:"kg", "lt", "pz"*/
/*crear vista para mostrar todos los productos*/
/*permitir filtrar productos por categoría*/
/*cada producto debe tener un botón de "agregar al carrito",
 debe pedir la cantidad de cada producto*/
/*crear vista de carrito de compras*/
/*debe tener la lista de productos en el carrito, 
mostrando el nombre, la cantidad y el precio*/
/*debe mostrar el costo total de la compra*/

//------------------------------------------------->Declaracion de Variables Globales
//Mis HTML IDs
let JsonElement = "#jsonElement"
let idOrders = "#items-chart"
let idImageProduct = "#image-Product"
//Mis Enpoints URLs
let endpointURL = "https://ajaxclass-1ca34.firebaseio.com/verox/items/.json"
let endpointOrder = "https://ajaxclass-1ca34.firebaseio.com/verox/orders/.json"
//Mis vars auxiliares
let newItem = {}
let itemsToChart = {}
let allItems = {}



//------------------------------------------------->Funciones
//Request de GET a AJAX
const getTheJson = (endpoint, criteria) => {
  $.ajax({
    url: endpoint,
    method: "GET",
    success: data => {
      endpoint === endpointURL ? allItems = data : false
      fillDataToCards(data, criteria)
    },
    error: "",
  });
}

//Request de CUD a AJAX
const crudTheJson = (endpoint, theEntry, action) => {
  let dataValue = ""
  switch (action) {
    case "POST":
      dataValue = JSON.stringify(theEntry);
      console.log("POST")
      break
    case "DELETE":
      endpoint = endpoint.replace(".json", theEntry + "/.json")
      console.log("DELETE")
      break
  }

  $.ajax({
    url: endpoint,
    method: action,
    data: dataValue,
    success: data => {
      getTheJson(endpointURL, "All")
    },
    error: "",
  });
}

//Listener de Inputs Agregar Nuevo Producto
$("input, select").change(event => {
  let property = event.target.name
  let value = event.target.value
  newItem[property] = value
  console.log(newItem)
})

//Listener de Boton Agregar Nuevo Producto
$("#add-product").click(() => {
  newItem["available"] = $("#star:checked").val() ? true : false
  console.log(newItem)
  console.log(endpointURL)
  crudTheJson(endpointURL, newItem, "POST")
 // $("#addProduct").modal("hide")
})

//Listener de Botones de Filtros
$("header .btn-group .btn").click(event => {
  let value = $(event.target).data("filter")
  console.log(value)
  getTheJson(endpointURL,value)
})
//Listener de Boton Agregar Producto al Carrito
//Listener de Boton Limpiar Producto del Carrito

//Llenado de Cards en el Main
const fillDataToCards = (theJson, criteria) => {
  $(jsonElement).empty()
  for (key in theJson) {
    let object = theJson[key]
    let { productName, price, units, category, imageURL } = object
    if (category === criteria || criteria === "All") {
      let newCard = `
            <div class="card m-1 d-flex flex-column align-items-center">
              <img src="${imageURL}" class="card-img-top h-100" alt="...">
              <div class="card-body">
                <h5 class="card-title text-success">${productName}</h5>
                <p class="card-text">Precio: $ ${price}.00</p>
                <div class="input-group mb-3">
                  <input type="number" name="quantity" min="0" step="1" class="form-control" placeholder="Cantidad" aria-label="Button Add Shop" aria-describedby="btn-add-chart">
                  <div class="input-group-append">
                    <span class="input-group-text">${units}</span>
                  </div>
                  <div class="input-group-append">
                    <button class="btn btn-success btn-block btn-add-chart" data-entry-key=${key}><i class="fas fa-cart-plus" data-entry-key=${key}></i></button>
                  </div>
                </div>
                  <button class="btn btn-danger btn-delete" data-entry-key=${key}>-</button>
                </div>
              </div>
              `
      $(jsonElement).append(newCard)
    }
  }
  $(jsonElement).html() === "" ? $(jsonElement).html(`<p class="p-3 font-weight-bold w-100">¡Oops! Aún no hay entradas en la categoria seleccionada.</p>`) : addBtnDeleteListener()
}

//Listener de los botones delete
const addBtnDeleteListener = () => {
  $(".card .btn-delete").click(event => {
    let entryKey = $(event.target).data("entry-key")
    crudTheJson(endpointURL, entryKey, "DELETE")
  })

  $(".card .btn-add-chart").click(event => {
    let entryKey = $(event.target).data("entry-key")
    $(".card input").each( function() {
      let qty = $(this).val()
      console.log(qty)
    })
    quantity = {quantity: 2}
    itemsToChart += allItems[entryKey]
    console.log(itemsToChart)
    fillChartTable(itemsToChart)
  })
}

//Llenado de Filas en la Tabla del Carrito de Compras

const fillChartTable = (theJson) => {
 let i = 0;
  for (key in theJson) {
    i++
    let object = theJson[key]
    let {productName, price} = object
    let newRow = `
    <tr>
      <td>${i}</td>
      <td>${productName}</td>
      <td>quantity</td>
      <td>${price}</td>
    </tr>
              `
    $(idOrders).append(newRow)
  }
}

//------------------------------------------------->Instrucciones Iniciales
getTheJson(endpointURL, "All")