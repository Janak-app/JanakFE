import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    body: "We collect information you provide directly to us when you create an account, request a quote, or contact us. This includes your name, email address, phone number, company name, and shipping address. When you use our app as a guest, we do not require you to create an account and we do not collect personally identifiable information beyond what is necessary for the session. We also automatically collect certain device and usage information, including your device type, operating system, IP address, pages viewed, and the time and date of your visit. This information helps us understand how our platform is used and improve your experience.",
  },
  {
    title: "2. How We Use Your Information",
    body: "We use the information we collect to operate and improve the Janak platform; to process and fulfil your quote requests and orders; to send you transactional communications such as order confirmations and updates; to respond to your enquiries and provide customer support; to personalise your browsing experience by showing relevant products and categories; to monitor and analyse usage trends to improve our app's functionality; and to comply with applicable legal and regulatory obligations. We do not use your information for automated profiling or decision-making that produces legal or similarly significant effects.",
  },
  {
    title: "3. Sharing of Information",
    body: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform, such as our hosting provider (Vercel) and payment processors, solely to the extent necessary to provide those services and under confidentiality obligations. We may disclose your information if required to do so by law, court order, or government authority, or if we believe disclosure is necessary to protect our rights or the safety of any person. In the event of a merger, acquisition, or sale of all or substantially all of our assets, your information may be transferred as part of that transaction.",
  },
  {
    title: "4. Cookies & Tracking Technologies",
    body: "Our platform uses cookies and similar tracking technologies to maintain your session, remember your preferences, and analyse usage patterns. Essential cookies are required for the platform to function and cannot be disabled. Analytics cookies help us understand how visitors interact with the platform; these can be disabled without affecting core functionality. We do not use advertising or cross-site tracking cookies. By continuing to use our platform, you consent to the use of essential cookies. You can manage cookie preferences through your browser settings, though disabling certain cookies may affect your experience.",
  },
  {
    title: "5. Data Retention",
    body: "We retain your personal information for as long as your account is active or as needed to provide services to you. If you request deletion of your account, we will delete or anonymise your personal data within 30 days, except where we are required to retain it for legal, regulatory, or accounting purposes. Usage and analytics data may be retained in an aggregated, anonymised form for longer periods. Guest session data that is not linked to an account is not retained beyond the session.",
  },
  {
    title: "6. Your Rights",
    body: "You have the right to access the personal information we hold about you, request correction of inaccurate data, and request deletion of your data subject to our legal obligations. You may also object to or restrict certain processing of your data, and request a portable copy of your data in a commonly used format. To exercise any of these rights, please contact us at hello@janakpositioning.com. We will respond to your request within a reasonable timeframe and in accordance with applicable law. We do not charge a fee for legitimate requests.",
  },
  {
    title: "7. Security",
    body: "We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, disclosure, alteration, or destruction. All data transmitted between the app and our servers is encrypted using industry-standard TLS. Access to personal data within our organisation is restricted to employees and contractors who need it to perform their functions. However, no method of electronic transmission or storage is 100% secure, and we cannot guarantee absolute security. If you believe your account has been compromised, please contact us immediately.",
  },
  {
    title: "8. Changes to This Policy",
    body: "We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will update the \"Last updated\" date at the top of this page and, where appropriate, notify you through the app or by email. We encourage you to review this policy periodically. Your continued use of the platform after changes are posted constitutes your acceptance of the updated policy.",
  },
  {
    title: "9. Contact Us",
    body: "If you have questions about this Privacy Policy, please contact us at hello@janakpositioning.com or write to us at 304 Survey House, Andheri East, Mumbai 400069.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-14">
        <p className="text-sm text-gray-400 mb-2">Last updated: January 1, 2026</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <p className="text-gray-500 text-sm leading-7 mb-10">
          Janak Positioning Pvt. Ltd. (&quot;Janak&quot;, &quot;we&quot;, &quot;us&quot;, or
          &quot;our&quot;) is committed to protecting your personal information. This Privacy Policy
          explains how we collect, use, disclose, and safeguard your information when you use our
          platform.
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
