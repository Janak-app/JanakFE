import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: "By downloading, installing, or using the Janak app or website (the \"Platform\") operated by Janak Positioning Pvt. Ltd. (\"Janak\", \"we\", \"us\", or \"our\"), you agree to be bound by these Terms and Conditions. If you do not agree to these Terms, please do not use the Platform. We reserve the right to modify these Terms at any time; continued use of the Platform after changes are posted constitutes your acceptance of the revised Terms.",
  },
  {
    title: "2. Use of the Platform",
    body: "The Platform is intended for business-to-business (B2B) use by professionals seeking positioning, surveying, and related equipment and services. You may browse products and categories as a guest without creating an account. Certain features, such as requesting a quote or placing an order, require registration. You agree to use the Platform only for lawful purposes and in a manner consistent with all applicable local, state, national, and international laws and regulations. You must not misuse the Platform, attempt to gain unauthorised access, or disrupt its normal operation.",
  },
  {
    title: "3. Account Registration",
    body: "To access features beyond guest browsing, you must create an account by providing accurate and complete information. You are solely responsible for maintaining the confidentiality of your login credentials and for all activities that occur under your account. You agree to notify us immediately at hello@janakpositioning.com if you suspect any unauthorised use of your account. We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.",
  },
  {
    title: "4. Orders & Payments",
    body: "Product listings on the Platform are for informational purposes. Prices shown are indicative and are confirmed at the time a quote is accepted. An order is confirmed only upon our written acceptance and receipt of agreed payment or credit terms. We reserve the right to cancel or decline any order due to product unavailability, pricing errors, or other circumstances, and will notify you promptly in such cases. Payment terms are as agreed at the time of order confirmation.",
  },
  {
    title: "5. Pricing & GST",
    body: "All prices displayed on the Platform are exclusive of Goods and Services Tax (GST) and other applicable taxes unless explicitly stated otherwise. The applicable GST will be added at the time of invoicing based on the nature of the product and delivery location. Prices are subject to change without prior notice. The price applicable to your order is the price confirmed in your accepted quotation.",
  },
  {
    title: "6. Shipping & Delivery",
    body: "Delivery timelines are estimates and may vary based on product availability, location, and logistics conditions. We will make reasonable efforts to dispatch orders within the timeframes communicated. Risk of loss or damage to products passes to you upon delivery. Janak is not liable for delays caused by events outside our reasonable control, including natural disasters, government actions, or logistics disruptions. Any specific delivery terms will be confirmed in your purchase order or quotation.",
  },
  {
    title: "7. Returns & Refunds",
    body: "All return requests must be submitted within 7 days of delivery by contacting hello@janakpositioning.com. Products must be returned in their original condition, unused, and in original packaging. Returns are subject to inspection and approval. We reserve the right to refuse returns for items that show signs of use, damage not caused by us, or missing components. Refunds, where applicable, will be processed within 14 business days of receiving and approving the returned item. Custom orders and specially sourced items are non-returnable.",
  },
  {
    title: "8. Intellectual Property",
    body: "All content on the Platform, including but not limited to text, images, logos, product descriptions, technical data, software, and the Janak brand identity, is the exclusive property of Janak Positioning Pvt. Ltd. or its licensors and is protected by applicable intellectual property laws. You may not copy, reproduce, distribute, modify, or create derivative works from any content on the Platform without our prior written consent. Nothing in these Terms grants you any licence to our intellectual property other than the limited right to use the Platform as described herein.",
  },
  {
    title: "9. Limitation of Liability",
    body: "To the maximum extent permitted by applicable law, Janak Positioning Pvt. Ltd. and its directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use of the Platform, including but not limited to loss of revenue, loss of data, or loss of business opportunity. Our total aggregate liability to you for any claim arising under these Terms shall not exceed the amount you paid to us in the three months preceding the claim. Some jurisdictions do not allow certain limitations of liability; in such cases, our liability is limited to the fullest extent permitted by law.",
  },
  {
    title: "10. Governing Law",
    body: "These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes, controversies, or claims arising out of or relating to these Terms, or the breach, termination, or validity thereof, shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra, India.",
  },
  {
    title: "11. Contact Us",
    body: "If you have any questions about these Terms and Conditions, please contact us at hello@janakpositioning.com or write to us at 304 Survey House, Andheri East, Mumbai 400069.",
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-14">
        <p className="text-sm text-gray-400 mb-2">Last updated: January 1, 2026</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Terms &amp; Conditions</h1>
        <p className="text-gray-500 text-sm leading-7 mb-10">
          Please read these Terms and Conditions carefully before using the Janak Positioning
          platform. These terms govern your access to and use of our website, mobile application,
          and related services offered by Janak Positioning Pvt. Ltd.
        </p>

        <div className="divide-y divide-gray-100">
          {SECTIONS.map((s) => (
            <section key={s.title} className="py-7">
              <h2 className="text-base font-semibold text-gray-900 mb-3">{s.title}</h2>
              <p className="text-sm text-gray-500 leading-7">{s.body}</p>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
