export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const validatePassword = (password: string): string | null => {
  if (password.length < 6) return "Password must be at least 6 characters"
  if (!/(?=.*[a-z])/.test(password)) return "Password must contain lowercase letter"
  if (!/(?=.*[A-Z])/.test(password)) return "Password must contain uppercase letter"
  return null
}

export const validateSKU = (sku: string): boolean => {
  return /^[A-Z0-9-_]{3,20}$/.test(sku)
}

export const validateQuantity = (qty: number): boolean => {
  return qty >= 0 && Number.isInteger(qty)
}

export const validateRequired = (value: string): boolean => {
  return value.trim().length > 0
}