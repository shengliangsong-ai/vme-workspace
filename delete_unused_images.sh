#!/bin/bash
USED_IMAGES=$(grep -o 'image: "[^"]*"' src/components/SelfDemo.tsx | awk -F'"' '{print $2}' | sed 's|^/||')

# Find all PNGs in public/
find public -type f -name "*.png" | while read -r img; do
  # Remove "public/" prefix to compare
  REL_IMG=${img#public/}
  
  # Check if REL_IMG is in USED_IMAGES
  if echo "$USED_IMAGES" | grep -Fqx "$REL_IMG"; then
    echo "Keeping: $img"
  else
    echo "Deleting unused: $img"
    rm "$img"
  fi
done
