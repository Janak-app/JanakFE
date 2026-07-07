export type Quote = {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  submittedOn: string;
  status: "Pending" | "Quote Sent" | "Accepted" | "Declined";
  validUntil: string;
  adminResponse: string;
  quotedPrice: number;
  quotedPriceLabel: string;
  notes: string;
  quantity: number;
};

export const quotes: Quote[] = [
  {
    id: "Q-2026-00045",
    productId: "leica-ts16",
    productName: "Leica TS16 Robotic Total Station",
    productImage: "https://images.pexels.com/photos/13279686/pexels-photo-13279686.jpeg",
    submittedOn: "10 May 2026",
    status: "Quote Sent",
    validUntil: "25 May 2026",
    adminResponse:
      "Thank you for your interest. Unit Price: ₹11,20,000 + 18% GST. This price includes a 1-year warranty, free on-site calibration, and the Captivate field software license. Delivery within 3 weeks from PO date.",
    quotedPrice: 1120000,
    quotedPriceLabel: "₹11,20,000",
    notes: "Required for highway project in Pune. 1\" accuracy preferred.",
    quantity: 1,
  },
];

export type ServiceStatus = "Pending" | "Confirmed" | "In Service" | "Completed";

export type ServiceRequest = {
  id: string;
  equipment: string;
  serialNumber: string;
  serviceType: string;
  slotDate: string;
  slotTime: string;
  mode: "Bring to Centre" | "On-site Visit";
  status: ServiceStatus;
  description: string;
  timeline: { label: string; date: string; done: boolean }[];
};

export const serviceRequests: ServiceRequest[] = [
  {
    id: "SRV-2026-00018",
    equipment: "Leica GS18 I",
    serialNumber: "LG18-220451",
    serviceType: "Annual Calibration",
    slotDate: "22 May 2026",
    slotTime: "Morning (9AM–12PM)",
    mode: "Bring to Centre",
    status: "Confirmed",
    description: "Routine annual calibration before monsoon survey season.",
    timeline: [
      { label: "Request Received", date: "08 May 2026", done: true },
      { label: "Slot Confirmed", date: "09 May 2026", done: true },
      { label: "Equipment Received", date: "22 May 2026", done: false },
      { label: "Calibration in Progress", date: "—", done: false },
      { label: "Ready for Pickup", date: "—", done: false },
    ],
  },
];
