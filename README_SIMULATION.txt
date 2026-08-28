TRAVEL COMMAND CENTRE — BATCH 1229 SCREENSHOT SIMULATION

Purpose: physical-iPad screenshot review of the current polished screens.
Simulation date: 10/07/2029
Current stay: Istanbul, Turkey

This build uses simulation-only local-storage and Service Worker cache namespaces and will not intentionally use the normal Travel Command Centre data or offline-cache namespaces.
It is seeded with several years of itinerary, reservations, expenses, calendar items, checklist items, Vault records and accounts.

The package is deliberately compact (under 100 files) while retaining the assets required by the seeded screenshot build and offline PWA shell.

BATCH 1229 CONSOLIDATED CORRECTIONS
- Preserves all Batch 1228 visual and runtime corrections, including isolated Simulation storage/cache namespaces.
- Hidden emails remain locked to: unlock The Vault -> open Streaming -> tap the Travel Command Centre compass/logo.
- Hidden email manager remains above Streaming with navigation visible.
- Add Expense remains Destination Budget only; Reservations retain Annual/Destination allocation choice, including Accommodation.
- Australian DD/MM/YYYY presentation is standardised across primary and secondary date editors/filters.
- To Book simulation reminders remain To Book after hydration; no default time is injected.
- Future Bookings keyboard activation and disclosure semantics corrected.
- Tap-to-edit and expandable-card keyboard behaviour corrected without changing touch behaviour.
- Expanded readability panels return focus correctly on Escape, Close and backdrop dismissal.
- Calendar/Vault/Reservation disclosure control relationships corrected.
- Map editing modes, itinerary marker mode, current-selection controls and filter states announce their state correctly.
- Reservation Active/Upcoming default-filter and Clear Filters logic corrected.
- Journey History disclosure rows now expose a valid aria-controls relationship to their expanded details.
- Dead portrait-dimension startup-image rules incorrectly marked landscape were removed.
- Approved screen/widget colours are unchanged.
