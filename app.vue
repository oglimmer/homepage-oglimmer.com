<script setup lang="ts">

const colorMode = useColorMode();

useHead({
  title: 'oglimmer`s Web-Tech-Workshop',
  meta: [
    { name: 'description', content: 'oglimmer\'s web-based applications, tools and games' }
  ],
  htmlAttrs: {
    lang: 'en',
    'data-bs-theme': colorMode.value
  }
})

watch(colorMode, _ => {
  useHead({
    htmlAttrs: {
      'data-bs-theme': colorMode.value
    }
  })
})

const data = [
    {
        imageSrc: "./images/github.com.jpg",
        title: "github.com",
        text: "My github account",
        linkData: [["https://github.com/oglimmer", "github.com/oglimmer"]]
    },
    {
        imageSrc: "./images/linkedin.com.jpg",
        title: "linkedin.com",
        text: "My Linkedin profile",
        linkData: [["https://www.linkedin.com/in/oliver-zimpasser", "www.linkedin.com/in/oliver-zimpasser"]],
    },
    {
        imageSrc: "./images/medium.com.jpg",
        title: "medium.com",
        text: "I've written a couple of articles on medium.com",
        linkData: [["https://oglimmer.medium.com", "oglimmer.medium.com"]]
    },
    {
        imageSrc: "./images/hub.docker.com.jpg",
        title: "hub.docker.com",
        text: "My docker hub",
        linkData: [["https://hub.docker.com/u/oglimmer", "hub.docker.com/u/oglimmer"]]
    },
    {
        imageSrc: "./images/picz.jpg",
        title: "Picture Sharing Z",
        text: "A vacation photo sharing app for iPhone",
        linkData: [
          ["https://picz.oglimmer.de", "picz.oglimmer.de"],
          ["https://apps.apple.com/app/picture-sharing-z/id6462514741", "App Store"]
        ],
        techList: "[iOS, Swift, SwiftUI, MapKit, OAuth]"
    },
    {
        imageSrc: "./images/karel.jpg",
        title: "Karel the Bot",
        text: "A simple Karel the bot engine and UI implemented in JavaScript for HTML",
        linkData: [
          ["https://oglimmer.github.io/karel-robot-js/", "play"], 
          ["https://github.com/oglimmer/karel-robot-js", "source code"]
        ],
        techList: "[JavaScript, Vue, Scripting-Engine, AST]"
    },
    {
        imageSrc: "./images/blackjack.jpg",
        title: "Discord Bot for BlackJack",
        text: "My docker hub",
        linkData: [ 
                    ["https://discord.gg/FwDFmBtFmr", "Join Discord"],
                    ["https://github.com/oglimmer/discord-bot-bj", "source code"],
                    ["https://github.com/oglimmer/discord-bot-bj-aws", "terraform for aws"]
                  ],
        techList: "[TypeScript, Nodejs, Terraform, AWS, Husky, sqlite]"
    },
    {
        imageSrc: "./images/build-server.jpg",
        title: "A (very) simple build server",
        text: "An apache/cgi-bin/bash based build server. Still offers a simple UI.",
        linkData: [["https://github.com/oglimmer/simple-build-server", "source code"]],
        techList: "[Docker, apache, cgi-bin, bash, cron]"
    },
    {
        imageSrc: "./images/homepage-oglimmer.jpg",
        title: "homepage oglimmer.de itself",
        text: "How this page is built using Nuxt, Boostrap, and static builds",
        linkData: [["https://github.com/oglimmer/homepage-oglimmer.de", "source code"]],
        techList: "[Nuxt, Vue, TypeScript, Bootstrap]"
    },
    {
        imageSrc: "./images/linky1.com.jpg",
        title: "Linky",
        text: "A link & surfing management application",
        linkData: [
          ["https://www.linky1.com", "go to linky"],
          ["https://github.com/oglimmer/linky", "source code"]],
        techList: "[JavaScript, ES6, Node.js, React, Redux, Nano, Isomorphic/Universal, Bootstrap, CouchDB]"
    },
    {
        imageSrc: "./images/blackjack-ui.jpg",
        title: "BlackJack REST API / JavaScript playground",
        text: "A REST API providing BlackJack (playable via JavaScript)",
        linkData: [
          ["https://bj.oglimmer.de/", "play"],
          ["https://github.com/oglimmer/blackjack-rest-api", "source code"],
        ],
        techList: "[c++20, oat++, cmake, bash-scripting, Dockerfile, github-action, swagger/OpenAPI, JavaScript, Ace]"
    },
    {
        imageSrc: "./images/math.jpg",
        title: "Mathematical Function parser library (C++) and REST API",
        text: "Library parsing and resolving mathematical functions like 'sin(pi)*3^(2+1)' and a REST API providing this service to the public internet.",
        linkData: [
          ["https://math.oglimmer.de/", "web ui"],          
          ["https://github.com/oglimmer/math_parser_cpp", "parser code"],
          ["https://github.com/oglimmer/math-parser-rest-api", "api code"]
        ],
        techList: "[c++20, oat++, cmake, conan, doctest, Dockerfile, github-action, swagger/OpenAPI, FSM, AST]"
    },
    {
        imageSrc: "./images/math-java.jpg",
        title: "Mathematical Function parser library (Java)",
        text: "Library parsing and resolving mathematical functions like 'sin(pi)*3^(2+1)'",
        linkData: [
          ["https://github.com/oglimmer/math-parser", "source code"],
        ],
        techList: "[Java, github-action, FSM, AST]"
    },
    {
        imageSrc: "./images/cyr.jpg",
        title: "Code Your Restaurant",
        text: "A JavaScript coding game",
        linkData: [
          ["https://www.codeyourrestaurant.com/", "play"],
          ["https://github.com/oglimmer/cyc", "source code"],
        ],
        techList: "[Java8, maven, CouchDB, JavaScript, Rhino, Groovy, Ace]"
    },
    {
        imageSrc: "./images/lunchy.jpg",
        title: "Lunchy",
        text: "Corporate lunch information system",
        linkData: [
          ["https://lunchylunch.com/", "go to lunchy"],
          ["https://lunchylunch.com/", "source code"],
        ],
        techList: "[Java8, maven, Jooq, Liquibase, AngularJS, Boostrap, Jersey, Lombok, Webjars]"
    },
    {
        imageSrc: "./images/junta.jpg",
        title: "Junta Online",
        text: "A classic board game played asynchronously via email",
        linkData: [
          ["https://junta-online.net/", "play"],
        ],
        techList: "[HTML4, JavaScript, Java, Spring, JDBC, Lombok, Flyway]"
    },        
    {
        imageSrc: "./images/oglimmer-commons.jpg",
        title: "oglimmer-commons",
        text: "Prevent boilerplate code for random strings and names, SPI-based slf4j configuration, sophisticated property files, human readable representation of date differences and getting attributes from MANIFEST.FM files.",
        linkData: [
          ["https://github.com/oglimmer/utils", "source code"],
          ["https://search.maven.org/artifact/de.oglimmer.utils/common-utils", "maven central"],
        ],
        techList: "[Java8, maven, Lombok]"
    },        
    {
        imageSrc: "./images/fulgens.jpg",
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
        imageSrc: "./images/yatdg.jpg",
        title: "Yet Another Tower Defense Game",
        text: "A multiplayer tower-defense fantasy combat game",
        linkData: [
          ["https://td.oglimmer.de/", "play"],
          ["https://github.com/oglimmer/yatdg", "source code"],
        ],
        techList: "[HTML5(Canvas, Websockets via Atmosphere), JavaScript, Java]"
    },        
    {
        imageSrc: "./images/citybuilder.jpg",
        title: "Citybuilder",
        text: "A card based multi player board game",
        linkData: [
          ["https://cb.oglimmer.de/", "play"],
          ["https://github.com/oglimmer/citybuilder", "source code"],
        ],
        techList: "[HTML5(Canvas, Websockets via Socket.io), JavaScript / Node.js / jQuery, CouchDB]"
    },        
    {
        imageSrc: "./images/toldyouso.jpg",
        title: "Told you so!",
        text: "A web offering for smart asses .... told you so!",
        linkData: [
          ["https://toldyouso.oglimmer.de/", "web"],
          ["https://github.com/oglimmer/toldyouso", "source code"],
        ],
        techList: "[Java8, maven, JSF, CouchDB]"
    },        
    {
        imageSrc: "./images/ggo.jpg",
        title: "Grid Game One",
        text: "A hex-based, no-luck, kinda-turn-based strategy game",
        linkData: [
          ["https://ggo.oglimmer.de/", "play"],
          ["https://github.com/oglimmer/ggo", "source code"],
        ],
        techList: "[HTML5(Canvas, Websockets via Atmosphere), JavaScript, Java8, maven, Stripes, twitter-bootstrap, jQuery, Lombok]"
    },        
    {
        imageSrc: "./images/scg.jpg",
        title: "Simple Card Game",
        text: "A game for 4 players playable via email",
        linkData: [
          ["https://scg.oglimmer.de/", "play"],
          ["https://github.com/oglimmer/scg", "source code"],
        ],
        techList: "[Java7, maven]"
    },        
    {
        imageSrc: "./images/swlcg.jpg",
        title: "SWLCG Deck Builder",
        text: "An alternative approach to Star Wars LCG deck building",
        linkData: [
          ["https://swlcg.oglimmer.de/", "web"],
          ["https://github.com/oglimmer/deckbuilderswlcg", "source code"],
        ],
        techList: "[HTML, jQuery, CouchDB, Groovy]"
    },        
    {
        imageSrc: "./images/swccg.jpg",
        title: "SWCCG Deck Builder",
        text: "A web based approach to Star Wars CCG deck building",
        linkData: [
          ["https://github.com/oglimmer/deckbuilderswccg", "source code"],
        ],
        techList: "[HTML, jQuery, CouchDB, Groovy]"
    },        
    {
        imageSrc: "./images/virtualdeck.jpg",
        title: "Online card game environment",
        text: "Let's you play SWCCG and SWLCG online card game",
        linkData: [
          ["https://bcg.oglimmer.de/", "web"],
          ["https://github.com/oglimmer/onlinecardgameassistance", "source code"],
        ],
        techList: "[HTML5 (Websockets via Java-WebSocket), Dojo Toolkit, CouchDB, Java/Groovy]"
    },        
    {
        imageSrc: "./images/shadowrun-simulator.jpg",
        title: "Shadowrun Crossfire",
        text: "A card game simulator / trainer",
        linkData: [
          ["https://www.youtube.com/watch?v=cnw0UfJFfiE", "demo video"],
        ],
        techList: "[Java8, maven, Lombok]"
    },        
    {
        imageSrc: "./images/jfind.jpg",
        title: "jFindPlus",
        text: "A program to find files inside jars and spot duplicate classes inside jars",
        linkData: [
          ["https://github.com/oglimmer/jfindplus", "source code"],
        ],
        techList: "[Java]"
    },        
    {
        imageSrc: "./images/ifcdb.jpg",
        title: "Experimental binary store",
        text: "A binary store server, called ifcdb - 'infrequently changed data database'",
        linkData: [
          ["https://github.com/oglimmer/ifcdb", "source code"],
        ],
        techList: "[Java7, maven, JBoss-Weld, Hibernate]"
    },        
    {
        imageSrc: "./images/uaparser.jpg",
        title: "UASparser",
        text: "The Java side for user agent analysis. The legacy git repo's initial code was provided by me, see the first commit's author name ;) ",
        linkData: [
          ["https://github.com/chetan/UASparser", "source code"],
        ],
        techList: "[Java]"
    },        
    {
        imageSrc: "./images/podcast-sync.jpg",
        title: "podcast-human-syncer",
        text: "Helps with 'who is talking' and 'who wants to talk next / now' for podcasts",
        linkData: [
          ["https://github.com/oglimmer/podcast-human-syncer", "source code"],
        ],
        techList: "[JavaScript, ES6, Node.js, Svelte / Sapper]"
    },        
];

const transformArray = (arr: any) => {
  const chunkSize = 3;
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
}

const switchColorMode = () => {
  colorMode.value = colorMode.value === 'light' ? 'dark' : 'light';
  return false;
}

</script>

<template>

  <div class="bg-primary text-white text-center banner-image">
    <nav class="navbar navbar-expand-lg py-3 navbar-dark">
      <div class="container-fluid">
        <a class="navbar-brand font-weight-bold text-uppercase" href="#"></a>
        <div>
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a href="javascript:void(0);" :onClick="switchColorMode">
                <span style="font-size: 1.4em;">
                  <span v-if="colorMode.value === 'light'">☼</span>
                  <span v-if="colorMode.value === 'dark'">☾</span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <h1>coding is the new knitting</h1>
    <div class="center-container p-4">
      <p>Born in the 70s. Raised in Germany. Influenced by computers, programming and technology. Enthusiastic about coding. Eager to create small helpful applications or sometimes even web based games.</p>
    </div>
  </div>

  
  <div class="container mt-5">
      <div class="row mt-2" v-for="row in transformArray(data)">
          <div class="col-lg-4 mt-4" v-for="item in row">
            <Project 
              :image-src="item.imageSrc" 
              :title="item.title" 
              :text="item.text" 
              :link-data="item.linkData" 
              :tech-list="item.techList" />
          </div>
      </div>  
  </div>

  <footer class="footer mt-auto py-3">
      <div class="container mt-5">
          <span class="text-muted">© Copyright 2004-2023 by oglimmer.de - Oliver Zimpasser - All rights reserved.</span>
      </div>
  </footer>

</template>

<style scoped>
@media (max-width: 460px) {
  .navbar-brand.font-weight-bold.text-uppercase::after {
    content: "Web-Tech-Workshop";
    display: block;
  }
}
@media (min-width: 460px) {
  .navbar-brand.font-weight-bold.text-uppercase::after {
    content: "oglimmer's Web-Tech-Workshop";
    display: block;
  }
}

div h1 {
  margin-top: 25px;
  font-family: SpecialElite;
}
div h1, div p {
  margin-bottom: 25px;
}
div p {
  width: 400px;
  hyphens: auto; 
	text-align: justify;
}
.banner-image {
	background: linear-gradient(rgba(29, 38, 113, 0.8), rgba(195, 55, 100, 0.8)), url(./images/banner-image.jpg);
  background-size: cover;
  background-position: center;
}
.center-container {
  display: flex;
  justify-content: center;
}

a {
  text-decoration: none;
  color: inherit;
  outline: none;
}

a:hover {
  text-decoration: none;
  color: inherit;
}
</style>
