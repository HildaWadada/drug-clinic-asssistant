/**
 * Footer.tsx
 * Page footer with links to data sources and the about page.
 */

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-6 text-center text-xs text-gray-400">
      <p>
        Data sourced from{" "}
        <a
          href="https://www.health.go.ug"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          Uganda Ministry of Health
        </a>{" "}
        and{" "}
        <a
          href="https://www.who.int"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-600"
        >
          WHO
        </a>
        . &nbsp;|&nbsp;{" "}
        <a href="/about" className="underline hover:text-gray-600">
          About &amp; Disclaimer
        </a>
      </p>
      <p className="mt-1">
        ⚕ Not a diagnostic tool — always consult a qualified health professional.
      </p>
    </footer>
  );
}
