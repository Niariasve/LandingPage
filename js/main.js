let loaded = (e) => {
    let myform = document.getElementById('formulario')
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault()

        let name = document.getElementById('name')
        let apellido = document.getElementById('apellido')
        let email = document.getElementById('email')
        let contraseña = document.getElementById('contraseña')
        let confirmar_contraseña = document.getElementById('contraseña-confirmar')
        
        if (name.value.length === 0) {
            name.focus()
            alert('Ingrese un texto válido')
        }
        
        if(apellido.value.length === 0) {
            apellido.focus()
            alert('Ingrese un texto válido')
        }

        if(email.value.length === 0) {
            email.focus()
            alert('Ingrese un texto válido')
        }

        if(contraseña.value.length === 0) {
            contraseña.focus()
            alert('Ingrese un texto válido')
        }

        if(confirmar_contraseña.value.length === 0) {
            confirmar_contraseña.focus()
            alert('Ingrese un texto válido')
        }
    })
}

window.addEventListener("DOMContentLoaded", loaded)