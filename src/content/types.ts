export type ContentSource = "Updated CV" | "Google Site";

export interface SourcedContent {
  id: string;
  source: ContentSource;
}