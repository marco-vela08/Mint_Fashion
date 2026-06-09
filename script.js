/* =========================
   MENU
========================= */

function toggleMenu() {
  document.getElementById("sidebar")?.classList.toggle("open");
}

/* =========================
   STATO GLOBALI
========================= */

let prodotti = [];

/* =========================
   CARICAMENTO DATI
========================= */

async function caricaDati() {
  try {
    const [prodottiRes, faqRes] = await Promise.all([
      fetch("prodotti.json"),
      fetch("faq.json")
    ]);

    prodotti = await prodottiRes.json();
    const faq = await faqRes.json();

    initProdotti();
    renderCatalogo(prodotti);
    renderHomeSwiper(prodotti);
    renderFAQ(faq);

  } catch (err) {
    console.error("Errore caricamento dati:", err);
  }
}

window.addEventListener("load", caricaDati);

/* =========================
   SELECT PRODOTTI
========================= */

function initProdotti() {
  aggiornaSelectProdotti();
}

function aggiornaSelectProdotti() {
  document.querySelectorAll(".prodotti").forEach(select => {
    if (select.dataset.loaded) return;

    select.dataset.loaded = "true";

    prodotti.forEach(p => {
      const option = document.createElement("option");
      option.value = p.nome;
      option.textContent = p.nome;
      select.appendChild(option);
    });
  });
}

/* =========================
   RIGHE DINAMICHE
========================= */

function aggiungiRiga() {
  const container = document.getElementById("righe");

  const row = document.createElement("div");
  row.className = "riga";

  row.innerHTML = `
    <select name="prodotto[]" class="prodotti">
      <option value="">Prodotto</option>
    </select>

    <input type="number" name="quantita[]" value="1" min="1">
    <input type="file" name="immagine[]">
  `;

  container.appendChild(row);

  aggiornaSelectProdotti();
}

/* =========================
   FAQ
========================= */

function renderFAQ(data) {
  const container = document.getElementById("faq-container");
  if (!container) return;

  container.innerHTML = "";

  data.forEach(item => {
    const details = document.createElement("details");
    details.className = "faq";

    details.innerHTML = `
      <summary>${item.titolo}</summary>
      <p>${item.testo}</p>
    `;

    container.appendChild(details);
  });
}

/* =========================
   TEMPLATE CARD
========================= */

function createCard(p) {
  return `
    <div class="card">
      <img src="${p.img}" alt="${p.nome}" loading="lazy">

      <div class="content">
        <div class="badge">${p.badge ?? ""}</div>
        <h3>${p.nome}</h3>
        <div class="price">€${p.prezzo}</div>

        <button onclick="location.href='richiesta_preventivi.html'">
          Richiedi un preventivo
        </button>
      </div>
    </div>
  `;
}

/* =========================
   CATALOGO
========================= */

function renderCatalogo(lista) {
  const container = document.getElementById("catalogo");
  if (!container) return;

  container.innerHTML = lista.map(createCard).join("");
}

/* =========================
   HOME SWIPER
========================= */

function renderHomeSwiper(lista) {
  const track = document.querySelector(".carousel-track");
  if (!track) return;

  const items = lista.slice(0, 7);

  track.innerHTML = [
    ...items,
    ...items
  ].map(createCard).join("");
}

/* =========================
   FILTRI
========================= */

function filterProducts(tipo) {
  if (tipo === "all") {
    return renderCatalogo(prodotti);
  }

  renderCatalogo(prodotti.filter(p => p.tipo === tipo));
}

/* =========================
   AZIONI
========================= */

function personalizza(id) {
  const prodotto = prodotti.find(p => p.id === id);
  if (!prodotto) return;

  console.log("Personalizzazione:", prodotto.nome);
}

/* =========================
   AUTOSCROLL (OPZIONALE)
========================= */

function startAutoScroll(track, totalItems) {
  let index = 0;
  const cardWidth = 270;

  setInterval(() => {
    index = (index + 1) % totalItems;
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }, 2500);
}