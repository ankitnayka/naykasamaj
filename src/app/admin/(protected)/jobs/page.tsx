import connectDB from "@/lib/db";
import Job from "@/models/Job";
import JobManagerList from "./JobManagerList";

export const dynamic = 'force-dynamic';

export default async function ManageJobs() {
  await connectDB();
  const jobs = await Job.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Opportunity Desk: Jobs & Skills</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)", maxWidth: "800px" }}>
        Manage job openings, skill development programs, and community opportunities.
      </p>

      <JobManagerList initialJobs={JSON.parse(JSON.stringify(jobs))} />
    </div>
  );
}
