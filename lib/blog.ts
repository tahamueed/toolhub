export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  publishedAt: string; // ISO date
  author: string;
  relatedToolSlugs: string[];
  content: { heading?: string; paragraphs: string[] }[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "what-is-json-and-how-to-validate-it",
    title: "What Is JSON, and How Do You Validate It?",
    description:
      "A plain-language guide to JSON syntax, the mistakes that break it most often, and how to validate a payload in seconds.",
    publishedAt: "2026-01-12",
    author: "Taha Mueed",
    relatedToolSlugs: ["json-formatter"],
    content: [
      {
        paragraphs: [
          "JSON (JavaScript Object Notation) is the format most APIs, config files, and web apps use to move structured data around. It's readable by humans and easy for machines to parse, which is why it replaced older formats like XML for most everyday use cases.",
        ],
      },
      {
        heading: "The basic shape",
        paragraphs: [
          "At its core, JSON is built from a small set of pieces: objects (key-value pairs wrapped in curly braces), arrays (ordered lists wrapped in square brackets), strings, numbers, booleans, and null. Every key must be a double-quoted string, and every value must be one of those types \u2014 nothing else is valid.",
        ],
      },
      {
        heading: "The mistakes that break JSON most often",
        paragraphs: [
          "Trailing commas are the most common culprit: {\"a\": 1, \"b\": 2,} looks harmless but is invalid JSON, because a comma can't appear after the last item. Single quotes are another frequent issue \u2014 JSON requires double quotes around strings and keys, so {'a': 1} will fail to parse even though it's valid JavaScript.",
          "Unquoted keys are a close third. JavaScript object literals allow {a: 1}, but JSON requires {\"a\": 1}. And because JSON has no comment syntax, anything starting with // or wrapped in /* */ will also cause a parse error, even though many config-file formats tolerate comments.",
        ],
      },
      {
        heading: "Validating a payload quickly",
        paragraphs: [
          "The fastest way to check whether a JSON string is valid is to run it through a formatter that reports the exact line and column where parsing failed, rather than a vague 'invalid JSON' message. That's exactly what a JSON formatter and validator does: paste the payload in, and any syntax error is pinpointed immediately so you're not scanning the whole document by eye.",
          "Once it's valid, pretty-printing with consistent indentation makes nested structures much easier to read \u2014 especially useful when you're debugging an API response that arrived as one unbroken line of text.",
        ],
      },
    ],
  },
  {
    slug: "jpg-vs-png-vs-webp",
    title: "JPG vs PNG vs WebP: Which Should You Use?",
    description:
      "A practical breakdown of the three most common image formats \u2014 what each is actually good at, and when to convert between them.",
    publishedAt: "2026-01-26",
    author: "Taha Mueed",
    relatedToolSlugs: ["image-format-converter", "image-compressor"],
    content: [
      {
        paragraphs: [
          "Picking an image format feels like it shouldn't matter until a page loads slowly or a logo looks blurry. Each of the three common web formats trades off compression, transparency, and quality differently, and picking the right one for the job makes a real difference.",
        ],
      },
      {
        heading: "JPG: best for photos",
        paragraphs: [
          "JPG uses lossy compression tuned for photographic detail \u2014 gradients, shadows, and complex color transitions compress well with barely visible quality loss. It doesn't support transparency, and it tends to introduce visible artifacts around sharp edges or text, which is why it's a poor choice for logos, screenshots, or line art.",
        ],
      },
      {
        heading: "PNG: best for graphics and transparency",
        paragraphs: [
          "PNG is lossless, which means it preserves every pixel exactly \u2014 ideal for logos, icons, screenshots, and anything with flat colors or text. It also supports transparency, which JPG can't do at all. The tradeoff is file size: a lossless photo saved as PNG can be several times larger than the same photo saved as JPG.",
        ],
      },
      {
        heading: "WebP: usually the best of both",
        paragraphs: [
          "WebP supports both lossy and lossless compression, plus transparency, and typically produces smaller files than JPG or PNG at a similar visual quality. Browser support is now near-universal, which makes it a solid default for web images when file size matters \u2014 though PNG or SVG are still worth keeping around for cases where you need guaranteed lossless output or the file needs to open cleanly in older design tools.",
        ],
      },
      {
        heading: "Converting between them",
        paragraphs: [
          "If you've got an image in the wrong format \u2014 a PNG screenshot you want to shrink for a blog post, or a JPG you need with a transparent background source \u2014 an image format converter that runs in the browser can switch between JPG, PNG, and WebP without uploading the file anywhere, and an image compressor can bring the file size down further by adjusting quality directly.",
        ],
      },
    ],
  },
  {
    slug: "how-unix-timestamps-work",
    title: "How Unix Timestamps Work (and Why Your Code Uses Them)",
    description:
      "Why so many systems store time as a single number, the seconds-vs-milliseconds trap, and how to convert one by hand.",
    publishedAt: "2026-02-09",
    author: "Taha Mueed",
    relatedToolSlugs: ["timestamp-converter"],
    content: [
      {
        paragraphs: [
          "A Unix timestamp is a single number representing the number of seconds (or milliseconds) that have elapsed since midnight UTC on January 1, 1970 \u2014 a moment programmers call 'the epoch.' It's the most common way computers store a point in time internally, because a single integer is easy to compare, sort, and do arithmetic on, unlike a formatted date string.",
        ],
      },
      {
        heading: "Why not just store a date string?",
        paragraphs: [
          "Date strings are ambiguous and locale-dependent \u2014 is 03/04/2026 March 4th or April 3rd? They're also awkward to do math with: finding the number of days between two formatted dates means parsing both first. A timestamp sidesteps all of that. Subtracting two timestamps instantly gives you an elapsed duration in seconds, with no parsing required.",
        ],
      },
      {
        heading: "The seconds-vs-milliseconds trap",
        paragraphs: [
          "This is the single most common timestamp bug: some systems (Unix tools, many APIs, most databases) use seconds since the epoch, while JavaScript's Date object and many web APIs use milliseconds. Mixing the two produces dates that are off by a factor of 1000 \u2014 usually showing up as a date sometime in 1970, since a millisecond value treated as seconds is still a very small number of years past the epoch.",
          "If a timestamp looks like it has 10 digits (for example 1751328000), it's almost certainly in seconds. If it has 13 digits (1751328000000), it's in milliseconds.",
        ],
      },
      {
        heading: "Converting one by hand",
        paragraphs: [
          "When you're debugging and need to know what a raw timestamp actually means, a timestamp converter that shows the local time, UTC time, and ISO 8601 format side by side saves you from writing a throwaway script just to answer 'what date is this?'",
        ],
      },
    ],
  },
  {
    slug: "pdf-merger-how-to-combine-pdfs",
    title: "PDF Merger: How to Combine Multiple PDFs Into One",
    description:
      "How the PDF merger works, step by step, and why merging never touches a server.",
    publishedAt: "2026-03-02",
    author: "Taha Mueed",
    relatedToolSlugs: ["pdf-merger"],
    content: [
      {
        paragraphs: [
          "Merging PDFs \u2014 combining a cover page, a report, and an appendix into one file, or stitching together scanned chapters \u2014 is one of the most common document tasks, and one of the easiest to get wrong with the wrong tool. Plenty of 'free PDF merger' websites work by uploading your files to a server, processing them there, and sending a result back. ToolHub's PDF Merger does the entire job inside your browser tab instead.",
        ],
      },
      {
        heading: "How to use it",
        paragraphs: [
          "Add two or more PDF files by dropping them onto the upload area, or selecting several at once from a file picker. Each file appears in a numbered list \u2014 use the up and down arrows next to a file to change the order pages will appear in the final document, since files are merged top to bottom exactly as listed. Once the order looks right, select Merge PDFs and download the combined file.",
        ],
      },
      {
        heading: "How it works technically",
        paragraphs: [
          "The tool uses a JavaScript PDF library (pdf-lib) that runs entirely client-side. It opens each source file, copies its pages byte-for-byte into a new document, and assembles the result \u2014 all inside the browser's own memory. Because there's no upload step, nothing about the files' contents is ever transmitted anywhere, and the tool works the same whether you're online or offline once the page has loaded.",
        ],
      },
      {
        heading: "A couple of practical notes",
        paragraphs: [
          "Because pages are copied as-is, merging doesn't change quality, compress images, or alter formatting \u2014 what you see in the source files is what ends up in the combined one. Password-protected or encrypted PDFs generally can't be merged without removing the protection first, since the tool needs to read the page contents to copy them.",
        ],
      },
    ],
  },
  {
    slug: "pdf-splitter-how-to-split-a-pdf",
    title: "PDF Splitter: How to Break a PDF Into Separate Pages",
    description:
      "When splitting a PDF is useful, and how ToolHub's splitter turns every page into its own downloadable file.",
    publishedAt: "2026-03-05",
    author: "Taha Mueed",
    relatedToolSlugs: ["pdf-splitter", "pdf-merger"],
    content: [
      {
        paragraphs: [
          "Splitting comes up more often than people expect: pulling one page out of a scanned form to email separately, breaking a long scanned book into per-chapter files, or isolating a single page that needs to be re-uploaded somewhere with a strict one-page-per-file requirement.",
        ],
      },
      {
        heading: "How to use it",
        paragraphs: [
          "Upload a single PDF, then select Split PDF. Every page in the file becomes its own single-page PDF, and all of them are packaged together into one ZIP file that downloads automatically \u2014 so a 20-page document becomes a ZIP containing 20 individually numbered PDFs, ready to unzip and use however you need.",
        ],
      },
      {
        heading: "How it works technically",
        paragraphs: [
          "The tool reads the uploaded PDF's page structure with pdf-lib, then builds a brand-new single-page PDF for each page by copying that page's content across. A second library (JSZip) then bundles all of those individual files into one ZIP archive in memory, which your browser then offers as a normal download \u2014 all without any file leaving your device.",
        ],
      },
      {
        heading: "If you only need a few pages, not all of them",
        paragraphs: [
          "If your goal is pulling out a specific range \u2014 say, pages 3 through 7 of a longer document \u2014 rather than every single page, it's often faster to split the whole file and then use the PDF Merger to recombine just the pages you kept.",
        ],
      },
    ],
  },
  {
    slug: "pdf-to-word-how-it-works",
    title: "PDF to Word: How Structure-Aware Conversion Actually Works",
    description:
      "How the PDF to Word tool tells headings from body text, preserves bold/italic and lists, and where its real limits are.",
    publishedAt: "2026-03-09",
    author: "Taha Mueed",
    relatedToolSlugs: ["pdf-to-word", "pdf-to-text"],
    content: [
      {
        paragraphs: [
          "PDFs are designed to look the same everywhere, which is exactly what makes them hard to edit \u2014 there's no underlying 'paragraph' or 'heading' structure the way a Word document has, just individual pieces of text positioned at exact coordinates on a page. A naive conversion just reads those pieces of text in order and dumps them into one paragraph, which is why so many free PDF-to-Word tools hand back a single unbroken wall of text with no headings, no bold, and no lists. This tool takes a different approach: it analyzes the page's layout first, and reconstructs the document's actual structure before generating anything.",
        ],
      },
      {
        heading: "How to use it",
        paragraphs: [
          "Upload a PDF and select Convert to Word. The tool analyzes each page's layout, then downloads a .docx file with a page break between each original PDF page. Open the result in Word, Google Docs, or any other word processor to keep editing \u2014 headings are real Word headings, bold text is really bold, and lists are real, editable lists, not paragraphs starting with a typed dash.",
        ],
      },
      {
        heading: "How it works technically",
        paragraphs: [
          "Text extraction runs on pdf.js, the same rendering engine behind Firefox's built-in PDF viewer. Beyond just reading the words, it also reads each text fragment's exact position, font size, and whether the underlying font is bold or italic. From there, the tool groups fragments into lines by their vertical position, then groups lines into paragraphs based on the spacing between them \u2014 a normal small gap means the next line continues the same paragraph; a noticeably larger gap means a new paragraph started.",
          "Heading detection compares each line's font size against the page's most common (body) font size \u2014 a line set noticeably larger is treated as a heading, and a short, fully bold standalone line is treated as a heading too, since that's how a lot of real documents mark section titles without necessarily increasing the font size. Lines starting with a bullet character or a number-and-period pattern are converted into genuine Word list items, with the original bullet or number stripped since Word generates its own. All of this becomes a real .docx built with Word's own heading styles, list numbering, and character-level bold/italic formatting \u2014 not a plain-text approximation.",
        ],
      },
      {
        heading: "What does and doesn't carry over",
        paragraphs: [
          "Headings, paragraph breaks, page breaks, bold and italic text, and bulleted or numbered lists all come through as real, editable Word formatting. What doesn't come through yet: tables, embedded images, multi-column layouts, headers, footers, and page numbers \u2014 that content is currently left out rather than dumped in as broken, unreadable text, since a wrong reconstruction is worse than an honest gap. Right-to-left languages like Arabic and Urdu also aren't specifically supported yet. And because this reads a PDF's embedded text layer, it can't extract anything from a scanned PDF that's really just a photo of a page with no underlying text \u2014 that requires OCR, which this tool doesn't perform. For a scanned document, the PDF to Text tool will show the same 'no text found' result, which is a useful way to check beforehand.",
        ],
      },
    ],
  },
  {
    slug: "word-to-pdf-how-it-works",
    title: "Word to PDF: Converting a .docx File to PDF",
    description:
      "How ToolHub renders a Word document as a PDF entirely in the browser, and where the conversion is strongest.",
    publishedAt: "2026-03-12",
    author: "Taha Mueed",
    relatedToolSlugs: ["word-to-pdf", "pdf-to-word"],
    content: [
      {
        paragraphs: [
          "Turning a Word document into a PDF is one of the most common 'submit this file' requirements \u2014 job applications, school assignments, forms \u2014 because a PDF looks the same on the reader's screen no matter what software or fonts they have installed.",
        ],
      },
      {
        heading: "How to use it",
        paragraphs: [
          "Upload a .docx file and select Convert to PDF. The tool processes it in two steps and then downloads a finished PDF \u2014 there's no server round-trip in between, so it works the same on a slow connection as a fast one.",
        ],
      },
      {
        heading: "How it works technically",
        paragraphs: [
          "First, a library called mammoth reads the .docx file's internal structure \u2014 Word documents are actually ZIP archives full of XML \u2014 and converts the content into clean HTML, preserving headings, paragraphs, bold and italic text, and lists. That HTML is then rendered onto a hidden canvas and laid out onto PDF pages using jsPDF, the same core engine several other tools on this site use to generate PDFs.",
        ],
      },
      {
        heading: "Where this works best, and where to double-check",
        paragraphs: [
          "This pipeline handles text-heavy documents \u2014 essays, reports, letters, notes \u2014 reliably. Documents with multi-column layouts, precisely positioned text boxes, complex table styling, or embedded objects like charts may render differently than they look in Word, since HTML doesn't have a direct equivalent for some of Word's more advanced layout features. For anything with important visual formatting, it's worth opening the downloaded PDF and checking it before sending it on.",
        ],
      },
    ],
  },
  {
    slug: "pdf-to-text-how-it-works",
    title: "PDF to Text: Pulling the Plain Text Out of a PDF",
    description:
      "A quick guide to extracting text from a PDF \u2014 for quoting, note-taking, or feeding into another tool.",
    publishedAt: "2026-03-15",
    author: "Taha Mueed",
    relatedToolSlugs: ["pdf-to-text", "word-counter"],
    content: [
      {
        paragraphs: [
          "Sometimes you don't need a whole new document \u2014 you just need the words. Quoting a passage for a citation, copying a paragraph into an email, or running a word count on a report someone sent you as a PDF are all cases where plain text is all you actually need.",
        ],
      },
      {
        heading: "How to use it",
        paragraphs: [
          "Upload a PDF and its text is extracted automatically, page by page, separated by blank lines so page boundaries stay visible. From there, copy the text directly, or download it as a plain .txt file. Since the output is ordinary text, it's easy to paste straight into the Word Counter or any other text tool for further work.",
        ],
      },
      {
        heading: "How it works technically",
        paragraphs: [
          "The extraction runs on pdf.js \u2014 the browser-based engine also used by the PDF to Word tool \u2014 which reads each page's embedded text layer directly, without ever sending the file anywhere.",
        ],
      },
      {
        heading: "When there's nothing to extract",
        paragraphs: [
          "If a PDF is a scanned image of a page rather than real embedded text \u2014 common with old documents or photographed pages \u2014 there's no text layer to read, and the tool will say so rather than guessing. Recovering text from an image like that requires optical character recognition (OCR), which is a different technology this tool doesn't include.",
        ],
      },
    ],
  },
  {
    slug: "text-to-pdf-how-it-works",
    title: "Text to PDF: Turning Notes Into a Shareable Document",
    description:
      "How to turn plain text into a properly paginated PDF, and what the page size and font size options actually change.",
    publishedAt: "2026-03-18",
    author: "Taha Mueed",
    relatedToolSlugs: ["text-to-pdf", "lorem-ipsum-generator"],
    content: [
      {
        paragraphs: [
          "Plenty of writing starts as plain text \u2014 quick notes, a draft, a list \u2014 that eventually needs to become a real file you can send, print, or submit somewhere that expects a PDF rather than a block of pasted text.",
        ],
      },
      {
        heading: "How to use it",
        paragraphs: [
          "Type or paste text into the box, optionally give it a title (used as the downloaded filename), and pick a page size and font size if the defaults don't fit your needs. Select Generate PDF and the file downloads immediately \u2014 long text automatically flows across as many pages as it needs.",
        ],
      },
      {
        heading: "How it works technically",
        paragraphs: [
          "The tool uses jsPDF to measure how the text wraps at the chosen font size and page width, then places lines onto the page one at a time, starting a new page automatically whenever the current one fills up. Because this works directly with text and page geometry \u2014 no HTML rendering step involved \u2014 it's fast even for long documents.",
        ],
      },
    ],
  },
  {
    slug: "images-to-pdf-how-it-works",
    title: "Images to PDF: Combining Photos and Scans Into One File",
    description:
      "How to turn a batch of photos \u2014 like phone photos of handwritten pages \u2014 into a single PDF, one image per page.",
    publishedAt: "2026-03-21",
    author: "Taha Mueed",
    relatedToolSlugs: ["images-to-pdf", "image-compressor"],
    content: [
      {
        paragraphs: [
          "Photographing handwritten notes, receipts, or a signed form and needing to submit them as 'one PDF' rather than a folder of loose photos is an extremely common task \u2014 and one that usually sends people looking for a scanner app they don't have installed.",
        ],
      },
      {
        heading: "How to use it",
        paragraphs: [
          "Add one or more images \u2014 JPG, PNG, or WebP \u2014 by dropping them in or selecting several at once. Reorder them with the up and down arrows if needed, since each image becomes one page in that order. Select Create PDF, and the file downloads with each image scaled to fit its own page.",
        ],
      },
      {
        heading: "How it works technically",
        paragraphs: [
          "Each image is measured to figure out whether it's wider than it is tall or the reverse, and jsPDF creates a matching portrait or landscape page sized to fit it well, scaling the image down only as much as needed to stay within the page margins. Everything happens locally: images are read directly from the files you selected and drawn onto PDF pages in the browser's memory.",
        ],
      },
      {
        heading: "A tip for scanned notes specifically",
        paragraphs: [
          "If the photos are a bit dark or the file sizes are large because they came straight from a phone camera, running them through the Image Compressor first \u2014 before combining them here \u2014 can noticeably shrink the final PDF without a visible quality difference.",
        ],
      },
    ],
  },
  {
    slug: "how-to-use-every-toolhub-tool",
    title: "How to Use Every Tool on ToolHub: A Quick Category Guide",
    description:
      "A fast reference covering what each tool on ToolHub does and how to use it, grouped by category.",
    publishedAt: "2026-03-25",
    author: "Taha Mueed",
    relatedToolSlugs: ["json-formatter", "word-counter", "length-converter", "percentage-calculator", "image-compressor"],
    content: [
      {
        paragraphs: [
          "Every tool page on ToolHub already includes its own step-by-step instructions, but this is a faster way to see what's available across the whole site in one place \u2014 what each tool does, and the basic steps to use it. For the newer PDF and Word tools, each one also has its own dedicated deep-dive post linked from its tool page.",
        ],
      },
      {
        heading: "Developer Tools",
        paragraphs: [
          "JSON Formatter & Validator: paste JSON in, choose Format to pretty-print it or Minify to compress it, and any syntax error is pointed out with its exact line and column.",
          "Base64 Encoder / Decoder and URL Encoder / Decoder: type or paste text, switch between Encode and Decode, and the result updates as you type.",
          "UUID Generator: choose how many UUIDs you need and select Generate for fresh, cryptographically random values.",
          "Hash Generator: paste text, pick SHA-1, SHA-256, or SHA-512, and the hash updates live.",
          "Timestamp Converter: enter a Unix timestamp (or select Now) to see it as a local date, UTC date, and ISO 8601 string.",
          "JWT Decoder: paste a token to see its header and payload as formatted JSON \u2014 it decodes only, and never verifies a signature.",
          "Regex Tester: enter a pattern and flags, then paste sample text to see matches highlighted live, with capture groups listed below.",
        ],
      },
      {
        heading: "Text Tools",
        paragraphs: [
          "Word & Character Counter: paste text to see live counts of words, characters, sentences, paragraphs, and estimated reading time.",
          "Case Converter: paste text and pick UPPERCASE, lowercase, Title Case, Sentence case, camelCase, or snake_case.",
          "Remove Duplicate Lines and Text Line Sorter: paste a list, one item per line, then deduplicate or sort it (A-Z, Z-A, numeric, by length, or shuffled).",
          "Lorem Ipsum Generator: choose paragraphs, sentences, or a word count, then select Generate for placeholder text.",
          "Text Cleaner: paste messy text and toggle which cleanup rules to apply \u2014 collapsing spaces, trimming lines, removing blank lines, or stripping non-printable characters.",
        ],
      },
      {
        heading: "Converter Tools",
        paragraphs: [
          "Length, Weight, and Data Storage Converters: enter a value and a starting unit, and every other unit updates automatically.",
          "Temperature Converter: enter a value in Celsius, Fahrenheit, or Kelvin to see the other two instantly.",
        ],
      },
      {
        heading: "Calculator Tools",
        paragraphs: [
          "Percentage Calculator: pick which of the three common percentage problems you're solving, fill in the numbers, and get an instant result.",
          "Age Calculator and Date Difference Calculator: pick two dates to see the gap broken down into years, months, and days.",
          "BMI Calculator: enter height and weight in metric or imperial units for an instant BMI and category, with a note that it's a screening measure, not a diagnosis.",
        ],
      },
      {
        heading: "Image Tools",
        paragraphs: [
          "Image Compressor: drop an image, adjust the quality slider, and compare the estimated file size before downloading.",
          "Image Resizer: drop an image, set target dimensions (with an option to lock the aspect ratio), and download the resized version.",
          "Image Format Converter: drop an image and choose JPG, PNG, or WebP as the output format.",
          "Base64 Image Converter: drop an image to get a Base64 data URL, or paste an existing data URL to preview and download it as a file.",
        ],
      },
      {
        heading: "Document Tools",
        paragraphs: [
          "PDF Merger, PDF Splitter, PDF to Word, Word to PDF, PDF to Text, Text to PDF, and Images to PDF each have their own detailed guide linked from their tool page \u2014 those cover the specific steps and technical details for working with PDFs and Word documents.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getSortedBlogPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
