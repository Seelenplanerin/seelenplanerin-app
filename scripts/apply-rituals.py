#!/usr/bin/env python3
"""
Ersetzt die abschnitte-Blöcke aller 51 Rituale mit individuellen Texten.
Liest die Ritual-Daten aus rewrite-rituals-individual.py und wendet sie an.
"""
import re, sys, importlib.util

# Load the ritual data from the other script
spec = importlib.util.spec_from_file_location("rituals", "scripts/rewrite-rituals-individual.py")
mod = importlib.util.module_from_spec(spec)

# We only need the RITUALE dict, not the replacement logic
# So we'll extract it by exec'ing just the dict part
import ast

# Actually, let's just import the dict directly by reading the file
with open('scripts/rewrite-rituals-individual.py', 'r') as f:
    script_content = f.read()

# Extract RITUALE dict - it starts after "RITUALE = {" and ends before the script section
start = script_content.index('RITUALE = {')
# Find the end of the dict - look for the line starting with "# ═══" after the dict
end_marker = '# ═══════════════════════════════════════════════════════════════\n# SKRIPT'
end = script_content.index(end_marker)
# Go back to find the closing }
dict_str = script_content[start:end].rstrip().rstrip('\n')
# Make sure it ends with }
if not dict_str.endswith('}'):
    dict_str = dict_str + '\n}'

# Execute to get the dict
local_vars = {}
exec(dict_str, {}, local_vars)
RITUALE = local_vars['RITUALE']

print(f"Loaded {len(RITUALE)} ritual definitions")

# Read the TS file
with open('data/rituale-kalender.ts', 'r') as f:
    content = f.read()

replaced = 0
for ritual_id, data in RITUALE.items():
    intro = data["intro"]
    bullets = data["bullets"]
    schritte = data["schritte"]
    
    # Build new abschnitte block matching the exact TS format
    new_abschnitte = f'''abschnitte: [
      {{ typ: "intro", text: "{intro}" }},
      {{ typ: "h2", text: "Dein Ritual-Set enthält:" }},
      {{ typ: "bullet", text: "{bullets[0]}" }},
      {{ typ: "bullet", text: "{bullets[1]}" }},
      {{ typ: "bullet", text: "{bullets[2]}" }},
      {{ typ: "bullet", text: "{bullets[3]}" }},
      {{ typ: "h2", text: "Dein Ritual – Schritt für Schritt:" }},
      {{ typ: "schritt", text: "{schritte[0]}" }},
      {{ typ: "schritt", text: "{schritte[1]}" }},
      {{ typ: "schritt", text: "{schritte[2]}" }},
      {{ typ: "schritt", text: "{schritte[3]}" }},
      {{ typ: "schritt", text: "{schritte[4]}" }},'''
    
    # Find the affirmation for this ritual to preserve it
    aff_pattern = rf'id: "{ritual_id}".*?typ: "affirmation", text: "([^"]+)"'
    aff_match = re.search(aff_pattern, content, re.DOTALL)
    if aff_match:
        affirmation = aff_match.group(1)
        new_abschnitte += f'\n      {{ typ: "affirmation", text: "{affirmation}" }},'
    
    new_abschnitte += '\n    ],'
    
    # Pattern to match the entire abschnitte block
    pattern = rf'(id: "{ritual_id}".*?)abschnitte: \[.*?\],([ \t]*\n\s*materialien:)'
    
    def make_replacer(new_abs):
        def replacer(match):
            return match.group(1) + new_abs + match.group(2)
        return replacer
    
    new_content = re.sub(pattern, make_replacer(new_abschnitte), content, flags=re.DOTALL)
    if new_content != content:
        replaced += 1
        content = new_content
    else:
        print(f"WARNING: Could not replace ritual {ritual_id}")

# Write the result
with open('data/rituale-kalender.ts', 'w') as f:
    f.write(content)

print(f"Successfully replaced {replaced} of {len(RITUALE)} rituals")
if replaced < len(RITUALE):
    print(f"FAILED: {len(RITUALE) - replaced} rituals could not be replaced")
    sys.exit(1)
