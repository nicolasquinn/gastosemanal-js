// Variables
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul')


// Events
eventListeners()
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
}

// Classes


// Functions

function preguntarPresupuesto () {
    const presupuestoUsuario = prompt('¿Cuál es tu presupuesto?')

    console.log(Number(presupuestoUsuario));

    if (presupuestoUsuario === '' || presupuestoUsuario == null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ) {
        window.location.reload();
    }

}