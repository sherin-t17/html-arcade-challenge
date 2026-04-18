// HTML/CSS Arcade — 30 ORIGINAL questions inspired by the study guide topics
// but written from scratch with new scenarios, code samples, and phrasing
// so students who memorized the study material still need to think.

export type Question = {
  id: number;
  level: number;
  levelName: string;
  question: string;
  code?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export const QUESTIONS: Question[] = [
  // ───── Level 1 — Document Skeleton ─────
  {
    id: 1, level: 1, levelName: "Document Skeleton",
    question: "A friend's HTML page renders weirdly in old browsers. Which line at the very top forces standards mode?",
    options: ["<doctype html>", "<!DOCTYPE html>", "<html5>", "<meta doctype='html'>"],
    correctIndex: 1,
    explanation: "<!DOCTYPE html> tells the browser to use the latest standards rendering mode.",
  },
  {
    id: 2, level: 1, levelName: "Document Skeleton",
    question: "Where should the page's <title> tag live?",
    code: "<!DOCTYPE html>\n<html>\n  <____>\n     <title>My Site</title>\n  </____>\n  <body>...</body>\n</html>",
    options: ["body", "header", "head", "main"],
    correctIndex: 2,
    explanation: "<title> is metadata, so it belongs inside <head>, not <body>.",
  },
  {
    id: 3, level: 1, levelName: "Document Skeleton",
    question: "Which attribute on <html> declares the page's primary language for screen readers and search engines?",
    options: ["locale", "lang", "language", "xml:lang"],
    correctIndex: 1,
    explanation: '<html lang="en"> tells assistive tech and Google what language the page is in.',
  },
  {
    id: 4, level: 1, levelName: "Document Skeleton",
    question: "Which <meta> tag makes a page look correct on phone screens?",
    options: [
      '<meta name="mobile" content="true">',
      '<meta name="viewport" content="width=device-width, initial-scale=1">',
      '<meta charset="responsive">',
      '<meta name="screen" content="auto">',
    ],
    correctIndex: 1,
    explanation: "The viewport meta tag is essential for responsive design on mobile devices.",
  },

  // ───── Level 2 — Semantic HTML ─────
  {
    id: 5, level: 2, levelName: "Semantic HTML",
    question: "You're laying out a news site. The main story area should use which tag?",
    options: ["<div id='main'>", "<main>", "<section id='main'>", "<content>"],
    correctIndex: 1,
    explanation: "<main> represents the dominant content of the <body> — there should be only one per page.",
  },
  {
    id: 6, level: 2, levelName: "Semantic HTML",
    question: "Which element best wraps a sidebar with related links and ads, separate from the main content?",
    options: ["<side>", "<aside>", "<nav>", "<extra>"],
    correctIndex: 1,
    explanation: "<aside> represents tangentially related content — perfect for sidebars and pull-quotes.",
  },
  {
    id: 7, level: 2, levelName: "Semantic HTML",
    question: "Look at this snippet — what's the BEST replacement for <div class='topbar'>?",
    code: "<div class='topbar'>\n  <h1>Logo</h1>\n  <nav>...</nav>\n</div>",
    options: ["<section>", "<header>", "<top>", "<article>"],
    correctIndex: 1,
    explanation: "<header> is meant for introductory content like a logo and primary navigation.",
  },
  {
    id: 8, level: 2, levelName: "Semantic HTML",
    question: "Which tag is used to group navigation links semantically?",
    options: ["<menu>", "<links>", "<nav>", "<navigation>"],
    correctIndex: 2,
    explanation: "<nav> defines a section of navigation links and helps screen readers skip to them.",
  },

  // ───── Level 3 — Text & Media ─────
  {
    id: 9, level: 3, levelName: "Text & Media",
    question: "Which tag should you use to mark text as STRONGLY important (also rendered bold)?",
    options: ["<b>", "<strong>", "<bold>", "<important>"],
    correctIndex: 1,
    explanation: "<strong> conveys semantic importance; <b> is purely visual.",
  },
  {
    id: 10, level: 3, levelName: "Text & Media",
    question: "Which tag would you use for a short inline quote like \"to be or not to be\"?",
    options: ["<blockquote>", "<quote>", "<q>", "<cite>"],
    correctIndex: 2,
    explanation: "<q> is for short inline quotations; <blockquote> is for longer block-level quotes.",
  },
  {
    id: 11, level: 3, levelName: "Text & Media",
    question: "Look at this image — which attribute would describe it for screen readers if it failed to load?",
    code: '<img src="logo.png" width="120" height="40" alt="FXEC College Logo">',
    options: ["src", "title", "alt", "aria-name"],
    correctIndex: 2,
    explanation: "alt provides accessible text and a fallback when the image cannot be displayed.",
  },
  {
    id: 12, level: 3, levelName: "Text & Media",
    question: "How do you create an ordered list that starts numbering from 5?",
    options: ['<ol from="5">', '<ol start="5">', '<ol begin="5">', '<ol num="5">'],
    correctIndex: 1,
    explanation: 'The start="5" attribute on <ol> sets where the numbering begins.',
  },
  {
    id: 13, level: 3, levelName: "Text & Media",
    question: "Which tag draws a horizontal divider line between sections?",
    options: ["<line>", "<hr>", "<divider>", "<break>"],
    correctIndex: 1,
    explanation: "<hr> renders a horizontal rule — a thematic break between content.",
  },

  // ───── Level 4 — Links & Navigation ─────
  {
    id: 14, level: 4, levelName: "Links & Navigation",
    question: "Look at this link — what does target='_blank' do?",
    code: '<a href="https://lovable.dev" target="_blank">Lovable</a>',
    options: [
      "Opens the link in a blank popup window",
      "Opens the link in a new browser tab",
      "Reloads the same tab after delay",
      "Hides the link from search engines",
    ],
    correctIndex: 1,
    explanation: "target='_blank' opens the URL in a new tab. Pair it with rel='noopener' for security.",
  },
  {
    id: 15, level: 4, levelName: "Links & Navigation",
    question: "Which link will compose an email when clicked?",
    options: [
      '<a href="email:hello@x.com">',
      '<a href="mail:hello@x.com">',
      '<a href="mailto:hello@x.com">',
      '<a href="send:hello@x.com">',
    ],
    correctIndex: 2,
    explanation: "mailto: opens the user's default email client with a pre-filled To: address.",
  },
  {
    id: 16, level: 4, levelName: "Links & Navigation",
    question: "How do you make an image act as a clickable link to another page?",
    options: [
      "<img href='page.html'>",
      "<a href='page.html'><img src='pic.png'></a>",
      "<link><img src='pic.png'></link>",
      "<img src='pic.png' onclick='page.html'>",
    ],
    correctIndex: 1,
    explanation: "Wrap the <img> inside an <a> tag with an href to make the image clickable.",
  },

  // ───── Level 5 — Forms & Input ─────
  {
    id: 17, level: 5, levelName: "Forms & Input",
    question: "Which input type masks the characters as the user types?",
    options: ['type="hidden"', 'type="secret"', 'type="password"', 'type="mask"'],
    correctIndex: 2,
    explanation: 'type="password" hides each character, usually as bullets or asterisks.',
  },
  {
    id: 18, level: 5, levelName: "Forms & Input",
    question: "Look at this form — what attribute would prevent the user from submitting an empty name?",
    code: '<input type="text" name="username" ____>',
    options: ["mandatory", "required", "needed", "must"],
    correctIndex: 1,
    explanation: "The required attribute blocks form submission until the field has a value.",
  },
  {
    id: 19, level: 5, levelName: "Forms & Input",
    question: "Which element creates a dropdown list of choices?",
    options: ["<dropdown>", "<menu>", "<select>", "<list>"],
    correctIndex: 2,
    explanation: "<select> with nested <option> tags creates a dropdown menu.",
  },
  {
    id: 20, level: 5, levelName: "Forms & Input",
    question: "How do you let a user choose ONLY ONE option from a group of choices?",
    options: [
      '<input type="checkbox">',
      '<input type="radio">',
      '<input type="select">',
      '<input type="single">',
    ],
    correctIndex: 1,
    explanation: "Radio buttons sharing the same name attribute let users pick exactly one option.",
  },

  // ───── Level 6 — Tables ─────
  {
    id: 21, level: 6, levelName: "Tables",
    question: "Which tag marks a header cell in a table (usually rendered bold and centered)?",
    options: ["<td>", "<th>", "<thead>", "<header>"],
    correctIndex: 1,
    explanation: "<th> is a table header cell; <thead> groups header rows.",
  },
  {
    id: 22, level: 6, levelName: "Tables",
    question: "Look at this code — what does colspan='3' do?",
    code: '<td colspan="3">Total</td>',
    options: [
      "Inserts 3 spaces of padding",
      "Stretches the cell across 3 columns horizontally",
      "Stretches the cell across 3 rows vertically",
      "Creates 3 cells with the same value",
    ],
    correctIndex: 1,
    explanation: "colspan merges cells horizontally; rowspan merges them vertically.",
  },
  {
    id: 23, level: 6, levelName: "Tables",
    question: "Which attribute (deprecated but still asked) used to add space INSIDE table cells?",
    options: ["cellspacing", "cellpadding", "border", "margin"],
    correctIndex: 1,
    explanation: "cellpadding controlled inside-cell spacing. Modern CSS uses padding on <td>/<th>.",
  },

  // ───── Level 7 — Embedding & Scripting ─────
  {
    id: 24, level: 7, levelName: "Embedding & Scripting",
    question: "Which tag embeds another web page inside the current one?",
    options: ["<embed>", "<iframe>", "<object>", "<frame>"],
    correctIndex: 1,
    explanation: "<iframe src='url'> embeds an inline frame containing another HTML document.",
  },
  {
    id: 25, level: 7, levelName: "Embedding & Scripting",
    question: "Which attribute on <script> waits to run the script until AFTER HTML is parsed, in order?",
    code: '<script src="app.js" ____></script>',
    options: ["async", "defer", "wait", "lazy"],
    correctIndex: 1,
    explanation: "defer downloads in parallel but executes after HTML parsing, preserving script order.",
  },
  {
    id: 26, level: 7, levelName: "Embedding & Scripting",
    question: "Where can <style> tags be placed inside an HTML document?",
    options: [
      "Only inside <head>",
      "Only inside <body>",
      "Inside <head> or <body> (head is preferred)",
      "Only inside <main>",
    ],
    correctIndex: 2,
    explanation: "<style> can technically appear anywhere, but the conventional and safest place is <head>.",
  },

  // ───── Level 8 — HTML5 Semantics & Inputs ─────
  {
    id: 27, level: 8, levelName: "HTML5",
    question: "Which HTML5 input type opens a date picker on most browsers?",
    options: ['type="calendar"', 'type="date"', 'type="day"', 'type="datetime"'],
    correctIndex: 1,
    explanation: 'type="date" provides a native date-picker UI in modern browsers.',
  },
  {
    id: 28, level: 8, levelName: "HTML5",
    question: "Look at this code — what does the <progress> element show?",
    code: '<progress value="32" max="100"></progress>',
    options: [
      "A loading spinner",
      "A bar showing 32 out of 100 complete",
      "A countdown timer of 32 seconds",
      "An empty placeholder",
    ],
    correctIndex: 1,
    explanation: "<progress> renders a progress bar; value/max define how full it is.",
  },
  {
    id: 29, level: 8, levelName: "HTML5",
    question: "Which attribute makes a <details> block start in the open (expanded) state?",
    options: ["expanded", "open", "show", "visible"],
    correctIndex: 1,
    explanation: "<details open> renders the disclosure widget already expanded.",
  },
  {
    id: 30, level: 8, levelName: "HTML5",
    question: "Which HTML5 element is meant to highlight (mark) text — like a yellow highlighter?",
    options: ["<highlight>", "<mark>", "<em>", "<note>"],
    correctIndex: 1,
    explanation: "<mark> renders text with a highlight, typically yellow background.",
  },
];
