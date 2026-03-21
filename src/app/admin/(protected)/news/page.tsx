import connectDB from "@/lib/db";
import Article from "@/models/Article";
import CategoryManager from "./CategoryManager";
import ArticleManagerList from "./ArticleManagerList";

export default async function ManageNews() {
  await connectDB();
  // Fetch recent 20 articles
  const articles = await Article.find().sort({ createdAt: -1 }).limit(20).lean();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Content Desk: News & Announcements</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)" }}>
        Draft official announcements, alert the community to fast-breaking news, or debunk myths using the Gemini AI Fact-Checker.
      </p>

      <CategoryManager />

      <ArticleManagerList initialArticles={JSON.parse(JSON.stringify(articles))} />
    </div>
  );
}
