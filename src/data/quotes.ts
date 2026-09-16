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
