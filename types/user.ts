export interface User {
  id: string
  name: string
  email: string
  provider: "email" | "google" | "apple" | "facebook"
}
