const domains = {
  acura: "acura.com", "alfa-romeo": "alfaromeo.com", audi: "audi.com",
  bmw: "bmw.com", buick: "buick.com", cadillac: "cadillac.com",
  chevrolet: "chevrolet.com", chrysler: "chrysler.com", dodge: "dodge.com",
  ferrari: "ferrari.com", fiat: "fiat.com", ford: "ford.com",
  gmc: "gmc.com", honda: "honda.com", hyundai: "hyundai.com",
  infiniti: "infinitiusa.com", jaguar: "jaguar.com", jeep: "jeep.com",
  kia: "kia.com", lamborghini: "lamborghini.com", "land rover": "landrover.com",
  lexus: "lexus.com", lincoln: "lincoln.com", maserati: "maserati.com",
  mazda: "mazda.com", "mercedes-benz": "mercedes-benz.com", mini: "mini.com",
  mitsubishi: "mitsubishi-motors.com", nissan: "nissan.com", pontiac: "pontiac.com",
  porsche: "porsche.com", ram: "ramtrucks.com", subaru: "subaru.com",
  suzuki: "suzuki.com", tesla: "tesla.com", toyota: "toyota.com",
  volkswagen: "vw.com", volvo: "volvocars.com", saturn: "gm.com",
  scion: "toyota.com", mercury: "ford.com", isuzu: "isuzu.com",
};

export function getBrandLogo(manufacturer) {
  if (!manufacturer) return null;
  const key = manufacturer.toLowerCase();
  const domain = domains[key];
  return domain ? `https://logo.clearbit.com/${domain}` : null;
}

export function getBrandColor(manufacturer) {
  const colors = {
    toyota: "#eb0a1e", honda: "#e40521", ford: "#003076", bmw: "#0166b1",
    mercedes: "#222", audi: "#bb0a14", volkswagen: "#001e50", tesla: "#e82127",
    chevrolet: "#d4a600", nissan: "#c3002f", hyundai: "#002c5f", kia: "#05141f",
    jeep: "#3d7c3f", porsche: "#b5985a", lexus: "#1a1a1a", subaru: "#003399",
    mazda: "#b41c22", dodge: "#d4001c", gmc: "#1b3a6b", cadillac: "#284e8f",
  };
  return colors[manufacturer?.toLowerCase()] || "#3b82f6";
}
