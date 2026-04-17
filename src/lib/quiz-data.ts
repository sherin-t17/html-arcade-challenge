// HTML Arcade — 24 questions (3 per level × 8 levels) drawn from the HTML/CSS Study Guide.
// Each question has options[]; correctIndex points to the right answer (pre-shuffle).

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
    question: "What does HTML stand for?",
    options: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "HyperTool Markup Language",
      "HyperText Making Language",
    ],
    correctIndex: 0,
    explanation: "HTML = HyperText Markup Language — the standard markup of the web.",
  },
  {
    id: 2, level: 1, levelName: "Core Structure",
    question: "Which tag wraps ALL content on an HTML page?",
    options: ["<body>", "<head>", "<html>", "<main>"],
    correctIndex: 2,
    explanation: "<html> is the root element that contains <head> and <body>.",
  },
  {
    id: 3, level: 1, levelName: "Core Structure",
    question: "What is the purpose of this line?",
    code: "<!DOCTYPE html>",
    options: [
      "It links a CSS file",
      "It starts the <html> tag",
      "It tells the browser this is an HTML5 document",
      "It adds a page title",
    ],
    correctIndex: 2,
    explanation: "<!DOCTYPE html> declares the document type as HTML5.",
  },

  // Level 2 — Semantic HTML
  {
    id: 4, level: 2, levelName: "Semantic HTML",
    question: 'Which tag means "navigation links"?',
    options: ["<div>", "<nav>", "<link>", "<menu>"],
    correctIndex: 1,
    explanation: "<nav> is the semantic element for navigation menus.",
  },
  {
    id: 5, level: 2, levelName: "Semantic HTML",
    question: "Which tag should be used only ONCE per page?",
    options: ["<section>", "<article>", "<main>", "<aside>"],
    correctIndex: 2,
    explanation: "<main> represents the dominant content and must appear only once.",
  },
  {
    id: 6, level: 2, levelName: "Semantic HTML",
    question: "What's wrong with this code?",
    code: "<div>Navigation</div>\n<div>Footer</div>",
    options: [
      "Nothing is wrong",
      "divs can't hold text",
      "These should use semantic tags like <nav> and <footer>",
      "Divs need a class attribute",
    ],
    correctIndex: 2,
    explanation: "Use semantic tags like <nav> and <footer> for accessibility & SEO.",
  },

  // Level 3 — Text & Media
  {
    id: 7, level: 3, levelName: "Text & Media",
    question: "Which heading tag is the LARGEST?",
    options: ["<h6>", "<h3>", "<h1>", "<heading>"],
    correctIndex: 2,
    explanation: "<h1> is the largest and most important heading.",
  },
  {
    id: 8, level: 3, levelName: "Text & Media",
    question: "What is the difference between <strong> and <b>?",
    options: [
      "No difference",
      "<strong> is semantic (meaningful) bold, <b> is just visual",
      "<b> is semantic",
      "<strong> is italic",
    ],
    correctIndex: 1,
    explanation: "<strong> conveys importance; <b> is purely visual styling.",
  },
  {
    id: 9, level: 3, levelName: "Text & Media",
    question: "What important attribute is missing?",
    code: '<img src="photo.jpg">',
    options: ["width", "height", "alt", "title"],
    correctIndex: 2,
    explanation: "alt text is essential for accessibility & when images fail to load.",
  },

  // Level 4 — Links & Navigation
  {
    id: 10, level: 4, levelName: "Links & Navigation",
    question: "What does href stand for?",
    options: [
      "HyperText Reference File",
      "HyperText REFerence",
      "Hyperlink Resource",
      "Home REFerence",
    ],
    correctIndex: 1,
    explanation: "href = HyperText REFerence — the URL the link points to.",
  },
  {
    id: 11, level: 4, levelName: "Links & Navigation",
    question: "Which href value opens the user's email app?",
    options: ["email:", "send:", "mailto:", "msg:"],
    correctIndex: 2,
    explanation: 'mailto: launches the default email client (e.g. mailto:hi@x.com).',
  },
  {
    id: 12, level: 4, levelName: "Links & Navigation",
    question: 'What does target="_blank" do?',
    code: '<a href="page.html" target="_blank">',
    options: [
      "Opens in same tab",
      "Downloads the file",
      "Opens in a new tab",
      "Opens in a popup",
    ],
    correctIndex: 2,
    explanation: 'target="_blank" opens the link in a new browser tab.',
  },

  // Level 5 — Forms & Input
  {
    id: 13, level: 5, levelName: "Forms & Input",
    question: "Which input type hides characters as dots?",
    options: ['type="hidden"', 'type="secret"', 'type="password"', 'type="private"'],
    correctIndex: 2,
    explanation: 'type="password" masks input — used for passwords.',
  },
  {
    id: 14, level: 5, levelName: "Forms & Input",
    question: "What is the difference between GET and POST?",
    options: [
      "No difference",
      "GET hides data, POST shows it",
      "GET shows data in URL, POST hides it",
      "POST is only for images",
    ],
    correctIndex: 2,
    explanation: "GET appends data to the URL; POST sends it in the request body.",
  },
  {
    id: 15, level: 5, levelName: "Forms & Input",
    question: "Which attribute is missing to make this field mandatory?",
    code: '<input type="email" name="mail">',
    options: ["validate", "mandatory", "required", "must"],
    correctIndex: 2,
    explanation: "The required attribute makes a form field mandatory.",
  },

  // Level 6 — Tables
  {
    id: 16, level: 6, levelName: "Tables",
    question: "Which tag creates a header cell in a table?",
    options: ["<td>", "<tr>", "<th>", "<thead>"],
    correctIndex: 2,
    explanation: "<th> defines a header cell (bold & centered by default).",
  },
  {
    id: 17, level: 6, levelName: "Tables",
    question: 'What does colspan="3" do?',
    options: [
      "Merges 3 rows vertically",
      "Merges 3 columns horizontally",
      "Adds 3 borders",
      "Creates 3 tables",
    ],
    correctIndex: 1,
    explanation: "colspan merges columns horizontally; rowspan merges rows vertically.",
  },
  {
    id: 18, level: 6, levelName: "Tables",
    question: "What is the correct nesting order?",
    code: "<table>\n  <thead>\n    <tr>\n      <th>...</th>",
    options: [
      "table > tr > thead > td",
      "table > thead > td > tr",
      "table > thead > tr > th",
      "table > th > tr > td",
    ],
    correctIndex: 2,
    explanation: "Correct nesting: table → thead → tr → th (then tbody → tr → td).",
  },

  // Level 7 — Embedding & Scripting
  {
    id: 19, level: 7, levelName: "Embedding & Scripting",
    question: "Which tag is used to embed another webpage or YouTube video?",
    options: ["<embed>", "<frame>", "<iframe>", "<include>"],
    correctIndex: 2,
    explanation: "<iframe> embeds another HTML document inside the current one.",
  },
  {
    id: 20, level: 7, levelName: "Embedding & Scripting",
    question: "Where is the BEST place to put your <script> tag?",
    options: [
      "Inside <head>",
      "Before <html>",
      "At the bottom of <body>",
      "After </html>",
    ],
    correctIndex: 2,
    explanation: "Placing scripts at the end of <body> lets the page render first.",
  },
  {
    id: 21, level: 7, levelName: "Embedding & Scripting",
    question: "Which is the BEST practice for adding CSS to a webpage?",
    options: [
      "Inline style",
      "<style> in head",
      "External CSS file with <link>",
      "JavaScript",
    ],
    correctIndex: 2,
    explanation: "External CSS keeps styles maintainable, cacheable, and reusable.",
  },

  // Level 8 — HTML5
  {
    id: 22, level: 8, levelName: "HTML5",
    question: "Which input type shows a calendar date picker?",
    options: ['type="calendar"', 'type="picker"', 'type="date"', 'type="time"'],
    correctIndex: 2,
    explanation: 'type="date" renders a built-in date picker.',
  },
  {
    id: 23, level: 8, levelName: "HTML5",
    question: "Which meta tag makes a page mobile-friendly?",
    options: [
      '<meta charset="UTF-8">',
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '<meta name="mobile">',
      '<meta name="responsive">',
    ],
    correctIndex: 1,
    explanation: "The viewport meta tag enables responsive scaling on mobile devices.",
  },
  {
    id: 24, level: 8, levelName: "HTML5",
    question: "What is the <canvas> element used for?",
    code: '<canvas id="myCanvas"></canvas>',
    options: [
      "Displaying images",
      "Embedding videos",
      "Drawing graphics with JavaScript",
      "Creating forms",
    ],
    correctIndex: 2,
    explanation: "<canvas> is a drawing surface manipulated via JavaScript.",
  },
];
