export default function PrivacyPolicy() {
  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "30px", textAlign: "center" }}>
          Privacy Policy
        </h1>
        <div style={{ background: "var(--surface)", padding: "40px", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", lineHeight: "1.8", color: "var(--text-muted)" }}>
          <p style={{ marginBottom: "20px" }}>Last updated: March 2026</p>
          <h2 style={{ color: "var(--secondary)", marginBottom: "15px", fontSize: "1.5rem" }}>1. Information We Collect</h2>
          <p style={{ marginBottom: "20px" }}>
            We only collect information necessary to provide you with membership services, process donations, and keep you informed about community events. This may include your name, address, email, and phone number.
          </p>
          <h2 style={{ color: "var(--secondary)", marginBottom: "15px", fontSize: "1.5rem" }}>2. How We Use Your Information</h2>
          <p style={{ marginBottom: "20px" }}>
            The information collected is strictly used for internal Nayka Samaj purposes, such as maintaining the member directory, sending newsletters, and organizing community welfare programs.
          </p>
          <h2 style={{ color: "var(--secondary)", marginBottom: "15px", fontSize: "1.5rem" }}>3. Data Security</h2>
          <p style={{ marginBottom: "20px" }}>
            We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or disclosure. We do not share your data with third parties without your explicit consent.
          </p>
        </div>
      </div>
    </div>
  );
}
