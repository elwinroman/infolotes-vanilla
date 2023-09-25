// registra service worker - offline webpage
if ('serviceWorker' in navigator)
  navigator.serviceWorker.register('./sw.js')

searchInfo()
setFocus()

/* ============== FUNCTIONS ============== */ 

// focus en el input cada vez que la aplicacion inicia
function setFocus () {
  const $input = document.querySelector('input[name="search"]')
  $input.focus()
}

// busca información de un lote
function searchInfo () {
  const $form = document.querySelector('form.search-form')

  $form.addEventListener('submit', async (e) => {
    e.preventDefault()
     
    const $infoContainer = document.querySelector('main.info')
    const formData = new FormData($form)
    const search = formData.get('search').toLowerCase().trim() 
    
    const response = await fetch('./database.json')
    const data = await response.json()
    
    try {
      const index = data.findIndex(el => (el.lote === search))
      
      if (index < 0) {
        $infoContainer.innerHTML = NotFoundComponent()
        return 
      }

      const info = data[index]
      let perimeter = 0

      info.lado.forEach(l => { perimeter += l })
      $infoContainer.innerHTML = CardComponent({ info, perimeter })

    } catch (error) {
      throw new Error(`Ha ocurrido un error ${error}`)
    }

  })
}

function CardComponent ({ info, perimeter }) {
  const icon = Icons()

  return (`
    <div class="card">
      <h1>${ info.lote }</h1>

      <div class="wrapper area">
        <span class="icon">${ icon.area }</span>
        <span class="area">${ info.area } m\xB2</span>
      </div>
      
      <span class="wrapper precio">
        ${ info.precio.toLocaleString('es-PE', {
          style: 'currency',
          currency: 'PEN'
        }) }
      </span>

      <div class="wrapper perimetro">
        <span class="icon">${ icon.perimeter }</span>
        <span class="perimetro">${ perimeter.toFixed(2) } m</span>
      </div>

      <div class="lado-wrapper">
        <div class="lado-line">
          <span class="icon-2">${ icon.caretUp }</span>
          <span> ${ info.lado[0].toFixed(2) }</span>
        </div>
      
        <div class="lado-line">
          <span class="icon-2">${ icon.caretRight }</span>
          <span>${ info.lado[1].toFixed(2) }</span>
        </div>
        
        <div class="lado-line">
          <span class="icon-2">${ icon.caretDown }</span>
          <span>${ info.lado[2].toFixed(2) }</span>
        </div>
        
        <div class="lado-line">
          <span class="icon-2">${ icon.caretLeft }</span>
          <span>${ info.lado[3].toFixed(2) }</span>
        </div>
      </div>
    </div>
  `)
}

function NotFoundComponent () {
  return (`
    <div class="not-found">
      <span class="msg">
        Lote no encontrado. Vuelva a intentarlo.
      </span>
      <img src="public/not-found.svg" width="300px"/>
    </div>
  `)
}

function Icons () {
  const size = '20'
  const size_carets = '16'
  
  return {
    area: `
      <svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke="none" d="M0 0h24v24H0z"/><path d="M5 4h14a1 1 0 0 1 1 1v5a1 1 0 0 1-1 1h-7a1 1 0 0 0-1 1v7a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1M4 8h2M4 12h3M4 16h2M8 4v2M12 4v3M16 4v2"/></svg>
    `,
    perimeter: `
      <svg xmlns="http://www.w3.org/2000/svg" width=${size} height=${size} fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path stroke="none" d="M0 0h24v24H0z"/><path d="M19.875 12c.621 0 1.125.512 1.125 1.143v5.714c0 .631-.504 1.143-1.125 1.143H4a1 1 0 0 1-1-1v-5.857C3 12.512 3.504 12 4.125 12h15.75zM9 12v2M6 12v3M12 12v3M18 12v3M15 12v2M3 3v4M3 5h18M21 3v4"/></svg>
    `,
    caretUp: `
      <svg xmlns="http://www.w3.org/2000/svg"   width=${size_carets} height=${size_carets} fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="m18 14-6-6-6 6h12"/></svg>
    `,
    caretRight: `
      <svg xmlns="http://www.w3.org/2000/svg" width=${size_carets} height=${size_carets} fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="m10 18   6-6-6-6v12"/></svg>
    `,
    caretLeft: `
      <svg xmlns="http://www.w3.org/2000/svg" width=${size_carets} height=${size_carets} fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="m14 6-6 6 6 6V6"/></svg>
    `,
    caretDown: `
      <svg xmlns="http://www.w3.org/2000/svg" width=${size_carets} height=${size_carets} fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"><path stroke="none" d="M0 0h24v24H0z"/><path d="m6 10 6 6 6-6H6"/></svg>
  `}
}
