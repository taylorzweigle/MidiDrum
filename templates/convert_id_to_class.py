# Gregary C. Zweigle and Taylor Zweigle, 2020

# Read in the .svg file.
# Replace all "id" strings in id="......Ring....." with a "class" string.
# Also remove the extraneous _X_ that Illustrator appended.
# Write to the HTML file.

# The HTML file is not very big, so can read the
# entire file into a string without any memory issues.
with open("DrumSVG.svg", "r") as f:
    svg_file = f.read()

index = 0
substring = "id="
while index < len(svg_file):
    index = svg_file.find(substring, index)
    if index == -1:
        break
    # Get the first string location
    indexQuote0 = svg_file.find("\"", index)
    # Get the second string location
    indexQuote1 = svg_file.find("\"", indexQuote0 + 1)

    # Change id to class.
    # Algorithm (whew!):
    # Goto the starting location of id= and replace with class=
    # Then, move to the end of the Ring string and delete everything
    # after it until the second quote.
    indexRing = svg_file.find("Ring", indexQuote0, indexQuote1+1)
    if (indexRing != -1):
        new_string = svg_file[:index] + "class" + \
        svg_file[index+len(substring)-1:indexRing+len("Ring")] + \
        svg_file[indexQuote1:]
        svg_file = new_string

    index += len(substring)


# Write the SVG in between the start and end strings.
string_start = "<!--SVG-START-->"
string_end = "<!--SVG-END-->"

with open("MidiDrum.html", "r") as f:
    html_file = f.read()

with open("MidiDrum.html", "w") as f:
    index_write_start = html_file.find(string_start) + len(string_start) + 1
    index_write_end = html_file.find(string_end)
    write_string = html_file[:index_write_start] + svg_file + html_file[index_write_end:]
    f.write(write_string)