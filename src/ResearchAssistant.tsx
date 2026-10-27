import { useEffect, useRef, useState } from "react";
import { awards } from "./content/awards";
import { academicMilestones, highlights } from "./content/highlights";
import { experience } from "./content/experience";
import { profile } from "./content/profile";
import { projects } from "./content/projects";
import { publications } from "./content/publications";
import { researchAreas } from "./content/research";

interface Entry { id: string; section: string; anchor: string; title: string; text: string }
interface Message { id: number; role: "user" | "assistant"; text: string; sources?: Entry[] }

const entries: Entry[] = [
  { id: "about", section: "About", anchor: "about", title: "Research focus", text: `${profile.summary} ${profile.researchFocus}` },
  ...profile.education.map((e) => ({ id: `edu-${e.id}`, section: "Education", anchor: "about", title: e.degree, text: [e.degree, e.institution, e.detail, e.year].filter(Boolean).join(", ") })),
  ...academicMilestones.map((m) => ({ id: `ms-${m.id}`, section: "Academic milestones", anchor: "about", title: m.title, text: `${m.date}: ${m.title}. ${m.description}` })),
  ...researchAreas.map((r) => ({ id: `res-${r.id}`, section: "Research", anchor: "research", title: r.title, text: `${r.title}. ${r.description}` })),
  ...highlights.map((h) => ({ id: `hl-${h.id}`, section: "Highlights & News", anchor: "highlights", title: h.title, text: `${h.date}: ${h.title}. ${h.description}` })),
  ...experience.map((x) => ({ id: `exp-${x.id}`, section: "Experience", anchor: "experience", title: `${x.role}, ${x.organization}`, text: `${x.role}, ${x.organization} (${x.period}). ${x.highlights.join(" ")}` })),
  ...publications.map((p) => ({ id: `pub-${p.id}`, section: "Publications", anchor: "publications", title: p.title, text: `${p.title} (${p.venue}, ${p.year}). ${p.contribution}` })),
  ...projects.map((p) => ({ id: `proj-${p.id}`, section: "Projects", anchor: "projects", title: p.title, text: `${p.title}. ${p.description} Tags: ${p.tags.join(", ")}.` })),
  ...awards.map((a) => ({ id: `aw-${a.id}`, section: "Awards", anchor: "awards-service", title: a.title, text: `${a.title}, ${a.organization} (${a.year})` })),
];

const STOP = new Set("a an and are as at be by can did do does for from has have how i in is it me my of on or priya she her tell the this that to was what when where which who with about your you use used using involve involving show list any there give know more also been been been if so than then them these those his their his be being were will would could should please".split(" "));
const stem = (w: string) => w.replace(/ied$/, "y").replace(/ies$/, "y").replace(/(ing|ed|es|s)$/, (m, _s, off) => (off >= 3 ? "" : m));
const tokens = (s: string) => s.toLowerCase().replace(/graph[\s-]+neural[\s-]+networks?|\bgnns?\b/g, "gnn").split(/[^a-z0-9]+/).filter((w) => w.length > 1 && !STOP.has(w)).map(stem);

// Synonym groups (single words); a query word also matches its group members at reduced weight.
const SYN = [
  "publication paper article journal manuscript publish conference",
  "project tool system app application prototype build built software",
  "job employment career position role intern internship work experience employer",
  "education study degree university school college phd doctorate doctoral student graduate",
  "award honor prize fellowship recognition scholarship achievement",
  "llm gpt chatgpt generative genai transformer",
  "rag retrieval augmented",
  "gnn graph",
  "ehr health record clinical medical healthcare patient",
  "epilepsy seizure pte",
  "nlp language text linguistic",
  "cv vision image visual",
  "qa question answering",
  "genome genomic dna",
  "advisor supervisor mentor adviser",
  "news update recent latest announcement",
  "reviewer review service peer",
  "ml machine ai artificial",
  "lab group team",
].map((g) => g.split(" ").map(stem));
const synOf = (t: string) => [...new Set(SYN.filter((g) => g.includes(t)).flat())].filter((x) => x !== t);

// Words that signal which section the user is asking about.
const INTENTS: { words: string[]; sections: string[] }[] = [
  { words: ["publication", "paper", "article", "journal", "publish", "manuscript"], sections: ["Publications"] },
  { words: ["project", "tool", "app", "application", "prototype", "software", "build", "built"], sections: ["Projects"] },
  { words: ["job", "work", "career", "employment", "intern", "internship", "role", "experience", "employer"], sections: ["Experience"] },
  { words: ["education", "study", "degree", "university", "school", "college", "doctorate", "phd", "graduate"], sections: ["Education", "Academic milestones"] },
  { words: ["award", "honor", "prize", "fellowship", "scholarship", "recognition", "achievement"], sections: ["Awards", "Highlights & News"] },
  { words: ["news", "update", "recent", "latest", "announcement"], sections: ["Highlights & News"] },
  { words: ["research", "interest", "focus", "topic"], sections: ["Research", "About"] },
].map((i) => ({ words: i.words.map(stem), sections: i.sections }));

const indexed = entries.map((e) => { const seq = tokens(`${e.title} ${e.text}`); return { e, seq, words: new Set(seq), titleWords: new Set(tokens(e.title)), joined: ` ${seq.join(" ")} ` }; });
const df = new Map<string, number>();
indexed.forEach((d) => d.words.forEach((w) => df.set(w, (df.get(w) ?? 0) + 1)));
const idf = (w: string) => Math.log(1 + indexed.length / (1 + (df.get(w) ?? 0)));

interface Result { found: Entry[]; note?: string; broad?: boolean }

function search(query: string): Result {
  const seq = tokens(query);
  const q = [...new Set(seq)];
  const intentHits = INTENTS.filter((i) => i.words.some((w) => q.includes(w)));
  const sections = new Set(intentHits.flatMap((i) => i.sections));
  const intentWords = new Set(intentHits.flatMap((i) => i.words));
  const topical = q.filter((w) => !intentWords.has(w));
  // Only section words (e.g. "list publications"): browse that section.
  if (!topical.length) {
    if (!sections.size) return { found: [] };
    return { found: entries.filter((e) => sections.has(e.section)).slice(0, 3), broad: true };
  }
  const concepts = topical.map((t) => [{ t, w: 1 }, ...synOf(t).map((x) => ({ t: x, w: 0.7 }))]);
  const pairs = seq.slice(1).map((w, i) => ` ${seq[i]} ${w} `);
  const scored = indexed.map(({ e, words, titleWords, joined }) => {
    let score = 0, matched = 0;
    const hit: boolean[] = concepts.map((vs) => {
      const best = Math.max(0, ...vs.map((v) => v.w * idf(v.t) * ((words.has(v.t) ? 1 : 0) + (titleWords.has(v.t) ? 0.5 : 0))));
      score += best;
      if (best > 0) matched++;
      return best > 0;
    });
    score += pairs.filter((p) => joined.includes(p)).length * 1.5;
    const strict = sections.has("Publications") || sections.has("Projects");
    const support = e.section === "Experience" || e.section === "Highlights & News";
    score *= strict ? (sections.has(e.section) ? 1.6 : support ? 0.8 : 0.5) : sections.has(e.section) ? 1.3 : 1;
    return { e, score, matched, hit };
  });
  const need = Math.ceil(concepts.length / 2);
  const ranked = scored.filter((r) => r.matched >= need && r.score > 0).sort((a, b) => b.score - a.score);
  if (!ranked.length) return { found: [] };
  const seen = new Set<string>();
  const strong = ranked.filter((r) => r.score >= ranked[0].score * 0.5).filter((r) => { const k = r.e.title.toLowerCase(); return seen.has(k) ? false : (seen.add(k), true); });
  const primary = strong.filter((r) => sections.has(r.e.section));
  const picked = (sections.size && primary.length ? [...primary.slice(0, 3), ...strong.filter((r) => !sections.has(r.e.section)).slice(0, 1)] : strong).slice(0, 3);
  const found = picked.map((r) => r.e);
  const missing = topical.filter((_, i) => !picked.some((r) => r.hit[i]));
  return { found, note: missing.length ? `I found nothing specific about “${missing.join("”, “")}”, so these are partial matches.` : undefined };
}

const suggestions = ["What is your research focus?", "Which publications involve graph neural networks?", "What projects use LLMs or RAG?", "Where have you worked?", "What awards have you received?", "Where did you study?"];
const trim = (s: string) => (s.length > 260 ? `${s.slice(0, 260).replace(/\s+\S*$/, "")}…` : s);
const GREETING = /^\s*(hi|hello|hey|thanks|thank you)\b/i;
const NO_MATCH = "I couldn't find that in the portfolio's public content, so I won't guess. Try asking about research areas, publications, projects, experience, education, awards, or news, with a specific topic such as “graph neural networks” or “epilepsy”.";

export default function ResearchAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const nextId = useRef(1);
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = logRef.current;
    if (!el || !messages.length) return;
    const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollTo({ top: el.scrollHeight, behavior: calm ? "auto" : "smooth" });
  }, [messages]);

  function ask(raw: string) {
    const question = raw.trim();
    if (!question) return;
    const { found, note, broad } = GREETING.test(question) && question.split(/\s+/).length < 4
      ? { found: [] as Entry[], note: undefined, broad: false }
      : search(question);
    const intro = GREETING.test(question) && question.split(/\s+/).length < 4 ? "Hello! Ask me about Priya's research, publications, projects, experience, education, awards, or news." : null;
    const body = found.map((f) => `${f.section}: ${trim(f.text)}`).join("\n\n");
    const reply: Message = intro
      ? { id: nextId.current + 1, role: "assistant", text: intro }
      : found.length
        ? { id: nextId.current + 1, role: "assistant", text: [broad ? "That's fairly broad. Here are a few items; open the linked section for more, or ask about a specific topic." : note ?? `Here ${found.length > 1 ? "are the most relevant items" : "is the most relevant item"} from the portfolio:`, body].filter(Boolean).join("\n\n"), sources: found }
        : { id: nextId.current + 1, role: "assistant", text: NO_MATCH };
    setMessages((m) => [...m, { id: nextId.current, role: "user", text: question }, reply]);
    nextId.current += 2;
    setInput("");
  }

  return <section className="ra page-wrap" id="research-assistant">
    <div className="ra-head"><p className="eyebrow">10 / RESEARCH ASSISTANT</p><h2>Ask My Research Assistant</h2><p className="ra-note"><strong>Portfolio research assistant (local retrieval).</strong> Not a generative LLM: it matches keywords in this site's public content and shows the matching excerpts with links. Nothing is sent anywhere.</p></div>
    <div className="ra-panel">
      <div className="ra-log" ref={logRef} role="log" aria-live="polite">
        {messages.length === 0 && <p className="ra-empty">Pick a suggested question or type your own.</p>}
        {messages.map((m) => <div key={m.id} className={`ra-msg ra-${m.role}`}>
          {m.text.split("\n\n").map((para, i) => <p key={i}>{para}</p>)}
          {m.sources && <div className="ra-sources"><span>Sources:</span>{m.sources.map((s) => <a key={s.id} href={`#${s.anchor}`} title={`${s.section}: ${s.title}`}><b>{s.section}</b> {s.title.length > 40 ? `${s.title.slice(0, 40)}…` : s.title}</a>)}</div>}
        </div>)}
      </div>
      <div className="ra-suggestions" aria-label="Suggested questions">{suggestions.map((s) => <button key={s} type="button" onClick={() => ask(s)}>{s}</button>)}</div>
      <form className="ra-form" onSubmit={(e) => { e.preventDefault(); ask(input); }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about research, publications, projects…" aria-label="Your question" />
        <button type="submit" disabled={!input.trim()}>Ask</button>
        <button type="button" className="ra-clear" onClick={() => setMessages([])} disabled={!messages.length}>Clear chat</button>
      </form>
    </div>
  </section>;
}
