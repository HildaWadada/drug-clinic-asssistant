/**
 * page.tsx — About & Disclaimer (/about)
 */

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">About HealthAssist UG</h1>
      <p className="mb-8 text-sm text-gray-500">
        A free AI-powered health information assistant for people in Uganda.
      </p>

      <div className="space-y-6 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="mb-1 font-semibold text-gray-900">⚕ Important Disclaimer</h2>
          <p>
            HealthAssist UG is an <strong>information tool only</strong>. It does not
            diagnose diseases, prescribe medication, or replace the advice of a qualified
            health professional. Always visit a clinic, health centre, or hospital for
            personal medical concerns.
          </p>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-gray-900">What this tool can help with</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>Explaining what medicines are used for in plain language</li>
            <li>Describing common side effects and dosage information</li>
            <li>Simplifying prescription instructions (e.g. what "BD" means)</li>
            <li>Finding nearby clinics, hospitals, and pharmacies</li>
            <li>Answering general health FAQs based on Uganda MoH guidelines</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-gray-900">Data sources</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>Uganda Ministry of Health Essential Medicines List (2023)</li>
            <li>Uganda Standard Treatment Guidelines</li>
            <li>WHO Essential Medicines List (23rd edition)</li>
            <li>Uganda MoH Malaria Treatment Protocol</li>
            <li>Uganda MoH HIV/ART Guidelines</li>
            <li>Uganda MoH Maternal Health Guidelines</li>
          </ul>
        </section>

        <section>
          <h2 className="mb-1 font-semibold text-gray-900">Emergency contacts</h2>
          <ul className="ml-4 list-disc space-y-1">
            <li>Mulago National Referral Hospital: +256 414 530 000</li>
            <li>Uganda Red Cross Emergency: 0800 199 150 (toll-free)</li>
            <li>Police / Ambulance: 999 or 112</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
