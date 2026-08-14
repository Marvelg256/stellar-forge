export type ComponentStatus = "Concept";

export interface StellarComponent {
  slug: string;
  name: string;
  description: string;
  category: string;
  status: ComponentStatus;
  shortDescription: string;
  overview: string;
  useCases: string[];
}

export const stellarComponents: StellarComponent[] = [
  {
    slug: "token",
    name: "Token",
    description:
      "A fungible token pattern for issuing and transferring balances on Soroban.",
    category: "Tokens",
    status: "Concept",
    shortDescription: "Fungible token pattern",
    overview:
      "A reusable pattern for representing, issuing, and transferring fungible assets in a Soroban-based application.",
    useCases: [
      "Create a reusable token structure",
      "Transfer balances between addresses",
      "Understand the basic Soroban token pattern",
    ],
  },

  {
    slug: "payment",
    name: "Payment",
    description:
      "A minimal pattern for building and submitting a Stellar payment.",
    category: "Payments",
    status: "Concept",
    shortDescription: "Stellar payment pattern",
    overview:
      "A simple pattern for working with Stellar payments and understanding the structure behind a payment flow.",
    useCases: [
      "Build a basic Stellar payment flow",
      "Understand payment transaction structure",
      "Adapt the pattern for application-specific payments",
    ],
  },

  {
    slug: "access-control",
    name: "Access Control",
    description:
      "Role- and permission-based access checks for a Soroban contract.",
    category: "Security",
    status: "Concept",
    shortDescription: "Role and permission checks",
    overview:
      "A reusable authorization pattern for controlling which addresses can perform specific contract operations.",
    useCases: [
      "Restrict contract operations",
      "Define role-based permissions",
      "Understand authorization patterns in Soroban",
    ],
  },

  {
    slug: "escrow",
    name: "Escrow",
    description:
      "Holds funds until a defined condition or set of signers releases them.",
    category: "Payments",
    status: "Concept",
    shortDescription: "Conditional fund release",
    overview:
      "A pattern for holding funds under defined conditions before allowing them to be released to the intended parties.",
    useCases: [
      "Hold funds between multiple parties",
      "Release funds after defined conditions",
      "Explore conditional payment workflows",
    ],
  },

  {
    slug: "subscription",
    name: "Subscription",
    description:
      "A recurring-payment pattern for periodic, agreed-upon transfers.",
    category: "Payments",
    status: "Concept",
    shortDescription: "Recurring payment pattern",
    overview:
      "A reusable pattern for representing recurring payments between an authorized payer and a service or recipient.",
    useCases: [
      "Model recurring payments",
      "Define payment intervals",
      "Explore automated payment workflows",
    ],
  },

  {
    slug: "multi-signature",
    name: "Multi-signature",
    description:
      "Requires multiple approving signers before a transaction executes.",
    category: "Security",
    status: "Concept",
    shortDescription: "Multiple signer approval",
    overview:
      "A security pattern that requires multiple authorized parties to approve an operation before it can execute.",
    useCases: [
      "Require multiple approvals",
      "Build shared-control workflows",
      "Explore multi-party transaction authorization",
    ],
  },
];

export const componentCategories = [
  "All",
  "Tokens",
  "Payments",
  "Security",
] as const;

export function getComponentBySlug(slug: string) {
  return stellarComponents.find((component) => component.slug === slug);
}