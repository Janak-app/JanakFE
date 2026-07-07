export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  categoryKey: string;
  model: string;
  price: number | null;
  priceLabel: string;
  stock: "In Stock" | "Limited Stock" | "On Order";
  images: string[];
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  reviews: { name: string; rating: number; date: string; text: string }[];
};

const LEICA_IMGS = [
  "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200",
  "https://images.pexels.com/photos/36930873/pexels-photo-36930873.jpeg",
  "https://images.unsplash.com/photo-1581094288338-2314dddb7ece?w=1200",
];
const TRIMBLE_IMGS = [
  "https://images.unsplash.com/photo-1628158088791-89567a8e84ec?w=1200",
  "https://images.pexels.com/photos/36930873/pexels-photo-36930873.jpeg",
  "https://images.unsplash.com/photo-1659353586512-bcc4c7182d01?w=1200",
];
const TOTAL_STATION_IMGS = [
  "https://images.pexels.com/photos/13279686/pexels-photo-13279686.jpeg",
  "https://images.pexels.com/photos/8961008/pexels-photo-8961008.jpeg",
  "https://images.pexels.com/photos/8961001/pexels-photo-8961001.jpeg",
];
const DRONE_IMGS = [
  "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=1200",
  "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=1200",
  "https://images.pexels.com/photos/34709170/pexels-photo-34709170.jpeg",
];
const CONTROLLER_IMGS = [
  "https://images.unsplash.com/photo-1580910051070-7d3e6f0ed1f5?w=1200",
  "https://images.pexels.com/photos/8961001/pexels-photo-8961001.jpeg",
  "https://images.unsplash.com/photo-1659353586512-bcc4c7182d01?w=1200",
];

export const products: Product[] = [
  {
    id: "leica-gs18",
    name: "Leica GS18 I GNSS RTK Rover",
    brand: "Leica",
    category: "GNSS / GPS",
    categoryKey: "gnss",
    model: "GS18-I",
    price: 1450000,
    priceLabel: "₹14,50,000",
    stock: "In Stock",
    images: LEICA_IMGS,
    description:
      "The Leica GS18 I is the world's first true tilt-compensated GNSS RTK rover with visual positioning. Capture points that were previously inaccessible — fast, accurate, and without calibration.",
    highlights: [
      "True tilt compensation — no calibration required",
      "Visual positioning with integrated camera",
      "6mm + 0.5ppm horizontal RTK accuracy",
      "IP68 rated for harsh field conditions",
    ],
    specs: [
      { label: "Horizontal Accuracy (RTK)", value: "6 mm + 0.5 ppm" },
      { label: "Vertical Accuracy (RTK)", value: "10 mm + 0.5 ppm" },
      { label: "Channels", value: "555 (all constellations)" },
      { label: "Weight", value: "1.18 kg (incl. battery)" },
      { label: "IP Rating", value: "IP68" },
      { label: "Battery Life", value: "Up to 8 hours" },
      { label: "Connectivity", value: "4G LTE, Wi-Fi, Bluetooth, UHF" },
      { label: "Warranty", value: "2 years" },
    ],
    reviews: [
      { name: "Vikram Singh", rating: 5, date: "12 Mar 2026", text: "Phenomenal accuracy. The tilt compensation is a game-changer for our infrastructure surveys." },
      { name: "Priya Nair", rating: 5, date: "02 Feb 2026", text: "Worth every rupee. Battery lasts a full day in the field. Highly recommended." },
      { name: "Sunil Patel", rating: 4, date: "18 Jan 2026", text: "Excellent receiver. Setup was quick and support from Janak team was outstanding." },
    ],
  },
  {
    id: "trimble-r12i",
    name: "Trimble R12i GNSS Receiver",
    brand: "Trimble",
    category: "GNSS / GPS",
    categoryKey: "gnss",
    model: "R12i",
    price: 1280000,
    priceLabel: "₹12,80,000",
    stock: "Limited Stock",
    images: TRIMBLE_IMGS,
    description:
      "Trimble R12i delivers superior RTK performance with TIP™ (Trimble Inertial Platform) tilt compensation. Faster initialisations and unmatched signal tracking.",
    highlights: [
      "TIP™ inertial tilt compensation",
      "ProPoint™ GNSS engine for difficult environments",
      "8 mm + 1 ppm horizontal RTK",
      "Magnetic immunity — works near rebar & power lines",
    ],
    specs: [
      { label: "Horizontal Accuracy (RTK)", value: "8 mm + 1 ppm" },
      { label: "Vertical Accuracy (RTK)", value: "15 mm + 1 ppm" },
      { label: "Channels", value: "672" },
      { label: "Weight", value: "1.12 kg" },
      { label: "IP Rating", value: "IP67" },
      { label: "Battery Life", value: "7 hours (RTK rover)" },
      { label: "Connectivity", value: "Wi-Fi, Bluetooth, 4G, UHF" },
      { label: "Warranty", value: "2 years" },
    ],
    reviews: [
      { name: "Anand Krishnan", rating: 5, date: "28 Feb 2026", text: "Best-in-class signal tracking in dense urban canopy. ProPoint is real." },
      { name: "Meera Iyer", rating: 4, date: "15 Jan 2026", text: "Great unit. Slightly heavier than the GS18 but the magnetic immunity is brilliant." },
    ],
  },
  {
    id: "topcon-gt-1003",
    name: "Topcon GT-1003 Robotic Total Station",
    brand: "Topcon",
    category: "Total Stations",
    categoryKey: "total_stations",
    model: "GT-1003",
    price: 820000,
    priceLabel: "₹8,20,000",
    stock: "In Stock",
    images: TOTAL_STATION_IMGS,
    description:
      "Compact, ultra-fast robotic total station with UltraSonic direct-drive motors. Ideal for one-man crews and demanding construction layout.",
    highlights: [
      '1" angular accuracy',
      "UltraSonic direct-drive motors — silent & fast",
      "Long-range reflectorless EDM (1,000 m)",
      "LongLink™ wireless communication",
    ],
    specs: [
      { label: "Angle Accuracy", value: '1" (0.3 mgon)' },
      { label: "Distance Accuracy (Prism)", value: "1 mm + 1 ppm" },
      { label: "Reflectorless Range", value: "1,000 m" },
      { label: "Weight", value: "5.6 kg" },
      { label: "IP Rating", value: "IP65" },
      { label: "Battery Life", value: "11 hours" },
      { label: "Connectivity", value: "LongLink, Bluetooth, USB" },
      { label: "Warranty", value: "1 year" },
    ],
    reviews: [
      { name: "Rohit Sharma", rating: 5, date: "08 Mar 2026", text: "Lightning fast turn speed. Our crew productivity doubled." },
      { name: "Kavita Joshi", rating: 4, date: "20 Feb 2026", text: "Solid performer. Slightly tricky to set up the LongLink initially." },
    ],
  },
  {
    id: "leica-ts16",
    name: "Leica TS16 Robotic Total Station",
    brand: "Leica",
    category: "Total Stations",
    categoryKey: "total_stations",
    model: "TS16",
    price: null,
    priceLabel: "Price on Request",
    stock: "On Order",
    images: TOTAL_STATION_IMGS,
    description:
      "The world's first self-learning total station. PowerSearch finds the prism in seconds. ATRplus tracking adapts to environmental conditions.",
    highlights: [
      "Self-learning ATRplus prism tracking",
      "Captivate field software with 3D visualisation",
      '1" angular accuracy options',
      "Imaging variant available for documentation",
    ],
    specs: [
      { label: "Angle Accuracy", value: '1" / 2" / 3" / 5" options' },
      { label: "Distance Accuracy", value: "1 mm + 1.5 ppm" },
      { label: "Reflectorless Range", value: "1,000 m" },
      { label: "Weight", value: "7.7 kg" },
      { label: "IP Rating", value: "IP65" },
      { label: "Battery Life", value: "9 hours" },
      { label: "Connectivity", value: "Wi-Fi, Bluetooth, USB, Radio" },
      { label: "Warranty", value: "1 year" },
    ],
    reviews: [
      { name: "Deepak Rao", rating: 5, date: "11 Feb 2026", text: "ATRplus is uncanny. The instrument truly learns your environment." },
      { name: "Anjali Verma", rating: 5, date: "01 Feb 2026", text: "Premium-grade total station. Captivate software is the best in the industry." },
    ],
  },
  {
    id: "dji-zenmuse-l2",
    name: "DJI Zenmuse L2 LiDAR Survey Drone",
    brand: "DJI",
    category: "UAV / Drones",
    categoryKey: "uav",
    model: "Zenmuse L2",
    price: 975000,
    priceLabel: "₹9,75,000",
    stock: "In Stock",
    images: DRONE_IMGS,
    description:
      "Integrated LiDAR + RGB payload for Matrice 350 RTK. Delivers centimetre-level accuracy for topographic mapping, corridor surveys, and powerline inspection.",
    highlights: [
      "240,000 pts/s LiDAR point cloud",
      "5 returns per pulse",
      "20 MP RGB camera with mechanical shutter",
      "4 cm vertical / 5 cm horizontal accuracy",
    ],
    specs: [
      { label: "Detection Range", value: "250 m @ 50% reflectivity" },
      { label: "Point Rate", value: "240,000 pts/s (single return)" },
      { label: "Returns Supported", value: "5" },
      { label: "RGB Camera", value: "20 MP, 4/3 CMOS" },
      { label: "Weight", value: "905 g" },
      { label: "IP Rating", value: "IP54" },
      { label: "Compatible Aircraft", value: "Matrice 350 RTK / 300 RTK" },
      { label: "Warranty", value: "1 year" },
    ],
    reviews: [
      { name: "Harish Menon", rating: 5, date: "22 Mar 2026", text: "Replaced our terrestrial scanning for corridor work. ROI in 3 projects." },
      { name: "Sanjay Gupta", rating: 4, date: "05 Mar 2026", text: "Excellent payload. Post-processing in DJI Terra is straightforward." },
    ],
  },
  {
    id: "hi-target-irtk5",
    name: "Hi-Target iRTK5 GNSS RTK System",
    brand: "Hi-Target",
    category: "GNSS / GPS",
    categoryKey: "gnss",
    model: "iRTK5",
    price: 340000,
    priceLabel: "₹3,40,000",
    stock: "In Stock",
    images: LEICA_IMGS,
    description:
      "Cost-effective full-constellation GNSS RTK rover with tilt survey capability. Perfect for cadastral, construction, and contractor work.",
    highlights: [
      "Full-constellation 800-channel board",
      "IMU tilt compensation up to 60°",
      "Built-in 4G modem and UHF radio",
      "IP67 rated",
    ],
    specs: [
      { label: "Horizontal Accuracy (RTK)", value: "8 mm + 1 ppm" },
      { label: "Vertical Accuracy (RTK)", value: "15 mm + 1 ppm" },
      { label: "Channels", value: "800" },
      { label: "Weight", value: "950 g" },
      { label: "IP Rating", value: "IP67" },
      { label: "Battery Life", value: "10 hours" },
      { label: "Connectivity", value: "4G, Wi-Fi, Bluetooth, UHF" },
      { label: "Warranty", value: "2 years" },
    ],
    reviews: [
      { name: "Pradeep Yadav", rating: 4, date: "14 Mar 2026", text: "Great value for money. Tilt works well within 30°." },
      { name: "Neha Reddy", rating: 5, date: "28 Feb 2026", text: "Affordable RTK that just works. Battery life is excellent." },
    ],
  },
  {
    id: "trimble-tsc7",
    name: "Trimble TSC7 Data Controller",
    brand: "Trimble",
    category: "Data Controllers",
    categoryKey: "controllers",
    model: "TSC7",
    price: 285000,
    priceLabel: "₹2,85,000",
    stock: "In Stock",
    images: CONTROLLER_IMGS,
    description:
      'Rugged 7" sunlight-readable data controller with full Windows 10. Runs Trimble Access, AutoCAD, and your favourite GIS software in the field.',
    highlights: [
      '7" sunlight-readable touchscreen',
      "Full QWERTY keyboard",
      "Windows 10 Pro / Android dual-boot options",
      "Drop-tested to MIL-STD-810G",
    ],
    specs: [
      { label: "Display", value: '7" 1280×800 sunlight-readable' },
      { label: "Processor", value: "Intel Pentium quad-core" },
      { label: "RAM", value: "8 GB" },
      { label: "Storage", value: "128 GB SSD" },
      { label: "Weight", value: "1.3 kg" },
      { label: "IP Rating", value: "IP68" },
      { label: "Battery Life", value: "13 hours (dual hot-swap)" },
      { label: "Warranty", value: "2 years" },
    ],
    reviews: [
      { name: "Manish Kapoor", rating: 5, date: "10 Mar 2026", text: "Best field controller I've ever used. The screen is fantastic outdoors." },
      { name: "Ritu Bansal", rating: 4, date: "01 Mar 2026", text: "Heavy but built like a tank. Hot-swap batteries save the day." },
    ],
  },
  {
    id: "south-galaxy-g7",
    name: "South Galaxy G7 GNSS Receiver",
    brand: "South",
    category: "GNSS / GPS",
    categoryKey: "gnss",
    model: "Galaxy G7",
    price: null,
    priceLabel: "Price on Request",
    stock: "On Order",
    images: LEICA_IMGS,
    description:
      "Flagship GNSS receiver from South with IMU tilt and visual stakeout. 1408-channel board for unmatched signal availability.",
    highlights: [
      "1408 channels — all GNSS constellations",
      "IMU tilt survey up to 60°",
      "Visual stakeout with AR overlay",
      "5G connectivity",
    ],
    specs: [
      { label: "Horizontal Accuracy (RTK)", value: "8 mm + 1 ppm" },
      { label: "Vertical Accuracy (RTK)", value: "15 mm + 1 ppm" },
      { label: "Channels", value: "1408" },
      { label: "Weight", value: "920 g" },
      { label: "IP Rating", value: "IP68" },
      { label: "Battery Life", value: "12 hours" },
      { label: "Connectivity", value: "5G, Wi-Fi 6, Bluetooth 5.0, UHF" },
      { label: "Warranty", value: "2 years" },
    ],
    reviews: [
      { name: "Karan Malhotra", rating: 4, date: "18 Feb 2026", text: "Visual stakeout is a fun feature. Channel count is wild." },
      { name: "Asha Pillai", rating: 5, date: "09 Feb 2026", text: "Excellent receiver at this price point. Field-ready out of the box." },
    ],
  },
];

export const categories = [
  { key: "gnss", label: "GNSS / GPS", icon: "navigation" },
  { key: "total_stations", label: "Total Stations", icon: "scan-line" },
  { key: "uav", label: "UAV / Drones", icon: "plane" },
  { key: "controllers", label: "Data Controllers", icon: "tablet" },
  { key: "software", label: "Software", icon: "code-2" },
  { key: "accessories", label: "Accessories", icon: "wrench" },
];

export const brands = [
  { name: "Leica" },
  { name: "Trimble" },
  { name: "Topcon" },
  { name: "DJI" },
  { name: "Hi-Target" },
  { name: "South" },
];

export const heroBanners = [
  {
    id: "b1",
    title: "Leica GS18 I",
    subtitle: "NOW AVAILABLE",
    description: "India's most accurate RTK rover with true tilt compensation.",
    productId: "leica-gs18",
    from: "#1A4F9C",
    to: "#0EA5E9",
  },
  {
    id: "b2",
    title: "DJI Zenmuse L2",
    subtitle: "LIDAR SURVEY",
    description: "Centimetre-level accuracy for corridor & topographic mapping.",
    productId: "dji-zenmuse-l2",
    from: "#0F172A",
    to: "#1A4F9C",
  },
  {
    id: "b3",
    title: "Annual Calibration",
    subtitle: "LIMITED OFFER",
    description: "Book before 31 May 2026 — 20% off calibration & service.",
    productId: null,
    from: "#16A34A",
    to: "#0EA5E9",
  },
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id);
}

export function formatINR(amount: number) {
  return "₹" + amount.toLocaleString("en-IN");
}
