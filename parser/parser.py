from pathlib import Path
import json
import sys

from pypdf import PdfReader


def extract_text(pdf_path: Path) -> str:
    reader = PdfReader(str(pdf_path))
    return "\n".join(page.extract_text() or "" for page in reader.pages)


def main():
    if len(sys.argv) != 2:
        print("Usage: python3 parser.py input/file.pdf")
        return

    pdf_path = Path(sys.argv[1])

    text = extract_text(pdf_path)

    result = {
        "source_file": pdf_path.name,
        "raw_text": text
    }

    output_path = Path("output") / f"{pdf_path.stem}.json"

    with output_path.open("w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print(f"✓ Created {output_path}")


if __name__ == "__main__":
    main()