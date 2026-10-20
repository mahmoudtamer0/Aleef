export type User = {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
  phone?: string;
};

export type PetStatus = "ok" | "upcoming" | "needs_care";

export type Pet = {
  id: string;
  name: string;
  species: string;
  ageLabel: string;
  photo?: string | null;
  status: PetStatus;
  vaccines: { upcoming: number; overdue: number };
  recordsCount: number;
  gender?: string;
  /** "YYYY-MM-DD" */
  birthDate?: string;
  breed?: string;
  weight?: number;
};

export type Doctor = {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  ratingsCount?: number;
  city?: string;
  about?: string;
  address?: string;
  phone?: string;
  /** only when the user shared their location */
  distanceKm?: number | null;
  minutes?: number | null;
  /** price after the user's discount, and the price before it */
  fee?: number;
  originalFee?: number;
  photo?: string | null;
};

export type Appointment = {
  id: string;
  doctorName: string;
  doctorRole: string;
  doctorPhoto?: string | null;
  status: string;
  date: string;
  time: string;
  petName: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  image?: string | null;
  /** only when it is on sale (higher than `price`) */
  originalPrice?: number;
  description?: string;
  stock?: number;
  sold?: number;
  rating?: number;
  ratingsCount?: number;
  categories?: string[];
};

/** one product page: the product + all its photos (thumbnail first) */
export type ProductDetailsData = Product & { images: string[] };

/** what we keep in localStorage for each cart line */
export type CartItem = { productId: string; title: string; price: number; image?: string | null; quantity: number; stock: number };

/** the invoice the backend calculates for a cart */
export type CartTotals = { subTotal: number; delivery: number; taxPercent: string; tax: number; total: number };

export type ShippingAddress = { address: string; city: string; phone: string };

export type OrderInput = {
  cart: { productId: string; quantity: number }[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
};

export type Review = {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
  userPhoto?: string | null;
};

/** GET /doctors/:id */
export type DoctorProfileData = { doctor: Doctor; reviews: Review[] };

/** days = "YYYY-MM-DD" strings; firstDaySlots = free times of days[0] */
export type DoctorSchedule = { doctor: Doctor; days: string[]; firstDaySlots: string[] };

export type NewAppointment = {
  doctor: string;
  pet: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
};

export type AppointmentPet = { id: string; name: string; species: string; gender?: string; photo?: string | null };

/** GET /appointments/:id  (date = "YYYY-MM-DD", chatId only when the doctor accepted) */
export type AppointmentDetailsData = {
  id: string;
  status: string;
  date: string;
  time: string;
  reason: string;
  notes?: string;
  rejectionReason?: string;
  cancelledReason?: string;
  fee?: number;
  createdAt: string;
  doctor: Doctor;
  pet: AppointmentPet;
  chatId: string | null;
};

export type ChatPerson = { id: string; name: string; photo?: string | null; role?: string };

export type ChatMessage = {
  id: string;
  chatId: string;
  text: string;
  image?: string | null;
  senderId: string;
  createdAt: string;
  deleted?: boolean;
  /** the "This chat has expired" message the backend sends on behalf of the system */
  system?: boolean;
};

/** one row of the chat list */
export type ChatSummary = { id: string; person: ChatPerson; lastMessage: ChatMessage | null; unreadCount: number; updatedAt: string };

/** one open chat: the other person + all messages */
export type ChatConversation = { chatId: string; person: ChatPerson; messages: ChatMessage[] };

/** where a notification should take the user (the backend's `data` object) */
export type NotificationData = { type?: string; appointmentId?: string; chatId?: string; productId?: string; orderId?: string };

export type AppNotification = { id: string; title: string; body: string; createdAt: string; read: boolean; data: NotificationData };

/** what the add / edit pet form sends */
export type PetInput = { name: string; type: string; gender: string; birthDate: string; breed?: string; weight?: string; photo?: File | null };

export type ProfileInput = { name: string; phone: string; photo?: File | null };

/** one row of "My appointments" */
export type AppointmentListItem = {
  id: string;
  doctorName: string;
  doctorRole: string;
  doctorPhoto?: string | null;
  petName: string;
  /** "YYYY-MM-DD" */
  date: string;
  time: string;
  status: string;
  fee?: number;
};

export type OrderItem = { id: string; productId?: string; title: string; price: number; image?: string | null; quantity: number; total: number };

export type Order = {
  id: string;
  status: string;
  createdAt: string;
  subTotal: number;
  delivery: number;
  tax: number;
  total: number;
  paymentMethod: string;
  shipping: ShippingAddress;
  items: OrderItem[];
  itemsCount: number;
};
