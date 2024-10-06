<script setup lang="ts">

const colorMode = useColorMode();

const route = useRoute();

useHead({
  title: 'oglimmer`s Web-Tech-Workshop',
  meta: [
    { name: 'description', content: 'oglimmer\'s web-based applications, tools and games' },
    { name: 'og:type', content: 'website' },
    { name: 'og:url', content: 'https://www.oglimmer.com/' },
    { name: 'og:title', content: 'oglimmer`s Web-Tech-Workshop' },
    { name: 'og:description', content: 'oglimmer\'s web-based applications, tools and games' },
    { name: 'og:image', content: 'https://www.oglimmer.com/images/icon.png' }
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
        imageSrc: "github.com.jpg",
        title: "github.com",
        text: "My github account",
        linkData: [["https://github.com/oglimmer", "github.com/oglimmer"]]
    },
    {
        imageSrc: "linkedin.com.jpg",
        title: "linkedin.com",
        text: "My Linkedin profile",
        linkData: [["https://www.linkedin.com/in/oliver-zimpasser", "www.linkedin.com/in/oliver-zimpasser"]],
    },
    {
        imageSrc: "medium.com.jpg",
        title: "medium.com",
        text: "I've written a couple of articles on medium.com",
        linkData: [["https://oglimmer.medium.com", "oglimmer.medium.com"]]
    },
    {
        imageSrc: "k8s.jpg",
        title: "My Kubernetes cluster",
        text: "My personal Kubernetes cluster running on 4x Raspberry Pis",
        linkData: [["https://oglimmer.github.io/homepage-k8s", "Sub page"]]
    },
    {
        imageSrc: "hub.docker.com.jpg",
        title: "hub.docker.com",
        text: "My docker hub",
        linkData: [["https://hub.docker.com/u/oglimmer", "hub.docker.com/u/oglimmer"]]
    },
    {
        imageSrc: "spring-rest-api-tutorial.jpg",
        title: "Spring REST API tutorial",
        text: "A tutorial on how to build a REST API with Spring Boot for beginners",
        linkData: [["https://github.com/oglimmer/java-spring-boot-class/", "Read the tutorial"]],
        techList: "[Spring, Java, REST, Vue, Bash, JPA, Postgres, Docker]"
    },
    {
        imageSrc: "picz.jpg",
        title: "Picture Sharing Z",
        text: "A vacation photo sharing app for iPhone",
        linkData: [
          ["https://picz.oglimmer.com", "Web"],
          ["https://apps.apple.com/app/picture-sharing-z/id6462514741", "App Store"]
        ],
        techList: "[iOS, Swift, SwiftUI, MapKit, OAuth]"
    },
    {
        imageSrc: "karel.jpg",
        title: "Karel the Bot",
        text: "A simple Karel the bot engine and UI implemented in JavaScript for HTML",
        linkData: [
          ["https://oglimmer.github.io/karel-robot-js/", "play"], 
          ["https://github.com/oglimmer/karel-robot-js", "source code"]
        ],
        techList: "[JavaScript, Vue, Scripting-Engine, AST]"
    },
    {
        imageSrc: "blackjack.jpg",
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
        imageSrc: "OCPP-Chargepoint-Simulator.jpg",
        title: "OCPP Chargepoint Simulator",
        text: "A scriptable OCPP Chargepoint Simulator for OCPP 1.6J.",
        linkData: [["https://github.com/oglimmer/scriptable-ocpp-chargepoint-simulator", "source code"]],
        techList: "[TypeScript, Nodejs, Websockets, OCPP, FTP]"
    },
    {
        imageSrc: "build-server.jpg",
        title: "A (very) simple build server",
        text: "An apache/cgi-bin/bash based build server. Still offers a simple UI.",
        linkData: [["https://github.com/oglimmer/simple-build-server", "source code"]],
        techList: "[Docker, apache, cgi-bin, bash, cron]"
    },
    {
        imageSrc: "homepage-oglimmer.jpg",
        title: "homepage oglimmer.com itself",
        text: "How this page is built using Nuxt, Boostrap, and static builds",
        linkData: [["https://github.com/oglimmer/homepage-oglimmer.com", "source code"]],
        techList: "[Nuxt, Vue, TypeScript, Bootstrap]"
    },
    {
        imageSrc: "linky1.com.jpg",
        title: "Linky",
        text: "A link & surfing management application",
        linkData: [
          ["https://www.linky1.com", "go to linky"],
          ["https://github.com/oglimmer/linky", "source code"]],
        techList: "[JavaScript, ES6, Node.js, React, Redux, Nano, Isomorphic/Universal, Bootstrap, CouchDB]"
    },
    {
        imageSrc: "blackjack-ui.jpg",
        title: "BlackJack REST API / JavaScript playground",
        text: "A REST API providing BlackJack (playable via JavaScript)",
        linkData: [
          ["https://bj.oglimmer.com/", "play"],
          ["https://github.com/oglimmer/blackjack-rest-api", "source code"],
        ],
        techList: "[c++20, oat++, cmake, bash-scripting, Dockerfile, github-action, swagger/OpenAPI, JavaScript, Ace]"
    },
    {
        imageSrc: "math.jpg",
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
        imageSrc: "math-java.jpg",
        title: "Mathematical Function parser library (Java)",
        text: "Library parsing and resolving mathematical functions like 'sin(pi)*3^(2+1)'",
        linkData: [
          ["https://github.com/oglimmer/math-parser", "source code"],
        ],
        techList: "[Java, github-action, FSM, AST]"
    },
    {
        imageSrc: "cyr.jpg",
        title: "Code Your Restaurant",
        text: "A JavaScript coding game",
        linkData: [
          ["https://www.codeyourrestaurant.com/", "play"],
          ["https://github.com/oglimmer/cyc", "source code"],
        ],
        techList: "[Java8, maven, CouchDB, JavaScript, Rhino, Groovy, Ace]"
    },
    {
        imageSrc: "lunchy.jpg",
        title: "Lunchy",
        text: "Corporate lunch information system",
        linkData: [
          ["https://lunchylunch.com/", "go to lunchy"],
          ["https://lunchylunch.com/", "source code"],
        ],
        techList: "[Java8, maven, Jooq, Liquibase, AngularJS, Boostrap, Jersey, Lombok, Webjars]"
    },
    {
        imageSrc: "junta.jpg",
        title: "Junta Online",
        text: "A classic board game played asynchronously via email",
        linkData: [
          ["https://junta-online.net/", "play"],
        ],
        techList: "[HTML4, JavaScript, Java, Spring, JDBC, Lombok, Flyway]"
    },        
    {
        imageSrc: "oglimmer-commons.jpg",
        title: "oglimmer-commons",
        text: "Prevent boilerplate code for random strings and names, SPI-based slf4j configuration, sophisticated property files, human readable representation of date differences and getting attributes from MANIFEST.FM files.",
        linkData: [
          ["https://github.com/oglimmer/utils", "source code"],
          ["https://search.maven.org/artifact/de.oglimmer.utils/common-utils", "maven central"],
        ],
        techList: "[Java8, maven, Lombok]"
    },        
    {
        imageSrc: "fulgens.jpg",
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
        imageSrc: "yatdg.jpg",
        title: "Yet Another Tower Defense Game",
        text: "A multiplayer tower-defense fantasy combat game",
        linkData: [
          ["https://td.oglimmer.com/", "play"],
          ["https://github.com/oglimmer/yatdg", "source code"],
        ],
        techList: "[HTML5(Canvas, Websockets via Atmosphere), JavaScript, Java]"
    },        
    {
        imageSrc: "citybuilder.jpg",
        title: "Citybuilder",
        text: "A card based multi player board game",
        linkData: [
          ["https://cb.oglimmer.com/", "play"],
          ["https://github.com/oglimmer/citybuilder", "source code"],
        ],
        techList: "[HTML5(Canvas, Websockets via Socket.io), JavaScript / Node.js / jQuery, CouchDB]"
    },        
    {
        imageSrc: "toldyouso.jpg",
        title: "Told you so!",
        text: "A web offering for smart asses .... told you so!",
        linkData: [
          ["https://toldyouso.oglimmer.com/", "web"],
          ["https://github.com/oglimmer/toldyouso", "source code"],
        ],
        techList: "[Java8, maven, JSF, CouchDB]"
    },        
    {
        imageSrc: "ggo.jpg",
        title: "Grid Game One",
        text: "A hex-based, no-luck, kinda-turn-based strategy game",
        linkData: [
          ["https://ggo.oglimmer.com/", "play"],
          ["https://github.com/oglimmer/ggo", "source code"],
        ],
        techList: "[HTML5(Canvas, Websockets via Atmosphere), JavaScript, Java8, maven, Stripes, twitter-bootstrap, jQuery, Lombok]"
    },        
    {
        imageSrc: "scg.jpg",
        title: "Simple Card Game",
        text: "A game for 4 players playable via email",
        linkData: [
          ["https://scg.oglimmer.com/", "play"],
          ["https://github.com/oglimmer/scg", "source code"],
        ],
        techList: "[Java7, maven]"
    },        
    {
        imageSrc: "swlcg.jpg",
        title: "SWLCG Deck Builder",
        text: "An alternative approach to Star Wars LCG deck building",
        linkData: [
          ["https://swlcg.oglimmer.com/", "web"],
          ["https://github.com/oglimmer/deckbuilderswlcg", "source code"],
        ],
        techList: "[HTML, jQuery, CouchDB, Groovy]"
    },        
    {
        imageSrc: "swccg.jpg",
        title: "SWCCG Deck Builder",
        text: "A web based approach to Star Wars CCG deck building",
        linkData: [
          ["https://github.com/oglimmer/deckbuilderswccg", "source code"],
        ],
        techList: "[HTML, jQuery, CouchDB, Groovy]"
    },        
    {
        imageSrc: "virtualdeck.jpg",
        title: "Online card game environment",
        text: "Let's you play SWCCG and SWLCG online card game",
        linkData: [
          ["https://bcg.oglimmer.com/", "web"],
          ["https://github.com/oglimmer/onlinecardgameassistance", "source code"],
        ],
        techList: "[HTML5 (Websockets via Java-WebSocket), Dojo Toolkit, CouchDB, Java/Groovy]"
    },        
    {
        imageSrc: "shadowrun-simulator.jpg",
        title: "Shadowrun Crossfire",
        text: "A card game simulator / trainer",
        linkData: [
          ["https://www.youtube.com/watch?v=cnw0UfJFfiE", "demo video"],
        ],
        techList: "[Java8, maven, Lombok]"
    },        
    {
        imageSrc: "jfind.jpg",
        title: "jFindPlus",
        text: "A program to find files inside jars and spot duplicate classes inside jars",
        linkData: [
          ["https://github.com/oglimmer/jfindplus", "source code"],
        ],
        techList: "[Java]"
    },        
    {
        imageSrc: "ifcdb.jpg",
        title: "Experimental binary store",
        text: "A binary store server, called ifcdb - 'infrequently changed data database'",
        linkData: [
          ["https://github.com/oglimmer/ifcdb", "source code"],
        ],
        techList: "[Java7, maven, JBoss-Weld, Hibernate]"
    },        
    {
        imageSrc: "uaparser.jpg",
        title: "UASparser",
        text: "The Java side for user agent analysis. The legacy git repo's initial code was provided by me, see the first commit's author name ;) ",
        linkData: [
          ["https://github.com/chetan/UASparser", "source code"],
        ],
        techList: "[Java]"
    },        
    {
        imageSrc: "podcast-sync.jpg",
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
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light';
  return false;
}

const cooking = ref("");
let c = 0;
const intervalRef = setInterval(() => {
  cooking.value = "cooking".substring(0, c) + "&nbsp;".repeat(7 - c);
  c++;
  if (c > 7) {
    clearInterval(intervalRef);
  }
}, 350);

const graphics = ref("comic");
if (route.query.theme != null && route.query.theme !== "comic") {
  setTimeout(() => {
    graphics.value = route.query.theme as string;
  }, 1);
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
                  <span v-if="colorMode.value === 'light'"><font-awesome-icon icon="fa-solid fa-sun" /></span>
                  <span v-if="colorMode.value === 'dark'"><font-awesome-icon icon="fa-solid fa-moon" /></span>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container pb-5">
      <div class="row py-5 align-items-center">
        <div class="col-lg-8">
          <h5 class="display-4 mb-4 font-weight-bold text-white">coding is the new <span class="cookingContainer">knitting<span class="cooking" v-html="cooking"></span></span></h5>
          <p class="h5 aa mb-4 pb-3 text-white-50">Born in the 70s. Raised in Germany. Influenced by computers, programming and technology. Enthusiastic about coding and cooking. Eager to create small helpful applications or sometimes even web based games.</p>          
        </div>
        <div class="col-lg-4 text-lg-right text-center mt-5 mt-lg-0">
          <div class="banner-phone-image">
            <img class="tilt-n-move-shaking" src="/images/icon.png">
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="container mt-3">
    <div class="d-flex justify-content-end">
        <div class="me-2">Graphics:</div>
        <div class="me-2">
            <select v-model="graphics">
                <option value="comic">Comic</option>
                <option value="fresh">Fresh</option>
                <option value="fun">Fun</option>
                <option value="winter">Winter</option>
                <option value="c64">C64</option>
                <option value="80s">80s</option>
            </select>
        </div>
    </div>
  </div>
  
  <div class="container mt-5">
      <div class="row mt-2" v-for="row in transformArray(data)">
          <div class="col-lg-4 mt-4" v-for="item in row">
            <Project 
              :image-src="`./images/${graphics}/${item.imageSrc}`"
              :title="item.title" 
              :text="item.text" 
              :link-data="item.linkData" 
              :tech-list="item.techList" />
          </div>
      </div>  
  </div>

  <footer class="footer mt-auto py-3">
      <div class="container mt-5">
          <span class="text-muted">© Copyright 2004-2024 by oglimmer.com - Oliver Zimpasser - All rights reserved.</span>
      </div>
  </footer>

</template>

<style scoped>

img:hover { 
    animation: tilt-n-move-shaking 0.5s linear infinite; 
} 

@keyframes tilt-n-move-shaking {
  0% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(5px, 5px) rotate(5deg); }
  50% { transform: translate(0, 0) rotate(0eg); }
  75% { transform: translate(-5px, 5px) rotate(-5deg); }
  100% { transform: translate(0, 0) rotate(0deg); }
}

.aa {
  line-height:30px;
}

@media (min-width: 920px) {
  .aa  {
    margin-left: 120px;
    margin-right: 120px;
  }
}

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

@media (max-width: 992px) {
  .cooking {
    font-size: 1.1em;
    top: -15px;
  }
}
@media (min-width: 992px) {
  .cooking {
    font-size: 1.2em;
    top: -20px;
  }
}
@media (min-width: 1200px) {
  .cooking {
    font-size: 1.3em;
    top: -30px;
  }  
}

div h5 {
  font-family: SpecialElite;
}

.cookingContainer {
  position: relative;
}
.cooking {
  font-family: CookingRegular;
  letter-spacing: 10px;
  text-shadow: 3px 3px 1px rgb(150 228 228);
  color: rgb(90 173 181);
  position: absolute;
  left: -10px;
  margin: 0;
  transform: rotate(-10deg);
}  


.banner-image {
	background: linear-gradient(rgba(29, 38, 113, 0.8), rgba(195, 55, 100, 0.8)), url(/images/banner-image.jpg);
  background-size: cover;
  background-position: center;
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
