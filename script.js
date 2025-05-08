const proxy = "https://corsproxy.io/?";
const baseURL = "https://api.rule34.xxx/index.php?page=dapi&s=post&q=index&json=1";

document.getElementById("searchBtn").addEventListener("click", buscar);

function buscar() {
  const query = document.getElementById("search").value.trim();
  const filterAI = document.getElementById("filter-ai").checked;
  const fileType = document.getElementById("type").value;
  const loader = document.getElementById("loader");

  if (!query) return alert("Escribe una etiqueta.");

  let tags = encodeURIComponent(query);
  if (filterAI) tags += "+-ai+-artificial_intelligence+-generated";

  const url = `${proxy}${baseURL}&tags=${tags}`;

  loader.style.display = "block";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      const gallery = document.getElementById("gallery");
      gallery.innerHTML = "";

      const filtered = fileType
        ? data.filter(item => item.file_ext === fileType)
        : data;

      if (filtered.length === 0) {
        gallery.innerHTML = "<p>No se encontraron resultados.</p>";
      } else {
        filtered.forEach(item => {
          const element = item.file_ext === "mp4"
            ? document.createElement("video")
            : document.createElement("img");

          element.src = item.file_url;
          if (item.file_ext === "mp4") element.controls = true;
          element.alt = item.tags;
          gallery.appendChild(element);
        });
      }
    })
    .catch(() => alert("Error al cargar datos desde la API."))
    .finally(() => loader.style.display = "none");
}
