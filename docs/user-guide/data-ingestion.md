Data Ingestion (Knowledge Base)

Overview
- Import trusted public datasets into the `MedicalKnowledge` collection to power RAG and search.
- Recommended sources: MeSH (NLM), RxTerms (NLM). Optional custom CSV importer included.

Prerequisites
- Ensure MongoDB is running and `backend/.env` has a valid `MONGODB_URI`.
- From `backend`, run `npm install` to install `xml2js` and `csv-parse`.

MeSH (Descriptors)
- Download: https://nlmpubs.nlm.nih.gov/mesh/MESH_FILES/xmlmesh/desc2024.xml
- Place at: `database/migrations/mesh/desc2024.xml`
- Import: from `backend` run `npm run import:mesh`
- Mapping:
  - Tree number prefix A → `anatomy`, C → `disease`, D → `medication`, E → `procedure`, else `general`.
  - Uses `ScopeNote` as the definition/description where available; includes concept synonyms.

RxTerms (Medications)
- Download CSV from: https://mor.nlm.nih.gov/RxNav/downloads.html
- Place at: `database/migrations/rxterms/rxterms.csv`
- Import: from `backend` run `npm run import:rxterms`
- Mapping: term from `FULL_NAME`/`GENERIC_NAME`/`BRAND_NAME`; category `medication`; includes synonyms and basic description.

Custom CSV
- Prepare CSV with: `term,category,definition,description,synonyms,relatedTerms,source_name,source_url`
- Place at: `database/seeds/custom_terms.csv`
- Import: from `backend` run `npm run import:csv`
- Notes: `synonyms`/`relatedTerms` support `;` or `|` as delimiters.

Verification
- Test retrieval: `GET /api/medical/search?query=hypertension` or any imported term.
- Chat grounding: ask related questions; the backend injects top KB snippets.

Licensing
- MeSH and RxTerms are provided by the U.S. National Library of Medicine and are free to use; retain provenance in `sources`.
- For other datasets, verify licenses before redistribution.

