#!/usr/bin/env bash
set -euo pipefail
ROOT="${1:-$PWD}"
MANIFEST="$ROOT/.devopsos-manifest"
find "$ROOT" -type f \
  ! -path "*/node_modules/*" \
  ! -path "*/.git/*" \
  ! -path "*/.gradle/*" \
  ! -name ".devopsos-manifest" \
  -print0 | while IFS= read -r -d "" f; do
    rel="${f#$ROOT/}"
    sha256sum "$f" | awk -v r="$rel" "{print \$1\" \"r}"
  done > "$MANIFEST"
echo "Manifest written to $MANIFEST"
