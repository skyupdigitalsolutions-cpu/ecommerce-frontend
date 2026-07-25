/* Per-product template registry. The editor is one shared route, so it looks up
 * the right template list, scheme list and resolvers by product id here instead
 * of importing a single product's templates directly. */

import {
  VC_TEMPLATES, VC_SCHEMES, getVcTemplate, getVcScheme,
} from "./templates-vc";
import {
  LH_TEMPLATES, LH_SCHEMES, getLhTemplate, getLhScheme,
} from "./templates-letterhead";

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
};

const FALLBACK = REGISTRY["visiting-card"];

export function templateSet(productId) {
  return REGISTRY[productId] || FALLBACK;
}