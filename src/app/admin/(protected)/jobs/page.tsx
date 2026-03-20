import connectDB from "@/lib/db";
import Job from "@/models/Job";
import JobForm from "./JobForm";

export default async function ManageJobs() {
  await connectDB();
  const jobs = await Job.find().sort({ createdAt: -1 });

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Opportunity Desk: Jobs & Skills</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)", maxWidth: "800px" }}>
        Post job openings and skill development programs to the public Opportunity Board.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
        
        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Add New Listing</h2>
          <JobForm />
        </div>

        <div>
          <h2 style={{ fontSize: "1.3rem", marginBottom: "15px", color: "var(--secondary)" }}>Active Listings Database</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {jobs.length === 0 ? (
              <p style={{ color: "var(--text-muted)" }}>No jobs posted yet.</p>
            ) : (
              jobs.map((job: any) => (
                <div key={job._id.toString()} style={{ background: "var(--surface)", padding: "12px 15px", borderRadius: "6px", border: "1px solid var(--border)", borderLeft: `4px solid ${job.isSkillDevelopment ? "var(--accent)" : "var(--primary)"}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                     <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: job.isSkillDevelopment ? "var(--accent)" : "var(--primary)"}}>
                        {job.isSkillDevelopment ? "SKILL PROGRAM" : "JOB OPPORTUNITY"}
                     </span>
                     <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{new Date(job.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ margin: "0 0 5px 0", fontSize: "1.05rem" }}>{job.title}</h4>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{job.company} • {job.location}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
