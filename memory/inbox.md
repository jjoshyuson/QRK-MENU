# Notes inbox

Use this file as the quick capture box for rough ideas, observations and questions from chat. Notes here are not approved requirements. When an idea becomes stable or affects the roadmap, summarize it in the relevant topic memory file and authoritative document, then mark the inbox entry as routed.

Keep entries short and dated. Preserve the original intent, label assumptions, and avoid turning tentative language into a decision.

## September 9, 2026 — Seamless QR access and trusted-customer ordering

Status: Captured and routed as a proposal to `memory/product.md`, `memory/decisions.md` and `docs/PRODUCT_PLAN.md`.

Raw idea, lightly cleaned up:

- Scanning a restaurant's QR code should open the menu immediately. Customers should not have to create an account just to browse.
- An account could unlock online ordering and payment, allowing a customer to order without going to the counter.
- An account alone may not provide enough protection against abuse or fraudulent orders for a small business.
- One possible model is business-approved access: a restaurant owner or admin approves accounts belonging to known regular customers. This would work like an optional VIP or trusted-customer program for participating businesses, not a requirement for every business or every menu visitor.
- The trust comes partly from the restaurant already knowing the customer, but the technical and operational security controls still need to be designed.

Questions to resolve before implementation:

- Is approval required to place any online order, only to pay online, or only to receive special privileges?
- Can guests still submit pay-at-counter orders?
- Who approves, suspends and removes trusted customers, and what evidence identifies the right person?
- Is trusted status specific to one business or portable across QRK MENU businesses?
- What protections are still required for account takeover, stolen phones, payment disputes, spam and compromised admin accounts?
- Does the VIP framing create too much friction or unfair exclusion for first-time customers?

