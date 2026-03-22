import type { Metadata } from "next";
import OurStoryClient from "@/components/our-story/OurStoryClient";

export const metadata: Metadata = {
  title: "Our Story — AromaIQ",
  description:
    "How AromaIQ started: two builders, a vision for AI that learns your nose, and a path from bedroom prototype to every room.",
};

export default function OurStoryPage() {
  return <OurStoryClient />;
}
