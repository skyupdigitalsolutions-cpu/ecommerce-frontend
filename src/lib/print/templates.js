/* Per-product template registry. The editor is one shared route, so it looks up
 * the right template list, scheme list and resolvers by product id here instead
 * of importing a single product's templates directly. */

import {
  VC_TEMPLATES, VC_SCHEMES, getVcTemplate, getVcScheme,
} from "./templates-vc";
import {
  LH_TEMPLATES, LH_SCHEMES, getLhTemplate, getLhScheme,
} from "./templates-letterhead";

/* Products with an editor but no ready-made templates yet. Without an explicit
 * entry they would fall through to FALLBACK and be offered visiting-card
 * templates, which are drawn for an 89x54mm canvas and look wrong anywhere else.
 * The editor hides its Templates button when this list is empty. */
const NO_TEMPLATES = {
  templates: [],
  schemes: VC_SCHEMES,
  getTemplate: () => null,
  getScheme: getVcScheme,
  defaultScheme: "navy",
};

const REGISTRY = {
  "visiting-card": {
    templates: VC_TEMPLATES,
    schemes: VC_SCHEMES,
    getTemplate: getVcTemplate,
    getScheme: getVcScheme,
    defaultScheme: "navy",
  },
  "letterhead": {
    templates: LH_TEMPLATES,
    schemes: LH_SCHEMES,
    getTemplate: getLhTemplate,
    getScheme: getLhScheme,
    defaultScheme: "navy",
  },
  "poster": NO_TEMPLATES,
  "label": NO_TEMPLATES,
};

const FALLBACK = REGISTRY["visiting-card"];

export function templateSet(productId) {
  return REGISTRY[productId] || FALLBACK;
}