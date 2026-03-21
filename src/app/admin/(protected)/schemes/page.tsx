import connectDB from "@/lib/db";
import Scheme from "@/models/Scheme";
import SchemeCategory from "@/models/SchemeCategory";
import TargetGroup from "@/models/TargetGroup";

import SchemeCategoryManager from "./SchemeCategoryManager";
import TargetGroupManager from "./TargetGroupManager";
import SchemeManagerList from "./SchemeManagerList";

export const dynamic = 'force-dynamic';

export default async function ManageSchemes() {
  await connectDB();
  const schemes = await Scheme.find().sort({ createdAt: -1 }).lean();
  const categories = await SchemeCategory.find().sort({ createdAt: -1 }).lean();
  const targetGroups = await TargetGroup.find().sort({ createdAt: -1 }).lean();

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "10px", color: "var(--primary)" }}>Schemes & Subsidies</h1>
      <p style={{ marginBottom: "30px", color: "var(--text-muted)" }}>
        Manage government schemes, private subsidies, eligibility criteria, and application links.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <SchemeCategoryManager />
        <TargetGroupManager />
      </div>

      <SchemeManagerList 
        initialSchemes={JSON.parse(JSON.stringify(schemes))} 
        categories={JSON.parse(JSON.stringify(categories))}
        targetGroups={JSON.parse(JSON.stringify(targetGroups))}
      />
    </div>
  );
}
