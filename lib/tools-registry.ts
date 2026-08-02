export type ToolCategory = "data" | "image" | "pdf" | "utility";

export interface ToolMeta {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: ToolCategory;
  icon: string;
}

export const categoryLabels: Record<ToolCategory, string> = {
  data: "Data Tools",
  image: "Image Tools",
  pdf: "PDF Tools",
  utility: "Developer Utilities",
};

export const tools: ToolMeta[] = [
  {
    slug: "csv-to-json",
    title: "CSV to JSON Converter",
    shortTitle: "CSV to JSON",
    description:
      "Free CSV to JSON converter — convert CSV to JSON online instantly, with no upload and no signup. Runs entirely in your browser.",
    category: "data",
    icon: "table",
  },
  {
    slug: "json-to-csv",
    title: "JSON to CSV Converter",
    shortTitle: "JSON to CSV",
    description:
      "Free JSON to CSV converter online. Turn a JSON array into a CSV file for Excel or Google Sheets — no upload, no signup required.",
    category: "data",
    icon: "table",
  },
  {
    slug: "json-to-yaml",
    title: "JSON to YAML Converter",
    shortTitle: "JSON to YAML",
    description:
      "Free JSON to YAML converter online. Convert JSON to clean YAML for Kubernetes configs and config files, entirely in your browser.",
    category: "data",
    icon: "braces",
  },
  {
    slug: "yaml-to-json",
    title: "YAML to JSON Converter",
    shortTitle: "YAML to JSON",
    description:
      "Free YAML to JSON converter online. Convert YAML config files to JSON for scripts and APIs — no upload, processed in your browser.",
    category: "data",
    icon: "braces",
  },
  {
    slug: "xml-to-json",
    title: "XML to JSON Converter",
    shortTitle: "XML to JSON",
    description:
      "Free XML to JSON converter online, with attributes preserved. No upload required — conversion happens entirely in your browser.",
    category: "data",
    icon: "code",
  },
  {
    slug: "json-to-xml",
    title: "JSON to XML Converter",
    shortTitle: "JSON to XML",
    description:
      "Free JSON to XML converter online. Turn JSON objects into well-formed XML documents instantly, entirely client-side.",
    category: "data",
    icon: "code",
  },
  {
    slug: "json-formatter",
    title: "JSON Formatter & Validator",
    shortTitle: "JSON Formatter",
    description:
      "Free online JSON formatter and validator. Format, beautify, and minify JSON with syntax highlighting and instant error detection.",
    category: "data",
    icon: "braces",
  },
  {
    slug: "compress-png",
    title: "Compress PNG",
    shortTitle: "Compress PNG",
    description:
      "Compress PNG online for free without losing quality. Shrink PNG file size instantly in your browser — no upload required.",
    category: "image",
    icon: "image",
  },
  {
    slug: "compress-jpg",
    title: "Compress JPG",
    shortTitle: "Compress JPG",
    description:
      "Compress JPG online for free. Reduce JPG/JPEG file size for faster websites and smaller uploads — processed entirely on your device.",
    category: "image",
    icon: "image",
  },
  {
    slug: "resize-image",
    title: "Resize Image",
    shortTitle: "Resize Image",
    description:
      "Resize images online for free — PNG, JPG, or WebP. Set exact dimensions or a scale percentage, right in your browser.",
    category: "image",
    icon: "image",
  },
  {
    slug: "png-to-webp",
    title: "PNG to WebP Converter",
    shortTitle: "PNG to WebP",
    description:
      "Free PNG to WebP converter online. Convert PNG images to the smaller WebP format without losing transparency.",
    category: "image",
    icon: "image",
  },
  {
    slug: "jpg-to-webp",
    title: "JPG to WebP Converter",
    shortTitle: "JPG to WebP",
    description:
      "Free JPG to WebP converter online. Convert JPG/JPEG photos to WebP for smaller file sizes and faster page loads.",
    category: "image",
    icon: "image",
  },
  {
    slug: "webp-to-png",
    title: "WebP to PNG Converter",
    shortTitle: "WebP to PNG",
    description:
      "Free WebP to PNG converter online. Convert WebP images back to universally-supported PNG format instantly.",
    category: "image",
    icon: "image",
  },
  {
    slug: "image-converter",
    title: "Image Format Converter",
    shortTitle: "Image Converter",
    description:
      "Free online image converter — PNG, JPG, and WebP, any direction. Convert images instantly in your browser, no upload needed.",
    category: "image",
    icon: "image",
  },
  {
    slug: "merge-pdf",
    title: "Merge PDF Files",
    shortTitle: "Merge PDF",
    description:
      "Merge PDF files online for free, no watermark. Combine multiple PDFs into one document in your chosen order — no upload required.",
    category: "pdf",
    icon: "file-text",
  },
  {
    slug: "split-pdf",
    title: "Split PDF",
    shortTitle: "Split PDF",
    description:
      "Split PDF online for free. Extract pages or split a PDF into individual files, downloaded as a zip — no upload required.",
    category: "pdf",
    icon: "file-text",
  },
  {
    slug: "images-to-pdf",
    title: "Images to PDF",
    shortTitle: "Images to PDF",
    description:
      "Free images to PDF converter online. Combine JPG or PNG images into a single PDF document in your chosen order.",
    category: "pdf",
    icon: "file-text",
  },
  {
    slug: "word-to-pdf",
    title: "Word to PDF Converter",
    shortTitle: "Word to PDF",
    description:
      "Free Word to PDF converter, no signup. Convert .docx to PDF with real selectable text, formatting, tables, and images.",
    category: "pdf",
    icon: "file-text",
  },
  {
    slug: "pdf-to-word",
    title: "PDF to Word Converter",
    shortTitle: "PDF to Word",
    description:
      "Free PDF to Word converter online. Convert PDF to an editable .docx document with headings, tables, and images reconstructed.",
    category: "pdf",
    icon: "file-text",
  },
  {
    slug: "uuid-generator",
    title: "UUID Generator",
    shortTitle: "UUID Generator",
    description:
      "Free UUID generator online. Generate random v4 UUIDs instantly, one or many at a time, right in your browser.",
    category: "utility",
    icon: "fingerprint",
  },
  {
    slug: "hash-generator",
    title: "Hash Generator",
    shortTitle: "Hash Generator",
    description:
      "Free online hash generator — MD5, SHA-1, SHA-256, and SHA-512. Generate a file checksum or text hash instantly in your browser.",
    category: "utility",
    icon: "hash",
  },
  {
    slug: "base64-encode-decode",
    title: "Base64 Encode / Decode",
    shortTitle: "Base64 Encode/Decode",
    description:
      "Free Base64 encoder and decoder online. Encode text to Base64 or decode Base64 to plain text, entirely client-side.",
    category: "utility",
    icon: "binary",
  },
  {
    slug: "jwt-decoder",
    title: "JWT Decoder",
    shortTitle: "JWT Decoder",
    description:
      "Free JWT decoder online, no server required. Decode a JSON Web Token to inspect its header and payload instantly.",
    category: "utility",
    icon: "key-round",
  },
  {
    slug: "regex-tester",
    title: "Regex Tester",
    shortTitle: "Regex Tester",
    description:
      "Free online regex tester. Test JavaScript regular expressions against sample text with live match highlighting and capture groups.",
    category: "utility",
    icon: "regex",
  },
  {
    slug: "log-analyzer",
    title: "Log Analyzer",
    shortTitle: "Log Analyzer",
    description:
      "Free online log analyzer — search log files or stack traces for keywords, entirely in your browser. No upload, no signup.",
    category: "utility",
    icon: "file-search",
  },
];

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return tools.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: ToolCategory): ToolMeta[] {
  return tools.filter((tool) => tool.category === category);
}

export function getRelatedTools(slug: string, limit = 4): ToolMeta[] {
  const current = getToolBySlug(slug);
  if (!current) return [];
  return tools
    .filter((tool) => tool.category === current.category && tool.slug !== slug)
    .slice(0, limit);
}
