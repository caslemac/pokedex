const API = "https://pokeapi.co/api/v2/pokemon/?offset=20&limit=100";

const lista = document.getElementById("lista");
const estado = document.getElementById("estado");
const buscador = document.getElementById("buscador");
const detalle = document.getElementById("detalle");

let pokemones = [];

function obtenerId(url) {
  return url.split("/").filter(Boolean).pop();
}

function imagen(id) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
}

function mostrar(datos) {
  lista.innerHTML = "";
  datos.forEach((p) => {
    const id = obtenerId(p.url);
    const boton = document.createElement("button");
    boton.className = "tarjeta";
    boton.innerHTML = `
      <img src="${imagen(id)}" alt="${p.name}" loading="lazy">
      <small>#${id}</small>
      <strong>${p.name}</strong>`;
    boton.addEventListener("click", () => abrirDetalle(p.url));
    lista.appendChild(boton);
  });
  estado.textContent = datos.length ? "" : "No hay resultados para esa búsqueda.";
}

async function abrirDetalle(url) {
  try {
    const respuesta = await fetch(url);
    const d = await respuesta.json();
    const tipos = d.types
      .map((t) => `<span class="tipo">${t.type.name}</span>`)
      .join("");
    detalle.innerHTML = `
      <img src="${imagen(d.id)}" alt="${d.name}">
      <h2>${d.name} #${d.id}</h2>
      <div>${tipos}</div>
      <p>Altura: ${d.height / 10} m<br>Peso: ${d.weight / 10} kg</p>
      <button id="cerrar">Cerrar</button>`;
    document.getElementById("cerrar").addEventListener("click", () => detalle.close());
    detalle.showModal();
  } catch (error) {
    estado.textContent = "No se pudo cargar el detalle. Intenta de nuevo.";
  }
}

async function cargar() {
  try {
    const respuesta = await fetch(API);
    if (!respuesta.ok) throw new Error("Respuesta inválida");
    const datos = await respuesta.json();
    pokemones = datos.results;
    mostrar(pokemones);
  } catch (error) {
    estado.textContent = "No se pudo cargar la lista. Revisa tu conexión e intenta de nuevo.";
  }
}

buscador.addEventListener("input", () => {
  const texto = buscador.value.trim().toLowerCase();
  mostrar(pokemones.filter((p) => p.name.includes(texto)));
});

cargar();
