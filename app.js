const cards = document.getElementById('cards')
const templatecard= document.getElementById('template-card').content
const templateFooter= document.getElementById('template-footer').content
const templatecarrito= document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}


const item=document.getElementById('items')
const footer=document.getElementById('footer')
document.addEventListener('DOMContentLoaded', () =>{
    fetchdata();
    if(localStorage.getItem('carrito')){
        carrito=JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
document.addEventListener("click", e =>{
addcarrito(e)
})
document.addEventListener('click', e => { btnAumentarDisminuir(e) })
const fetchdata = async ()=> {
    try {
        const res = await fetch('Planes.json')
        const data = await res.json()
        pintaracards(data)
    } catch (error) {
        console.log(error)
    }
} 

const pintaracards= data =>{
    data.forEach(producto=>{
        if(producto.id<=6){
        templatecard.querySelector('h3').textContent =producto.Numero
        templatecard.querySelector('h4').textContent=producto.Forma
        templatecard.querySelector('h5').textContent=producto.Duracion
        templatecard.querySelector('p').textContent=producto.Valor
        templatecard.querySelector('img').setAttribute("src", producto.Imagen)
        templatecard.querySelector('.btn-dark').dataset.id = producto.id }
        else{
            
                templatecard.querySelector('h3').textContent =producto.Producto
                templatecard.querySelector('h4').textContent=producto.Material
                templatecard.querySelector('h5').textContent=producto.Fabricado
                templatecard.querySelector('p').textContent=producto.Valor
                templatecard.querySelector('img').setAttribute("src", producto.Imagen)
                templatecard.querySelector('.btn-dark').dataset.id = producto.id }
        
        const clone=templatecard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}
const addcarrito = e =>{
    if(e.target.classList.contains('btn-dark')){

 setCarrito(e.target.parentElement)
    }
e.stopPropagation()
}
const setCarrito = objeto=> {

const producto ={
    id:objeto.querySelector('.btn-dark').dataset.id,
    Plan:objeto.querySelector('h3').textContent,
    Forma:objeto.querySelector('h4').textContent,
    Duracion:objeto.querySelector('h5').textContent,
    Precio:objeto.querySelector('p').textContent,
    Cantidad:1
}
if(carrito.hasOwnProperty(producto.id)){
    producto.Cantidad=carrito[producto.id].Cantidad +1 
}
carrito[producto.id]={...producto}
pintarCarrito()
}
const pintarCarrito = ( ) =>{
    item.innerHTML=''
    Object.values(carrito).forEach(producto => {
        templatecarrito.querySelector('th').textContent=producto.id
        templatecarrito.querySelectorAll('td')[0].textContent=producto.Plan
        templatecarrito.querySelectorAll('td')[1].textContent=producto.Cantidad
        templatecarrito.querySelector('.btn-info').dataset.id=producto.id
        templatecarrito.querySelector('.btn-danger').dataset.id=producto.id
        templatecarrito.querySelector('span').textContent= producto.Cantidad * producto.Precio
        const clone= templatecarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
item.appendChild(fragment)
pintarFooter()

localStorage.setItem('carrito', JSON.stringify(carrito))
}
const pintarFooter= ()=>{
    footer.innerHTML=''
    if(Object.keys(carrito).length==0)
    {
        footer.innerHTML='<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc,{Cantidad}) =>acc +Cantidad, 0) 
    const nPrecio= Object.values(carrito).reduce((acc,{Cantidad, Precio}) =>acc +Cantidad*Precio, 0) 
    
    templateFooter.querySelectorAll('td')[0].textContent=nCantidad
    templateFooter.querySelector('span').textContent=nPrecio
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    const btnVaciar=document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', ()=> {
        carrito={}
        pintarCarrito()
    })
} 
const btnAumentarDisminuir = e => {
    // console.log(e.target.classList.contains('btn-info'))
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto }
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } else {
            carrito[e.target.dataset.id] = {...producto}
        }
        pintarCarrito()
    }
    e.stopPropagation()
}