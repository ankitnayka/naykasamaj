"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface PostItem {
  _id: string;
  title: string;
  content: string;
  category: string;
  isAnonymous: boolean;
  author: { _id: string; name: string };
  createdAt: string;
}

export default function ForumPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [filter, setFilter] = useState("ALL");
  const [isPosting, setIsPosting] = useState(false);
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "GENERAL", isAnonymous: false });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/forum");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = filter !== "ALL" ? `?category=${filter}` : "";
        const res = await fetch(`/api/forum${query}`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (e) {
        console.error(e);
      }
    };
    if (session?.user?.isVerified || session?.user?.role === "ADMIN") {
      fetchPosts();
    }
  }, [filter, session]);

  if (status === "loading") return <div style={{ padding: "100px", textAlign: "center" }}>Loading...</div>;

  if (session && !session.user.isVerified && session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    return (
       <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh" }}>
        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🔒</div>
        <h1 style={{ color: "var(--primary)", marginBottom: "15px" }}>Verification Required</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto", fontSize: "1.1rem" }}>
          The Community Forum is a safe space exclusively for Verified Members of the Nayka Samaj. Your account is pending admin approval.
        </p>
      </div>
    );
  }

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/forum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPost)
      });
      if (res.ok) {
        const published = await res.json();
        setPosts([published, ...posts]);
        setIsPosting(false);
        setNewPost({ title: "", content: "", category: "GENERAL", isAnonymous: false });
      } else {
        alert("Failed to create post.");
      }
    } catch {
      alert("Error creating post.");
    }
  };

  const categories = ["ALL", "GENERAL", "EDUCATION", "FARMING", "HEALTH", "EMERGENCY"];

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0", background: "var(--background)", minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: "1000px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "10px" }}>Community Forum</h1>
            <p style={{ color: "var(--text-muted)" }}>Ask questions, seek help, and discuss community matters safely.</p>
          </div>
          <button className="btn" onClick={() => setIsPosting(!isPosting)}>
            {isPosting ? "Cancel" : "+ New Discussion"}
          </button>
        </div>

        {isPosting && (
          <div style={{ background: "var(--surface)", padding: "30px", borderRadius: "12px", boxShadow: "var(--shadow-lg)", marginBottom: "30px", border: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "20px", color: "var(--secondary)" }}>Start a Discussion</h2>
            <form onSubmit={handlePostSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
              <input 
                type="text" 
                placeholder="Discussion Title..." 
                required 
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--background)", color: "var(--foreground)" }}
              />
              <textarea 
                placeholder="What's on your mind?" 
                required 
                rows={5}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--background)", color: "var(--foreground)" }}
              />
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
                <select 
                  value={newPost.category}
                  onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                  style={{ padding: "10px", border: "1px solid var(--border)", borderRadius: "6px", background: "var(--background)", color: "var(--foreground)", width: "200px" }}
                >
                  <option value="GENERAL">General Discussion</option>
                  <option value="EDUCATION">Education & Careers</option>
                  <option value="FARMING">Farming Advice</option>
                  <option value="HEALTH">Health & Wellness</option>
                  <option value="EMERGENCY">Emergency Help</option>
                </select>

                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: "var(--foreground)" }}>
                  <input 
                    type="checkbox" 
                    checked={newPost.isAnonymous}
                    onChange={(e) => setNewPost({...newPost, isAnonymous: e.target.checked})}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  Post Anonymously
                </label>

                <button type="submit" className="btn" style={{ padding: "10px 30px" }}>Publish</button>
              </div>
            </form>
          </div>
        )}

        <div style={{ display: "flex", gap: "10px", marginBottom: "30px", overflowX: "auto", paddingBottom: "10px" }}>
          {categories.map(cat => (
             <button
             key={cat}
             onClick={() => setFilter(cat)}
             style={{
               padding: "6px 16px",
               borderRadius: "20px",
               border: "none",
               whiteSpace: "nowrap",
               background: filter === cat ? (cat === "EMERGENCY" ? "#e74c3c" : "var(--primary)") : "var(--surface)",
               color: filter === cat ? "white" : "var(--foreground)",
               boxShadow: "var(--shadow-sm)",
               cursor: "pointer",
               fontWeight: filter === cat ? "bold" : "normal"
             }}
           >
             {cat} {cat === "EMERGENCY" && "🔴"}
           </button>
          ))}
        </div>

        <div style={{ display: "grid", gap: "20px" }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", background: "var(--surface)", borderRadius: "12px" }}>
              No discussions found in this category. Be the first to start one!
            </div>
          ) : (
            posts.map(post => (
              <div key={post._id} style={{ 
                background: "var(--surface)", 
                padding: "25px", 
                borderRadius: "12px", 
                boxShadow: "var(--shadow-sm)", 
                borderLeft: post.category === "EMERGENCY" ? "5px solid #e74c3c" : "5px solid var(--primary)",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
                  <span style={{ 
                    fontSize: "0.75rem", 
                    fontWeight: "bold", 
                    color: post.category === "EMERGENCY" ? "white" : "var(--primary)", 
                    background: post.category === "EMERGENCY" ? "#e74c3c" : "#e8f5e9", 
                    padding: "4px 10px", 
                    borderRadius: "12px" 
                  }}>
                    {post.category}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 style={{ fontSize: "1.4rem", color: "var(--secondary)", marginBottom: "15px" }}>{post.title}</h3>
                <p style={{ color: "var(--foreground)", fontSize: "1rem", lineHeight: "1.6", marginBottom: "20px" }}>
                  {post.content}
                </p>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "15px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: post.isAnonymous ? "#ccc" : "var(--accent)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: "bold" }}>
                      {post.isAnonymous ? "?" : post.author?.name?.charAt(0) || "U"}
                    </div>
                    <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", fontStyle: post.isAnonymous ? "italic" : "normal" }}>
                      {post.isAnonymous ? "Anonymous Member" : post.author?.name || "Unknown"}
                    </span>
                  </div>
                  
                  <div style={{ display: "flex", gap: "15px" }}>
                    <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span>👍</span> Like
                    </button>
                    <button style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px" }}>
                      <span>💬</span> Comment
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
