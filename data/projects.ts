export interface Project {
  title: string
  text: string
  linkData: [string, string][]
  techList?: string
}

export const projects: Project[] = [
  {
    title: "ID5 IRL Attendance App",
    text: "A web app for collecting attendee information ahead of company offsites (\"IRLs\"). Admins (IRL team) configure an event once; employees sign in with Google SSO (restricted to @oglimmer.com) and submit attendance + travel details via a form with conditional logic. The app tracks non-responders, sends invitations + tz-aware reminders over email or Slack, logs all activity, and exports responses. Events can carry a cover image, and the admin activity timeline is filterable by participant vs. admin actions.",
    linkData: [
      ["https://irl-planner.oglimmer.com/", "Web"],
      ["https://github.com/oglimmer/irl-planner-pro", "source code"]
    ],
    techList: "[Go, Vue, TypeScript, Shell, CSS, Go Template]"
  },
  {
    title: "Coding Agent - Self-Service Feature Development Platform",
    text: "Self-service platform where authenticated users request features against configured GitHub repositories and an autonomous coding agent implements them end-to-end — with tests — opens a pull request, waits for the repository's GitHub Action review, and fixes the findings. It then auto-merges the approved PR, or — if the requester turns auto-merge off — stops at an approved, green PR and leaves the final merge to a human.",
    linkData: [
      ["https://coding-agent.oglimmer.com/", "Web"],
      ["https://github.com/oglimmer/coding-agent", "source code"]
    ],
    techList: "[Go, Shell, Vue, TypeScript, Docker, CSS]"
  },
  {
    title: "Trivia - Real-Time Multiplayer Trivia Game",
    text: "A mobile-first, real-time trivia game where players upload a photo and a question, the host runs the round, everyone answers live, and scores are revealed with a podium finish. Live updates via WebSocket, time-bonus scoring, scheduled-start games, and optional magic-link email login so players can rejoin from any device.",
    linkData: [
      ["https://trivia.oglimmer.com/", "play"],
      ["https://github.com/oglimmer/trivia", "source code"]
    ],
    techList: "[Vue 3, TypeScript, Vite, Pinia, Go, chi, gorilla/websocket, pgx, Postgres, Docker, Kubernetes, Helm]"
  },
  {
    title: "Plugin Skill Hosting - Claude Code Plugin Marketplace",
    text: "A self-hosted, token-gated Claude Code plugin marketplace for organizations to share plugins and skills. Authors edit skills via the web UI or a built-in MCP server, and the backend materialises every change into a bare git repo served over smart HTTP so updates are instantly available to every Claude Code user in the org.",
    linkData: [
      ["https://ai-plugins.oglimmer.com/", "Web"],
      ["https://github.com/oglimmer/plugin-skill-hosting", "source code"]
    ],
    techList: "[Go 1.25, chi, gitkit, MCP, Vue 3, TypeScript, Vite, Pinia, Postgres 16, nginx, Docker, Kubernetes, Helm]"
  },
  {
    title: "NIST Randomness Beacon - Verifiable Dice Rolls",
    text: "A single-page Vue 3 app that turns a public NIST beacon pulse plus a user-chosen seed into a SHA-256 hash and maps it to fair dice rolls. Anyone can re-fetch the same pulse and recompute the hash to verify the result — no trust required.",
    linkData: [
      ["https://oglimmer.github.io/nist-random/", "Web"],
      ["https://github.com/oglimmer/nist-random", "source code"]
    ],
    techList: "[Vue 3, Web Crypto API, SHA-256, NIST Beacon, GitHub Pages]"
  },
  {
    title: "Video Nicer - Video to MP4 Converter for macOS",
    text: "A native macOS app that converts video files to MP4 using ffmpeg. Supports drag-and-drop, right-click Finder context menu, and \"Open With\" integration. Includes a Finder extension for seamless conversion without opening a separate window.",
    linkData: [
      ["https://github.com/oglimmer/macos-webpm-video-convert", "source code"]
    ],
    techList: "[Swift, SwiftUI, macOS, ffmpeg, Homebrew]"
  },
  {
    title: "Coffee Diary - Espresso Brewing Tracker",
    text: "A web app for espresso enthusiasts to record beans, equipment, brewing parameters, and tasting notes. Log detailed brewing sessions, maintain inventories of coffee beans and filters, and refine your workflow over time.",
    linkData: [
      ["https://coffee.oglimmer.com/", "Web"],
      ["https://github.com/oglimmer/coffee-diary", "source code"]
    ],
    techList: "[Spring Boot, Java 21, Vue 3, TypeScript, MariaDB, Flyway, Docker, Kubernetes, Helm]"
  },
  {
    title: "Easy Host K8s - Simple Web Content Hosting",
    text: "A simple web content hosting service. Upload HTML and other files via API, and serve them on unique URLs. Built with a cloud-native architecture, designed for Kubernetes deployment.",
    linkData: [
      ["https://content.oglimmer.com/login", "Web"],
      ["https://github.com/oglimmer/easy-host-k8s", "source code"]
    ],
    techList: "[Spring Boot, Java 21, MariaDB, Flyway, Thymeleaf, Docker, Kubernetes, Helm]"
  },
  {
    title: "git-ls - Git-Aware Directory Listing",
    text: "A command-line utility that enhances the standard ls command by displaying directory listings with integrated git repository status information. Shows permissions, modification times, and color-coded indicators for staged changes, unstaged modifications, and untracked files.",
    linkData: [
      ["https://github.com/oglimmer/git-ls", "source code"]
    ],
    techList: "[Python, Git, CLI]"
  },
  {
    title: "zed-crypt - Transparent Encryption for Zed Editor",
    text: "Enables transparent encryption for the Zed editor. Edit encrypted .cpt files as if they were plaintext while they stay encrypted on disk. Decrypts files to a temporary location, opens them in Zed, monitors for changes, and re-encrypts automatically when saved.",
    linkData: [
      ["https://github.com/oglimmer/zed-crypt", "source code"]
    ],
    techList: "[Go, Zed, ccrypt, Homebrew]"
  },
  {
    title: "Boardwalk Billionaire - Property Trading Board Game",
    text: "A digital board game where you compete against three AI opponents on a 40-space board. Buy properties, collect rent, build houses and hotels, and negotiate trades to become the last player standing.",
    linkData: [
      ["https://boardwalk-billionaire.oglimmer.com/", "play"],
      ["https://github.com/oglimmer/boardwalk-billionaire", "source code"]
    ],
    techList: "[Vue 3, TypeScript, Pinia, Vite, Java, Docker, Kubernetes]"
  },
  {
    title: "git-llm - AI Commit Message Helper",
    text: "A Git extension that generates AI-powered commit messages using Simon Willison's llm CLI. Stage your changes, run git llm, and review the generated message before committing.",
    linkData: [
      ["https://github.com/oglimmer/git-llm-commit-message-helper", "source code"]
    ],
    techList: "[Shell, Git, LLM, AI]"
  },
  {
    title: "Coffee Kcal Calculator",
    text: "A simple web app to calculate the calories in your coffee drinks. Track your daily coffee intake and make informed choices about your caffeine habits.",
    linkData: [
      ["https://oglimmer.github.io/coffee-kcal-calc/", "Web"],
      ["https://github.com/oglimmer/coffee-kcal-calc/", "source code"]
    ],
    techList: "[Vue 3, TypeScript, Vite]"
  },
  {
    title: "Cybernight - Multiplayer Card Game",
    text: "A cyberpunk-themed multiplayer card game focused on resource management. Play against others in a neon-lit future where strategy and card play determine your success.",
    linkData: [
      ["https://cybernight.oglimmer.com", "Web"]
    ],
    techList: "[Vue, TypeScript, Java, Spring, JPA]"
  },
  {
    title: "Picz2 - Image Sharing System",
    text: "A private photo sharing platform for vacation memories. Share with friends without social media hassle. Features slideshow mode with audio narration. No accounts needed for viewers.",
    linkData: [
      ["https://picz2.oglimmer.com/", "Web"],
      ["https://github.com/oglimmer/picz2", "source code"]
    ],
    techList: "[Java, Spring, JPA, Vue.js, iOS, Swift]"
  },
  {
    title: "Video-Msg - Screen Recording Platform",
    text: "A full stack web application for sending screen recordings with audio commentary. Built with modern frameworks featuring a Vue 3 SPA frontend and a Spring Boot REST API backend.",
    linkData: [
      ["https://vmsg.oglimmer.com/", "Web"],
      ["https://github.com/oglimmer/video-msg", "source code"]
    ],
    techList: "[Vue 3, TypeScript, Vite, Pinia, Spring Boot, Java 21, MariaDB]"
  },
  {
    title: "Status Tacos - HTTP Monitoring & Alerting",
    text: "A comprehensive HTTP monitoring and alerting system. Monitor your websites and APIs with real-time status checks, uptime tracking, and instant notifications when services go down.",
    linkData: [
      ["https://tacos.oglimmer.com/", "Web"],
      ["https://github.com/oglimmer/status-tacos/", "source code"]
    ],
    techList: "[Java, Spring Boot, JPA, Vue.js]"
  },
  {
    title: "Deep Digest RSS - AI-Powered News Reader",
    text: "An intelligent RSS feed reader powered by AI and LLM technology. Automatically summarizes and digests news articles, helping you stay informed without information overload.",
    linkData: [
      ["https://news.oglimmer.com/", "Web"],
      ["https://github.com/oglimmer/deep-digest-rss/", "source code"]
    ],
    techList: "[Java, Spring Boot, AI, LLM, RSS]"
  },
  {
    title: "Renovate Initializr - an easy way to start with Renovate Bot",
    text: "A small web app that helps you create a clear, best‑practice renovate.json without reading the entire Renovate docs. Pick your preferences, preview the JSON live, and download the file for your repo.",
    linkData: [
      ["https://renovate.oglimmer.com", "Web"],
      ["https://github.com/oglimmer/start-renovate", "source code"]
    ],
    techList: "[Vue.js, Renovate Bot, Dependency Management]"
  },
  {
    title: "Recipes - Recipe Collection Website",
    text: "A modern, beautiful recipe collection website with photo galleries. Features responsive mobile/desktop design, fast Nuxt routing, and automatic GitHub Pages deployment.",
    linkData: [
      ["https://oglimmer.github.io/recipes/", "Web"],
      ["https://github.com/oglimmer/recipes/", "source code"]
    ],
    techList: "[Nuxt 4, Vue 3, Tailwind CSS, TypeScript, GitHub Actions]"
  },
  {
    title: "Traefik OIDC Auth Plugin",
    text: "A Traefik middleware plugin that adds OpenID Connect (OIDC) authentication capabilities to your reverse proxy. Secure your services with OAuth2/OIDC authentication flows.",
    linkData: [
      ["https://github.com/oglimmer/traefik-plugin-auth-oidc", "source code"]
    ],
    techList: "[Go, Traefik, Plugin, OIDC, OAuth2]"
  },
  {
    title: "Spring REST API tutorial",
    text: "A tutorial on how to build a REST API with Spring Boot for beginners",
    linkData: [["https://github.com/oglimmer/java-spring-boot-class/", "Read the tutorial"]],
    techList: "[Spring, Java, REST, Vue, Bash, JPA, Postgres, Docker]"
  },
  {
    title: "Picture Sharing Z",
    text: "A vacation photo sharing app for iPhone",
    linkData: [
      ["https://picz.oglimmer.com", "Web"],
      ["https://apps.apple.com/app/picture-sharing-z/id6462514741", "App Store"]
    ],
    techList: "[iOS, Swift, SwiftUI, MapKit, OAuth]"
  },
  {
    title: "perf-test - System Performance Benchmarking Tool",
    text: "A performance benchmarking tool that evaluates CPU and disk I/O performance. Features multi-threaded prime number calculations for CPU testing and filesystem read/write speed assessments.",
    linkData: [
      ["https://github.com/oglimmer/perf-test", "source code"]
    ],
    techList: "[Go]"
  },
  {
    title: "Karel the Bot",
    text: "A simple Karel the bot engine and UI implemented in JavaScript for HTML",
    linkData: [
      ["https://oglimmer.github.io/karel-robot-js/", "play"],
      ["https://github.com/oglimmer/karel-robot-js", "source code"]
    ],
    techList: "[JavaScript, Vue, Scripting-Engine, AST]"
  },
  {
    title: "Discord Bot for BlackJack",
    text: "A Discord bot to play BlackJack with friends",
    linkData: [
      ["https://discord.gg/FwDFmBtFmr", "Join Discord"],
      ["https://github.com/oglimmer/discord-bot-bj", "source code"],
      ["https://github.com/oglimmer/discord-bot-bj-aws", "terraform for aws"]
    ],
    techList: "[TypeScript, Nodejs, Terraform, AWS, Husky, sqlite]"
  },
  {
    title: "OCPP Chargepoint Simulator",
    text: "A scriptable OCPP Chargepoint Simulator for OCPP 1.6J.",
    linkData: [["https://github.com/oglimmer/scriptable-ocpp-chargepoint-simulator", "source code"]],
    techList: "[TypeScript, Nodejs, Websockets, OCPP, FTP]"
  },
  {
    title: "Simple Build Server",
    text: "A lightweight, containerized build server written in Go. Triggers builds instantly via API or web dashboard with bearer token auth and bcrypt-hashed credentials.",
    linkData: [
      ["https://github.com/oglimmer/simple-build-server", "source code"],
      ["/blog/rewriting-simple-build-server-in-go", "blog post"]
    ],
    techList: "[Go, Docker, REST API, Bootstrap]"
  },
  {
    title: "Linky",
    text: "A bookmark management system for organizing, searching, and tracking web links with tagging, full-text search, and RSS feed monitoring.",
    linkData: [
      ["https://www.linky1.com", "go to linky"],
      ["https://github.com/oglimmer/linky", "source code"]],
    techList: "[Vue 3, TypeScript, Tailwind CSS, Pinia, Go, MariaDB, Docker, Helm]"
  },
  {
    title: "BlackJack REST API / JavaScript playground",
    text: "A REST API providing BlackJack (playable via JavaScript)",
    linkData: [
      ["https://bj.oglimmer.com/", "play"],
      ["https://github.com/oglimmer/blackjack-rest-api", "source code"],
    ],
    techList: "[c++20, oat++, cmake, bash-scripting, Dockerfile, github-action, swagger/OpenAPI, JavaScript, Ace]"
  },
  {
    title: "Mathematical Function parser library (C++) and REST API",
    text: "Library parsing and resolving mathematical functions like 'sin(pi)*3^(2+1)' and a REST API providing this service to the public internet.",
    linkData: [
      ["https://math.oglimmer.com/", "web ui"],
      ["https://github.com/oglimmer/math_parser_cpp", "parser code"],
      ["https://github.com/oglimmer/math-parser-rest-api", "api code"]
    ],
    techList: "[c++20, oat++, cmake, conan, doctest, Dockerfile, github-action, swagger/OpenAPI, FSM, AST]"
  },
  {
    title: "Mathematical Function parser library (Java)",
    text: "Library parsing and resolving mathematical functions like 'sin(pi)*3^(2+1)'",
    linkData: [
      ["https://github.com/oglimmer/math-parser", "source code"],
    ],
    techList: "[Java, github-action, FSM, AST]"
  },
  {
    title: "Code Your Restaurant",
    text: "A JavaScript coding game",
    linkData: [
      ["https://www.codeyourrestaurant.com/", "play"],
      ["https://github.com/oglimmer/cyc", "source code"],
    ],
    techList: "[Java8, maven, CouchDB, JavaScript, Rhino, Groovy, Ace]"
  },
  {
    title: "Lunchy",
    text: "Corporate lunch information system",
    linkData: [
      ["https://lunchylunch.com/", "go to lunchy"],
      ["https://lunchylunch.com/", "source code"],
    ],
    techList: "[Java8, maven, Jooq, Liquibase, AngularJS, Boostrap, Jersey, Lombok, Webjars]"
  },
  {
    title: "Junta Online",
    text: "A classic board game played asynchronously via email. Source code is not publicly available due to the licensed nature of the original board game.",
    linkData: [
      ["https://junta-online.net/", "play"],
    ],
    techList: "[HTML4, JavaScript, Java, Spring, JDBC, Lombok, Flyway]"
  },
  {
    title: "Yet Another Tower Defense Game",
    text: "A multiplayer tower-defense fantasy combat game",
    linkData: [
      ["https://td.oglimmer.com/", "play"],
      ["https://github.com/oglimmer/yatdg", "source code"],
    ],
    techList: "[Java, HTML5 Canvas, JavaScript, Maven, Docker, Kubernetes]"
  },
  {
    title: "Citybuilder",
    text: "A card-based multiplayer online board game with real-time competitive gameplay",
    linkData: [
      ["https://cb.oglimmer.com/", "play"],
      ["https://github.com/oglimmer/citybuilder", "source code"],
    ],
    techList: "[Node.js, Vite, HTML5 Canvas, Socket.IO, JavaScript, CouchDB, Docker, Kubernetes]"
  },
  {
    title: "Told you so!",
    text: "A web app to document predictions with tamper-proof timestamps, preserving evidence of your foresight.",
    linkData: [
      ["https://toldyouso.oglimmer.com/", "web"],
      ["https://github.com/oglimmer/toldyouso", "source code"],
    ],
    techList: "[Java, JSF, Bootstrap 5, CouchDB, Redis, Docker, Kubernetes]"
  },
  {
    title: "Grid Game One",
    text: "A hex-based, no-luck, kinda-turn-based strategy game",
    linkData: [
      ["https://ggo.oglimmer.com/", "play"],
      ["https://github.com/oglimmer/ggo", "source code"],
    ],
    techList: "[Java, Spring Boot, HTML5 Canvas, JavaScript, WebSocket, Maven, Docker]"
  },
  {
    title: "Simple Card Game",
    text: "A game for 4 players playable via email",
    linkData: [
      ["https://scg.oglimmer.com/", "play"],
      ["https://github.com/oglimmer/scg", "source code"],
    ],
    techList: "[Java7, maven]"
  },
  {
    title: "SWLCG Deck Builder",
    text: "An alternative approach to Star Wars LCG deck building",
    linkData: [
      ["https://swlcg.oglimmer.com/", "web"],
      ["https://github.com/oglimmer/deckbuilderswlcg", "source code"],
    ],
    techList: "[HTML, jQuery, CouchDB, Groovy]"
  },
  {
    title: "SWCCG Deck Builder",
    text: "A web based approach to Star Wars CCG deck building",
    linkData: [
      ["https://github.com/oglimmer/deckbuilderswccg", "source code"],
    ],
    techList: "[HTML, jQuery, CouchDB, Groovy]"
  },
  {
    title: "Online card game environment",
    text: "Let's you play SWCCG and SWLCG online card game",
    linkData: [
      ["https://bcg.oglimmer.com/", "web"],
      ["https://github.com/oglimmer/onlinecardgameassistance", "source code"],
    ],
    techList: "[HTML5 (Websockets via Java-WebSocket), Dojo Toolkit, CouchDB, Java/Groovy]"
  },
  {
    title: "Shadowrun Crossfire",
    text: "A card game simulator / trainer. Source code is not publicly available due to the licensed nature of the original card game.",
    linkData: [
      ["https://www.youtube.com/watch?v=cnw0UfJFfiE", "demo video"],
    ],
    techList: "[Java8, maven, Lombok]"
  },
]

export const legacyProjects: Project[] = [
  {
    title: "podcast-human-syncer",
    text: "Helps with 'who is talking' and 'who wants to talk next / now' for podcasts",
    linkData: [
      ["https://github.com/oglimmer/podcast-human-syncer", "source code"],
    ],
    techList: "[JavaScript, ES6, Node.js, Svelte / Sapper]"
  },
  {
    title: "UASparser",
    text: "The Java side for user agent analysis. The legacy git repo's initial code was provided by me, see the first commit's author name ;) ",
    linkData: [
      ["https://github.com/chetan/UASparser", "source code"],
    ],
    techList: "[Java]"
  },
  {
    title: "Experimental binary store",
    text: "A binary store server, called ifcdb - 'infrequently changed data database'",
    linkData: [
      ["https://github.com/oglimmer/ifcdb", "source code"],
    ],
    techList: "[Java7, maven, JBoss-Weld, Hibernate]"
  },
  {
    title: "jFindPlus",
    text: "A command-line utility to search for class files inside JAR, EAR, and WAR archives. Lists all classes, detects duplicate classes across multiple archives, and compares two JAR files for differences.",
    linkData: [
      ["https://github.com/oglimmer/jfindplus", "source code"],
    ],
    techList: "[Java 17, Maven, Homebrew]"
  },
  {
    title: "fulgens",
    text: "A build, local deploy and run script generator",
    linkData: [
      ["/blog/fulgens-build-deploy-script-generator", "blog post"],
      ["https://github.com/oglimmer/fulgens", "source code"],
      ["http://npmjs.com/package/fulgens", "npm repo"],
    ],
    techList: "[JavaScript, ES6, Node.js, Npm Registry, Bash, Docker, Vagrant]"
  },
  {
    title: "oglimmer-commons",
    text: "Prevent boilerplate code for random strings and names, SPI-based slf4j configuration, sophisticated property files, human readable representation of date differences and getting attributes from MANIFEST.FM files.",
    linkData: [
      ["https://github.com/oglimmer/utils", "source code"],
      ["https://search.maven.org/artifact/de.oglimmer.utils/common-utils", "maven central"],
    ],
    techList: "[Java8, maven, Lombok]"
  },
]

// Helper function to parse tech list string
export function parseTechList(techList?: string): string[] {
  if (!techList) return []
  // Remove brackets and split by comma
  return techList
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map(tech => tech.trim())
    .filter(tech => tech.length > 0)
}
