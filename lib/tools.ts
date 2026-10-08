import type { CategoryId } from "./categories";

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface Tool {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  category: CategoryId;
  keywords: string[];
  /** Key used to dynamically load the tool's client component. */
  component: string;
  /** Runs entirely in the browser, no file/data upload to a server. */
  localOnly: boolean;
  featured?: boolean;
  popularity: number; // 0-100, used for sorting/"popular" surfaces
  relatedToolIds?: string[];
  instructions: string[];
  faqs: ToolFaq[];
}

export const tools: Tool[] = [
  // ---------------- Developer Tools ----------------
  {
    id: "json-formatter",
    slug: "json-formatter",
    name: "JSON Formatter & Validator",
    shortDescription: "Format, validate, and minify JSON instantly.",
    description:
      "Paste any JSON payload to pretty-print it with consistent indentation, validate its syntax, or minify it for transport. Errors point to the exact line and column that failed to parse.",
    category: "developer",
    keywords: ["json", "format", "validate", "minify", "pretty print"],
    component: "JsonFormatter",
    localOnly: true,
    featured: true,
    popularity: 96,
    instructions: [
      "Paste or type your JSON into the input panel.",
      "Choose Format to pretty-print it, or Minify to compress it onto one line.",
      "Validation errors, if any, appear below the input with the line and column.",
      "Use Copy to copy the result, or Clear to start over.",
    ],
    faqs: [
      {
        question: "Does my JSON get uploaded anywhere?",
        answer:
          "No. Parsing and formatting happen entirely in your browser using the built-in JSON engine — nothing is sent to a server.",
      },
      {
        question: "Why does it say my JSON is invalid?",
        answer:
          "Common causes are trailing commas, single quotes instead of double quotes, or unquoted keys. The error message includes the position where parsing failed.",
      },
    ],
  },
  {
    id: "base64-encoder",
    slug: "base64-encoder-decoder",
    name: "Base64 Encoder / Decoder",
    shortDescription: "Encode text to Base64 or decode it back.",
    description:
      "Convert plain text or UTF-8 strings to Base64 and back. Useful for quick debugging of tokens, headers, and encoded payloads.",
    category: "developer",
    keywords: ["base64", "encode", "decode"],
    component: "Base64Tool",
    localOnly: true,
    popularity: 82,
    instructions: [
      "Type or paste text into the input.",
      "Switch between Encode and Decode mode.",
      "The result updates instantly and can be copied with one click.",
    ],
    faqs: [
      {
        question: "What happens if I decode invalid Base64?",
        answer:
          "The tool shows a clear error message instead of a broken result, so you know the input wasn't valid Base64.",
      },
    ],
  },
  {
    id: "url-encoder",
    slug: "url-encoder-decoder",
    name: "URL Encoder / Decoder",
    shortDescription: "Percent-encode or decode URLs and query strings.",
    description:
      "Safely encode special characters for use in URLs, or decode a percent-encoded string back to plain text.",
    category: "developer",
    keywords: ["url", "uri", "encode", "decode", "percent encoding"],
    component: "UrlEncoderTool",
    localOnly: true,
    popularity: 68,
    instructions: [
      "Enter a URL, path, or query string.",
      "Choose Encode to percent-encode reserved characters, or Decode to reverse it.",
    ],
    faqs: [],
  },
  {
    id: "uuid-generator",
    slug: "uuid-generator",
    name: "UUID Generator",
    shortDescription: "Generate random UUID v4 identifiers.",
    description:
      "Generate one or many RFC 4122 version-4 UUIDs using your browser's cryptographically secure random number generator.",
    category: "developer",
    keywords: ["uuid", "guid", "generator", "unique id"],
    component: "UuidGenerator",
    localOnly: true,
    popularity: 74,
    instructions: [
      "Choose how many UUIDs you need.",
      "Select Generate to create fresh values.",
      "Copy a single value or all of them at once.",
    ],
    faqs: [
      {
        question: "Are these UUIDs safe to use as real identifiers?",
        answer:
          "Yes. They're generated with the Web Crypto API's cryptographically secure random source and follow the UUID v4 format.",
      },
    ],
  },
  {
    id: "hash-generator",
    slug: "hash-generator",
    name: "Hash Generator",
    shortDescription: "Generate SHA-1, SHA-256, and SHA-512 hashes.",
    description:
      "Compute cryptographic hashes of any text using the browser's Web Crypto API, entirely on your device.",
    category: "developer",
    keywords: ["hash", "sha256", "sha1", "sha512", "checksum"],
    component: "HashGenerator",
    localOnly: true,
    featured: true,
    popularity: 71,
    instructions: [
      "Type or paste the text you want to hash.",
      "Pick an algorithm: SHA-1, SHA-256, or SHA-512.",
      "The hash updates as you type and can be copied instantly.",
    ],
    faqs: [
      {
        question: "Why isn't MD5 available?",
        answer:
          "Browsers' native Web Crypto API does not implement MD5 because it's cryptographically broken. This tool only offers modern SHA algorithms.",
      },
    ],
  },
  {
    id: "timestamp-converter",
    slug: "timestamp-converter",
    name: "Timestamp Converter",
    shortDescription: "Convert between Unix timestamps and readable dates.",
    description:
      "Convert Unix epoch timestamps (seconds or milliseconds) to human-readable dates in your local timezone and UTC, or the other way around.",
    category: "developer",
    keywords: ["unix timestamp", "epoch", "date converter"],
    component: "TimestampConverter",
    localOnly: true,
    popularity: 65,
    instructions: [
      "Enter a Unix timestamp, or use Now to fill in the current time.",
      "Read the converted value in local time and UTC.",
      "Switch to date input to convert a calendar date back to a timestamp.",
    ],
    faqs: [],
  },
  {
    id: "jwt-decoder",
    slug: "jwt-decoder",
    name: "JWT Decoder",
    shortDescription: "Decode a JSON Web Token's header and payload.",
    description:
      "Paste a JWT to inspect its header and payload as formatted JSON. This tool only decodes — it never verifies a signature or contacts a server, so it's safe for tokens containing sensitive data.",
    category: "developer",
    keywords: ["jwt", "json web token", "decode", "auth"],
    component: "JwtDecoder",
    localOnly: true,
    popularity: 63,
    instructions: [
      "Paste a JWT (three Base64 segments separated by dots).",
      "The header and payload are decoded and formatted automatically.",
      "This tool does not verify signatures — it only decodes the readable parts.",
    ],
    faqs: [
      {
        question: "Is my token sent anywhere?",
        answer:
          "No. Decoding happens locally in your browser. Even so, avoid pasting production tokens into any third-party tool unless you trust it.",
      },
    ],
  },
  {
    id: "regex-tester",
    slug: "regex-tester",
    name: "Regex Tester",
    shortDescription: "Test regular expressions against sample text.",
    description:
      "Write a regular expression and test it live against sample text, with matches highlighted and capture groups listed.",
    category: "developer",
    keywords: ["regex", "regular expression", "pattern matching"],
    component: "RegexTester",
    localOnly: true,
    popularity: 69,
    instructions: [
      "Enter a pattern and choose flags (g, i, m, s).",
      "Paste sample text to test against.",
      "Matches are highlighted inline, with capture groups listed below.",
    ],
    faqs: [],
  },

  // ---------------- Text Tools ----------------
  {
    id: "word-counter",
    slug: "word-counter",
    name: "Word & Character Counter",
    shortDescription: "Count words, characters, sentences, and reading time.",
    description:
      "Get a live count of words, characters (with and without spaces), sentences, paragraphs, and estimated reading time as you type or paste text.",
    category: "text",
    keywords: ["word count", "character count", "reading time"],
    component: "WordCounter",
    localOnly: true,
    featured: true,
    popularity: 88,
    instructions: [
      "Paste or type text into the box.",
      "Counts update live below the input.",
    ],
    faqs: [],
  },
  {
    id: "case-converter",
    slug: "case-converter",
    name: "Case Converter",
    shortDescription: "Convert text to upper, lower, title, or sentence case.",
    description:
      "Switch text between UPPERCASE, lowercase, Title Case, Sentence case, and camelCase in one click.",
    category: "text",
    keywords: ["case converter", "uppercase", "lowercase", "title case"],
    component: "CaseConverter",
    localOnly: true,
    popularity: 60,
    instructions: [
      "Paste your text.",
      "Choose a case style to convert it instantly.",
    ],
    faqs: [],
  },
  {
    id: "remove-duplicate-lines",
    slug: "remove-duplicate-lines",
    name: "Remove Duplicate Lines",
    shortDescription: "Strip duplicate lines from a list of text.",
    description:
      "Paste a list and remove exact duplicate lines, with an option to ignore case and trim whitespace before comparing.",
    category: "text",
    keywords: ["duplicate lines", "unique lines", "deduplicate"],
    component: "RemoveDuplicateLines",
    localOnly: true,
    popularity: 54,
    instructions: [
      "Paste a list with one item per line.",
      "Optionally ignore case when comparing lines.",
      "Duplicates are removed, keeping the first occurrence.",
    ],
    faqs: [],
  },
  {
    id: "text-sorter",
    slug: "text-sorter",
    name: "Text Line Sorter",
    shortDescription: "Sort lines alphabetically, numerically, or by length.",
    description:
      "Sort a list of lines A-Z, Z-A, numerically, by length, or shuffle them randomly.",
    category: "text",
    keywords: ["sort lines", "alphabetize", "text sorter"],
    component: "TextSorter",
    localOnly: true,
    popularity: 48,
    instructions: [
      "Paste lines of text, one per line.",
      "Choose a sort order.",
    ],
    faqs: [],
  },
  {
    id: "lorem-ipsum-generator",
    slug: "lorem-ipsum-generator",
    name: "Lorem Ipsum Generator",
    shortDescription: "Generate placeholder text by paragraphs or words.",
    description:
      "Generate classic Lorem Ipsum placeholder text in paragraphs, sentences, or a fixed word count for mockups and layouts.",
    category: "text",
    keywords: ["lorem ipsum", "placeholder text", "filler text"],
    component: "LoremIpsumGenerator",
    localOnly: true,
    popularity: 57,
    instructions: [
      "Choose paragraphs, sentences, or words, and set a count.",
      "Select Generate, then copy the result.",
    ],
    faqs: [],
  },
  {
    id: "text-cleaner",
    slug: "text-cleaner",
    name: "Text Cleaner",
    shortDescription: "Remove unwanted characters, markdown formatting, and extra spaces from text.",
    description:
      "Clean up messy text by removing unwanted symbols, markdown formatting, extra spaces, and non-printable characters without changing your paragraphs or structure.",
    category: "text",
    keywords: ["text cleaner", "whitespace remover", "clean text"],
    component: "TextCleaner",
    localOnly: true,
    popularity: 45,
    instructions: [
      "Paste text that needs cleanup.",
      "Toggle which cleaning rules to apply.",
      "Copy the cleaned result.",
    ],
    faqs: [],
  },

  // ---------------- Converter Tools ----------------
  {
    id: "length-converter",
    slug: "length-converter",
    name: "Length Converter",
    shortDescription: "Convert between metric and imperial length units.",
    description:
      "Convert millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles instantly.",
    category: "converter",
    keywords: ["length converter", "meters to feet", "unit converter"],
    component: "LengthConverter",
    localOnly: true,
    popularity: 58,
    instructions: [
      "Enter a value and choose the source unit.",
      "All other units update automatically.",
    ],
    faqs: [],
  },
  {
    id: "weight-converter",
    slug: "weight-converter",
    name: "Weight Converter",
    shortDescription: "Convert between kilograms, pounds, and more.",
    description:
      "Convert grams, kilograms, ounces, pounds, and stone instantly, in both directions.",
    category: "converter",
    keywords: ["weight converter", "kg to lbs", "mass converter"],
    component: "WeightConverter",
    localOnly: true,
    popularity: 55,
    instructions: [
      "Enter a value and choose the source unit.",
      "All other units update automatically.",
    ],
    faqs: [],
  },
  {
    id: "temperature-converter",
    slug: "temperature-converter",
    name: "Temperature Converter",
    shortDescription: "Convert Celsius, Fahrenheit, and Kelvin.",
    description:
      "Convert between Celsius, Fahrenheit, and Kelvin with a single input.",
    category: "converter",
    keywords: ["temperature converter", "celsius to fahrenheit"],
    component: "TemperatureConverter",
    localOnly: true,
    featured: true,
    popularity: 62,
    instructions: ["Enter a temperature in any unit to see the others."],
    faqs: [],
  },
  {
    id: "data-storage-converter",
    slug: "data-storage-converter",
    name: "Data Storage Converter",
    shortDescription: "Convert bytes, KB, MB, GB, and TB.",
    description:
      "Convert between bits, bytes, kilobytes, megabytes, gigabytes, and terabytes using base-1024 or base-1000 conventions.",
    category: "converter",
    keywords: ["byte converter", "mb to gb", "storage converter"],
    component: "DataStorageConverter",
    localOnly: true,
    popularity: 47,
    instructions: [
      "Enter a value and choose the unit and base (1024 or 1000).",
      "All other units update automatically.",
    ],
    faqs: [],
  },

  // ---------------- Calculator Tools ----------------
  {
    id: "calculator-hub",
    slug: "calculator-hub",
    name: "All-in-One Calculator",
    shortDescription: "Access over 30 calculators for math, finance, health, and more in one place.",
    description:
      "A comprehensive suite of calculators covering everything from basic math and fractions to compound interest, BMI, unit conversions, and GPA calculations. Switch instantly between tools without reloading.",
    category: "calculator",
    keywords: ["calculator hub", "all in one calculator", "scientific calculator", "finance calculator"],
    component: "CalculatorHub",
    localOnly: true,
    featured: true,
    popularity: 95,
    instructions: [],
    faqs: [],
  },
  {
    id: "percentage-calculator",
    slug: "percentage-calculator",
    name: "Percentage Calculator",
    shortDescription: "Calculate percentages, increases, and decreases.",
    description:
      "Solve the three most common percentage problems: what is X% of Y, what percent X is of Y, and percentage change between two numbers.",
    category: "calculator",
    keywords: ["percentage calculator", "percent change"],
    component: "PercentageCalculator",
    localOnly: true,
    featured: true,
    popularity: 79,
    instructions: [
      "Choose the type of calculation you need.",
      "Fill in the values — the result updates instantly.",
    ],
    faqs: [],
  },
  {
    id: "age-calculator",
    slug: "age-calculator",
    name: "Age Calculator",
    shortDescription: "Calculate exact age in years, months, and days.",
    description:
      "Calculate exact age, or the time between two dates, down to years, months, and days.",
    category: "calculator",
    keywords: ["age calculator", "date of birth"],
    component: "AgeCalculator",
    localOnly: true,
    popularity: 66,
    instructions: [
      "Enter a date of birth.",
      "Optionally change the 'as of' date from today.",
    ],
    faqs: [],
  },
  {
    id: "bmi-calculator",
    slug: "bmi-calculator",
    name: "BMI Calculator",
    shortDescription: "Calculate body mass index from height and weight.",
    description:
      "Calculate Body Mass Index (BMI) using metric or imperial units, with the standard BMI category shown alongside the result.",
    category: "calculator",
    keywords: ["bmi calculator", "body mass index"],
    component: "BmiCalculator",
    localOnly: true,
    popularity: 61,
    instructions: [
      "Enter your height and weight in metric or imperial units.",
      "Your BMI and category appear instantly.",
    ],
    faqs: [
      {
        question: "Is BMI a complete measure of health?",
        answer:
          "No. BMI is a simple screening measure and doesn't account for muscle mass, body composition, or individual health factors. Use it as one data point, not a diagnosis.",
      },
    ],
  },
  {
    id: "date-difference-calculator",
    slug: "date-difference-calculator",
    name: "Date Difference Calculator",
    shortDescription: "Calculate the days, weeks, or months between two dates.",
    description:
      "Find the exact number of days, weeks, months, and years between any two dates.",
    category: "calculator",
    keywords: ["date difference", "days between dates"],
    component: "DateDifferenceCalculator",
    localOnly: true,
    popularity: 52,
    instructions: [
      "Choose a start date and an end date.",
      "The difference is broken down into years, months, and days.",
    ],
    faqs: [],
  },

  // ---------------- Image Tools ----------------
  {
    id: "image-compressor",
    slug: "image-compressor",
    name: "Image Compressor",
    shortDescription: "Reduce image file size directly in your browser.",
    description:
      "Compress JPEG, PNG, and WebP images by adjusting quality, right in your browser. Files are processed locally using the canvas API and never uploaded.",
    category: "image",
    keywords: ["image compressor", "reduce image size", "compress photo"],
    component: "ImageCompressor",
    localOnly: true,
    featured: true,
    popularity: 84,
    instructions: [
      "Drop an image or choose a file.",
      "Adjust the quality slider and compare the estimated file size.",
      "Download the compressed result.",
    ],
    faqs: [
      {
        question: "Is my image uploaded to a server?",
        answer:
          "No. Compression happens locally in your browser using the canvas API — the image file never leaves your device.",
      },
    ],
  },
  {
    id: "image-resizer",
    slug: "image-resizer",
    name: "Image Resizer",
    shortDescription: "Resize images to exact dimensions locally.",
    description:
      "Resize an image to specific pixel dimensions or a percentage scale, with an option to preserve the original aspect ratio.",
    category: "image",
    keywords: ["image resizer", "resize photo", "scale image"],
    component: "ImageResizer",
    localOnly: true,
    popularity: 73,
    instructions: [
      "Drop an image or choose a file.",
      "Enter target dimensions or a scale percentage.",
      "Download the resized image.",
    ],
    faqs: [],
  },
  {
    id: "image-format-converter",
    slug: "image-format-converter",
    name: "Image Format Converter",
    shortDescription: "Convert images between JPG, PNG, and WebP.",
    description:
      "Convert an image between JPEG, PNG, and WebP formats locally in your browser.",
    category: "image",
    keywords: ["jpg to png", "png to jpg", "image converter", "webp"],
    component: "ImageFormatConverter",
    localOnly: true,
    popularity: 70,
    instructions: [
      "Drop an image or choose a file.",
      "Choose the output format.",
      "Download the converted file.",
    ],
    faqs: [],
  },
  {
    id: "base64-image-converter",
    slug: "base64-image-converter",
    name: "Base64 Image Converter",
    shortDescription: "Convert images to and from Base64 data URLs.",
    description:
      "Convert an image file into a Base64-encoded data URL for embedding in CSS or HTML, or paste a data URL to preview and download it as a file.",
    category: "image",
    keywords: ["base64 image", "data url", "image to base64"],
    component: "Base64ImageConverter",
    localOnly: true,
    popularity: 49,
    instructions: [
      "Drop an image to convert it to a Base64 data URL, or paste an existing data URL to decode it.",
      "Copy the result or download the decoded image.",
    ],
    faqs: [],
  },

  // ---------------- Document Tools ----------------
  {
    id: "pdf-merger",
    slug: "pdf-merger",
    name: "PDF Merger",
    shortDescription: "Combine multiple PDFs into a single file.",
    description:
      "Combine two or more PDF files into a single document, in the order you choose. Everything happens in your browser \u2014 files are never uploaded to a server.",
    category: "document",
    keywords: ["pdf merger", "combine pdf", "join pdf files"],
    component: "PdfMerger",
    localOnly: true,
    featured: true,
    popularity: 80,
    instructions: [
      "Add two or more PDF files, either one at a time or by selecting several at once.",
      "Drag the list to reorder files \u2014 they'll be merged in that order.",
      "Select Merge, then download the combined PDF.",
    ],
    faqs: [
      {
        question: "Is there a limit to how many files I can merge?",
        answer:
          "There's no hard limit in the tool itself, but very large files may be slow to process since everything runs in your browser's memory rather than on a server.",
      },
      {
        question: "Does merging affect the quality of the original pages?",
        answer:
          "No. Pages are copied into the new file as-is, so text, images, and formatting stay exactly as they were in the source PDFs.",
      },
    ],
  },
  {
    id: "pdf-splitter",
    slug: "pdf-splitter",
    name: "PDF Splitter",
    shortDescription: "Split a PDF into separate single-page files.",
    description:
      "Split a multi-page PDF into individual single-page PDF files, downloaded together as a ZIP archive.",
    category: "document",
    keywords: ["pdf splitter", "split pdf", "extract pdf pages"],
    component: "PdfSplitter",
    localOnly: true,
    popularity: 62,
    instructions: [
      "Upload a PDF file.",
      "Select Split \u2014 every page becomes its own PDF.",
      "Download the ZIP file containing all the split pages.",
    ],
    faqs: [
      {
        question: "Can I extract just a few pages instead of splitting the whole file?",
        answer:
          "For pulling out a specific page range as one file, use the PDF page extractor behavior built into this tool's advanced options, or merge the pages you want back together afterward with the PDF Merger.",
      },
    ],
  },
  {
    id: "pdf-to-word",
    slug: "pdf-to-word",
    name: "PDF to Word",
    shortDescription: "Convert a PDF into an editable, formatted Word document.",
    description:
      "Convert a PDF into an editable .docx Word document that keeps its structure \u2014 headings, bold and italic text, and bulleted or numbered lists come through as real, editable Word formatting, not one flat block of text.",
    category: "document",
    keywords: ["pdf to word", "pdf to docx", "convert pdf to word"],
    component: "PdfToWord",
    localOnly: true,
    featured: true,
    popularity: 85,
    instructions: [
      "Upload a PDF file.",
      "Select Convert to Word \u2014 the tool analyzes each page's layout before generating the document.",
      "Download the resulting .docx file and continue editing it in Word or Google Docs.",
    ],
    faqs: [
      {
        question: "What formatting actually carries over?",
        answer:
          "The tool analyzes font size and weight to tell headings apart from body text, applies real Word Heading styles, keeps bold and italic text as actual character formatting (not plain text), reconstructs paragraph breaks from line spacing instead of guessing, and converts bulleted or numbered lines into genuine, editable Word lists.",
      },
      {
        question: "What doesn't carry over yet?",
        answer:
          "Tables, images, multi-column layouts, headers/footers, and page numbers from the original PDF aren't reconstructed \u2014 that content is currently skipped rather than dumped in as broken text. Right-to-left languages (Arabic, Urdu) aren't specifically supported yet either. These are real, disclosed limitations, not silent failures.",
      },
      {
        question: "Does this work on scanned PDFs (images of text)?",
        answer:
          "No. This tool reads the text layer embedded in the PDF. If the PDF is a scanned image with no embedded text, there's nothing for it to extract \u2014 that would require OCR, which this tool doesn't perform.",
      },
    ],
  },
  {
    id: "word-to-pdf",
    slug: "word-to-pdf",
    name: "Word to PDF",
    shortDescription: "Convert a .docx Word document into a PDF.",
    description:
      "Convert a .docx Word document into a PDF you can share or submit, entirely in your browser.",
    category: "document",
    keywords: ["word to pdf", "docx to pdf", "convert word to pdf"],
    component: "WordToPdf",
    localOnly: true,
    featured: true,
    popularity: 83,
    instructions: [
      "Upload a .docx file.",
      "Select Convert to render it as a PDF.",
      "Download the PDF once it's ready.",
    ],
    faqs: [
      {
        question: "Will formatting like tables and images carry over exactly?",
        answer:
          "Headings, paragraphs, bold/italic text, and lists convert reliably. Complex layouts \u2014 multi-column sections, precise table styling, text boxes, and embedded objects \u2014 may render differently than in Word. For heavily formatted documents, double-check the result before submitting or sharing it.",
      },
      {
        question: "Does this work with .doc (older Word format) files?",
        answer:
          "No, only the modern .docx format is supported. If you have an older .doc file, save it as .docx from Word first (File \u2192 Save As \u2192 Word Document (.docx)).",
      },
    ],
  },
  {
    id: "pdf-to-text",
    slug: "pdf-to-text",
    name: "PDF to Text",
    shortDescription: "Extract all readable text from a PDF.",
    description:
      "Pull the plain text out of a PDF \u2014 handy for copying notes, quoting a passage, or feeding the content into another tool like the word counter.",
    category: "document",
    keywords: ["pdf to text", "extract text from pdf", "pdf text extractor"],
    component: "PdfToText",
    localOnly: true,
    popularity: 67,
    instructions: [
      "Upload a PDF file.",
      "Its text is extracted automatically, page by page.",
      "Copy the text or download it as a .txt file.",
    ],
    faqs: [
      {
        question: "Why is the output empty for my PDF?",
        answer:
          "This usually means the PDF is a scanned image with no embedded text layer. Extracting text from a scanned document requires OCR, which this tool doesn't perform.",
      },
    ],
  },
  {
    id: "text-to-pdf",
    slug: "text-to-pdf",
    name: "Text to PDF",
    shortDescription: "Turn plain text or notes into a downloadable PDF.",
    description:
      "Convert plain text \u2014 notes, a draft, a list \u2014 into a clean, downloadable PDF document.",
    category: "document",
    keywords: ["text to pdf", "notes to pdf", "convert text to pdf"],
    component: "TextToPdf",
    localOnly: true,
    popularity: 58,
    instructions: [
      "Type or paste your text.",
      "Choose a page size and font size if you'd like to adjust the defaults.",
      "Select Generate PDF and download the result.",
    ],
    faqs: [],
  },
  {
    id: "images-to-pdf",
    slug: "images-to-pdf",
    name: "Images to PDF",
    shortDescription: "Combine one or more images into a single PDF.",
    description:
      "Turn a batch of photos or scans \u2014 like phone photos of handwritten notes \u2014 into one PDF document, one image per page.",
    category: "document",
    keywords: ["images to pdf", "jpg to pdf", "photos to pdf", "scan to pdf"],
    component: "ImagesToPdf",
    localOnly: true,
    popularity: 71,
    instructions: [
      "Add one or more images (JPG, PNG, or WebP).",
      "Reorder them if needed \u2014 each becomes one page, in order.",
      "Select Create PDF and download the result.",
    ],
    faqs: [],
  },

  // ---------------- Study Tools ----------------
  {
    id: "gpa-calculator",
    slug: "gpa-calculator",
    name: "GPA / CGPA Calculator",
    shortDescription: "Calculate semester GPA and overall CGPA from your courses.",
    description:
      "Add each course's credit hours and grade to calculate your semester GPA, and combine it with a prior CGPA and credit total to get your updated overall CGPA. The grade point scale is editable, so it isn't locked to one university's grading system.",
    category: "study",
    keywords: ["gpa calculator", "cgpa calculator", "grade point average"],
    component: "GpaCalculator",
    localOnly: true,
    featured: true,
    popularity: 78,
    instructions: [
      "Add each course with its credit hours and grade.",
      "Adjust the grade-point scale if your institution uses different values.",
      "Optionally enter a previous CGPA and credit hour total to calculate an updated overall CGPA.",
      "Your semester GPA and (if provided) overall CGPA update automatically.",
    ],
    faqs: [
      {
        question: "Why is the grade point scale editable?",
        answer:
          "Grading scales vary by country and institution \u2014 some use A = 4.0, others use different point values or letter grades entirely. Editing the scale lets this calculator match your school's actual system instead of assuming one standard.",
      },
      {
        question: "How is CGPA calculated?",
        answer:
          "CGPA is the credit-weighted average across all completed semesters. This tool combines the grade points and credit hours from the courses you entered with an optional prior CGPA and credit hour total, weighting each by its credit hours.",
      },
    ],
  },
  {
    id: "grade-calculator",
    slug: "grade-calculator",
    name: "Grade Calculator",
    shortDescription: "Calculate a percentage, letter grade, and pass/fail result.",
    description:
      "Enter total and obtained marks to get a percentage, a letter grade, and a pass/fail result, using an editable grading scale.",
    category: "study",
    keywords: ["grade calculator", "percentage calculator", "marks to grade"],
    component: "GradeCalculator",
    localOnly: true,
    popularity: 66,
    instructions: [
      "Enter the total possible marks and the marks obtained.",
      "Adjust the grade boundaries if needed.",
      "Your percentage, grade, and result appear instantly.",
    ],
    faqs: [],
  },
  {
    id: "required-marks-calculator",
    slug: "required-marks-calculator",
    name: "Required Marks Calculator",
    shortDescription: "Find the marks you need on what's left to hit a target grade.",
    description:
      "Enter your current marks and what's remaining to calculate exactly how many of the remaining marks you need to reach a target overall percentage.",
    category: "study",
    keywords: ["required marks calculator", "marks needed", "target percentage"],
    component: "RequiredMarksCalculator",
    localOnly: true,
    popularity: 57,
    instructions: [
      "Enter the marks you've obtained so far and the total marks those were out of.",
      "Enter the marks still available (remaining assessments/exams) and your target overall percentage.",
      "The tool shows how many of the remaining marks you need \u2014 and whether that target is still achievable.",
    ],
    faqs: [],
  },
  {
    id: "attendance-calculator",
    slug: "attendance-calculator",
    name: "Attendance Calculator",
    shortDescription: "Check your attendance percentage and safe margins.",
    description:
      "Calculate your current attendance percentage, how many more classes you can miss while staying above a target, or how many you need to attend to reach it.",
    category: "study",
    keywords: ["attendance calculator", "attendance percentage", "bunk calculator"],
    component: "AttendanceCalculator",
    localOnly: true,
    popularity: 64,
    instructions: [
      "Enter total classes held so far and how many you attended.",
      "Enter your target attendance percentage (often set by your institution).",
      "See your current percentage, plus how many classes you can miss or must attend to hit that target.",
    ],
    faqs: [
      {
        question: "How is 'classes you can still miss' calculated?",
        answer:
          "It assumes classes keep being held and you attend all of them except the ones you skip. It finds the largest number of additional classes you could mark absent while your attended-over-total ratio stays at or above your target.",
      },
    ],
  },
  {
    id: "exam-countdown",
    slug: "exam-countdown",
    name: "Exam Countdown",
    shortDescription: "Live countdown to an exam date and time.",
    description:
      "Enter an exam's date and time to see a live countdown in days, hours, minutes, and seconds, using your device's local time zone.",
    category: "study",
    keywords: ["exam countdown", "countdown timer", "days until exam"],
    component: "ExamCountdown",
    localOnly: true,
    popularity: 60,
    instructions: [
      "Enter the exam name, date, and time.",
      "The countdown updates live, down to the second.",
    ],
    faqs: [],
  },
  {
    id: "pomodoro-timer",
    slug: "pomodoro-timer",
    name: "Pomodoro Study Timer",
    shortDescription: "A focus timer with customizable work and break sessions.",
    description:
      "Run focused study sessions using the Pomodoro technique, with customizable focus, short break, and long break durations, and a running count of completed sessions.",
    category: "study",
    keywords: ["pomodoro timer", "study timer", "focus timer"],
    component: "PomodoroTimer",
    localOnly: true,
    featured: true,
    popularity: 76,
    instructions: [
      "Adjust the focus, short break, and long break durations if you'd like.",
      "Select Start to begin a focus session \u2014 Pause, Resume, Reset, and Skip are available any time.",
      "The timer automatically moves to a break after each focus session, and tracks how many sessions you've completed.",
    ],
    faqs: [
      {
        question: "Does the timer stay accurate if I switch tabs?",
        answer:
          "Yes. Instead of just counting down a number, the timer tracks the actual clock time each session should end at, so the display is always correct when you come back to the tab \u2014 even if the browser slowed down background updates while it wasn't visible.",
      },
    ],
  },
  {
    id: "study-planner",
    slug: "study-planner",
    name: "Study Planner",
    shortDescription: "Plan study sessions by subject, date, and priority.",
    description:
      "Create study sessions with a subject, topic, date, time, priority, and notes, then track them as you complete each one. Sessions are saved in your browser, so they're there the next time you visit.",
    category: "study",
    keywords: ["study planner", "study schedule", "study tracker"],
    component: "StudyPlanner",
    localOnly: true,
    popularity: 62,
    instructions: [
      "Select Add Session and fill in the subject, topic, date, time, and priority.",
      "Sessions are listed soonest first \u2014 mark one complete, edit it, or delete it any time.",
      "Everything is saved in your browser automatically.",
    ],
    faqs: [
      {
        question: "Where is my study plan saved?",
        answer:
          "In your browser's local storage, on this device only. It isn't uploaded anywhere, but it also won't follow you to a different browser or device, and clearing your browser data will remove it.",
      },
    ],
  },
  // ---------------- Writing Tools ----------------
  {
    id: "ai-writing-naturalizer",
    slug: "ai-writing-naturalizer",
    name: "AI Writing Naturalizer",
    shortDescription:
      "Transform rough, formulaic, or AI-assisted draft text into clear, natural academic and professional writing.",
    description:
      "Improve AI-assisted, rough, or overly formulaic writing with a natural academic and professional rewriting tool. Preserve original meaning, citations, technical terms, mathematical notation, and your unique author voice.",
    category: "writing",
    keywords: [
      "ai writing naturalizer",
      "academic writing improver",
      "thesis writing assistant",
      "assignment writing assistant",
      "academic rewriter",
      "natural writing tool",
      "improve academic writing",
      "research writing assistant",
      "thesis paragraph rewriter",
      "writing style improver",
    ],
    component: "AiWritingNaturalizer",
    localOnly: true,
    featured: true,
    popularity: 98,
    relatedToolIds: [
      "word-counter",
      "case-converter",
      "text-cleaner",
      "pdf-to-text",
      "text-to-pdf",
      "study-planner",
    ],
    instructions: [
      "Paste or type your thesis paragraph, assignment, research report, or draft text into the Original Text panel, or upload a .txt/.md file.",
      "Select your preferred Writing Mode (Academic, Formal, Natural, Professional, Simple, Conversational, or Custom).",
      "Enable Thesis / Research Mode or customize Academic Controls such as Academic Level, Complexity, Formality, and Vocabulary if needed.",
      "Choose your desired Rewrite Strength (Light, Balanced, or Extensive) and add optional custom writing instructions.",
      "Select Naturalize Text to generate clear, fluid writing with preserved citations and technical terminology, then copy or download the result.",
    ],
    faqs: [
      {
        question: "Can I use this for my thesis?",
        answer:
          "Yes. Academic mode is designed to improve clarity, structure, readability, and formal expression while preserving technical terminology and citations.",
      },
      {
        question: "Does the tool change the meaning?",
        answer:
          "It should preserve the original meaning and factual claims. Users should still review the final version before submitting academic work.",
      },
      {
        question: "Can I preserve citations?",
        answer:
          "Yes. Citation formats should remain unchanged whenever possible.",
      },
      {
        question: "Can I choose different writing styles?",
        answer:
          "Yes. Users can select Academic, Formal, Natural, Professional, Simple, Conversational, or Custom styles.",
      },
      {
        question: "Does this tool guarantee that text will be classified as human-written?",
        answer:
          "No. AI-detection systems are probabilistic and unreliable, so the tool should not make guarantees about detector results.",
      },
    ],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function getToolsByCategory(category: CategoryId): Tool[] {
  return tools.filter((t) => t.category === category);
}

export function getFeaturedTools(): Tool[] {
  return tools.filter((t) => t.featured);
}

export function getPopularTools(limit = 8): Tool[] {
  return [...tools].sort((a, b) => b.popularity - a.popularity).slice(0, limit);
}

export function getRelatedTools(tool: Tool, limit = 3): Tool[] {
  if (tool.relatedToolIds && tool.relatedToolIds.length > 0) {
    const customRelated = tools.filter((t) => tool.relatedToolIds?.includes(t.id));
    if (customRelated.length > 0) return customRelated.slice(0, limit);
  }
  return tools
    .filter((t) => t.id !== tool.id && t.category === tool.category)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return tools.filter((t) => {
    return (
      t.name.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q)) ||
      t.category.toLowerCase().includes(q)
    );
  });
}
