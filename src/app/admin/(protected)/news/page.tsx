import connectDB from "@/lib/db";
import Article from "@/models/Article";
import NewsEditor from "./NewsEditor";

export default async function ManageNews() {
  await connectDB();
  // Fetch recent 10 articles
  const articles = await Article.find().sort({ createdAt: -1 }).limit(10);

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Content Desk: News & Announcements</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)" }}>
        Draft official announcements, alert the community to fast-breaking news, or debunk myths using the Gemini AI Fact-Checker.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "30px" }}>
        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Create New Article</h2>
          <NewsEditor />
        </div>

        <div>
           <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Recent Articles</h2>
           <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
             {articles.length === 0 ? (
               <p style={{ color: "var(--text-muted)" }}>No articles published yet.</p>
             ) : (
               articles.map((article: any) => (
                 <div key={article._id.toString()} style={{ background: "var(--surface)", padding: "15px", borderRadius: "8px", borderLeft: `4px solid ${article.isPublished ? "var(--primary)" : "var(--text-muted)"}`, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                   <div style={{ fontSize: "0.75rem", fontWeight: "bold", color: "var(--accent)", marginBottom: "5px" }}>{article.category}</div>
                   <h4 style={{ margin: "0 0 5px 0", fontSize: "1rem" }}>{article.title}</h4>
                   <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
                     <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                     <span style={{ fontWeight: "bold", color: article.isPublished ? "var(--primary)" : "var(--text-muted)" }}>{article.isPublished ? "Published" : "Draft"}</span>
                   </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>
    </div>
  );
}
