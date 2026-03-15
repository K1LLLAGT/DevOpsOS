#!/usr/bin/env bash
NAME="$1"
ROOT="${DEVOPSOS_ROOT:-$HOME/DevOpsOS}"

DIR="$ROOT/plugins/$NAME"
mkdir -p "$DIR"

cat > "$DIR/plugin.json" <<EOF
{
  "id": "$NAME",
  "name": "$NAME",
  "version": "1.0.0",
  "description": "",
  "entry": "index.js"
}
EOF

echo "module.exports = () => { console.log('Plugin $NAME loaded'); };" > "$DIR/index.js"

mkdir -p "$DIR/tests"

echo "Plugin $NAME created at $DIR"
