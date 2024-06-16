let loaded = (e) => {
    loadTable();
    loadOptions();

    let myform = document.getElementById('formulario')
    myform.addEventListener('submit', (eventSubmit) => {
        eventSubmit.preventDefault()

        let name = document.getElementById('name')
        let apellido = document.getElementById('apellido')
        let email = document.getElementById('email')
        let episodio = document.getElementById('episode')

        let errores = []
        
        if (name.value.length === 0) {
            errores.push('Please enter a name')
        }
        
        if(apellido.value.length === 0) {
            errores.push('Please enter a last name')
        }

        if(email.value.length === 0) {
            errores.push('Please enter an email')
        }

        if(episodio.value === 0) {
            errores.push('Please enter an episode')
        }

        if(errores.length > 0) {
            mostrarErrores(errores)
        } else {
            guardarObjeto(name.value, apellido.value, email.value, episodio.value)
        }
    })
}

function guardarObjeto(name, apellido, email, episode) {
    const datos = {
        nombre: name,
        apellido: apellido,
        email: email,
        episode: episode
    }

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
            <div class="exito container">
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
            <div class="error container">
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

    let mapa = new Map()

    for (const key in datos) {
        if (Object.hasOwnProperty.call(datos, key)) {
            const element = datos[key];

            let cantidad = mapa.get(element.episode)
            
            if (cantidad == null) {
                mapa.set(element.episode, 1) 
            } else {
                mapa.set(element.episode, cantidad + 1)
            }
        }
    }

    let table = document.getElementById('table-body')

    table.innerHTML = ""
    
    mapa.forEach( (value,episode) => {
        let cantidad = mapa.get(episode)
        let template = `
            <tr>
                <th scope="row">${episode}</th>
                <td>${cantidad}</td>	
            </tr>
        `
        table.innerHTML += template
    })
}

 async function loadOptions() {
    console.log('Desde load Options')
    let url = 'https://api.sampleapis.com/rickandmorty/episodes'

    let respuesta = await fetch(url)

    if(!respuesta.ok) {
        console.error('Error: ', respuesta.status)
        return
    }

    let datos = await respuesta.json()

    console.log(datos)

    let select = document.getElementById('episode')

    for (const key in datos) {
        if (Object.hasOwnProperty.call(datos, key)) {
            const element = datos[key];
            
            let episodeName = element['name']
            let template = `
                <option value="${episodeName}">
                    ${episodeName}
                </option>
            `

            select.innerHTML += template
        }
    }
}

window.addEventListener("DOMContentLoaded", loaded)