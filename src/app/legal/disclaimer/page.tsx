export default function Disclaimer() {
  return (
    <div className="animate-fade-in" style={{ padding: "60px 0" }}>
      <div className="container" style={{ maxWidth: "800px" }}>
        <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "30px", textAlign: "center" }}>
          Disclaimer
        </h1>
        <div style={{ background: "var(--surface)", padding: "40px", borderRadius: "var(--radius)", boxShadow: "var(--shadow-sm)", lineHeight: "1.8", color: "var(--text-muted)" }}>
          <p style={{ marginBottom: "20px" }}>Last updated: March 2026</p>
          <h2 style={{ color: "var(--secondary)", marginBottom: "15px", fontSize: "1.5rem" }}>General Information</h2>
          <p style={{ marginBottom: "20px" }}>
            The information provided on the Nayka Samaj website is for general informational and educational purposes only. We make every effort to ensure the accuracy and reliability of the internal directory and resources, but we make no representations or warranties of any kind regarding their completeness.
          </p>
          <h2 style={{ color: "var(--secondary)", marginBottom: "15px", fontSize: "1.5rem" }}>External Links</h2>
          <p style={{ marginBottom: "20px" }}>
            Our website may contain links to third-party websites for educational or welfare purposes. The Nayka Samaj has no control over the content and nature of these external sites and accepts no responsibility for them.
          </p>
        </div>
      </div>
    </div>
  );
}
