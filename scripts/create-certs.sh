#!/bin/bash

PRIVATE_PEM="${PRIVATE_PEM:-private.pem}"
PUBLIC_PEM="${PUBLIC_PEM:-public.pem}"

# Parse arguments
OVERWRITE_PEM=false
ADD_TO_ENV=false
HELP=false
for arg in "$@"; do
  case "$arg" in
    --overwrite)
      OVERWRITE_PEM=true
      ;;
    --add-to-env)
      ADD_TO_ENV=true
      ;;
    --help)
      HELP=true
      ;;
  esac
done

if [ "$HELP" = true ]; then
  echo "Usage: $0 [--add-to-env] [--help]"
  echo ""
  echo "Options:"
  echo "  --overwrite     Overwrite existing PEM files if they exist."
  echo "  --add-to-env   Add the generated keys to the .env file in single-line format."
  echo "  --help         Show this help message."
  exit 0
fi


if [ -f "${PRIVATE_PEM}" ] || [ -f "${PUBLIC_PEM}" ]; then
  if [ "$OVERWRITE_PEM" = true ]; then
    echo "Overwriting existing PEM files..."
  else
    echo "Error: ${PRIVATE_PEM} or ${PUBLIC_PEM} already exists. Use --overwrite to overwrite." >&2
    exit 1
  fi
fi

openssl genrsa -out ${PRIVATE_PEM} 2048
openssl rsa -in ${PRIVATE_PEM} -pubout -out ${PUBLIC_PEM}

# Convert to single-line format for .env
echo "Private Pem (${PRIVATE_PEM}): "
echo ''
awk '{printf "%s\\n", $0}' "${PRIVATE_PEM}"
echo ''
echo ''
echo -n "Public Pem (${PUBLIC_PEM}): "
echo ''
awk '{printf "%s\\n", $0}' "${PUBLIC_PEM}"
echo ''

# Add to the .env file if requested and it exists:
if [ "$ADD_TO_ENV" = true ] && [ -f ".env" ]; then
  echo "Adding to .env file..."
  PRIVATE_LINE=$(awk '{printf "%s\\n", $0}' "${PRIVATE_PEM}")
  PUBLIC_LINE=$(awk '{printf "%s\\n", $0}' "${PUBLIC_PEM}")

  # Detect BSD (macOS) vs GNU sed for the -i flag
  if sed --version >/dev/null 2>&1; then
    SED_INPLACE=(-i)          # GNU sed
  else
    SED_INPLACE=(-i '')       # BSD/macOS sed
  fi

  sed "${SED_INPLACE[@]}" '/^NUXT_PRIVATE_KEY=/d' .env
  sed "${SED_INPLACE[@]}" '/^NUXT_PUBLIC_KEY=/d' .env

  printf 'NUXT_PRIVATE_KEY="%s"\n' "${PRIVATE_LINE}" >> .env
  printf 'NUXT_PUBLIC_KEY="%s"\n' "${PUBLIC_LINE}" >> .env
  echo "Done."
elif [ "$ADD_TO_ENV" = true ] && [ ! -f ".env" ]; then
  echo "Warning: --add-to-env was passed but no .env file was found. Skipping." >&2
fi
