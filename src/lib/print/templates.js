/* Per-product template registry. The editor is one shared route, so it looks up
 * the right template list, scheme list and resolvers by product id here instead
 * of importing a single product's templates directly. */

import {
  VC_TEMPLATES,
  VC_SCHEMES,
  getVcTemplate,
  getVcScheme,
} from "./templates-vc";
import {
  LH_TEMPLATES,
  LH_SCHEMES,
  getLhTemplate,
  getLhScheme,
} from "./templates-letterhead";
import {
  PO_TEMPLATES,
  PO_SCHEMES,
  getPoTemplate,
  getPoScheme,
} from "./templates-poster";
import {
  LB_TEMPLATES,
  LB_SCHEMES,
  getLbTemplate,
  getLbScheme,
} from "./templates-label";

const REGISTRY = {
  "visiting-card": {
    templates: VC_TEMPLATES,
    schemes: VC_SCHEMES,
    getTemplate: getVcTemplate,
    getScheme: getVcScheme,
    defaultScheme: "navy",
  },
  letterhead: {
    templates: LH_TEMPLATES,
    schemes: LH_SCHEMES,
    getTemplate: getLhTemplate,
    getScheme: getLhScheme,
    defaultScheme: "navy",
  },
  poster: {
    templates: PO_TEMPLATES,
    schemes: PO_SCHEMES,
    getTemplate: getPoTemplate,
    getScheme: getPoScheme,
    defaultScheme: "navy",
  },
  label: {
    templates: LB_TEMPLATES,
    schemes: LB_SCHEMES,
    getTemplate: getLbTemplate,
    getScheme: getLbScheme,
    defaultScheme: "navy",
  },
};

const FALLBACK = REGISTRY["visiting-card"];

export function templateSet(productId) {
  return REGISTRY[productId] || FALLBACK;
}

/* Build a template's scene(s), threading personalize-form values through.
 * Always returns { front, back } — back is null for single-sided templates — so
 * callers don't have to branch on doubleSided themselves. */
export function buildScenes(productId, templateId, schemeId, g, data) {
  const set = templateSet(productId);
  const tpl = set.getTemplate(templateId);
  if (!tpl || !g) return null;
  if (tpl.doubleSided) {
    const both = tpl.buildSides(g, data) || {};
    return { tpl, front: both.front || null, back: both.back || null };
  }
  return {
    tpl,
    front: tpl.build(set.getScheme(schemeId), g, data),
    back: null,
  };
}