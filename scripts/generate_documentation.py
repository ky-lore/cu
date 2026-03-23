import os
import sys
import re

def summarize_js_file(path):
    if not path.endswith(".js"):
        raise ValueError(f"Error: {path} is not a .js file")

    with open(path, "r", encoding="utf-8") as f:
        source = f.read()

    imports = re.findall(r'import\s+.*?from\s+[\'"](.*?)[\'"]', source)
    classes = re.findall(r'class\s+([A-Za-z0-9_]+)', source)
    functions = re.findall(r'function\s+([A-Za-z0-9_]+)\s*\(', source)

    summary = []
    summary.append(f"File: {os.path.basename(path)}")
    summary.append("")

    if imports:
        summary.append("Imports:")
        for imp in imports:
            summary.append(f"  - {imp}")
        summary.append("")

    if classes:
        summary.append("Classes:")
        for c in classes:
            summary.append(f"  - {c}")
        summary.append("")

    if functions:
        summary.append("Functions:")
        for fn in functions:
            summary.append(f"  - {fn}")
        summary.append("")

    if not (imports or classes or functions):
        summary.append("No imports, classes, or functions detected.")

    return "\n".join(summary)


if __name__ == "__main__":
    file_path = sys.argv[1]
    print(summarize_js_file(file_path))