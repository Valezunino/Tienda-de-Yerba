import type { Product } from "./types";

export const sampleProducts: Product[] = [
  { id: "demo-1", name: "Yerba tradicional", brand: "Playadito", description: "Sabor suave y equilibrado para todos los días.", weight: "1 kg", price: 5900, stock: 18, active: true, image_url: null, accent: "#c33b32" },
  { id: "demo-2", name: "Yerba con palo", brand: "Amanda", description: "Clásica, rendidora y de estacionamiento natural.", weight: "1 kg", price: 5700, stock: 12, active: true, image_url: null, accent: "#c8323e" },
  { id: "demo-3", name: "Suave", brand: "Unión", description: "Una opción suave para mates largos.", weight: "500 g", price: 3400, stock: 9, active: true, image_url: null, accent: "#278852" },
  { id: "demo-4", name: "Selección especial", brand: "La Merced", description: "Perfil intenso, ideal para quienes buscan más carácter.", weight: "500 g", price: 4900, stock: 7, active: true, image_url: null, accent: "#273e30" },
  { id: "demo-5", name: "Hierbas serranas", brand: "Cachamate", description: "Con hierbas seleccionadas y aroma fresco.", weight: "500 g", price: 3600, stock: 14, active: true, image_url: null, accent: "#4a8e48" },
  { id: "demo-6", name: "Orgánica", brand: "Anna Park", description: "Yerba orgánica de sabor limpio y persistente.", weight: "500 g", price: 6200, stock: 5, active: true, image_url: null, accent: "#9f7a30" },
];
