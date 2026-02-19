export function DisclaimerBanner() {
  return (
    <div
      className="rounded-2xl px-6 py-5 text-sm space-y-2"
      style={{
        background: "var(--neutral-100)",
        border: "1px solid var(--neutral-200)",
        color: "var(--neutral-600)",
      }}
    >
      <p className="font-semibold" style={{ color: "var(--neutral-700)" }}>Important Disclaimers</p>
      <ul className="space-y-1.5 list-none">
        {[
          "For planning purposes only. Actual take-home pay depends on your personal tax code, student loan repayments, pension opt-out status, and other individual circumstances.",
          "Private sector salary figures are estimates. Actual earnings vary significantly by specialty, reputation, and patient volume.",
          "NHS pay is subject to ongoing negotiation. Verify current pay scales at nhsemployers.org before making decisions.",
          "Cost of living figures reflect city-wide averages. Actual costs vary by neighbourhood and personal choices.",
          "Edinburgh doctors pay Scottish Income Tax rates, which differ from the figures shown in this tool.",
          "Currency exchange rates change daily. All INR figures use the rate shown at the top of the page.",
          "Migration costs shown are estimates. Verify current GMC and UKVI fees directly at gmc-uk.org and gov.uk before applying.",
          "Data verified February 2026. Consult a qualified financial adviser before making life decisions.",
        ].map((text, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 shrink-0 w-1.5 h-1.5 rounded-full" style={{ background: "var(--neutral-400)" }} />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
