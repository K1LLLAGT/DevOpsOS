# DevOpsOS Plugin Developer Guide

DevOpsOS supports plugins that extend panels, intelligence, and marketplace entries.

---

## Plugin Structure

Each plugin lives under:

```text
/plugins/<plugin-id>/
  manifest.json
  index.js        # or other entry file
