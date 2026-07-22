export const FEATURED_PROJECT_SLUGS = [
  "perception",
  "agent-identity-graph",
  "ai-dashboard",
  "catalog-redesign",
  "fluent-design-system",
  "coraway",
] as const;

export const PROJECT_MOCKUP_TILT_OVERRIDES: Record<string, string> = {
  "fluent-design-system": "mockup-bleed--fluent",
  "catalog-redesign": "mockup-bleed--catalog",
  coraway: "mockup-bleed--coraway",
  "ai-dashboard": "mockup-bleed--ai-dashboard",
  perception: "mockup-bleed--perception",
  "agent-identity-graph": "mockup-bleed--identity-access-graph",
};
