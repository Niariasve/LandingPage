let loaded = (e) => {
    loadTable();

    let myform = document.getElementById('formulario')
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault()

        let name = document.getElementById('name')
        let apellido = document.getElementById('apellido')
        let email = document.getElementById('email')
        let contraseña = document.getElementById('contraseña')
        let confirmar_contraseña = document.getElementById('contraseña-confirmar')
        let genero = document.getElementById('genero')

        let errores = []
        
        if (name.value.length === 0) {
            name.focus()
            errores.push('Es obligatorio ingresar un nombre')
        }
        
        if(apellido.value.length === 0) {
            apellido.focus()
            errores.push('Es obligatorio ingresar el apellido')
        }

        if(email.value.length === 0) {
            email.focus()
            errores.push('Es obligatorio ingresar email')
        }

        if(contraseña.value.length === 0) {
            contraseña.focus()
            errores.push('Es obligatorio ingresar una contraseña')
        }

        if(confirmar_contraseña.value.length === 0) {
            confirmar_contraseña.focus()
            errores.push('Es obligatorio ingresar confirmar su contraseña')
        }

        if(genero.value === 0) {
            errores.push('Es obligatorio ingresar un género')
        }

        if(errores.length > 0) {
            mostrarErrores(errores)
        } else {
            guardarObjeto(name.value, apellido.value, email.value, contraseña.value, confirmar_contraseña.value, genero.value)
        }
    })
}

function guardarObjeto(name, apellido, email, contraseña, confirmar_contraseña, genero) {
    const datos = {
        nombre: name,
        apellido: apellido,
        email: email,
        contraseña: contraseña,
        confirmar_contraseña: confirmar_contraseña,
        genero: genero
    }

    console.log(datos)

    fetch('https://landing-page-36bed-default-rtdb.firebaseio.com/collection.json', {
        method: 'POST',
        body: JSON.stringify(datos),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(respuesta => {
        if (!respuesta.ok) {
            throw new Error('Error en la respuesta del servidor');
        }
        return respuesta.json();
    })
    .then(datos => {
        console.log(datos);
        let alertas = document.querySelector('.alertas');
        alertas.innerHTML = `
            <div class="exito">
                <p>Exito</p>
            </div>
        `;
        loadTable()
    })
    .catch(error => {
        console.error(error);
        let alertas = document.querySelector('.alertas');
        alertas.innerHTML = `
            <div class="error">
                <p>Error: ${error.message}</p>
            </div>
        `;
    });
}


function mostrarErrores(errores) {
    let documentErrores = document.querySelector('.alertas')

    documentErrores.innerHTML = ""

    errores.forEach(element => {
        let html = `
            <div class="error">
                <p>${element}</p>
            </div>
        `

        documentErrores.innerHTML += html
    });
}

async function loadTable() {
    console.log('Desde load tbale')
    let url = 'https://landing-page-36bed-default-rtdb.firebaseio.com/collection.json'

    let respuesta = await fetch(url)

    if(!respuesta.ok) {
        console.error('Error: ', respuesta.status)
        return
    }

    let datos = await respuesta.json()

    let setGender = new Set()
    let mapa = new Map()

    for (const key in datos) {
        if (Object.hasOwnProperty.call(datos, key)) {
            const element = datos[key];
            setGender.add(element.genero)

            let cantidad = mapa.get(element.genero)
            
            if (cantidad == null) {
                mapa.set(element.genero, 1) 
            } else {
                mapa.set(element.genero, cantidad + 1)
            }
        }
    }

    let table = document.getElementById('table-body')

    table.innerHTML = ""
    
    setGender.forEach(genero => {
        let cantidad = mapa.get(genero)
        let template = `
            <tr>
                <th scope="row">${genero}</th>
                <td>${cantidad}</td>	
            </tr>
        `
        table.innerHTML += template
    })
}

window.addEventListener("DOMContentLoaded", loaded)