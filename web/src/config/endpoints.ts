// TODO: match these to your real backend routes.
export const endpoints = {
  me: "/users/me",
  updateProfile: "/users/edit-user-profile",
  pets: "/pets/get-my-pets",
  createPet: "/pets/add-pet",
  pet: (id: string) => `/pets/${id}`,
  deletePet: (id: string) => `/pets/${id}`,
  updatePet: (id: string) => `/pets/${id}`,
  doctors: "/doctors/get-available-doctors",
  unreadNotificationsCount: "/users/get-unread-notifications-count",
  notifications: "/users/get-notifications",
  markNotificationsRead: `/users/mark-all-notifications-as-read`,
  products: "/products",
  // TODO: match these to your real store routes
  product: (id: string) => `/products/${id}`, // GET  -> product
  calculateCart: "/products/calculate-cart", // POST { cart: [{ productId, quantity }] } -> invoice
  orders: "/orders",
  order: (id: string) => `/orders/${id}`,
  myOrders: "/orders/my-previous-orders", // GET  -> { orders: Order[] }
  // TODO: match these to your real chat routes
  chats: "/chats", // GET  -> chat list
  chatMessages: (id: string) => `/chats/${id}/messages`, // GET  -> { chatId, person, messages }
  chatUpload: "/chats/chatbot/image", // POST multipart (field "image") -> { image: url }
  unreadMessagesCount: "/chats/unread-messages-count", // GET  -> { count }
  availableDoctors: "/doctors/get-available-doctors", // GET  -> { doctors: Doctor[] }
  upcomingAppointment: "/appointments/get-my-active-appointment", // GET  -> { appointment, doctor, chat }
  // TODO: match these to your real routes
  doctor: (id: string) => `/doctors/${id}`, // GET  -> { doctor, reviews }
  doctorSchedule: (id: string) => `/doctors/${id}/schedual`, // GET  -> { doctor, doctorDays, firstDaySlots }
  doctorSlots: (id: string) => `/doctors/${id}/slots`, // GET ?date=YYYY-MM-DD -> { date, slots }
  appointments: "/appointments", // POST -> book
  myAppointments: "/appointments/get-my-previous-appointments", // GET  -> { appointments: AppointmentListItem[] }
  appointment: (id: string) => `/appointments/${id}`, // GET  -> { appointment, chat }
  cancelAppointment: (id: string) => `/appointments/cancel-appointment-by-user/${id}`, // PATCH { reason }
} as const;
