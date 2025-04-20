tree -I "node_modules"

find . -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.html" -o -name "*.css" \) -not -path "*/node_modules/*" -not -name "package-lock.json" | xargs -I{} sh -c 'echo -e "\n\n\033[1;32m=== {} ===\033[0m\n"; cat {}'