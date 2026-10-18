// Strips spaces/dashes and a leading +91 / 0 so the API receives a bare 10-digit number.
export function normalizePhone(input: string): string {
  return input.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
}

export function isValidIndianMobile(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}
