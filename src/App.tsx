import { useState } from "react";
import myPicture from "../Image/MyPicture.png";
import osuLogo from "../Image/OSULOGO.jpg";
import { awards } from "./content/awards";
import { academicMilestones, highlights } from "./content/highlights";
import { experience } from "./content/experience";
import { profile } from "./content/profile";
import { projects } from "./content/projects";
import { publications } from "./content/publications";
import { researchAreas } from "./content/research";
import ResearchAssistant from "./ResearchAssistant";
import { service } from "./content/service";
import { skillGroups } from "./content/skills";

const SHOW_CV = false;
const navigation = [["Home", "home"], ["About", "about"], ["Research", "research"], ["Highlights & News", "highlights"], ["Experience", "experience"], ["Publications", "publications"], ["Projects", "projects"], ["Skills", "skills"], ["Awards & Service", "awards-service"], ["CV", "cv"], ["Contact", "contact"], ["Research Assistant", "research-assistant"]];

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return <div className="section-heading"><p className="eyebrow">{eyebrow}</p><h2>{title}</h2>{intro && <p className="section-intro">{intro}</p>}</div>;
}

function App() {
  const [showAllHighlights, setShowAllHighlights] = useState(false);

  return <>
    <header className="site-header">
      <a className="wordmark" href="#home" aria-label={`${profile.name}, home`}><span className="wordmark-mark">PR</span><span>Research portfolio</span></a>
      <nav aria-label="Main navigation">{navigation.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
    </header>
    <main>
      <section className="hero page-wrap" id="home">
        <div className="hero-copy"><p className="eyebrow"><span className="status-dot" /> AI / ML RESEARCH & ENGINEERING</p><h1>{profile.name}</h1><p className="hero-role">{profile.title}</p><p className="hero-affiliation">AI/ML research at Oklahoma State University</p><p className="hero-expertise">Healthcare AI <span>|</span> Graph Neural Networks <span>|</span> NLP <span>|</span> LLMs <span>|</span> RAG <span>|</span> Agentic AI</p><p className="hero-summary">Applied AI/ML research and production-grade intelligent solutions across healthcare, biopharma, retail, banking, and manufacturing.</p><div className="hero-actions"><a className="button button-primary" href="#research">Explore Research</a><a className="button button-secondary" href="#publications">View Publications</a>{SHOW_CV && <a className="button button-secondary" href={profile.cvPath}>Download CV</a>}<a className="button button-secondary" href="#research-assistant">Ask My Research Assistant</a></div></div>
        <aside className="hero-aside" aria-label="Research focus snapshot"><div className="hero-profile"><img src={myPicture} alt="Priyadharsini Ramamurthy" /><p className="eyebrow">RESEARCHER</p></div><div className="signal-head"><span>RESEARCH SNAPSHOT</span><span>CORE AREAS</span></div><div className="signal-graphic" aria-hidden="true"><span className="signal-line signal-line-one" /><span className="signal-line signal-line-two" /><span className="signal-node signal-node-one" /><span className="signal-node signal-node-two" /><span className="signal-node signal-node-three" /><span className="signal-node signal-node-four" /><span className="signal-node signal-node-five" /><span className="signal-center">ML</span></div><div className="snapshot-focus"><p className="eyebrow">METHODS & DOMAINS</p><ul className="snapshot-tags"><li>Healthcare AI</li><li>Graph Neural Networks</li><li>NLP & LLMs</li><li>RAG & Agentic AI</li></ul></div><div className="hero-stat"><strong>11+ / 6+</strong><span>years in enterprise technology / applied AI/ML research</span></div></aside>
        <a className="scroll-cue" href="#about">SCROLL TO EXPLORE <span aria-hidden="true">&#8595;</span></a>
      </section>

      <section className="content-section page-wrap" id="about"><SectionHeading eyebrow="01 / ABOUT" title="Research grounded in real-world data" /><div className="about-layout"><div><p className="about-lead">{profile.summary}</p><p className="about-biography">Her doctoral work at Oklahoma State University brings together NLP, graph learning, and healthcare analytics to address practical clinical challenges.</p></div><div className="about-detail"><div className="about-focus"><p className="eyebrow">CURRENT RESEARCH FOCUS</p><p>{profile.researchFocus}</p></div><div className="education-block"><div className="education-heading"><p className="eyebrow">EDUCATION</p><img src={osuLogo} alt="Oklahoma State University logo" /></div><div className="education-list">{profile.education.map((item) => <article className="education-row" key={item.id} data-source={item.source}><div><strong>{item.degree}</strong><span>{item.institution}</span>{item.detail && <small>{item.detail}</small>}</div>{item.year && <span className="education-year">{item.year}</span>}</article>)}</div><div className="milestones"><p className="eyebrow">ACADEMIC MILESTONES</p><ol className="milestone-list">{academicMilestones.map((milestone) => <li key={milestone.id}><time>{milestone.date}</time><div><strong>{milestone.title}</strong><span>{milestone.description}</span></div></li>)}</ol></div></div></div></div></section>

      <section className="content-section section-tint page-wrap" id="research"><SectionHeading eyebrow="02 / RESEARCH INTERESTS" title="Questions across language, graphs, and health" intro="Research areas documented in the CV and focused on practical healthcare and biomedical applications." /><div className="research-grid">{researchAreas.map((area, index) => <article className="research-item" key={area.id} data-source={area.source}><span className="item-index">0{index + 1}</span><h3>{area.title}</h3><p>{area.description}</p></article>)}</div></section>

      <section className="content-section page-wrap" id="highlights"><SectionHeading eyebrow="HIGHLIGHTS & NEWS" title="Research, service, and academic milestones" intro="Updates from the personal website, organized newest first." /><div className="highlights-list">{(showAllHighlights ? highlights : highlights.slice(0, 4)).map((highlight) => <article className="highlight-item" key={highlight.id}><time>{highlight.date}</time><div><h3>{highlight.title}</h3><p>{highlight.description}</p>{highlight.links && <div className="highlight-links">{highlight.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer">{link.label}</a>)}</div>}</div></article>)}</div><button className="highlights-toggle" type="button" aria-expanded={showAllHighlights} onClick={() => setShowAllHighlights((show) => !show)}>{showAllHighlights ? "Show Less" : "View All Highlights"}</button></section>

      <section className="content-section page-wrap" id="experience"><SectionHeading eyebrow="03 / EXPERIENCE" title="A career across research and industry" /><div className="timeline">{experience.map((item) => <article className="timeline-item" key={item.id} data-source={item.source}><p className="timeline-period">{item.period}</p><div className="timeline-content"><h3>{item.role}</h3><p className="timeline-org">{item.organization}</p><ul>{item.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul></div></article>)}</div></section>

      <section className="content-section section-ink page-wrap" id="publications"><SectionHeading eyebrow="04 / PUBLICATIONS" title="Selected publications" intro="Bibliographic details transcribed from the updated CV." /><div className="publication-list">{publications.map((publication) => <article className="publication-row" key={publication.id} data-source={publication.source}><div className="publication-main"><div className="publication-meta"><span className="publication-year">{publication.year}</span><span className="publication-venue">{publication.venue}</span></div><h3>{publication.title}</h3><p className="publication-contribution">{publication.contribution}</p><details className="publication-citation"><summary>Authors and full citation</summary><p>{publication.citation}</p></details></div><span className="missing-link">{publication.url ?? publication.linkPlaceholder}</span></article>)}</div></section>

      <section className="content-section page-wrap" id="projects"><SectionHeading eyebrow="05 / PROJECTS" title="Selected research and applied work" intro="Project summaries are based on accomplishments described in the CV." /><div className="project-grid">{projects.map((project, index) => <article className="project-item" key={project.id} data-source={project.source}><div className="project-meta"><span>PROJECT / 0{index + 1}</span><span aria-hidden="true">&#8599;</span></div><h3>{project.title}</h3><p>{project.description}</p><ul className="tag-list">{project.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul></article>)}</div></section>

      <section className="content-section section-tint page-wrap" id="skills"><SectionHeading eyebrow="06 / SKILLS" title="Tools and methods" /><div className="skills-grid">{skillGroups.map((group) => <article className="skill-row" key={group.id} data-source={group.source}><h3>{group.category}</h3><ul className="tag-list">{group.skills.map((skill) => <li key={skill}>{skill}</li>)}</ul></article>)}</div></section>

      <section className="content-section page-wrap" id="awards-service"><SectionHeading eyebrow="07 / RECOGNITION & SERVICE" title="Awards, service, and community" /><div className="recognition-layout"><div><h3 className="column-title">Awards & honors</h3><div className="award-list">{awards.map((award) => <article className="award-row" key={award.id} data-source={award.source}><div><h4>{award.title}</h4><p>{award.organization}</p></div><span>{award.year}</span></article>)}</div></div><div><h3 className="column-title">Professional service</h3><div className="service-list">{service.map((item) => <article className="service-row" key={item.id} data-source={item.source}><div><h4>{item.title}</h4><p>{item.detail}</p></div>{item.period && <span>{item.period}</span>}</article>)}</div></div></div></section>

      <section className="cv-band page-wrap" id="cv"><div><p className="eyebrow">08 / CURRICULUM VITAE</p><h2>Full experience, in one document.</h2></div>{SHOW_CV ? <a className="button button-light" href={profile.cvPath} target="_blank" rel="noreferrer">Download CV <span aria-hidden="true">&#8595;</span></a> : <span>CV available upon request.</span>}</section>

      <section className="content-section page-wrap contact-section" id="contact"><SectionHeading eyebrow="09 / CONTACT" title="Get in touch" intro="Contact details listed in the updated CV." /><div className="contact-grid"><a href={`mailto:${profile.email}`}><span>Email</span><strong>{profile.email}</strong><span aria-hidden="true">&#8599;</span></a><a href={`tel:${profile.phone}`}><span>Phone</span><strong>{profile.phone}</strong><span aria-hidden="true">&#8599;</span></a>{profile.links.map((link) => <div className="contact-placeholder" key={link.id} data-source={link.source}><span>{link.label}</span><strong>{link.value}</strong><small>{link.placeholder}</small></div>)}</div></section>

      <ResearchAssistant />
    </main>
    <footer className="site-footer page-wrap"><a href="#home">{profile.name}</a><span>AI/ML research and engineering</span><a href="#home">Back to top &#8593;</a></footer>
  </>;
}

export default App;