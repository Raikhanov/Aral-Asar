(() => {
  const errorMessage = document.getElementById("map-error");

  function initializeMap() {
    if (!window.L) {
      errorMessage.hidden = false;
      return;
    }

    const points = {
      kyzylorda: [44.8488, 65.4823],
      aralsk: [46.8, 61.6667],
      karateren: [45.9701465, 61.0198333],
      aralAsar: [45.7102, 60.3156],
    };
    const map = L.map("map", {
      zoomControl: false,
      scrollWheelZoom: false,
      minZoom: 5,
      maxZoom: 14,
    });
    map.createPane("highlightPane");
    map.getPane("highlightPane").style.zIndex = "350";

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>',
    }).addTo(map);
    L.control.zoom({ position: "topright" }).addTo(map);

    const route = L.polyline(
      [points.kyzylorda, points.aralsk, points.karateren, points.aralAsar],
      { color: "#a67745", weight: 3, opacity: 0.9, dashArray: "7 8" },
    ).addTo(map);

    const markers = [];
    const makeMarker = (coords, name, description, className = "") => {
      const icon = L.divIcon({
        className: "",
        html: `<span class="custom-marker ${className}"><span class="marker-dot"></span><span class="marker-label">${name}</span></span>`,
        iconSize: [170, 32],
        iconAnchor: [7, 16],
      });
      const marker = L.marker(coords, { icon }).bindPopup(
        `<div class="map-popup"><strong>${name}</strong><span>${description}</span></div>`,
      );
      markers.push(marker);
      return marker.addTo(map);
    };

    makeMarker(points.kyzylorda, "Кызылорда", "Начальная точка предлагаемого маршрута.");
    makeMarker(points.aralsk, "Аральск", "Город на берегу Северного Аральского моря.");
    makeMarker(points.karateren, "Каратерен", "Ближайший ориентир; памятник расположен примерно в 65,2 км.", "village-marker");
    makeMarker(points.aralAsar, "Арал-асар", "Средневековое городище. Координаты по материалам экспедиции 2008 года.", "site-marker");

    const riskArea = L.circleMarker(points.aralAsar, {
      radius: 23,
      pane: "highlightPane",
      className: "risk-circle",
      color: "#b76a50",
      fillColor: "#be755e",
      weight: 1,
    }).bindPopup(
      '<div class="map-popup"><strong>Арал-асар</strong><span>Подсветка точки условная и не обозначает границу участка или зоны риска.</span></div>',
    );
    riskArea.addTo(map);

    map.fitBounds(route.getBounds(), { padding: [38, 50] });
    window.setTimeout(() => map.invalidateSize(), 0);

    document.getElementById("layer-route").addEventListener("change", (event) => {
      event.target.checked ? route.addTo(map) : map.removeLayer(route);
    });
    document.getElementById("layer-risk").addEventListener("change", (event) => {
      event.target.checked ? riskArea.addTo(map) : map.removeLayer(riskArea);
    });
    document.getElementById("layer-labels").addEventListener("change", (event) => {
      markers.forEach((marker) => {
        if (event.target.checked) marker.addTo(map);
        else map.removeLayer(marker);
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeMap, { once: true });
  } else {
    initializeMap();
  }
})();
