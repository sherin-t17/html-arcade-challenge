// HTML Arcade — 24 ORIGINAL questions inspired by the HTML/CSS Study Guide topics.
// Same 8 levels but completely different wording, scenarios, and code samples.

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
  // Level 1 — Core Structure
  {
    id: 1, level: 1, levelName: "Core Structure",
    question: "Which section of an HTML document holds metadata like the page title and CSS links?",
    options: ["<body>", "<header>", "<head>", "<meta>"],
    correctIndex: 2,
    explanation: "<head> contains metadata: <title>, <meta>, <link>, and <script> references.",
  },
  {
    id: 2, level: 1, levelName: "Core Structure",
    question: "Looking at this skeleton, what should go in the blank line?",
    code: "<!DOCTYPE html>\n<html>\n  ____\n  <body>...</body>\n</html>",
    options: ["<title>", "<head>...</head>", "<meta>", "<style>"],
    correctIndex: 1,
    explanation: "Every HTML page needs both a <head> (metadata) and a <body> (content) inside <html>.",
  },
  {
    id: 3, level: 1, levelName: "Core Structure",
    question: "What is the correct file extension for an HTML web page?",
    options: [".htm5", ".web", ".html", ".page"],
    correctIndex: 2,
    explanation: ".html is the standard extension recognized by all modern browsers.",
  },

  // Level 2 — Semantic HTML
  {
    id: 4, level: 2, levelName: "Semantic HTML",
    question: "You want to wrap the bottom copyright and contact info of a page. Which tag is most semantic?",
    options: ["<bottom>", "<footer>", "<aside>", "<section>"],
    correctIndex: 1,
    explanation: "<footer> is the semantic element for content at the bottom — author info, copyright, links.",
  },
  {
    id: 5, level: 2, levelName: "Semantic HTML",
    question: "Which element best represents a self-contained blog post that could stand alone?",
    options: ["<div>", "<section>", "<article>", "<main>"],
    correctIndex: 2,
    explanation: "<article> is for independent, self-contained content — perfect for a blog post or news story.",
  },
  {
    id: 6, level: 2, levelName: "Semantic HTML",
    question: "Why prefer semantic tags over plain <div> elements?",
    options: [
      "They render faster in the browser",
      "They improve accessibility, SEO, and code clarity",
      "They use less memory",
      "They are required by HTML5",
    ],
    correctIndex: 1,
    explanation: "Semantic tags help screen readers, search engines, and other developers understand your structure.",
  },

  // Level 3 — Text & Media
  {
    id: 7, level: 3, levelName: "Text & Media",
    question: "Which tag visually emphasizes text in italic for stylistic reasons (without semantic meaning)?",
    options: ["<em>", "<i>", "<italic>", "<strong>"],
    correctIndex: 1,
    explanation: "<i> is purely visual italic; <em> conveys emphasis with semantic meaning.",
  },
  {
    id: 8, level: 3, levelName: "Text & Media",
    question: "Looking at this image tag, which attribute makes it accessible to screen readers?",
    code: '<img src="cat.jpg" width="300" alt="A fluffy orange cat">',
    options: ["src", "width", "alt", "title"],
    correctIndex: 2,
    explanation: "alt provides a text description for screen readers and shows when the image fails to load.",
  },
  {
    id: 9, level: 3, levelName: "Text & Media",
    question: "Which tag is used to create an unordered (bulleted) list?",
    options: ["<ol>", "<li>", "<ul>", "<list>"],
    correctIndex: 2,
    explanation: "<ul> creates an unordered list with bullets; <ol> creates an ordered (numbered) list.",
  },

  // Level 4 — Links & Navigation
  {
    id: 10, level: 4, levelName: "Links & Navigation",
    question: "Which attribute of <a> specifies the destination URL?",
    options: ["src", "link", "href", "url"],
    correctIndex: 2,
    explanation: "href (HyperText REFerence) tells the browser where the link should go.",
  },
  {
    id: 11, level: 4, levelName: "Links & Navigation",
    question: "How do you create a link that jumps to a section with id='contact' on the same page?",
    options: [
      '<a href="contact">',
      '<a href="#contact">',
      '<a href=".contact">',
      '<a href="@contact">',
    ],
    correctIndex: 1,
    explanation: "The # prefix targets an element by its id on the current page.",
  },
  {
    id: 12, level: 4, levelName: "Links & Navigation",
    question: "Look at this link — what will happen when clicked?",
    code: '<a href="tel:+919876543210">Call Us</a>',
    options: [
      "Opens a new website",
      "Triggers the phone app to dial the number",
      "Sends a text message",
      "Does nothing on mobile",
    ],
    correctIndex: 1,
    explanation: "tel: protocol prompts the device to dial the given phone number.",
  },

  // Level 5 — Forms & Input
  {
    id: 13, level: 5, levelName: "Forms & Input",
    question: "Which input type lets the user pick a number using up/down arrows?",
    options: ['type="text"', 'type="number"', 'type="range"', 'type="numeric"'],
    correctIndex: 1,
    explanation: 'type="number" gives a numeric input with built-in spinner controls.',
  },
  {
    id: 14, level: 5, levelName: "Forms & Input",
    question: "What is missing from this label–input pair to properly link them?",
    code: '<label>Email</label>\n<input type="email" id="email">',
    options: [
      "Add name='email' to input",
      "Add for='email' to label",
      "Add type='label' to label",
      "Wrap them in a <div>",
    ],
    correctIndex: 1,
    explanation: "The label's for attribute must match the input's id to make them accessible.",
  },
  {
    id: 15, level: 5, levelName: "Forms & Input",
    question: "Which element is used for a multi-line text input box?",
    options: ["<input type='text'>", "<textbox>", "<textarea>", "<longtext>"],
    correctIndex: 2,
    explanation: "<textarea> creates a resizable, multi-line text input area.",
  },

  // Level 6 — Tables
  {
    id: 16, level: 6, levelName: "Tables",
    question: "Which tag groups the body rows of a table?",
    options: ["<tbody>", "<tgroup>", "<rows>", "<tr>"],
    correctIndex: 0,
    explanation: "<tbody> groups the main data rows, separating them from <thead> and <tfoot>.",
  },
  {
    id: 17, level: 6, levelName: "Tables",
    question: "What does this code do?",
    code: '<td rowspan="2">Hello</td>',
    options: [
      "Repeats 'Hello' twice",
      "Stretches the cell across 2 rows vertically",
      "Stretches across 2 columns horizontally",
      "Creates 2 nested cells",
    ],
    correctIndex: 1,
    explanation: "rowspan='2' makes the cell occupy 2 rows vertically.",
  },
  {
    id: 18, level: 6, levelName: "Tables",
    question: "Which tag wraps a single row inside a table?",
    options: ["<row>", "<tr>", "<td>", "<rw>"],
    correctIndex: 1,
    explanation: "<tr> (table row) wraps the cells (<td> or <th>) of a single row.",
  },

  // Level 7 — Embedding & Scripting
  {
    id: 19, level: 7, levelName: "Embedding & Scripting",
    question: "Which tag links an external CSS stylesheet to your HTML page?",
    options: ["<style>", "<css>", "<link>", "<script>"],
    correctIndex: 2,
    explanation: '<link rel="stylesheet" href="styles.css"> attaches an external CSS file.',
  },
  {
    id: 20, level: 7, levelName: "Embedding & Scripting",
    question: "What attribute should you add to load a JavaScript file without blocking page rendering?",
    code: '<script src="app.js"></script>',
    options: ["async or defer", "lazy", "wait", "nonblock"],
    correctIndex: 0,
    explanation: "async and defer let the browser keep parsing HTML while downloading the script.",
  },
  {
    id: 21, level: 7, levelName: "Embedding & Scripting",
    question: "Which HTML tag plays an audio file natively in the browser?",
    options: ["<sound>", "<media>", "<audio>", "<music>"],
    correctIndex: 2,
    explanation: "<audio src='song.mp3' controls> plays audio with native browser controls.",
  },

  // Level 8 — HTML5
  {
    id: 22, level: 8, levelName: "HTML5",
    question: "Which HTML5 input type validates that the user enters a proper URL?",
    options: ['type="link"', 'type="url"', 'type="web"', 'type="address"'],
    correctIndex: 1,
    explanation: 'type="url" provides built-in URL format validation in modern browsers.',
  },
  {
    id: 23, level: 8, levelName: "HTML5",
    question: "What is the purpose of the HTML5 <video> element?",
    code: '<video src="movie.mp4" controls></video>',
    options: [
      "Display a static image",
      "Embed and play video natively without plugins",
      "Stream live TV channels",
      "Record video from webcam",
    ],
    correctIndex: 1,
    explanation: "<video> plays video files natively — no Flash or plugins needed.",
  },
  {
    id: 24, level: 8, levelName: "HTML5",
    question: "Which attribute on an <input> shows hint text inside the field that disappears when typing?",
    options: ["hint", "default", "placeholder", "tooltip"],
    correctIndex: 2,
    explanation: 'placeholder="Enter name..." shows greyed-out hint text inside the input.',
  },
];
