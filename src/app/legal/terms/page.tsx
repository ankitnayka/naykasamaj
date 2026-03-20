export default function Terms() {
  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "30px", textAlign: "center" }}>
          Terms & Conditions
        </h1>
        <div style={{ background: "var(--surface)", padding: "40px", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", lineHeight: "1.8", color: "var(--text-muted)" }}>
          <p style={{ marginBottom: "20px" }}>Last updated: March 2026</p>
          <h2 style={{ color: "var(--secondary)", marginBottom: "15px", fontSize: "1.5rem" }}>1. Acceptance of Terms</h2>
          <p style={{ marginBottom: "20px" }}>
            By registering as a member or using our website, you agree to be bound by these functional rules and terms. The Nayka Samaj reserves the right to update these conditions at any time.
          </p>
          <h2 style={{ color: "var(--secondary)", marginBottom: "15px", fontSize: "1.5rem" }}>2. Community Conduct</h2>
          <p style={{ marginBottom: "20px" }}>
            All members are expected to interact respectfully during events, meetings, and within all community forums. Any hateful conduct or spam will result in a suspension of account and membership privileges.
          </p>
        </div>
      </div>
    </div>
  );
}
