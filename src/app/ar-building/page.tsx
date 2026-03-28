import type { Metadata } from "next";
import ARBuildingClient from "./ARBuildingClient";

export const metadata: Metadata = {
  title: "Nayaka Samaj Bhavan | AR Experience",
  description:
    "Experience the Nayaka Samaj Bhavan in augmented reality. Place the community building in your real world using your Android phone camera.",
};

export default function ARBuildingPage() {
  return <ARBuildingClient />;
}
