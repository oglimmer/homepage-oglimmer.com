# Homepage: oglimmer.com

This repo builds the https://www.oglimmer.com web page.

It's technicaly based on Boostrap 5 and Nuxt 3 using a static build.

## Development Server

```bash
npm i
npm run dev
```

Access at `http://localhost:3000`:

## Build for prod

```bash
npm run static
```

### Test prod

```bash
cd .output/public/
docker run -v $PWD:/usr/share/nginx/html -p 8080:80 nginx
```

# Create picture

```bash
bash -c 'for f in *.png; do mv "$f" "${f%.png}.jpg"; done'
bash -c 'for i in *.jpg; do convert "$i" -resize "414x414>" "$i"; done'
```

## github.com

```
a silhouette of a tree. a cat with a large head in front of the tree from behind
```

## linkedin.com.jpg

```
stylized a meeting room full of people from a professional engineering community
```

## medium.com

```
a stylized desk from above showing a hand writing into a notebook. a typewriter on the side
```

## k8s

```
stylized nice and cosy living room with a data server in the middle
```

## hub.docker.com

```
areal view on stylized Container port with hundreds of containers with a Container crane
```

## spring-rest-api-tutorial

```
stylized laptop with hands typing on the keyboard, code on the screen
```

## picz

```
stylized person holding a camera taking a picture of a group of people
```

## karel

```
stylized karel the bot
```

## blackjack

```
Group chat that’s all fun games Discord is great for playing games and chilling with friends, or even building a worldwide community. Customize your own space to talk, play, and hang out.
```

## OCPP-Chargepoint-Simulator

```
stylized sleek electric car charging at a modern power station, dynamic angles, vivid colors, futuristic design, sunlight reflecting off the car's surface, gas station in the background, professional photography, high contrast, sharp focus
```

## build-server

```
a modular computer server with cranes around it. building on computer modules
```

## homepage-oglimmer

```
stylized homepage
```

## linky1.com

```
stylized internet homepage on a computer
```

## blackjack-ui

```
stylized a black jack table connected with a wire to a computer
```

## math

```
stylized calculator connected with pipes and valves
```

## math-java

```
stylized calculator connected with pipes and valves
```

## lunchy

```
Stylized world map filled with vibrant meals from different cultures, colorful illustrations, intricate details, playful food representations, artistic flair, bold colors
```

## cyr

```
stylized restaurant front with a robot at the door. sign "RESTAURANT" at the front
```

## junta

```
Stylized city map nestled in a lush jungle, intricate details, vibrant colors, military troops strategically positioned throughout, dynamic composition, high contrast
```

## oglimmer-commons

```
Stylized breadboard featuring intricate electronic components and colorful wires, vibrant illustration style, intricate details, smooth lines, dynamic composition
```

## fulgens

```
stylized fulgens
```

## yatdg

```
stylized many towers with roads in between
```

## scg

```
stylized card game with star wars on the card back
```

## swccg

```
stylized trading cards on a table with a stack of cards on the side and some tokens on the cards
```

## swlcg

```
stylized trading cards on a table with a stack of cards on the side and some tokens on the cards
```

## virtualdeck

```
stylized two tables with cards on the table and a wire between the two tables
```

## shadowrun-simulator

```
stylized cyberpunk scene with a group of runners and cars
```

## jfind

```
stylized jar with someone looking into the jar with a magnifying glasses
```

## ifcdb

```
stylized database with experimental data stores
```

## uaparser

```
stylized spy vs spy with code in the background
```

## podcast-sync

```
stylized table in the middle. chairs on each side. persons sitting on the chairs. wires and gear between the 2 persons
```

## ggo

```
stylized hexagon field with stylized military troops meeple
```

## toldyouso

```
stylized guy shouting at a woman with raised pointing finger
```

## citybuilder

```
stylized and abstract monopoly board game
```

