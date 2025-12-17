export interface Project {
  title: string
  text: string
  linkData: [string, string][]
  techList?: string
}

export const projects: Project[] = [
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
    title: "Lord Renovate - Dependency Management Dashboard",
    text: "A powerful dashboard for managing Renovate bot dependency updates across multiple repositories. Visualize, track, and manage automated dependency updates with ease.",
    linkData: [
      ["https://oglimmer.github.io/lord-renovate/", "Web"],
      ["https://github.com/oglimmer/lord-renovate", "source code"]
    ],
    techList: "[Vue.js, Renovate Bot, Dependency Management]"
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
    title: "A (very) simple build server",
    text: "An apache/cgi-bin/bash based build server. Still offers a simple UI.",
    linkData: [["https://github.com/oglimmer/simple-build-server", "source code"]],
    techList: "[Docker, apache, cgi-bin, bash, cron]"
  },
  {
    title: "Linky",
    text: "A link & surfing management application",
    linkData: [
      ["https://www.linky1.com", "go to linky"],
      ["https://github.com/oglimmer/linky", "source code"]],
    techList: "[JavaScript, ES6, Node.js, React, Redux, Nano, Isomorphic/Universal, Bootstrap, CouchDB]"
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
    text: "A classic board game played asynchronously via email",
    linkData: [
      ["https://junta-online.net/", "play"],
    ],
    techList: "[HTML4, JavaScript, Java, Spring, JDBC, Lombok, Flyway]"
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
  {
    title: "fulgens",
    text: "A build, local deploy and run script generator",
    linkData: [
      ["https://medium.com/@oglimmer/fulgens-c11016fdd5d8", "medium article"],
      ["https://github.com/oglimmer/fulgens", "source code"],
      ["http://npmjs.com/package/fulgens", "npm repo"],
    ],
    techList: "[JavaScript, ES6, Node.js, Npm Registry, Bash, Docker, Vagrant]"
  },
  {
    title: "Yet Another Tower Defense Game",
    text: "A multiplayer tower-defense fantasy combat game",
    linkData: [
      ["https://td.oglimmer.com/", "play"],
      ["https://github.com/oglimmer/yatdg", "source code"],
    ],
    techList: "[HTML5(Canvas, Websockets via Atmosphere), JavaScript, Java]"
  },
  {
    title: "Citybuilder",
    text: "A card based multi player board game",
    linkData: [
      ["https://cb.oglimmer.com/", "play"],
      ["https://github.com/oglimmer/citybuilder", "source code"],
    ],
    techList: "[HTML5(Canvas, Websockets via Socket.io), JavaScript / Node.js / jQuery, CouchDB]"
  },
  {
    title: "Told you so!",
    text: "A web offering for smart asses .... told you so!",
    linkData: [
      ["https://toldyouso.oglimmer.com/", "web"],
      ["https://github.com/oglimmer/toldyouso", "source code"],
    ],
    techList: "[Java8, maven, JSF, CouchDB]"
  },
  {
    title: "Grid Game One",
    text: "A hex-based, no-luck, kinda-turn-based strategy game",
    linkData: [
      ["https://ggo.oglimmer.com/", "play"],
      ["https://github.com/oglimmer/ggo", "source code"],
    ],
    techList: "[HTML5(Canvas, Websockets via Atmosphere), JavaScript, Java8, maven, Stripes, twitter-bootstrap, jQuery, Lombok]"
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
    text: "A card game simulator / trainer",
    linkData: [
      ["https://www.youtube.com/watch?v=cnw0UfJFfiE", "demo video"],
    ],
    techList: "[Java8, maven, Lombok]"
  },
  {
    title: "jFindPlus",
    text: "A program to find files inside jars and spot duplicate classes inside jars",
    linkData: [
      ["https://github.com/oglimmer/jfindplus", "source code"],
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
    title: "UASparser",
    text: "The Java side for user agent analysis. The legacy git repo's initial code was provided by me, see the first commit's author name ;) ",
    linkData: [
      ["https://github.com/chetan/UASparser", "source code"],
    ],
    techList: "[Java]"
  },
  {
    title: "podcast-human-syncer",
    text: "Helps with 'who is talking' and 'who wants to talk next / now' for podcasts",
    linkData: [
      ["https://github.com/oglimmer/podcast-human-syncer", "source code"],
    ],
    techList: "[JavaScript, ES6, Node.js, Svelte / Sapper]"
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
