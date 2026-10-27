import type { SourcedContent } from "./types";

export interface AwardRecord extends SourcedContent { title: string; organization: string; year: string; }

export const awards: AwardRecord[] = [
  { id: "award-osu-researcher-2024", source: "Updated CV", title: "Outstanding Computer Science Researcher Award", organization: "Oklahoma State University", year: "2024" },
  { id: "award-cs-fellowship-2019", source: "Updated CV", title: "Computer Science Fellowship", organization: "Oklahoma State University", year: "2019" },
  { id: "award-fisher-fellowship-2024", source: "Updated CV", title: "Fisher Fellowship", organization: "Oklahoma State University", year: "2024" },
  { id: "award-chsi-research-fellowship", source: "Updated CV", title: "DoD-Oracle-Cerner Research Fellowship", organization: "Center for Health Systems Innovation, Oklahoma State University", year: "Not specified in CV" },
  { id: "award-aes-dod-travel-2025", source: "Updated CV", title: "AES Department of Defense Travel Award", organization: "Research contributions in healthcare AI and neuroinformatics", year: "2025" },
  { id: "award-wids-ambassador-2024", source: "Google Site", title: "Women in Data Science Ambassador", organization: "Women in Data Science", year: "2024" },
  { id: "award-three-minute-thesis-2022", source: "Updated CV", title: "Professional Development Allowance", organization: "Oklahoma State University, Three Minute Thesis Competition", year: "2022" },
  { id: "award-doosan-star-2013", source: "Updated CV", title: "STAR PERFORMER Award", organization: "Doosan Infracore (HD Hyundai Infracore)", year: "2013" },
  { id: "award-doosan-na-parts", source: "Updated CV", title: "Excellent Contribution Award, North America Parts Implementation", organization: "Doosan Infracore (HD Hyundai Infracore)", year: "Not specified in CV" },
];