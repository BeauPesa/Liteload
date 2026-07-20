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
    print("\n----- BEGIN EXTRACTED TEXT -----\n")
    print(text)
    print("\n----- END EXTRACTED TEXT -----\n")
    warehouse = "WAXIE Livermore" if "WAXIE Livermore" in text else ""
    carrier = ""
    for line in text.splitlines():
        if line.startswith("Carrier:"):
            carrier = line.replace("Carrier:", "").strip()
    print(f"Warehouse variable: '{warehouse}'")
    print(f"Carrier variable: '{carrier}'")
    result = {
    "source_file": pdf_path.name,

    "metadata": {
        "warehouse": warehouse,
        "route": carrier,
        "truck": "",
        "driver": "",
        "date": "",
        "totalCube": 0
    },

    "stops": [],

    "raw_text": text
}

    BASE_DIR = Path(__file__).resolve().parent
    OUTPUT_DIR = BASE_DIR / "output"
    OUTPUT_DIR.mkdir(exist_ok=True)

    output_filename = pdf_path.stem + ".json"
    output_path = OUTPUT_DIR / output_filename

    with output_path.open("w", encoding="utf-8") as f:
        json.dump(result, f, indent=2)

    print(f"✓ Created {output_path}")


if __name__ == "__main__":
    main()