import type { CartTotals, Product, ProductDetailsData } from "@/types";

// Mock mode only: a small catalog so search, sort, infinite scroll and the cart can all be tried without a backend.
const item = (id: string, name: string, price: number, extra: Partial<Product>): Product => ({
  id,
  name,
  price,
  currency: "EGP",
  image: null,
  description: `${name}. A quality pick for your pet, chosen by the ALEEF team.\n\nAsk the ALEEF assistant if you are not sure it suits your pet.`,
  ...extra,
});

export const mockCatalog: Product[] = [
  item("r1", "Royal Canin 400gm", 445, { originalPrice: 520, stock: 24, sold: 310, rating: 4.8, ratingsCount: 52, categories: ["Food"] }),
  item("r2", "Mera Exklusiv Dry Cat", 800, { stock: 12, sold: 140, rating: 4.6, ratingsCount: 30, categories: ["Food"] }),
  item("r3", "Rugged Leash X", 180, { originalPrice: 220, stock: 40, sold: 95, rating: 4.4, ratingsCount: 18, categories: ["Accessories"] }),
  item("r4", "Catmania Litter", 295, { stock: 3, sold: 220, rating: 4.7, ratingsCount: 41, categories: ["Litter"] }),
  item("r5", "ALPHA Dry Food 1kg", 185, { stock: 30, sold: 180, rating: 4.5, ratingsCount: 27, categories: ["Food"] }),
  item("r6", "K9 Dental Chews", 130, { stock: 0, sold: 75, rating: 4.2, ratingsCount: 12, categories: ["Treats"] }),
  item("r7", "Cat Scratch Tower", 950, { originalPrice: 1200, stock: 6, sold: 64, rating: 4.9, ratingsCount: 22, categories: ["Furniture"] }),
  item("r8", "Pet Water Fountain", 640, { stock: 9, sold: 58, rating: 4.6, ratingsCount: 16, categories: ["Accessories"] }),
  item("r9", "Feather Wand Toy", 60, { stock: 100, sold: 400, rating: 4.3, ratingsCount: 40, categories: ["Toys"] }),
  item("r10", "Orthopedic Dog Bed", 1100, { originalPrice: 1300, stock: 5, sold: 30, rating: 4.8, ratingsCount: 11, categories: ["Beds"] }),
  item("r11", "Grooming Brush", 120, { stock: 50, sold: 110, rating: 4.5, ratingsCount: 20, categories: ["Grooming"] }),
  item("r12", "Flea & Tick Drops", 210, { stock: 18, sold: 130, rating: 4.4, ratingsCount: 33, categories: ["Health"] }),
  item("r13", "Collar with Bell", 75, { stock: 60, sold: 88, rating: 4.1, ratingsCount: 14, categories: ["Accessories"] }),
  item("r14", "Travel Carrier", 780, { stock: 7, sold: 42, rating: 4.7, ratingsCount: 19, categories: ["Travel"] }),
];

export type MockProductsQuery = { page: number; search?: string; sort?: string };

export function mockProductsPage({ page, search, sort }: MockProductsQuery) {
  const PAGE_SIZE = 6; // the backend's page size
  let list = [...mockCatalog];
  const term = search?.trim().toLowerCase();
  if (term) list = list.filter((p) => [p.name, ...(p.categories ?? [])].some((v) => v.toLowerCase().includes(term)));
  if (sort === "popular") list.sort((a, b) => (b.sold ?? 0) - (a.sold ?? 0));
  if (sort === "price_asc") list.sort((a, b) => a.price - b.price);
  if (sort === "price_desc") list.sort((a, b) => b.price - a.price);
  const start = (page - 1) * PAGE_SIZE;
  return {
    products: list.slice(start, start + PAGE_SIZE),
    page,
    totalPages: Math.max(1, Math.ceil(list.length / PAGE_SIZE)),
    totalProducts: list.length,
  };
}

export function mockProductDetails(id: string): ProductDetailsData {
  const product = mockCatalog.find((p) => p.id === id) ?? mockCatalog[0];
  return { ...product, id, images: [] };
}

// Same rules as the backend's calculateCart: delivery 20, tax 14% rounded down.
export function mockCalculate(cart: { productId: string; quantity: number }[]): CartTotals {
  const subTotal = cart.reduce((sum, line) => sum + line.quantity * (mockCatalog.find((p) => p.id === line.productId)?.price ?? 0), 0);
  const tax = Math.floor(subTotal * 0.14);
  const delivery = 20;
  return { subTotal, delivery, taxPercent: "14%", tax, total: subTotal + delivery + tax };
}
