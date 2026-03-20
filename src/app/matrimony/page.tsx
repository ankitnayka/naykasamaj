"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Profile {
  _id: string;
  user: { _id: string; name: string };
  gender: string;
  dateOfBirth: string;
  height: string;
  education: string;
  occupation: string;
  location: string;
  maritalStatus: string;
  isPrivacyEnabled: boolean;
}

export default function MatrimonyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [filterGender, setFilterGender] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin?callbackUrl=/matrimony");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      try {
        const query = filterGender !== "ALL" ? `?gender=${filterGender}` : "";
        const res = await fetch(`/api/matrimony${query}`);
        if (res.ok) {
          const data = await res.json();
          setProfiles(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    if (session?.user?.isVerified || session?.user?.role === "ADMIN") {
      fetchProfiles();
    }
  }, [filterGender, session]);

  if (status === "loading" || loading) return <div style={{ padding: "100px", textAlign: "center" }}>Loading Matrimony Details...</div>;

  if (session && !session.user.isVerified && session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    return (
       <div style={{ padding: "100px 20px", textAlign: "center", minHeight: "60vh" }}>
        <div style={{ fontSize: "4rem", marginBottom: "20px" }}>🔒</div>
        <h1 style={{ color: "var(--primary)", marginBottom: "15px" }}>Verification Required</h1>
        <p style={{ color: "var(--text-muted)", maxWidth: "500px", margin: "0 auto", fontSize: "1.1rem" }}>
          The Matrimony Corner requires strict verified membership to access to ensure the safety and privacy of all members.
        </p>
      </div>
    );
  }

  const calculateAge = (dobString: string) => {
    const birthDate = new Date(dobString);
    const difference = Date.now() - birthDate.getTime();
    const ageDate = new Date(difference);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  return (
    <div className="animate-fade-in" style={{ padding: "60px 0", background: "var(--background)", minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: "1200px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "40px", flexWrap: "wrap", gap: "20px" }}>
          <div>
            <h1 style={{ fontSize: "2.5rem", color: "var(--primary)", marginBottom: "10px" }}>Matrimony Corner</h1>
            <p style={{ color: "var(--text-muted)" }}>Secure and private matchmaking connecting verified Nayka Samaj families.</p>
          </div>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <select 
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              style={{ padding: "10px", borderRadius: "30px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)" }}
            >
              <option value="ALL">All Genders</option>
              <option value="FEMALE">Brides</option>
              <option value="MALE">Grooms</option>
            </select>
            <button className="btn" style={{ padding: "10px 20px" }}>Create My Profile</button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "30px" }}>
          {profiles.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)", background: "var(--surface)", borderRadius: "12px", gridColumn: "1 / -1" }}>
              No matrimony profiles found matching your search.
            </div>
          ) : (
            profiles.map(profile => (
              <div key={profile._id} style={{ 
                background: "var(--surface)", 
                borderRadius: "12px", 
                overflow: "hidden",
                boxShadow: "var(--shadow-sm)", 
                border: "1px solid var(--border)",
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ height: "180px", background: "var(--primary)", opacity: 0.1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                  {/* Placeholder for Photo */}
                  <span style={{ fontSize: "3rem" }}>{profile.isPrivacyEnabled ? "🔒" : "👤"}</span>
                </div>
                
                <div style={{ padding: "25px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "15px" }}>
                    <div>
                      <h3 style={{ fontSize: "1.4rem", color: "var(--secondary)", margin: "0 0 5px 0" }}>
                        {profile.user.name}
                        {profile.isPrivacyEnabled && <span style={{ fontSize: "0.8rem", background: "var(--accent)", color: "white", padding: "2px 6px", borderRadius: "12px", marginLeft: "10px", verticalAlign: "middle" }}>Private</span>}
                      </h3>
                      <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
                        {profile.gender === "MALE" ? "Groom" : "Bride"} • {calculateAge(profile.dateOfBirth)} Yrs • {profile.height}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "0.9rem", color: "var(--foreground)", marginBottom: "20px", background: "var(--background)", padding: "15px", borderRadius: "8px" }}>
                    <div><strong style={{ color: "var(--text-muted)", display: "block" }}>Education</strong> {profile.education}</div>
                    <div><strong style={{ color: "var(--text-muted)", display: "block" }}>Occupation</strong> {profile.occupation}</div>
                    <div><strong style={{ color: "var(--text-muted)", display: "block" }}>Location</strong> {profile.location}</div>
                    <div><strong style={{ color: "var(--text-muted)", display: "block" }}>Status</strong> {profile.maritalStatus.replace("_", " ")}</div>
                  </div>

                  <div style={{ marginTop: "auto" }}>
                    <button className="btn" style={{ width: "100%", background: "transparent", border: "1px solid var(--primary)", color: "var(--primary)" }}>
                      Express Interest
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
