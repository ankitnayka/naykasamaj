"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function SchemeForm({ existingScheme, categories, targetGroups, onSuccess, onCancel }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // Basic
  const [title, setTitle] = useState(existingScheme?.title || "");
  const [provider, setProvider] = useState(existingScheme?.provider || "");
  const [description, setDescription] = useState(existingScheme?.description || "");
  const [shortDescription, setShortDescription] = useState(existingScheme?.shortDescription || "");
  const [fullDescription, setFullDescription] = useState(existingScheme?.fullDescription || "");
  const [category, setCategory] = useState(existingScheme?.category || "");

  // Eligibility
  const [ageLimit, setAgeLimit] = useState(existingScheme?.ageLimit || "");
  const [incomeCriteria, setIncomeCriteria] = useState(existingScheme?.incomeCriteria || "");
  const [targetGroup, setTargetGroup] = useState(existingScheme?.targetGroup || "");

  // Benefits
  const [financialBenefit, setFinancialBenefit] = useState(existingScheme?.financialBenefit || "");
  const [otherBenefits, setOtherBenefits] = useState(existingScheme?.otherBenefits || "");

  // Details
  const [startDate, setStartDate] = useState(existingScheme?.startDate ? new Date(existingScheme.startDate).toISOString().split('T')[0] : "");
  const [lastDate, setLastDate] = useState(existingScheme?.lastDate ? new Date(existingScheme.lastDate).toISOString().split('T')[0] : "");
  const [status, setStatus] = useState(existingScheme?.status || "Active");

  // Links
  const [officialWebsite, setOfficialWebsite] = useState(existingScheme?.officialWebsite || "");
  const [applyLink, setApplyLink] = useState(existingScheme?.applyLink || "");

  // Media
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImage, setExistingImage] = useState<string | null>(existingScheme?.image || null);
  const [removeImage, setRemoveImage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!category) return setError("Please select a Category");
    if (!targetGroup) return setError("Please select a Target Group");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("provider", provider);
    formData.append("description", description);
    formData.append("shortDescription", shortDescription || description);
    formData.append("fullDescription", fullDescription);
    formData.append("category", category);
    formData.append("ageLimit", ageLimit);
    formData.append("incomeCriteria", incomeCriteria);
    formData.append("targetGroup", targetGroup);
    formData.append("financialBenefit", financialBenefit);
    formData.append("otherBenefits", otherBenefits);
    if (startDate) formData.append("startDate", startDate);
    if (lastDate) formData.append("lastDate", lastDate);
    formData.append("status", status);
    formData.append("officialWebsite", officialWebsite);
    formData.append("applyLink", applyLink);

    if (existingImage) formData.append("existingImage", existingImage);
    if (removeImage) formData.append("removeImage", "true");
    if (imageFile) formData.append("image", imageFile);

    try {
      const url = existingScheme ? `/api/admin/schemes/${existingScheme._id}` : "/api/admin/schemes";
      const method = existingScheme ? "PUT" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json();

      if (res.ok) {
        if (!existingScheme) {
          setTitle(""); setProvider(""); setDescription(""); setShortDescription(""); setFullDescription(""); setCategory("");
          setAgeLimit(""); setIncomeCriteria(""); setTargetGroup("");
          setFinancialBenefit(""); setOtherBenefits("");
          setStartDate(""); setLastDate(""); setStatus("Active");
          setOfficialWebsite(""); setApplyLink("");
          setImageFile(null);
        }
        if (onSuccess) onSuccess(data.scheme);
        alert(`Scheme successfully ${existingScheme ? "updated" : "created"}`);
      } else {
        setError(data.error || "Failed to save scheme");
      }
    } catch (err: any) {
      setError("Network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const sectionStyle = { marginBottom: "25px", padding: "15px", background: "#f8f9fa", borderRadius: "8px", border: "1px solid #e5e7eb" };
  const labelStyle = { display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "0.9rem" };
  const inputStyle = { width: "100%", padding: "10px", borderRadius: "4px", border: "1px solid #ccc", marginBottom: "15px" };

  return (
    <form onSubmit={handleSubmit} style={{ background: "var(--surface)", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
      {error && <div style={{ color: "red", padding: "10px", background: "#fee2e2", marginBottom: "15px", borderRadius: "4px" }}>{error}</div>}

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: "15px", color: "var(--primary)" }}>📋 Basic Information</h3>
        <label style={labelStyle}>Scheme Title *</label>
        <input required style={inputStyle} value={title} onChange={e => setTitle(e.target.value)} />
        
        <label style={labelStyle}>Provider / Department *</label>
        <input required placeholder="e.g. Ministry of Agriculture" style={inputStyle} value={provider} onChange={e => setProvider(e.target.value)} />

        <label style={labelStyle}>Description / Summary *</label>
        <textarea required placeholder="Brief summary of the scheme" style={{ ...inputStyle, minHeight: "60px" }} value={description} onChange={e => {
          setDescription(e.target.value);
          if (!shortDescription) setShortDescription(e.target.value);
        }} />

        <label style={labelStyle}>Full Details *</label>
        <textarea required style={{ ...inputStyle, minHeight: "120px" }} value={fullDescription} onChange={e => setFullDescription(e.target.value)} />

        <label style={labelStyle}>Category *</label>
        <select required style={inputStyle} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="">-- Select Category --</option>
          {categories.map((c: any) => <option key={c._id} value={c.name}>{c.name}</option>)}
        </select>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: "15px", color: "var(--primary)" }}>👥 Eligibility</h3>
        <label style={labelStyle}>Age Limit</label>
        <input placeholder="e.g. 18-35" style={inputStyle} value={ageLimit} onChange={e => setAgeLimit(e.target.value)} />

        <label style={labelStyle}>Income Criteria</label>
        <input placeholder="e.g. < 2.5 LPA" style={inputStyle} value={incomeCriteria} onChange={e => setIncomeCriteria(e.target.value)} />

        <label style={labelStyle}>Target Group *</label>
        <select required style={inputStyle} value={targetGroup} onChange={e => setTargetGroup(e.target.value)}>
          <option value="">-- Select Target Group --</option>
          {targetGroups.map((tg: any) => <option key={tg._id} value={tg.name}>{tg.name}</option>)}
        </select>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: "15px", color: "var(--primary)" }}>💰 Benefits</h3>
        <label style={labelStyle}>Financial Benefit</label>
        <input placeholder="₹ amount or description" style={inputStyle} value={financialBenefit} onChange={e => setFinancialBenefit(e.target.value)} />

        <label style={labelStyle}>Other Benefits</label>
        <textarea style={{ ...inputStyle, minHeight: "60px" }} value={otherBenefits} onChange={e => setOtherBenefits(e.target.value)} />
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: "15px", color: "var(--primary)" }}>📅 Important Details</h3>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Start Date</label>
            <input type="date" style={inputStyle} value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Last Date</label>
            <input type="date" style={inputStyle} value={lastDate} onChange={e => setLastDate(e.target.value)} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Status *</label>
            <select style={inputStyle} value={status} onChange={e => setStatus(e.target.value)}>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: "15px", color: "var(--primary)" }}>🔗 Useful Links</h3>
        <label style={labelStyle}>Official Website Link</label>
        <input type="url" style={inputStyle} value={officialWebsite} onChange={e => setOfficialWebsite(e.target.value)} />

        <label style={labelStyle}>Apply Link</label>
        <input type="url" style={inputStyle} value={applyLink} onChange={e => setApplyLink(e.target.value)} />
      </div>

      <div style={sectionStyle}>
        <h3 style={{ marginBottom: "15px", color: "var(--primary)" }}>📎 Media</h3>
        {existingImage && !removeImage && (
          <div style={{ marginBottom: "15px" }}>
            <img src={existingImage} alt="Current Banner" style={{ maxWidth: "200px", borderRadius: "5px" }} />
            <br/>
            <button type="button" onClick={() => setRemoveImage(true)} style={{ color: "red", background: "none", border: "none", cursor: "pointer", marginTop: "5px", textDecoration: "underline" }}>
              Remove Image
            </button>
          </div>
        )}
        <label style={labelStyle}>Upload Image / Banner</label>
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)} style={inputStyle} />
      </div>

      <div style={{ display: "flex", gap: "15px" }}>
        <button type="submit" disabled={loading} style={{ background: "var(--primary)", color: "white", padding: "12px 24px", borderRadius: "4px", border: "none", cursor: loading ? "wait" : "pointer", fontWeight: "bold" }}>
          {loading ? "Saving..." : (existingScheme ? "Update Scheme" : "Create Scheme")}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ background: "transparent", color: "var(--text-muted)", padding: "12px 24px", borderRadius: "4px", border: "1px solid var(--border)", cursor: "pointer" }}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
