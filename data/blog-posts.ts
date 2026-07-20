export interface BlogPost {
  slug: string
  title: string
  description: string
  date: string
  content: string
  lang?: 'en' | 'de'
  translationSlug?: string
}

export function getTranslation(post: BlogPost): BlogPost | undefined {
  if (!post.translationSlug) return undefined
  return blogPosts.find(p => p.slug === post.translationSlug)
}

/**
 * Returns blog posts deduplicated by translation group.
 * For posts with translations, only the English (default) version is kept.
 */
export function getDeduplicatedPosts(): BlogPost[] {
  const translationSlugs = new Set(
    blogPosts
      .filter(p => (p.lang || 'en') !== 'en' && p.translationSlug)
      .map(p => p.slug),
  )
  return blogPosts.filter(p => !translationSlugs.has(p.slug))
}

export function formatBlogDate(dateString: string, lang: string = 'en'): string {
  const date = new Date(dateString)
  const locale = lang === 'de' ? 'de-DE' : 'en-US'
  return date.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'coding-guidelines-that-ai-actually-reads',
    title: 'Coding Guidelines That AI Actually Reads',
    description: 'Why I wrote my coding conventions as standalone markdown docs and wrapped them in a skill that feeds AI only the ones a task actually needs',
    date: '2026-07-20',
    content: `Every time I start a new project - or even just a new AI coding session on an old one - I end up re-explaining the same things. Layered packages: \`controller\` to \`service\` to \`repository\`, nothing skipping a layer. An \`@Entity\` never crosses the controller boundary - every request and response is a DTO. No MapStruct; I let the AI write the entity-to-DTO mapping out by hand so it shows up in the diff. Lombok for the boilerplate. Multi-stage Docker build, run as non-root.

None of this is written down anywhere an AI can see it. It lives in my head and, implicitly, in a dozen existing repos. So an agent starting fresh does what agents always do: it reaches for the most generic, most average version of whatever I asked for. Different router, a logging framework I don't use, a config library I don't use, a project layout that isn't mine.

The code works. It just doesn't look like mine. And then I spend the review nudging it back toward how I actually build things. Every single time.

So I wrote it all down.

## One file per concept

The result is [a small repo of markdown files](https://github.com/oglimmer/coding-guidelines) - one per concept. Go backend, Java Spring backend, Vue frontend, Nuxt frontend, Postgres from Go, Postgres from Spring, Docker, Helm, GitHub Actions, Renovate, pre-commit, observability, MCP servers, testing, versioning, and my \`oglimmer.sh\` deploy script. Sixteen documents at the moment.

Each one is precise and opinionated on purpose. It doesn't describe every option that exists - it states what I build toward. The Spring Boot doc, for example, opens with its philosophy and then gets blunt:

> No MariaDB, no form-login-only auth, no ad-hoc \`RestTemplate\` — unless a project has a specific reason.

That single line saves a whole round of nudging the AI back toward how I actually do it. The docs are deliberately repo-agnostic - they assume no particular layout beyond the paths they name - so the same Go doc applies whether I'm scaffolding something new or extending a five-year-old service.

Writing them was more valuable than I expected. You cannot write "this is how we do Postgres access" without actually deciding how you do Postgres access. A lot of my conventions had never been stated out loud; they were just habits. Putting them on paper forced me to notice where two of my repos disagreed and pick a winner.

## Don't make the AI read all sixteen

Sixteen documents is too much context to dump into every session, and most of it is irrelevant to any given task. A Nuxt static site doesn't care about the pgx pooler settings.

So the conventions are wrapped in a small skill whose entire job is routing. Before it reads anything, it answers three questions: what are we doing (scaffolding, extending, or reviewing), which layers does the task actually touch, and is this a repo I already have notes on. It detects the stack from markers in the repo - a \`go.mod\`, a \`nuxt.config.ts\`, a \`Chart.yaml\` - and then reads only the matching docs.

That's the whole trick. The AI gets my exact conventions for the two or three layers it's working on, and none of the noise. It builds in my style from the first attempt instead of the third.

## Keeping myself honest

The last piece is a set of assessments - a folder that audits my live repos against these guidelines. For each project it records the stack, which docs apply, where the repo matches the target, and where it drifts. There's an adoption matrix with a lot of ⚠️ and ❌ in it.

This part is not aspirational marketing; it's a to-do list. It tells me which repo is still on an old action pin, which one has no Renovate config, which one's CI is stale. The guidelines say what good looks like, and the assessment says how far each repo is from it. Both the AI and I use it: when the agent works on a known repo, its actual state overrides the generic advice, so it fixes the real gap instead of imposing the ideal wholesale.

## The point

This is the same idea I keep coming back to, most recently with [Renovate Initializr](/blog/intent-driven-configuration-rethinking-the-renovate-onboarding-experience): I don't want to re-derive a decision I've already made. I made these choices once. I shouldn't have to re-argue them with a fresh AI session every week.

None of this is universal truth - it's my house style, opinionated on purpose, and yours would look different. But that's exactly why it has to be written down. An AI agent will happily match your conventions, if it can find them. Mine used to be invisible. Now they're sixteen markdown files and a skill that hands over the right two.

The nice side effect: the docs are just as useful for the human. When I forget how I decided to handle context paths or migrations, I read my own guideline. Turns out writing things down so the machine understands them makes them clearer for me too.

The guidelines are public if you want to borrow the idea (or the conventions themselves): [github.com/oglimmer/coding-guidelines](https://github.com/oglimmer/coding-guidelines).`,
  },
  {
    slug: 'from-documentary-to-infographic-an-ai-adventure',
    title: 'From Documentary to Infographic: An AI Adventure',
    description: 'How I turned an Arte TV documentary about ancient Egypt into a graphical info sheet using ffmpeg, Whisper, and Claude',
    date: '2026-03-15',
    translationSlug: 'von-der-doku-zur-infografik-ein-ki-abenteuer',
    content: `I recently watched an Arte TV documentary about the fall of ancient Egypt - [Der Untergang des alten Ägypten](https://www.arte.tv/de/videos/127479-002-A/der-untergang-des-alten-aegypten-2-2/). It was fascinating, packed with information, and naturally I forgot half of it by the next morning. That got me thinking: could I turn a video documentary into a graphical overview that captures the key information in a way that is easy to revisit?

Turns out, with a few tools and some AI, you absolutely can.

## The pipeline

The idea is simple: get the spoken content out of the video, transcribe it, and then use AI to generate a structured visual summary. Here is how I did it step by step.

**Step 1: Download the video.** Arte makes its documentaries available in their media library, but downloading them directly is not straightforward. I used [MediathekViewWeb](https://mediathekviewweb.de/) to find and download the video file.

**Step 2: Extract the audio.** I did not need the video itself, just the spoken content. A quick ffmpeg command strips the audio track from the video file:

\`\`\`bash
ffmpeg -i documentary.mp4 -vn -acodec aac output.aac
\`\`\`

**Step 3: Transcribe with Whisper.** OpenAI's Whisper model does an impressive job at speech-to-text, even with German audio. You can install it locally and run the transcription with just two commands:

\`\`\`bash
pip install -U openai-whisper
whisper output.aac --model base
\`\`\`

The result was a surprisingly accurate transcript of the full documentary.

**Step 4: Generate the infographic.** This is where it gets interesting. I fed the transcript into Claude and asked it to create a graphical info sheet summarizing the documentary's content. Claude generated a structured, visual HTML page covering the key events, timelines, and relationships described in the documentary.

The result is available at [content.oglimmer.com/s/egypt](https://content.oglimmer.com/s/egypt) if you want to see it yourself.

## What makes this fascinating

The entire pipeline - from a two-hour documentary to a shareable visual summary - took maybe 30 minutes of hands-on work. Most of that was waiting for the transcription to finish. The actual creative and analytical heavy lifting was done by AI.

What surprised me most was the quality. The transcript captured the narration accurately, and Claude did a remarkable job at extracting the important themes, organizing them visually, and presenting them in a way that genuinely helps you understand and remember the content.

## Is this the end of school books?

This experiment raises a bigger question. If anyone can take a documentary, a lecture, or any other educational content and turn it into personalized learning material in minutes - what does that mean for traditional educational resources?

Today, students use textbooks that were written years ago, designed for a generic audience, and updated on slow publication cycles. But the tools now exist for students to create their own learning material. Watch a documentary, attend a lecture, read a paper - then use AI to generate summaries, infographics, flashcards, or whatever format works best for your own learning style.

The material is not just consumed anymore. It is transformed, personalized, and made your own. That is a fundamentally different relationship with educational content.

I am not saying school books will disappear tomorrow. But the direction is clear: the future of learning material is personal, AI-assisted, and created on demand. The internet provides the raw content. AI provides the transformation. The student decides the format.

That is a fascinating shift, and we are just at the beginning of it.`,
  },
  {
    slug: 'von-der-doku-zur-infografik-ein-ki-abenteuer',
    title: 'Von der Doku zur Infografik: Ein KI-Abenteuer',
    description: 'Wie ich eine Arte-Dokumentation über das alte Ägypten mit ffmpeg, Whisper und Claude in eine grafische Übersicht verwandelt habe',
    date: '2026-03-15',
    lang: 'de',
    translationSlug: 'from-documentary-to-infographic-an-ai-adventure',
    content: `*Dieser Text wurde mit Hilfe von KI aus dem Englischen übersetzt.*

Ich habe mir kürzlich eine Arte-Dokumentation über den Untergang des alten Ägypten angeschaut - [Der Untergang des alten Ägypten](https://www.arte.tv/de/videos/127479-002-A/der-untergang-des-alten-aegypten-2-2/). Sie war faszinierend, vollgepackt mit Informationen, und natürlich hatte ich am nächsten Morgen die Hälfte davon wieder vergessen. Das brachte mich auf eine Idee: Könnte man eine Video-Dokumentation in eine grafische Übersicht verwandeln, die die wichtigsten Informationen so aufbereitet, dass man sie jederzeit wieder abrufen kann?

Wie sich herausstellt: Mit ein paar Werkzeugen und etwas KI geht das tatsächlich.

## Die Pipeline

Die Idee ist einfach: Den gesprochenen Inhalt aus dem Video extrahieren, transkribieren und dann mit KI eine strukturierte visuelle Zusammenfassung erstellen. So habe ich es Schritt für Schritt gemacht.

**Schritt 1: Das Video herunterladen.** Arte stellt seine Dokumentationen in der Mediathek zur Verfügung, aber ein direkter Download ist nicht ohne Weiteres möglich. Ich habe [MediathekViewWeb](https://mediathekviewweb.de/) benutzt, um die Videodatei zu finden und herunterzuladen.

**Schritt 2: Audio extrahieren.** Ich brauchte nicht das Video selbst, nur den gesprochenen Inhalt. Ein kurzer ffmpeg-Befehl trennt die Audiospur aus der Videodatei:

\`\`\`bash
ffmpeg -i documentary.mp4 -vn -acodec aac output.aac
\`\`\`

**Schritt 3: Transkription mit Whisper.** OpenAIs Whisper-Modell leistet beeindruckende Arbeit bei der Spracherkennung, auch bei deutschem Audio. Man kann es lokal installieren und die Transkription mit nur zwei Befehlen starten:

\`\`\`bash
pip install -U openai-whisper
whisper output.aac --model base
\`\`\`

Das Ergebnis war ein überraschend genaues Transkript der gesamten Dokumentation.

**Schritt 4: Die Infografik generieren.** Hier wird es richtig spannend. Ich habe das Transkript in Claude eingegeben und darum gebeten, eine grafische Übersicht zu erstellen, die den Inhalt der Dokumentation zusammenfasst. Claude hat eine strukturierte, visuelle HTML-Seite generiert, die die wichtigsten Ereignisse, Zeitabläufe und Zusammenhänge aus der Dokumentation abdeckt.

Das Ergebnis ist unter [content.oglimmer.com/s/egypt](https://content.oglimmer.com/s/egypt) verfügbar, falls ihr es euch selbst ansehen wollt.

## Was das Ganze so faszinierend macht

Die gesamte Pipeline - von einer zweistündigen Dokumentation zu einer teilbaren visuellen Zusammenfassung - hat vielleicht 30 Minuten aktive Arbeit gekostet. Das meiste davon war Warten auf die Transkription. Die eigentliche kreative und analytische Schwerstarbeit wurde von KI erledigt.

Was mich am meisten überrascht hat, war die Qualität. Das Transkript hat die Erzählung genau erfasst, und Claude hat hervorragend die wichtigen Themen extrahiert, sie visuell aufbereitet und so präsentiert, dass es wirklich hilft, den Inhalt zu verstehen und zu behalten.

## Ist das das Ende der Schulbücher?

Dieses Experiment wirft eine größere Frage auf. Wenn jeder eine Dokumentation, eine Vorlesung oder beliebige andere Bildungsinhalte nehmen und in wenigen Minuten in personalisiertes Lernmaterial verwandeln kann - was bedeutet das für traditionelle Bildungsmedien?

Heute nutzen Schüler und Studenten Lehrbücher, die vor Jahren geschrieben wurden, für ein allgemeines Publikum konzipiert sind und in langsamen Publikationszyklen aktualisiert werden. Aber die Werkzeuge existieren bereits, um eigenes Lernmaterial zu erstellen. Eine Dokumentation schauen, eine Vorlesung besuchen, ein Paper lesen - und dann mit KI Zusammenfassungen, Infografiken, Karteikarten oder welches Format auch immer am besten zum eigenen Lernstil passt, generieren.

Das Material wird nicht mehr nur konsumiert. Es wird transformiert, personalisiert und zu etwas Eigenem gemacht. Das ist ein fundamental anderes Verhältnis zu Bildungsinhalten.

Ich sage nicht, dass Schulbücher morgen verschwinden werden. Aber die Richtung ist klar: Die Zukunft des Lernmaterials ist persönlich, KI-gestützt und on demand erstellt. Das Internet liefert die Rohinhalte. KI liefert die Transformation. Der Lernende bestimmt das Format.

Das ist ein faszinierender Wandel, und wir stehen erst am Anfang.`,
  },
  {
    slug: 'rewriting-simple-build-server-in-go',
    title: 'Rewriting Simple Build Server in Go',
    description: 'Why I rewrote my Apache/CGI/bash build server as a single Go binary - and what improved along the way',
    date: '2026-03-15',
    content: `The original Simple Build Server was one of those projects that worked well enough for years. I first wrote about it in my [poor man's Continuous Deployment pipeline](/blog/poor-mans-continuous-deployment) post back in 2019. It used Apache with CGI-bin scripts written in bash, and a cron job that polled for changes every 60 seconds. It did the job: trigger a build, show the result in a simple web UI. But let's be honest - it's 2026 and the era of Apache with CGI-bin is long over.

The real problem was the **attack surface**. Running Apache with CGI-bin meant exposing a full web server with all its configuration complexity, plus bash scripts directly handling HTTP requests. That is a lot of surface area for something that just needs to trigger a shell script and show the result. Every CVE for Apache or its CGI module was potentially relevant, and hardening the setup properly required more effort than the actual build logic.

Beyond that, there were smaller annoyances:

- **Polling delay**: Cron ran every 60 seconds, so builds never started instantly. That small delay added up when iterating quickly.
- **No proper authentication**: The API had no real auth mechanism. Anyone who could reach the endpoint could trigger a build.
- **Fragile scripting**: Bash scripts doing HTTP request handling via CGI-bin is clever, but debugging and extending them is painful.

## The rewrite

Claude was so kind to rewrite the whole thing as a single Go binary. No Apache, no cron, no CGI. The server handles HTTP directly using Go's standard library \`net/http\`, with the new Go 1.22 routing patterns for clean route definitions.

Key improvements:

**Instant builds.** The API endpoint triggers a build immediately. No polling, no delay. The server also cancels any in-progress build for the same app when a new one is triggered, so you never wait for a stale build to finish.

**Proper authentication.** API calls require a bearer token verified against a bcrypt hash. The web dashboard uses HTTP Basic Auth, also with bcrypt-hashed passwords. Tokens and credentials are configured in a single \`config.yaml\` file.

**Simpler architecture.** The entire server is a single Go file. It handles config loading, build execution, state persistence, and the dashboard UI. The Docker image uses a multi-stage build - the final image is Alpine with the compiled binary, around 50 MB plus whatever build tools you add.

**Runs as non-root.** The container creates a dedicated user and runs the server without root privileges.

## How it works

The basic concept is still the same as the original solution. Each app gets a directory under \`/opt/<app-name>/\` with a \`build.sh\` script and optionally \`test.sh\`, \`get-git-url.sh\`, and \`get-git-hash.sh\`. The server calls these scripts when a build is triggered, captures the output into log files, and tracks the build state as JSON.

The dashboard is a server-rendered HTML page using Go templates and Bootstrap. It shows each app's last build status, timing, git commit link, and lets you trigger rebuilds with a button. Build logs and the engine log are viewable directly from the dashboard.

Triggering a build from CI is a one-liner:

\`\`\`bash
curl -X POST -H "Authorization: Bearer <token>" http://localhost:8080/api/rebuild/my-app
\`\`\`

The source code is on [GitHub](https://github.com/oglimmer/simple-build-server).`,
  },
  {
    slug: 'intent-driven-configuration-rethinking-the-renovate-onboarding-experience',
    title: 'Intent-Driven Configuration: Rethinking the Renovate Onboarding Experience',
    description: 'The motivation behind creating Renovate Initializr - a tool that lets you describe the behaviour you want and generates a usable renovate.json from it',
    date: '2025-03-10',
    content: `I built Renovate Initializr because I found settings up the Renove config for a project harder than it should be.
    
Renovate itself is a very useful tool. Once it is set up properly, it helps keep dependencies current, reduces manual maintenance, and generally does an important job in the background. But the setup experience can be frustrating. The documentation is detailed, which is good, but as a user you often have to translate a long list of technical parameters into the much simpler question you actually care about: what do I want Renovate to do?

That is the part I didn't like.

As a Renovate user, I do not want to become a Renovate engineer. I do not want to think in terms of every internal option and config key first. I want to decide how Renovate should behave. Should it open only a few PRs at a time? Should it run on weekends? Should it automerge patch updates? Should it group updates to reduce noise? Those are the questions I care about. The technical parameters should follow from that, not the other way around.

That is the idea behind this project.

A bit like Spring Initializr gives you a sensible way to start a Spring project, I wanted something similar for Renovate. Not a full replacement for the documentation, and not a tool for every advanced edge case, but a practical starting point for real users who simply want to get going.

So I created Renovate Initializr at https://renovate.oglimmer.com/.

The goal is straightforward: you describe the behaviour you want, and the service turns that into a usable renovate.json. Instead of dealing with raw configuration first, you work through the decisions in a more natural way. You choose things like schedule, timezone, PR limits, automerge policy, grouping, lock file maintenance, and vulnerability handling. The resulting configuration is shown live.

That live preview matters because I did not want to hide the output. The point is not to abstract Renovate config away completely. The point is to make it easier to arrive at a good configuration without forcing users to think like tool maintainers. You still want to understand the JSON and stay in control, but the path to it is much more direct. It connects what you want to how it looks in JSON.

I also wanted the result to be useful for most people without much effort. So the service starts from a sensible baseline, including config:recommended, vulnerability alerts, and the dependency dashboard. From there, users can adjust what matters for their own workflow. For many teams that will already be enough. Even when it is not the final configuration forever, it should at least be a very good starting point.

That is really the standard I had in mind from the beginning: good enough for most users and a strong starting point for everyone else.

I think that matters because many teams want the benefits of Renovate but do not want to invest unnecessary energy into understanding every detail up front. People often end up copying what the last project did or asking AI to generate a configuration. That can still miss what you actually intend if you do not know which options exist.

This project exists because I wanted Renovate setup to begin with intent, not with parameter hunting. You should be able to say what you want Renovate to do, generate a solid configuration, and move on.

If that sounds useful, you can try it at https://renovate.oglimmer.com/.

Finally, I am not an expert on Renovate, just an enthusiastic user. If you have feedback about my service, please pass it on.`,
  },
  {
    slug: 'web-analytics-grafana-loki',
    title: 'Web analytics with Grafana Loki',
    description: 'Building a web analytics system using Grafana Loki, Traefik access logs, and Promtail for log processing and geolocation',
    date: '2024-06-14',
    content: `*Originally published on Medium, June 14, 2024*

I recently asked myself if it is possible to build a typical web analytics system using Grafana Loki.

Throughout the article, I have removed all code that is unnecessary for this purpose. For a complete yet simple example, visit [https://github.com/oglimmer/traefik-loki-grafana-web-analytics](https://github.com/oglimmer/traefik-loki-grafana-web-analytics).

This is what the overall architecture and its building blocks look like:

![Architecture Diagram](/images/architecture-diagram.png)

**Flow of information from a user issuing an http request to showing diagrams in grafana**

The architecture consists of:
1. Traefik (reverse proxy with access logging)
2. Promtail (log processor with GeoIP enrichment)
3. Loki (log aggregation)
4. Grafana (visualization)

## traefik

We have to enable access logs for traefik. Additionally it makes our life easier to write json instead of a common log format. Finally we want to see the User-Agent and Referer headers in the log.

For the purpose of Web Analytics traefik also has to see the source IP of all incoming http requests. There are various ways to achieve this, one simple - but not recommended way in production - is to enable \`network_mode: host\`. You might want to look up how to enable the proxy protocol between your edge load balancers and traefik for a more secure way.

\`\`\`yaml
# docker-compose.yml ...
  traefik:
    image: traefik:v3.0
    command:
      - "--accesslog=true"
      - "--accesslog.filepath=/opt/access-logs/access.json"
      - "--accesslog.format=json"
      - "--accesslog.fields.defaultmode=keep"
      - "--accesslog.fields.headers.defaultmode=keep"
      - "--accesslog.fields.headers.names.User-Agent=keep"
      - "--accesslog.fields.headers.names.Referer=keep"
    network_mode: host
    volumes:
      - ./access-logs:/opt/access-logs
\`\`\`

Now we have traefik writing proper access logs with source IPs.

## promtail

The next step is to push these access logs into Loki, which is done by promtail.

promtail needs a configuration file, which configures where to look for access logs, how to transform and enrich it and finally where to send it.

Adding promtail to a docker compose definition is mostly defining volumes:

\`\`\`yaml
# docker-compose.yml ...
  promtail:
    image: grafana/promtail:2.9.3
    command: -config.file=/etc/promtail/promtail.yaml
    volumes:
      - "./promtail-config.yml:/etc/promtail/promtail.yaml"
      - "./access-logs:/var/log"
      - "./promtail-data:/tmp/positions"
      - "./GeoLite2-City.mmdb:/etc/promtail/GeoLite2-City.mmdb"
\`\`\`

For IP to geographical location lookup we have to provide MaxMind's GeoLite2-City.mmdb file. You can download a version from the [MaxMind Homepage](https://www.maxmind.com/en/solutions/ip-geolocation-databases-api-services).

I have commented the promtail-config.yml on the different sections for a better understanding. You can find the full documentation [here](https://grafana.com/docs/loki/latest/clients/promtail/configuration/).

\`\`\`yaml
# for a simple access log push we don't need the server capabilities
server:
  disable: true

# where to send the logs - our Loki server / container
clients:
- url: "http://loki:3100/loki/api/v1/push"

# stores the file pointer inside access logs which have been sent
positions:
  filename: /tmp/positions/positions.yaml

target_config:
  sync_period: 10s

scrape_configs:
- job_name: traefik-logs
  pipeline_stages:
    # extracts json fields to make them labels
    - json:
        expressions:
          client_host: ClientHost
          user_agent: ""request_User-Agent""
          request_path: RequestPath
    # uses MaxMind GeoLite2 to map IP addresses to geo locations
    - geoip:
        source: client_host
        db: /etc/promtail/GeoLite2-City.mmdb
        db_type: city
    # drop certain geoip labels, as we are limited to 15 labels in total
    - labeldrop:
      - geoip_postal_code
      - geoip_subdivision_code
      - geoip_continent_code
      - geoip_continent_name
      - geoip_subdivision_name
      - geoip_timezone
    # uses a regex to extract the OS from the user_agent
    - regex:
        source: user_agent
        expression: "(?P<OS>Windows \\\\w+ \\\\d+(?:\\\\.\\\\d+)*|Linux(?: (?:i686|x86_64))?|Macintosh|(?:CPU )?iPhone OS|CPU OS.*?like Mac OS X)"
    # uses a regex to extract the Device type from the user_agent
    - regex:
        source: user_agent
        expression: "(?P<Device>iPhone|iPad|Mobile|Android(?: \\\\d+(?:\\\\.\\\\d+)*))"
    # uses a regex to extract the Browser from the user_agent
    - regex:
        source: user_agent
        expression: "(?P<Browser>(MSIE|(?:Mobile )?Safari|Chrome|\\\\b\\\\w+\\\\b Chromium|Firefox|Version|Mobile|GSA|QuickLook|OPR)[ \\\\\\\\/](?:[A-Z\\\\d]+\\\\b|\\\\d+(?:\\\\.\\\\d+)*))"
    # defines new labels from extracted fields within the pipeline processing
    - labels:
        client_host:
        user_agent:
        request_path:
        OS:
        Device:
        Browser:
  # define the static labels and the filesystem location to find the
  # log to be scraped
  static_configs:
  - targets:
    - localhost
    labels:
      job: traefik
      host: localhost
      __path__: /var/log/*.json
\`\`\`

## Grafana

Finally we have to create a Grafana dashboard to visually present all this information. I have added the Grafana dashboard as JSON in the [github repository](https://github.com/oglimmer/traefik-loki-grafana-web-analytics) linked at the beginning.

![Grafana Dashboard](/images/grafana-dashboard.png)

While this cannot catch up to full-grown web analytics tools, it certainly contains some useful information.

## Key Features

This setup provides:
- Geographic location of visitors
- Browser and OS statistics
- Device type tracking
- Request path analysis
- All based on standard access logs

## Conclusion

Using Grafana Loki for web analytics is a lightweight alternative to traditional analytics platforms. While it may not have all the features of dedicated solutions, it provides valuable insights without additional tracking scripts or privacy concerns.`
  },
  {
    slug: 'tomcat-behind-reverse-proxy',
    title: 'Tomcat behind a Reverse-Proxy',
    description: 'How to properly configure Tomcat when running behind a reverse proxy to handle source IPs, context paths, and HTTPS correctly',
    date: '2023-01-08',
    content: `*Originally published on Medium, January 8, 2023*

As long as you offer only http and do simple host based routing on the Reverse-Proxy your application doesn't have to do anything to support being behind a Reverse-Proxy. Having said that you still might find it odd to see only the Reverse-Proxy's IP in your Tomcat's access log files.

As soon as you use https or a different path prefix on the Reverse-Proxy, your application might run into problems.

Let's look at those problems and their solutions.

## The possible Problems

### Your application sees the Reverse-Proxy's IP as the Source IP

As the TCP connections are terminated on the Reverse-Proxy and traffic is forwarded on a second TCP connection you only see the Reverse-Proxy's IP as the "Remote IP" in Tomcat. This is also seen in access logs or anywhere in your application where you use \`HttpServletRequest.getRemoteAddr()\`.

### Your application might be deployed under a different URL path prefix

You might have developed your application - and thus always deployed it - as a myapp.war, so the context path - the prefix on the URL path - was \`/myapp/\`. Maybe your application is now running on a Reverse-Proxy, configured by an administrator who wants to run your application on a different path prefix or just without any in case of a host based routing scenario.

### You see Http protocol is "http" even the user accesses your system via https

If your application uses \`HttpServletRequest.isSecure()\` you will notice that this value is set to what the Reverse-Proxy is using, not what the client is actually asking for.

## Fixing the Source IP

Assuming that your Reverse-Proxy is setting the http header \`X-Forwarded-For\` and \`X-Forwarded-Proto\`, Tomcat provides a very elegant and simple solution to replace all relevant TCP level information in a HttpServletRequest with this configuration:

\`\`\`xml
<!-- inside conf/server.xml -->

<Host ...>
  <Valve className="org.apache.catalina.valves.RemoteIpValve" />
</Host>
\`\`\`

See [here](https://tomcat.apache.org/tomcat-9.0-doc/config/valve.html#Remote_IP_Valve) for the full documentation to configure the validation for trusted Reverse-Proxy IPs and different http/https server ports. By default, 10/8, 192.168/16, 169.254/16, 127/8, 172.16/12, and ::1 are allowed as Reverse-Proxy IPs.

## Fixing Access Logs

There is another configuration change needed to let Tomcat use the X-Forwarded-For header information for the access logs:

\`\`\`xml
<!-- inside conf/server.xml -->

<Host ...>
  <Valve className="org.apache.catalina.valves.RemoteIpValve"
         httpServerPort="8080" httpsServerPort="8443" />

  <Valve className="org.apache.catalina.valves.AccessLogValve"
         directory="logs"
         prefix="localhost_access_log"
         suffix=".txt"
         pattern="combined"
         requestAttributesEnabled="true" />
</Host>
\`\`\`

The attribute \`requestAttributesEnabled="true"\` tells Tomcat to use a possible X-Forwarded-For for the access logs.

As a side note \`pattern="combined"\` switches Tomcat's access logs to the combined log format known from Apache.

## Context Path configuration

At this point it is worth to mention that your application must not hardcode URL path prefix nor is it necessary to make it configurable in your application.

Whenever you construct an absolute URL you have to call \`HttpServletRequest.getContextPath()\` for the URL prefix.

Then you can freely configure the context path via \`<Context>\`. This can be done in two ways:

### Inside server.xml

To define a different context path you can simple add a \`<Context>\` element inside \`<Host>\` of server.xml.

\`\`\`xml
<Host appBase="webapps" ...>
  <Context docBase="path/to/myapp" path="app" />
</Host>
\`\`\`

Leave path empty to use the \`/\` path. docBase can be relative to appBase or absolute. Keep in mind that if you don't want to load your application twice you have to move the docBase outside of appBase.

As the documentation says:

> It is NOT recommended to place \`<Context>\` elements directly in the server.xml file.

### As a XML file in conf/Catalina/localhost

So the recommended way is to put a file into \`conf/Catalina/localhost\` (replace localhost in case of virtual hosting with your domain) and here the filename of the XML file will define the path prefix.

Use \`ROOT.xml\` if you want the \`/\` path, for \`/myapp\` use \`myapp.xml\`, like this:

\`\`\`xml
<Context
  docBase="/path/to/myapp"
/>
\`\`\`

As a side note: while you can have \`<Context>\` inside your application's directory's \`META-INF/Context.xml\` file, this cannot define a different path.

## Examples of wrongly and properly configured systems

Let's assume we are running a HAproxy Reverse-Proxy on port 8000/8443. All traffic is forwarded via http only to a Tomcat running on 8080, where we have deployed an application into \`webapps/myapp\`.

Let's also accept that we are not redirecting http to https for this analysis.

### Without configuration

Let's check what Tomcat sees without any configuration.

![Tomcat HTTPS request without configuration](/images/tomcat-http-without-config.png)

We have configured HAProxy to add several http headers defining what has happened, but Tomcat and its HttpServletRequest API is not taking this into account and thus shows wrong data for Remote Address, Remote Host in case of this http request.

![Tomcat HTTP request with configuration](/images/tomcat-https-without-config.png)

For an https request even \`isSecure()\` is wrong.

### With proper configuration

Let's fix this by adding:

\`\`\`xml
<Valve className="org.apache.catalina.valves.RemoteIpValve"
       httpServerPort="8000"
       httpsServerPort="8443" />
\`\`\`

to \`conf/server.xml\`.

Now we see:

![Tomcat HTTP request with configuration](/images/tomcat-http-with-config.png)

That all information retrieved from Tomcat's \`HttpServletRequest\` API is equal to the client side's point of view.

![Tomcat HTTP request with configuration](/images/tomcat-https-with-config.png)

Even for an https request, the \`isSecure()\` shows true.

### Tomcat logs

After adding \`requestAttributesEnabled="true"\` to the logger definition in server.xml you also see the right Source IP in the access logs.

![Tomcat access logs](/images/tomcat-access-logs.png)

## Download all files for your own tests

I have uploaded a project with HAProxy, Tomcat and all files you need to reproduce the experiments shown in this article.

[https://github.com/oglimmer/tomcat-behind-reverse-proxy](https://github.com/oglimmer/tomcat-behind-reverse-proxy)`
  },
  {
    slug: 'source-ips-traefik-kubernetes',
    title: 'Getting Source IPs behind Traefik in Kubernetes at home',
    description: 'How to properly configure HAProxy, Traefik, and Kubernetes to preserve client source IPs for applications running in a home cluster',
    date: '2023-01-04',
    content: `*Originally published on Medium, January 4, 2023*

I am running all my applications on a Kubernetes cluster in my living room. Like every good DevOps person I want to see the source IPs in my application logs, for all IPv4 and IPv6 clients. As Traefik is fabulously taking care of getting and renewing Letsencrypt certificates, even with wildcard domains, I am terminating TLS on Traefik.

## Setup description

My living room hosting setup looks like this:

![Traefik Kubernetes setup diagram](/images/traefik-k8s-setup.png)

1. **Fritzbox** is my DSL/Router, it forwards all incoming TCP for IPv4 and IPv6 on 80 and 443 to the host where HAProxy is running
2. I am running **HAProxy** in between the Router and the Kubernetes cluster because I want to support IPv6 and as this address changes frequently, this host and its HAProxy helps to adopt to every changing IPv6. I have written another article how this works, you can find it [here](/blog/hosting-website-home-fritzbox-ipv6). The HAProxy forwards all IPv4 and IPv6 traffic on layer 4 to the IPv4 address of Traefik
3. **Traefik** is my Kubernetes ingress controller, it terminates TLS, refreshes all my Letsencrypt certificates and forwards the http requests to my applications (e.g. "My App")
4. **My App** gets the requests with all X-Forward-* headers properly set

## HAProxy

The host running HAProxy runs Ubuntu 22.04, so the configuration for my layer 3 forwarding looks like this:

\`\`\`
global
  log /dev/log  local0
  log /dev/log  local1 notice
  chroot /var/lib/haproxy
  stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
  stats timeout 30s
  user haproxy
  group haproxy
  daemon

defaults
  timeout client          30s
  timeout server          30s
  timeout connect         30s

frontend frontend-http
  bind    :::80 v6only
  bind    :80
  default_backend backend-http

backend backend-http
  mode   tcp
  server upstream 192.168.178.50:80 send-proxy check

frontend frontend-https
  bind    :::443 v6only
  bind    :443
  default_backend backend-https

backend backend-https
  mode   tcp
  server upstream 192.168.178.50:443 send-proxy check

frontend stats
  bind :1936
  default_backend stats

backend stats
  mode http
  stats enable
  stats hide-version
  stats realm Haproxy Statistics
  stats uri /
  stats auth admin:foobar
\`\`\`

This configuration enables a statistics page on port 1936, while also forwarding all IPv4 and IPv6 traffic on 80 and 443 to my Traefik host.

It is worth to mention that we need to enable \`send-proxy\` on the upstream servers, as this transports the source IP to the Traefik host.

## Traefik

To install Traefik on Kubernetes [this page](https://doc.traefik.io/traefik/getting-started/install-traefik/) explains this very well. Having said that, one needs to make a couple of additional configurations to enable source IPs:

\`\`\`yaml
---
  additionalArguments:
    - --certificatesresolvers.digitalocean.acme.dnschallenge.provider=digitalocean
    - --certificatesresolvers.digitalocean.acme.email=my@email.com
    - --certificatesresolvers.digitalocean.acme.storage=/certs/acme.json

  ports:
    web:
      redirectTo: websecure
      proxyProtocol:
        trustedIPs: ["192.168.178.52"]
    websecure:
      proxyProtocol:
        trustedIPs: ["192.168.178.52"]

  env:
    - name: DO_AUTH_TOKEN
      valueFrom:
        secretKeyRef:
          key: apiKey
          name: digitalocean-api-credentials

  ingressRoute:
    dashboard:
      enabled: false

  persistence:
    enabled: true
    path: /certs
    size: 128Mi

  service:
    spec:
      externalTrafficPolicy: Local
    externalIPs:
      - 192.168.178.50

  logs:
    general:
      level: INFO

  hostNetwork: true

  affinity:
    nodeAffinity:
      requiredDuringSchedulingIgnoredDuringExecution:
        nodeSelectorTerms:
        - matchExpressions:
          - key: node-role.kubernetes.io/master
            operator: Exists

  tolerations:
    - key: node-role.kubernetes.io/master
      effect: NoSchedule
\`\`\`

The first section \`additionalArguments\` configures Traefik for DNS challenge with Digitalocean.

The second section \`ports\` makes sure that all http (port 80) traffic is redirected to https (port 443). It also enables the proxy protocol for 80 and 443 requests. This is the counterpart of the \`send-proxy\` configuration we have done in HAproxy. You also have to define the trusted IPs, which in my case is the HAProxy host's IP.

The third section \`env\` defines a variable \`DO_AUTH_TOKEN\` which is used by the certificationResolver written for DigitalOcean. Of course you have to create the Kubernetes secret as well, like this:

\`\`\`yaml
---
  apiVersion: v1
  kind: Secret
  metadata:
    name: digitalocean-api-credentials
    namespace: traefik

  type: Opaque
  stringData:
    apiKey: dop_v1_here_goes_your_digital_ocean_api_key
\`\`\`

The fourth section \`ingressRoute\` simply deactivates the Traefik dashboard.

The fifth section \`persistence\` defines a PersistentVolume where the Letsencrypt private key and its certificates are stored. You have to define this PersistentVolume elsewhere.

The sixth section \`service\` enables "[Preserving the client source IP](https://kubernetes.io/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)" via \`externalTrafficPolicy: Local\`. It also defines the IP address where Traefik can be found from the outside local network. As I will run Traefik on the master node, this is the IP address of my Kubernetes master node. You don't have to run Traefik on the master node, but my master node has a lot of capacity left.

The seventh section \`logs\` simply sets the logging level to INFO. DEBUG or ERROR are also useful values.

The eighth section \`hostNetwork\` switches the Traefik Kubernetes Pod to use the host's network directly. This is necessary to get and pass through the source IP.

The ninth section \`affinity\` configures Kubernetes so Traefik will always run on the master node.

The tenth section \`tolerations\` will remove the restriction to not install the Traefik Pod on the master node.

## My App

Finally I want to show the ingress configuration for my applications. This can be done either with an IngressRoute or with Ingress.

This is how it looks with an IngressRoute:

\`\`\`yaml
---
apiVersion: traefik.containo.us/v1alpha1
kind: IngressRoute
metadata:
  name: test-ingress
  namespace: default

spec:
  entryPoints:
    - websecure

  routes:
    - match: Host(\`test.oglimmer.de\`)
      kind: Rule
      services:
        - name: test-service
          kind: Service
          namespace: default
          port: 80
  tls:
    certresolver: digitalocean
    domains:
    - main: "*.oglimmer.de"
\`\`\`

or this for Ingress:

\`\`\`yaml
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
    name: test-ingress
    annotations:
      traefik.ingress.kubernetes.io/router.tls.certresolver: digitalocean
      traefik.ingress.kubernetes.io/router.tls.domains.0.main: "*.oglimmer.de"
spec:
  rules:
  - host: "test.oglimmer.de"
    http:
      paths:
      - pathType: Prefix
        path: "/"
        backend:
          service:
            name: test-service
            port:
              number: 80
\`\`\`

In the application you now get the following X-Forwarded-* headers:

- \`X-Forwarded-For: 92.117.246.225\`
- \`X-Forwarded-Host: test.oglimmer.de\`
- \`X-Forwarded-Port: 443\`
- \`X-Forwarded-Proto: https\`
- \`X-Forwarded-Server: k8s-p2-master\`
- \`X-Real-Ip: 92.117.246.225\`

## Final words of wisdom

As you have already realized this is not a recommended production setup. Using \`hostNetwork: true\` is not the best idea, as for example written [here](https://kubernetes.io/docs/concepts/configuration/overview/).`
  },
  {
    slug: 'hosting-website-home-ds-lite',
    title: 'Hosting a website at home with DS-Lite',
    description: 'A guide to hosting websites at home when your ISP uses DS-Lite, combining dynamic DNS and IPv6 reverse-proxy solutions',
    date: '2022-07-28',
    content: `*Originally published on Medium, July 28, 2022*

If you like to play around with Web technologies like I do, you might have also the need to host those projects somewhere. One possibility is to run them on a RaspberryPi in your living room.

To do this you have to solve 2 problems:

1. Your ISP frequently assigns you different IP addresses. Some ISPs do this every 24h, some only now and then, but as you don't have a fixed IP address you need some sort of dynamic DNS.
2. Your ISP might not give you a public IPv4. This is called "DS Lite" (Dual Stack Lite) and basically means that your Router is behind a NAT gateway and you share your public IPv4 with other people. This makes you "not reachable" via IPv4 from the Internet and you need to use IPv6 for inbound connections.

## Issue 1 - Dynamic DNS

Usually your Router (DSL or Cable Modem) should support dynamic DNS. So you only need to pick a provider, set it up on their Webpage and finally configure it within your Router.

These are the DynDNS providers my Fritzbox 7520 supports:

![Fritzbox DynDNS providers](/images/fritzbox-dyndns-providers.png)

### Using a self hosted Dynamic DNS solution

As we want to host our own webserver anyway, we can also run our own DynDNS solution.

This requires the following components:

- A 3rd party DNS server hosting our domain
- A Router (DSL/Cable modem) allowing to call an HTTP endpoint when it gets a new public IP address
- A host running at your home (like a RaspberryPi) - but that's also our home server we want to use as our web server

To summarize it, we need to tell the Router to call an http endpoint when a new public IP is assigned. A script behind this endpoint will then use the new IP to update the DNS records on the DNS Server's API.

## Issue 2 - ISP connects you via DS-Lite (a.k.a. no public IPv4)

Depending on your ISP you might not have a public IPv4, what means while you see a IPv4 on your Router, this IPv4 is behind a NAT gateway, thus you are sharing this IPv4 with other users / Routers on your ISP network.

A solution can be a very tiny resourced host running in a public data-center, which takes in all IPv4 and IPv6 connections to our domain and forwards them via IPv6 only to our (home) router which in turn forwards it to our RaspberryPi.

## Target architecture

This is the target architecture to solve both problems:

![DS-Lite target architecture](/images/ds-lite-target-architecture.png)

## Implementation hints

Here are a couple of ideas how to implement this architecture.

### Dynamic DNS

A free DNS server with an easy to use REST API is provided by Digital Ocean. Here is a link to the PATCH endpoint for domain records and this is how a curl to update the IPv6 for a domain (in this case test-backend.oglimmer.de) could look like:

\`\`\`bash
curl -H "Authorization: Bearer $DIGITALOCEAN_TOKEN" \\
     -H "Content-Type: application/json" \\
     "https://api.digitalocean.com/v2/domains/oglimmer.de/records/326215399" \\
     -X PATCH \\
     -d '{"type": "AAAA", "data": "'$IPV6'"}'
\`\`\`

### Static DNS

There is nothing special with the A and AAAA records you need for your main domain (in this case test.oglimmer.de), just serve them from the DNS server you have used for the dynamic part.

### IPv4 + IPv6 to IPv6 only reverse-proxy

The host can be as small as you can get it, like 512 MB RAM and 1 vCPU.

Here are a couple of options:
- At DigitalOcean this is $4 / month
- If you dare to use AWS you can run a t3.micro instance for 12 months free of charge
- A company called v6node provides for just 9€ per year (sic!) such a tiny host

Install an HAProxy and configure it as a reverse-proxy for your IPv6 sub-domain. These are the important lines in a haproxy.cfg file:

\`\`\`
resolvers dns
  parse-resolv-conf
  hold valid 60s

frontend all
  bind :::80
  bind :::443 <here your usual parameters>
  default_backend haproxy

backend haproxy
  option httpchk
  server haproxy1 test-backend.oglimmer.de:443 ssl check \\
    ca-file ISRG_Root_X1.pem check-ssl resolvers dns \\
    init-addr libc
\`\`\`

You need to use a resolver as you want to use a FQDN for the backend server. We cannot use an IPv6 directly as the IP changes frequently (like once a day) and you need to tell haproxy to constantly re-query the DNS. \`hold valid 60s\` lets haproxy query the DNS every 60 seconds.

### Using IPv6 inside your home network

Running IPv6 in your internal home network makes the IP forwarding between your Router and the web server host a lot more difficult. I wrote a separate article about that. Unless you are interested in IPv6 in particular, I would recommend to use IPv4 for your home network.

## Conclusion

By combining dynamic DNS with a small cloud-based reverse proxy, you can successfully host websites at home even when your ISP uses DS-Lite. The key is leveraging IPv6 connectivity while maintaining IPv4 accessibility through the proxy server.`
  },
  {
    slug: 'unit-testing-stdin-stdout-java',
    title: 'Unit testing a stdin / stdout based Java program',
    description: 'How to properly test Java programs that take input from stdin and write results to stdout using JUnit 5',
    date: '2022-07-04',
    content: `# Unit testing a stdin / stdout based Java program

*Originally published on Medium, July 4, 2022*

How to (unit) test a Java program which takes input from stdin and writes its results to stdout?

JUnit 5 is not offering any support for this scenario out of the box. Of course it would be easy to just redirect stdin / stdout like that:

\`\`\`java
System.setIn(new FileInputStream("test_input.txt"));
OutputStream baos = new ByteArrayOutputStream();
System.setOut(new PrintStream(baos));

UserManagerApp.main(null); // this is our stdin-stdout program

// test expected output against baos
\`\`\`

The problem is, that you don't get precise feedback if anything fails and you also don't test if the output was generated in return to a specific input line.

## What we want to achieve

What we want to do is more like:

\`\`\`java
@Test
public void testMethod() {

    try (TestCase testCase = TestCase.build()
            .input("add-user John Quil").expect("user added")
            .input("add-user Anita Bath").expect("user added")
            .input("list-users").expect(
                     "user:", "1,John,Quil", "2,Anita,Bath")
            .input("del-user 1").expect("user deleted")
            .input("list-users").expect("user:", "2,Anita,Bath")
            .input("quit")) {

        UserManagerApp.main(null);

    }
}
\`\`\`

This should test each input line, terminated by \`<enter>\`, against each expected output line, terminated by \`<enter>\`.

## Implementation

This is a class implementing such a logic:

\`\`\`java
public class TestCase {

    class TestStep {
        List<String> inputs;
        List<String> expectedOutputs;

        TestStep(List<String> inputs) {
            this.inputs = inputs;
        }
    }

    class TestInputStream extends InputStream {

        @Override
        public int read(byte b[], int off, int len) {
            if (expectedQueueType != QueueType.INPUT) {
                //FAIL
            }
            List<String> inputs = testSteps.get(mainCounter).inputs;
            String inputString = inputs.get(readSubCounter) + "\\n";
            readSubCounter++;

            if (readSubCounter == inputs.size()) {
                expectedQueueType = QueueType.OUTPUT;
            }
            ByteArrayInputStream bais =
                  new ByteArrayInputStream(inputString.getBytes());
            return bais.read(b, off, len);
        }
    }

    class TestOutputStream extends OutputStream {

        private String buffer = "";

        @Override
        public void write(byte[] b, int off, int len) {
            if (expectedQueueType != QueueType.OUTPUT) {
                // FAIL
            }
            buffer += new String(b, 0, len);
            if (buffer.contains("\\n")) {
                // remove string to test from buffer (0...\\n)
                int posNewline = buffer.indexOf("\\n");
                String stringToTest
                                  = buffer.substring(0, posNewline);
                if (posNewline < buffer.length() - 1) {
                    buffer = buffer.substring(posNewline + 1);
                } else {
                    buffer = "";
                }
                // check string against expected result
                String expectedOutput
                          = testSteps.get(mainCounter)
                             .expectedOutputs.get(writeSubCounter);
                if (!stringToTest.equals(expectedOutput)) {
                    // FAIL
                }
                writeSubCounter++;
                // when all expected blocks are found -> to input
                if (writeSubCounter ==
                                testSteps.get(mainCounter)
                                         .expectedOutputs.size()) {
                    expectedQueueType = QueueType.INPUT;
                    writeSubCounter = 0;
                    readSubCounter = 0;
                    mainCounter++;
                }
            }
        }
    }

    enum QueueType {
        INPUT, OUTPUT
    }

    private int mainCounter;
    private int writeSubCounter;
    private int readSubCounter;

    private QueueType expectedQueueType = QueueType.INPUT;

    private List<TestStep> testSteps = new ArrayList<>();

    private TestCase() {
        System.setIn(new TestInputStream());
        System.setOut(new PrintStream(new TestOutputStream()));
    }

    public static TestCase build() {
        return new TestCase();
    }

    public TestCase input(String... input) {
        testSteps.add(new TestStep(Arrays.asList(input)));
        return this;
    }

    public TestCase expect(String... expectedOutput) {
        testSteps.get(testSteps.size() - 1)
                   .expectedOutputs = Arrays.asList(expectedOutput);
        return this;
    }

    // Removed some code not necessary for the core logic
    // see the github repo for the complete code
}
\`\`\`

## Known issues

A known issue is the missing possibility to reset the program between tests, so you also need to instantiate a custom ClassLoader and load UserManagerApp into this ClassLoader, so you can throw it away between tests easily.

## Complete code

You can find the code and its usage in this GitHub repository: [https://github.com/oglimmer/junit-stdin-stdout](https://github.com/oglimmer/junit-stdin-stdout)`
  },
  {
    slug: 'zoom-recordings-to-discourse',
    title: 'How to automatically publish Zoom recordings to discourse.org',
    description: 'An automated pipeline using AWS Lambda, Vimeo, and Discourse to publish Zoom cloud recordings with hashtag-based categorization',
    date: '2021-12-22',
    content: `# How to automatically publish Zoom recordings to discourse.org

*Originally published on Medium, December 22, 2021*

While Zoom cloud recordings are easy to make, they are not easily accessible for other people.

We at id5 are using discourse.org within our Intranet to share information and so we want to have each Zoom cloud recording available as a discourse post, where anyone can easily access those recordings.

The solution described in this article is a Zoom cloud recording to Vimeo to discourse.org automated upload and post pipeline.

## Supported features

Any meeting with a hashtag in its title and a Zoom cloud recording should be automatically uploaded to Vimeo and a discourse.org post should be created under the category of its hashtag. Those categories should be sub-categories of "Videos".

### Typical usage in a Google Calendar integration with Zoom

If the meeting title also contains the hashtag #Exp it should be used to set an expiry date when the video and its discourse post will be deleted automatically.

Videos on Vimeo should be password protected.

## AWS architecture

This diagram shows the architecture using AWS infrastructure.

Before we dive into details, let's look at the general building blocks:

- a Zoom cloud API webhook calls an AWS API Gateway for each finished Zoom cloud recording, which puts a message into AWS SNS
- an AWS Lambda function is called for each SNS message, this function downloads the video file, uploads it into Vimeo and finally puts an entry into a AWS DynamoDB table
- A second AWS Lambda function runs every 5 minutes and for each entry in the DynmoDB table it checks if Vimeo has finished the transcoding for this video. When the transcoding is completed, it creates a discourse.org post within a certain category. It might also create a new DynamoDB entry in a second table to set the date and time for an automated deletion of this video and post
- To implement the deletion process, the second AWS Lambda function also checks against the DynamoDB table holding the expiration information. When a video is expired this lambda deletes the video on Vimeo and deletes the post in discourse.org

You might ask why the API Gateway isn't directly connected to a Lambda function. According to this AWS documentation page a lambda connected to an API Gateway cannot have more than 30 seconds of execution time, which might not be enough to download and upload the video. De-coupling the integration gives us a timeout of max 15 minutes.

Now let's look at the different components in detail.

## AWS DynamoDB tables

Start with creating a table \`zoom-to-videoplatform-upload\` and another table \`zoom-to-videoplatform-expiry\`.

Both tables should be of type "On-demand" and have a partition key "videoUrl" of type String.

## AWS API Gateway and SNS

Next create a SNS topic called "zoom-to-vimeo-topic". Then create an API Gateway of type REST called "zoom-to-vimeo-gateway". Create a new resource with a path name of "ingest". Add the POST method with an integration of the SNS service to it. We will add the Auth lambda later.

Create a deployment for it and write down the endpoint URL. I have taken most of the information on how to set up the API Gateway to SNS integration from https://www.alexdebrie.com/posts/aws-api-gateway-service-proxy/, it is worth to read it as well.

## AWS SNS to Lambda

Create a Lambda function using nodejs and attach it via an EventBridge to the SNS, which makes our lambda a subscription of the SNS topic.

The JavaScript code looks like this:

\`\`\`javascript
const AWS = require('aws-sdk');
const stream = require('stream');
const {promisify} = require('util');
const got = require('got');

const pipeline = promisify(stream.pipeline);

const generatePassword = require('./random-password');

AWS.config.update({region: 'eu-central-1'});
const ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

const accessToken = '<<here goes the Vimeo API token>>';

const prepareUpload = async (meetingTitle, accessToken, fileSize) => {
    const password = generatePassword();
    const postResponse = await got.post('https://api.vimeo.com/me/videos', {
        json: {
            "upload": {
                "approach":"tus",
                "size": fileSize
            },
            "name": meetingTitle,
            "description": "Video uploaded on: " + new Date(),
            "password": password,
            "privacy": {
                "view": "password"
            }
        },
        responseType: 'json',
        headers: {
            "Authorization": \\\`Bearer \\\${accessToken}\\\`,
            "Accept": "application/vnd.vimeo.*+json;version=3.4"
        }
    });
    const response = postResponse.body;
    return {
        uploadLink: response.upload.upload_link,
        videoUri: response.uri,
        videoFullLink: response.link,
        password: password
    };
}

// Additional functions and handler code...
\`\`\`

You need to make sure to upload the got npm module and a second JavaScript file called "random-password.js" which exports a function to generate a fixed or random password, like:

\`\`\`javascript
const generatePassword = () => {
    return "our-secret-vimeo-password";
}

module.exports = generatePassword
\`\`\`

You have to change the timeout for this lambda to 15 minutes, also you might want to give it more memory.

As this lambda writes into the DynamoDB table "zoom-to-videoplatform-upload", it also needs more permissions. Add this to the existing role:

\`\`\`json
{
  "Effect": "Allow",
  "Action": [
      "dynamodb:PutItem"
  ],
  "Resource": [
      "<<arn of the DynamoDB table zoom-to-videoplatform-upload>>"
  ]
}
\`\`\`

## AWS Authorizer lambda

To protect your API gateway from anybody being able to add Videos to your intranet, you have to implement an Authorizer lambda function.

Create a new lambda, add this code and don't forget to change the token to your Zoom token later on.

\`\`\`javascript
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};

    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = '2012-10-17';
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = 'execute-api:Invoke';
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }

    authResponse.context = {};
    return authResponse;
}

exports.handler = async (event) => {
    if (!event.headers || !event.headers.Authorization) {
        throw new Error("Bad Gateway");
    }

    const token = event.headers.Authorization;
    if (token === '<<Your Zoom verification token goes here>>') {
        return generatePolicy('user', 'Allow', event.methodArn);
    }

    throw new Error("Unauthorized");
};
\`\`\`

Add this lambda to the API Gateways Authorizers section. Then go to /ingest POST and under "Method Request" use it as an Authorization.

## The 2nd AWS lambda

As shown in the diagram, this lambda has 2 jobs:

1. looking at the DynamoDB table "zoom-to-videoplatform-upload" and check for any finished transcoding on Vimeo, if so, find the right category on discourse - if this category doesn't exist yet, create it - then post the video on discourse, send a slack notification and delete the entry in "zoom-to-videoplatform-upload"
2. looking at the DynamoDB table "zoom-to-videoplatform-expiry" and for each expired entry, delete the respective Vimeo video and the discourse topic, then delete the entry in "zoom-to-videoplatform-expiry"

To give this Lambda function the needed permission on the DynamoDB tables, add this to the execution role of your Lambda:

\`\`\`json
{
  "Effect": "Allow",
  "Action": [
      "dynamodb:Scan",
      "dynamodb:DeleteItem"
  ],
  "Resource": [
      "<<arn of the DynamoDB table zoom-to-videoplatform-upload>>"
  ]
},
{
    "Effect": "Allow",
    "Action": [
        "dynamodb:Scan",
        "dynamodb:DeleteItem",
        "dynamodb:PutItem"
    ],
    "Resource": [
        "<<arn of the DynamoDB table zoom-to-videoplatform-expiry>>"
    ]
}
\`\`\`

To configure it properly you need to change some values:

\`\`\`javascript
// this is the Vimeo Access token
const accessToken = '<<here goes the Vimeo API token>>';

// this is the Disource.org Access token. Choose "User Level"
// as "All Users" and Scope to "Global"
const discourseToken = {
    user: 'system',
    key: '<<here goes the Discourse API token>>'
}

// this needs to match your discourse.org domain
const discourseRoot = "https://test.trydiscourse.com";

// Create a root category names "Video" and put the id here
const defaultDiscourseCategoryId = 14;
\`\`\`

If you also want a Slack integration you have to add a Webhook integration on one of your channels and replace \`https://hooks.slack.com/services/xxx/xxx/xxxx\` with your endpoint URL.

## Zoom integration

Under https://marketplace.zoom.us/develop/ you need to create a Webhook Only integration.

Enter all relevant data and make sure you have selected the event type "All Recordings have completed".

Make sure to use the endpoint URL you got from the AWS Gateway deployment and put the Verification token into the Authorizer Lambda function.

## Discourse.org configuration

To support embedded Vimeo videos on discourse.org you have to allow iframes from player.vimeo.com. Go to the administration area of discourse and add under Security a new "allowed iframes" entry.

## AWS cost

The AWS cost to run this setup is negligible. We usually pay in the area of 0.01 to 0.1 USD per month for this. All resources are paid by usage which makes them very cheap - of course only as long as you made sure to use On-Demand DynamoDB tables.`
  },
  {
    slug: 'hosting-website-home-fritzbox-ipv6',
    title: 'Hosting a website at home behind a Fritzbox with IPv6 enabled',
    description: 'A guide to hosting a website at home using a Raspberry Pi and Fritzbox with IPv6 support and dynamic DNS',
    date: '2021-05-11',
    content: `# Hosting a website at home behind a Fritzbox with IPv6 enabled

*Originally published on Medium, May 11, 2021*

My "web-server infrastructure" at home is composed of:

- a Fritzbox acting as a DSL modem and a network Router
- a Raspberry Pi as my web-server with Ubuntu 20.04

On this Raspberry Pi I host a few web applications including my homepage. As my home IP changes every night, I use a dynamic DNS service (ydns.eu) as the target for a CNAME on www.oglimmer.de.

As we know hosting a website at home, on a Raspberry Pi for example, is very simple and making it available on the Internet via IPv4 is super straight forward.

## Let us recap the situation for IPv4

1. The browser resolves www.oglimmer.de and finds a CNAME for oglimmer.ydns.eu, which returns an A entry pointing on my Fritzbox's public and dynamic IPv4
2. The Fritzbox forwards a request on port 443 to the Raspberry Pi's web-server, because a port forwarding for 443 to the private and fixed IPv4 of my Raspberry Pi is configured

## Things are more complicated with IPv6

As there is no NAT for IPv6, the Fritzbox does not have a port forwarding, instead it has port permissions on routing configurations. So for my scenario the web-server's IPv6 is given permission to be routed on port 80/443 on incoming requests.

### Here is the problem

My Ubuntu 20.04 assigns two global unicast IPv6 addresses and both of those IPs have randomly generated interface ids.

While this is very good for privacy reasons, this is a problem for my setup, as the Fritzbox needs a static interface id for its routing permission.

## The solution

Enable EUI-64 on the standard address to avoid a randomly generated interface id, that means Ubuntu will use "a MAC address derived" interface id instead.

Where this configuration needs to be applied depends on which component is responsible for SLAAC.

### If SLAAC done by the Kernel

You need to use sysctl to enable EUI-64 via:

\`\`\`
net.ipv6.conf.default.addr_gen_mode = 0
net.ipv6.conf.eth0.addr_gen_mode = 0
\`\`\`

### If SLAAC is done by dhcpcd

You need to change dhcpcd.conf like this:

\`\`\`
slaac hwaddr
\`\`\`

### If SLAAC is done by NetworkManager

You need to change the configuration via:

\`\`\`
nmcli con modify "Connection name" ipv6.addr-gen-mode eui64
\`\`\`

This is my IP setup after applying EUI64. As you can see the MAC address is reflected in the interface id of the second global unicast IPv6 address.

A shout-out needs to go to the user Grawity on qastack.co who pointed us to the right solution. See [this post](https://qastack.co).

## Configuration on the Fritzbox

The Fritzbox has under "Internet" → "Permit access" → "Port sharing" a configuration dialog where you can set sharing options.

Most notably is the setting for "IPv6 Interface ID" which must reflect the MAC address.

## Updating ydns.eu

To complete the process we need a script on the web-server to update the dynamic DNS service with both IPs when my ISP updates my public IP.

A simple cgi-bin is called from the Fritzbox (as a custom dynamic DNS provider):

\`\`\`bash
#!/bin/bash

set -f

echo "Content-type: text/plain; charset=iso-8859-1"
echo

IPV4=$(curl -s ifconfig.me)
curl -u 'user:password' "https://ydns.io/api/v1/update/?host=oglimmer.ydns.eu&record_id=164921&ip=$IPV4"

IPV6=$(ip -6 address show dev enp2s0f0 | grep -v " 0sec" | grep "sec" -B 1 | grep inet | grep -v 'temporary' | grep -v 'inet6 fd' |cut -d ' ' -f6|cut -d '/' -f1)
curl -u 'user:password' "https://ydns.io/api/v1/update/?host=oglimmer.ydns.eu&record_id=173613&ip=$IPV6"
\`\`\`

## Conclusion

Running an IPv6 enabled web-server at home is a bit more complicated than thought, but still pretty doable.

The main problem comes from the fact that enabling EUI-64 on Ubuntu depends on your configuration, but once you understood how it works it's quite straight forward again.`
  },
  {
    slug: 'wsl2-ubuntu-gui-alternative',
    title: 'An alternative development WSL 2 setup with Ubuntu GUI',
    description: 'An alternative approach to setting up WSL 2 with Ubuntu GUI and systemd support without using genie',
    date: '2020-11-16',
    content: `# An alternative development WSL 2 setup with Ubuntu GUI

*Originally published on Medium, November 16, 2020*

You might have seen my last article "A working WSL 2 Ubuntu development setup" which uses a program called "genie" to start systemd on WSL 2.

There is an alternative approach described in [this blog post](https://blog.ubuntu.com/2020/06/17/install-wsl-2-on-windows-10) which I would like to discuss here now.

While that post mainly wants to enable snap on WSL 2, it also brings systemd, thus the goal is very comparable to the approach in my first article.

## Basic installation

So let's start with executing all steps in the linked blog post including the section "/etc/bash.bashrc".

As of this writing, the location of daemonize changed from /usr/sbin to /usr/bin, so I added a sym-link:

\`\`\`bash
ln -s /usr/bin/daemonize /usr/sbin/daemonize
\`\`\`

I also changed the file \`/etc/default/locale\` to:

\`\`\`
LANG=en_US.UTF-8
\`\`\`

and did a "wsl --shutdown" in the Windows PowerShell to make this change effective.

## Installing Gnome

The next step is to install a GUI via:

\`\`\`bash
sudo apt install -y tasksel
sudo tasksel install ubuntu-desktop
\`\`\`

which is similar to my last article.

## X11 Server on Windows

Also see my last article in how to set up and start an X11 Server on Windows. The section "Starting VcXsrv in Windows 10" described the necessary steps.

## Configuration

Add the following lines to the .profile file in your user's home directory:

\`\`\`bash
export DISPLAY=$(cat /etc/resolv.conf | grep nameserver | cut -d ' ' -f 2):0
export NO_AT_BRIDGE=1
unset XDG_RUNTIME_DIR
unset DBUS_SESSION_BUS_ADDRESS
\`\`\`

The first line sets the DISPLAY variable so X11 forwarding to Windows works.

The second line sets a variable to suppress a warning when starting the gnome terminal.

Row three and four are also needed to start gnome terminal. Frankly I don't understand why, I just tried-and-error'ed until it worked, so any explanation is appreciated.

## Fish

As I like to use fish as my Unix shell, I install it via:

\`\`\`bash
sudo apt install -y fish
\`\`\`

but the setup of systemd in this scenario depends on bash, so we keep bash as the standard shell for my user.

Instead I change the default shell just for the gnome-terminal which is my default terminal application anyway.

So start the gnome terminal via:

\`\`\`bash
gnome-terminal
\`\`\`

and go to the preferences dialog and change it to use fish as the default shell.

## Known issues

- I had issues in terms of "WSL can talk properly to Windows", mainly in regards to the Unix sockets in /run/WSL and the shell variable WSL_INTEROP. If those are wrong you cannot use code (aka Visual Studio Code) from WSL anymore, which is obviously very annoying, I often had to set WSL_INTEROP manually

## Conclusion

Generally this approach works as fine as the first one, but the advantages and disadvantages are different.

### Pros:

- You don't have to deal with initializing "genie" and entering those bottles (aka namespaces)

### Cons:

- Still the basic underlying issue of a separated process tree still exists
- The issue around WSL_INTEROP was very severe for me
- Fish is not the default shell - only the gnome-terminal uses it by default`
  },
  {
    slug: 'wsl-dev-setup-endgame',
    title: 'WSL dev setup endgame',
    description: 'The final solution for a WSL development environment using Debian instead of Ubuntu to avoid systemd issues',
    date: '2020-12-22',
    content: `# WSL dev setup endgame

*Originally published on Medium, December 22, 2020*

As my first two articles discussed, I have used Windows 10 with WSL 2 and Ubuntu as my development environment for Java/Node for some time now. But Ubuntu uses the Snap Store to install software so you have to have systemd running. My previous two posts showed two different ways how to set up systemd.

Getting systemd to work comes with price to pay. For all the details read my last 2 articles, but I have to say that the price is too high. So instead of solving all the issues coming from having systemd within WSL, let us try to avoid having those problems.

The main difference for this article is that we are using Debian instead of Ubuntu - as Debian is not using Snap, thus we should not need systemd.

This guide shows step by step what I did to set up a Java/Node development environment with WSL+Debian.

## Windows prerequisites

We need to start with the usual preparations on the Windows side:

Do the basic installation steps for WSL 2 on Windows 10 as described [here](https://docs.microsoft.com/en-us/windows/wsl/install-win10)

A dev setup without Docker ain't no dev setup ;) so let's install that as well: [Docker for Windows](https://docs.docker.com/docker-for-windows/wsl/)

In my humble opinion Visual Studio Code is generally the best editor in 2020, but when it comes to WSL setups VSC has the unique feature to be able to edit files inside the WSL VM from the Windows side. So I strongly recommend to install it: [Visual Studio Code](https://visualstudio.microsoft.com/)

The next step is to get the Debian distribution from the Microsoft App Store: [Debian](https://www.microsoft.com/en-us/p/debian/9msvkqc78pk6)

I also recommend to install Windows Terminal as it is way better than the default terminal app coming with Windows and especially the possibility to auto-start the gnome-terminal makes it superior. You can install it from the [Microsoft Store](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701)

Finally you need an X11 Server for Windows. I would recommend VcXsrv as it is free and doesn't have any issues: [VcXsrv](https://sourceforge.net/projects/vcxsrv/)

So let us make sure the X Server is running on Windows. Install and start it as described in this article. Keep in mind to change the Windows Firewall!

## Debian setup

If not done yet, start "Debian" from the Windows Start menu once to install it into WSL. Close the application when you see the shell.

Start Windows Terminal and select "Debian" from the profile menu, then execute:

\`\`\`bash
cd $HOME
\`\`\`

to change to your home directory as Windows Terminal starts in the Windows Home directory by default. This is something we can reconfigure later on.

Continue with:

\`\`\`bash
sudo apt update && sudo apt -y upgrade
\`\`\`

to install all available updates.

Let us continue to install some useful packages (at least useful for my type of development):

\`\`\`bash
sudo apt install -y git tasksel net-tools exa openjdk-11-jdk maven gradle wget chromium curl gcc g++ make jq fish meld
\`\`\`

As you see this installs commonly known packages, feel free to add/remove packages to your liking.

This guide assumes you will use fish as your shell.

To set the DISPLAY variable properly, you need to put this into your \`~/.config/fish/config.fish\`:

\`\`\`fish
set -x DISPLAY (cat /etc/resolv.conf | grep nameserver | cut -d ' ' -f 2):0
\`\`\`

I also needed to explicitly set the PATH variable in my config.fish, but if your PATH variable already looks similar, I would suggest to skip the next step. Make sure to replace \`<WINDOWS_USER>\` with your actual windows user name.

\`\`\`fish
set -x PATH "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/mnt/c/WINDOWS/system32:/mnt/c/WINDOWS:/mnt/c/WINDOWS/System32/Wbem:/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/:/mnt/c/WINDOWS/System32/OpenSSH/:/mnt/c/Program Files/dotnet/:/mnt/c/Program Files/Docker/Docker/resources/bin:/mnt/c/ProgramData/DockerDesktop/version-bin:/mnt/c/Users/<WINDOWS_USER>/AppData/Local/Microsoft/WindowsApps:/mnt/c/Users/<WINDOWS_USER>/AppData/Local/Programs/Microsoft VS Code/bin"
\`\`\`

From this point in time you can use "code" to open Visual Studio Code and of course you can \`code <filename>\` to just edit a file on the Linux filesystem with Visual Studio Code. If this doesn't work, you need to open Visual Studio Code manually and install the plugin "Remote-WSL".

Now we want to install the gnome-desktop to run UI applications:

\`\`\`bash
sudo tasksel install gnome-desktop
\`\`\`

Finally we can change the default shell from bash to fish:

\`\`\`bash
chsh -s /usr/bin/fish
\`\`\`

After closing the current Windows Terminal shell and re-opening one, you should be ready to roll in the fish shell.

You can start with one of these X11 applications:

\`\`\`bash
gnome-terminal
/opt/idea/bin/idea.sh &
chromium &
firefox &
nautilus / &
meld
\`\`\`

## Windows Terminal setup

To make your life easier you can change some configuration. Open the settings for Windows Terminal:

- Add a \`"startingDirectory": "//wsl$/Debian/home/<DEBIAN_USER>"\` to change the initial directory
- You can change the \`defaultProfile\` to Debian's UUID to avoid the first windows always creates a PowerShell
- Add a \`"commandline": "wsl -d Debian -- gnome-terminal && /usr/bin/fish"\` to automatically start the gnome terminal

Example settings:

\`\`\`json
"profiles":
{
    "defaults":
    {
    },
    "list":
    [
        {
            "guid": "{58ad8b0c-3ef8-5f4d-bc6f-13e4c00f2530}",
            "hidden": false,
            "name": "Debian",
            "source": "Windows.Terminal.Wsl",
            "commandline": "wsl -d Debian -- gnome-terminal && /usr/bin/fish",
            "startingDirectory": "//wsl$/Debian/home/oli"
        }
    ]
}
\`\`\`

## VcXsrv setup

You can always start VcXsrv manually, but you can also create a xlaunch file to easily start the X11 Server under Windows with the right configuration. To do so create a file called "x11-startup.xlaunch" at a convenient location under Windows. Add this content:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<XLaunch
    WindowMode="MultiWindow"
    ClientMode="NoClient"
    LocalClient="False"
    Display="-1"
    LocalProgram="xcalc"
    RemoteProgram="xterm"
    RemotePassword=""
    PrivateKey=""
    RemoteHost=""
    RemoteUser=""
    XDMCPHost=""
    XDMCPBroadcast="False"
    XDMCPIndirect="False"
    Clipboard="True"
    ClipboardPrimary="False"
    ExtraParams=""
    Wgl="True"
    DisableAC="True"
    XDMCPTerminate="False"
/>
\`\`\`

Go to \`C:\\Users\\<WINDOWS_USER_NAME>\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\` and create a Windows Shortcuts file here. For maximum convenience go to your Start Menu, right click the new entry "x11-startup" and click "Pin To Start".

## Conclusion

This setup using WSL + X11 + Debian doesn't require solutions for problems you should not have in the first place.

Check out this walk-through video.

I created a script to automate this initial setup for Debian.

Feel free to try it: [https://github.com/oglimmer/wsl-debian-setup](https://github.com/oglimmer/wsl-debian-setup)`
  },
  {
    slug: 'wsl2-ubuntu-development-setup',
    title: 'A working WSL 2 Ubuntu development setup',
    description: 'A comprehensive guide to setting up a development environment using WSL 2, Ubuntu, and Windows tools for the best of both worlds',
    date: '2020-10-26',
    content: `# A working WSL 2 Ubuntu development setup

*Originally published on Medium, October 26, 2020*

## UPDATE: January, 2023

This article was written before Microsoft introduced systemd for WSL as written [here](https://devblogs.microsoft.com/commandline/systemd-support-is-now-available-in-wsl/). If available on your system, use the official way instead of genie.

## Introduction

My development setup has two fundamental requirements: the availability of Unix shell scripting and corporate tools/compliance standards.

Furthermore I need a couple of tools and programs and while the required tools vary from project to project, I always want to install IntelliJ IDEA as my Java / JavaScript IDE, Visual Studio Code as my general purpose editor, docker for containers, Microsoft Teams for collaboration, KeePass as a password manager, a terminal application for bash/fish scripting, Meld as a visual diff tool, Postman for testing REST APIs and an assorted choice of browsers, because - you know - browsers are the thing nowadays.

So how can I get that with Windows as the host platform?

## The issue with my setup for the last 12 month

I was working with Ubuntu as my development system for the last 12 month and while I am pretty happy with the setup in general, I had to run it inside a VirtualBox VM to align with corporate compliance regulations.

That again works quite well but there is one serious drawback: memory allocation between the host system and the virtual machine. VirtualBox, as well as VMware, require you to define the available - and the allocated - memory of the virtual machine before you start it.

In situations where you have plenty of memory on the host system and your needs inside the virtual machine are limited, this is no issue at all. Unfortunately my use-case requires a lot of memory inside the VM and on top of that some flexibility for the host system - and that makes the whole setup some sort of a problem.

Originally I wanted to solely use the virtual machine and so I max'ed out the available memory to the guest operating system.

My laptop has 32 GB of RAM and I assigned 24 GB of RAM to the Ubuntu VM. As said the original idea was to start all applications inside the VM to avoid any switching between the host and the VM, but there are things one cannot do (easily) inside a VM and that is for example video conferencing. We use Microsoft Teams which does exist as a (somewhat) native Linux application, but as VirtualBox does not support the camera - at least without commercial addons - I needed to start and use Teams on Windows.

## A possible solution: WSL 2

Microsoft has built a decent native Hypervisor into Windows and with version 2 of WSL (Windows Subsystem for Linux) it supports memory reclaim mechanisms, thus Windows and Ubuntu can increase and decrease their memory distribution at runtime. This feature in combination with Docker Desktop for Windows could make a Windows-HyperV-Ubuntu-X11 setup not only a reality, but it can be superior to a VirtualBox solution.

## The Windows installation

For the sake of reproducibility I have written this article in an tutorial-like style. So if you want to follow along, start with installing Visual Studio Code on Windows.

The first step is to install WSL 2 on Windows as described [here](https://docs.microsoft.com/en-us/windows/wsl/install-win10) and as we will choose Ubuntu 20.04 as the Linux distribution in a later step, skip step 7. For now you should also install Windows Terminal.

The 2nd step is to install VcXsrv a X11 server for Windows. We will start and configure it later.

The 3rd is to create an Ubuntu VM. So you should download the Ubuntu WSL image from Microsoft Store.

The 4th step on the Windows 10 installation is Docker Desktop for Windows. Just start it after the installation. If the default WSL distro is Ubuntu you don't need to change any settings in Docker. Check the default distro (the asterisk marks the default):

\`\`\`
wsl --list
\`\`\`

If you have or want to have a different default distro, you have to add WSL integration for Ubuntu in the Docker settings dialog under Resources / WSL integration.

The final step is to start Ubuntu via the Start Menu. After initializing the Ubuntu VM in WSL 2 and creating of a user, start with installing the latest Ubuntu updates and switch to the fish shell.

Open the Windows Terminal, then open a "Ubuntu shell" (the little downwards arrow in the menu) and type:

\`\`\`bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y fish
chsh -s /usr/bin/fish
\`\`\`

At this point I would like to point out two arguable decisions I made:

- all my configurations assume fish as the default shell
- I will use remote X11 forwarding to show GUI Linux applications, but you could do that via VNC or RDP as well - it's just that I think X11 creates a more homogeneous experience and it completely eradicates multi-monitor issues

Starting a Ubuntu VM with WSL 2 is super simple, but for a real-world usage, there are a couple of issue to overcome.

## Setting up: Visual Studio Code

Inside the Ubuntu shell type

\`\`\`bash
code
\`\`\`
as you see WSL is installing Visual Studio Code in Ubuntu. From now on you can start the Windows Visual Studio Code for editing files on the Linux file system. You might want to read [this](https://code.visualstudio.com/docs/remote/wsl) for a deeper understanding.

## Issue 1: No systemd

The first issue you will find with WSL is that it doesn't come with systemd, but many things require systemd, so people created genie.

To install genie und you need a .NET runtime. So we start with installing this:

\`\`\`bash
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-runtime-3.1
\`\`\`

After this you can install genie:

\`\`\`bash
echo "deb [trusted=yes] https://wsl-translinux.arkane-systems.net/apt/ /" | sudo tee /etc/apt/sources.list.d/wsl-translinux.list > /dev/null
sudo apt update
sudo apt install -y systemd-genie
\`\`\`

Now genie - aka systemd - can be started with \`genie -s\`. But before we do this let's look into a couple of other issues.

## Issue 2: Changing PATH

Creating a genie shell (via \`genie -s\`) changes the PATH.

\`\`\`bash
echo $PATH
genie -s
echo $PATH
\`\`\`

This is a problem, as the docker and WSL tools (like code) disappeared from the path. Another problem is, that the switch to fish removed the path to \`/snap/bin\`.

My (probably too) simple solution is to set the PATH in the startup script. So type:

\`\`\`bash
code ~/.config/fish/config.fish
\`\`\`

and put the following line into the file (keep in mind to replace "oglimmer" with your Windows user name):

\`\`\fish
set PATH "/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/mnt/c/WINDOWS/system32:/mnt/c/WINDOWS:/mnt/c/WINDOWS/System32/Wbem:/mnt/c/WINDOWS/System32/WindowsPowerShell/v1.0/:/mnt/c/WINDOWS/System32/OpenSSH/:/mnt/c/Program Files/dotnet/:/mnt/c/Program Files/Docker/Docker/resources/bin:/mnt/c/ProgramData/DockerDesktop/version-bin:/mnt/c/Users/oglimmer/AppData/Local/Microsoft/WindowsApps:/mnt/c/Users/oglimmer/AppData/Local/Programs/Microsoft VS Code/bin:/snap/bin"
\`\`\`

## Issue 3: Deleting all content of /tmp

The next issue comes with the temp directory. Start a new Windows Terminal tab for Ubuntu and type:

(To reproduce this, you might need to "wsl --shutdown" first from PowerShell)

\`\`\`bash
ll /tmp
genie -s
ll /tmp
\`\`\`

When genie starts, it somehow deletes everything inside /tmp directory. This is another problem as some programs use /tmp for their state files. An example is ssh-agent which puts its unix socket file into /tmp.

So we need to take that into consideration when starting programs.

## Issue 4: Changing process tree

The next issue comes with the process tree. Start again a new Windows Terminal tab for Ubuntu and type:

(To reproduce this, you might need to "wsl --shutdown" first from PowerShell)

\`\`\`bash
ps -efH
genie -s
ps -efH
\`\`\`

As you see getting into the "systemd aware shell" changes the process tree. Our shell is no longer coming from 3 /init processes, it now has a runuser parent. This has implications on scripts checking for processes. Again we need to keep that in mind.

## Issue 5: Changing host IP for DISPLAY

To start GUI based applications on the remote Windows 10 X Server, the DISPLAY variable has to be defined properly.

Fortunately this is no real issue and we simply put this

\`\`\fish
set -x DISPLAY (cat /etc/resolv.conf | grep nameserver | cut -d ' ' -f 2):0
\`\`\`

into \`~/.config/fish/config.fish\` (via code).

## Ubuntu GUI preparation

The next step is to install the Ubuntu desktop packages. We do this via tasksel:

\`\`\`bash
sudo apt install -y tasksel
sudo tasksel install ubuntu-desktop
\`\`\`

## Starting VcXsrv in Windows 10

Before we can use any GUI programs in Ubuntu, we have to start the X Server in Windows.

Start VcXsrv via "XLaunch" and confirm the first dialog with next:

Confirm the second dialog with next:

Change "native opengl" to false and "Disable access contrl" to true. Then confirm with next and finally click finsh.

You should now see an X icon in the Windows icon area on the lower right corner. You might need to accept a Firewall change for the "public network".

## The manual daily startup routine :(

We talk about about the Good and the Bad. Now to the Ugly.

Taking the issues from above into account I have to do a couple of manual steps after each start. After opening Windows Terminal and selecting the Ubuntu tab I have to type:

\`\`\`bash
genie -s
eval (ssh-agent -c); set -Ux SSH_AGENT_PID $SSH_AGENT_PID; set -Ux SSH_AUTH_SOCK $SSH_AUTH_SOCK
ssh-add ~/.ssh/id_rsa
gnome-terminal
\`\`\`

If gnome-terminal exits with an error and need to execute a "wsl --shutdown" from PowerShell. Then start the "daily startup routine" again.

At this point I minimize the Windows Terminal and switch to the newly created gnome terminal. The reason for this is that I prefer the select and click behavior of the gnome-terminal, especially with features like X Window selections.

## Docker and Client Certificates

If your company has its own docker registry and authentication is done via client certificates (also called mutual TLS) you need to add a client.key and client.cert (both PEM encoded) into

\`\`\`
C:\\Users\\<username>\\.docker\\certs.d\\docker.mycompany.com
\`\`\`

Unfortunately this is not enough and after each restart of Docker's Desktop for Windows application you need to run this command from PowerShell:

\`\`\`powershell
docker run --rm --privileged -d -v /:/host -v $env:UserProfile\\.docker\\certs.d:/certs.d alpine cp -r /certs.d /host/etc/docker/certs.d
\`\`\`

## IntelliJ IDEA

Install it via:

\`\`\`bash
sudo snap install intellij-idea-ultimate --classic
\`\`\`

Start it from the Ubuntu tab in Windows terminal via:

\`\`\`bash
intellij-idea-ultimate &
\`\`\`

## Miscellaneous things to mention

- While memory allocation is flexible, you can limit the max CPU and memory for WSL. This can be configured via .wslconfig
- To have the Windows Terminal as similar as possible to the fish shell, I want to have an alias for "ll" in PowerShell as well:

\`\`\`powershell
cd $env:USERPROFILE\\Documents
md WindowsPowerShell -ErrorAction SilentlyContinue
cd WindowsPowerShell
New-Item Microsoft.PowerShell_profile.ps1 -ItemType "file" -ErrorAction SilentlyContinue
echo "Set-Alias ll ls" > Microsoft.PowerShell_profile.ps1
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
\`\`\`

- Selecting a text in PowerShell should select full paths, so open the Settings and add:

\`\`\`json
"wordDelimiters": " \\\\()"'-:,;<>~!@#$%^&*|+=[]{}~?│",
\`\`\`

- Using FanzyZone in PowerToys enables you do quickly drop and resize windows into different zones. Very handy for ultra-wide monitors.
- You might want to get familiar with the "wsl" command line tool in PowerShell. This can be used to restart, import or export the Ubuntu VM.

## Running programs in Linux vs. Windows

The setup enables me to run inside Ubuntu:

- IntelliJ IDEA
- gnome-terminal
- meld
- bash/fish scripts
- Firefox, Chrome, Opera

While I can run natively under Windows:

- Visual Studio Code
- Firefox, Chrome, Opera, Edge
- Teams
- KeePass
- Windows Terminal
- Postman

All programs look and behave the same. They all have it's own box in the Windows taskbar, can be moved to different monitors and share the Windows Clipboard.

## File system access

You can easily access the Windows file system from Ubuntu via \`/mnt/c/\`. 

Accessing the Ubuntu file system from Windows works as easy as \`\\wsl$\\Ubuntu\\\`

## Docker

You can use docker from Windows and Ubuntu as both share the same docker daemon in the background. Also docker-compose is available by default.

## Known issues

- When docker has strange network issues reboot Windows 10
- Sometimes the Windows 10 X server cannot be reached (e.g. when you want to start gnome-terminal) and you need to shutdown the WSL instances
- Sometimes the docker process holds a handle on directories. This results in a file/directory cannot be written/read within WSL with the error message "file a resource busy". In those cases quit Docker, then delete the directory.
- If starting gnome-terminal doesn't work inside a genie bottle, unset DBUS_SESSION_BUS_ADDRESS and XDG_RUNTIME_DIR, still I am unable to create new tabs via " -- tab" while inside a bottle.
- If starting gnome-terminal brings an error "Couldn't register with accessibility bus" set NO_AT_BRIDGE to 1.

## Don'ts

- Do not install Visual Studio Code inside the Ubuntu VM. It has to be used from \`/mnt/c/Users/oglimmer/AppData/Local/Programs/Microsoft VS Code/bin\`
- Do not install docker, docker.io or docker-compose inside the Ubuntu VM. It has to be used from \`/mnt/c/Program Files/Docker/Docker/resources/bin\` or \`/mnt/c/ProgramData/DockerDesktop/version-bin\`

## Conclusion

A dream came true and I got the best of both worlds: the development tools from Linux and the corporate tools from Windows - everything working seamlessly together.

### Pros:

- it mostly feels like one system - and not as two separated operating systems
- you can start Linux GUI applications and they are shown in Windows as a regular window
- the setup is stable and never crashed for me
- memory is handled automatically and without my interaction or attention

### Cons:

- The docker issue around "file and resource is busy" is annoying and forces you into occasional restarts of Docker
- Using remote X11 makes the regular Ubuntu Desktop not available (at least I haven't figured it out)
- Using "genie" to start and use systemd creates many problems you usually don't have to deal with`
  },
  {
    slug: 'tomee-jpa-datasources',
    title: 'TomEE and JPA DataSources',
    description: 'A guide to the different places DataSources can be defined for web applications using JEE running in a TomEE server',
    date: '2019-06-17',
    content: `# TomEE and JPA DataSources

*Originally published on Medium, June 17, 2019*

This short article shows the different places DataSources can be defined for web applications using JEE running in a TomEE server.

## The situation

In order that your 
@PersistenceContext
 knows against which database it should connect, you have a 
META-INF/persistence.xml
 which defines a persistence-unit which defines a jta-data-source:

### META-INF/persistence.xml

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence"
 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
 xsi:schemaLocation="http://xmlns.jcp.org/xml/ns/persistence
        http://xmlns.jcp.org/xml/ns/persistence/persistence_2_2.xsd"
 version="2.2">

   <persistence-unit name="PersUnitName" transaction-type="JTA">
      <jta-data-source>jdbc/mydatabase</jta-data-source>
   </persistence-unit>
</persistence>
\`\`\`

Finally the database connection must be put into JNDI under \`jdbc/mydatabase\` or to be more precise under \`java:comp/env/openejb/Resource/<CONTEXT>/jdbc/mydatabase\`.

## Where DataSources can be defined

In JEE 6 or later DataSources can be defined in:

- a \`<data-source>\` in \`$WEBAPP/WEB-INF/web.xml\` (or application.xml, application-client.xml, ejb-jar.xml)
- a \`@DataSourceDefinition\` in one of your Java classes

Tomcat adds DataSource definitions under some more locations [[1]](https://tomcat.apache.org/tomcat-9.0-doc/jndi-resources-howto.html):

- as a \`<Resource>\` inside \`<GlobalNamingResources>\` in \`$TOMCAT/conf/server.xml\`
- as a \`<Resource>\` inside \`<Context>\` in \`$WEBAPP/META-INF/context.xml\`
- as a \`<Resource>\` inside \`<Context>\` in \`$TOMCAT/conf/Catalina/localhost/mypath.xml\`
- as a \`<Resource>\` inside \`<Context>\` in \`$TOMCAT/conf/server.xml\`

TomEE adds even more DataSource definition locations [[2]](http://tomee.apache.org/datasource-config.html):

- as a \`<Resource>\` inside \`$TOMEE/conf/tomee.xml\`
- as a \`<Resource>\` inside \`$WEBAPP/WEB-INF/resources.xml\`
- as a list of key=value entries in \`$TOMEE/conf/system.properties\`
- as a "-D" command-line option

## The bad news

Defining the \`<Resource>\` at any location in a \`<Context>\` does add a DataSource object into JDNI, but it doesn't work for your application - this bug is filed under [https://issues.apache.org/jira/browse/TOMEE-263](https://issues.apache.org/jira/browse/TOMEE-263)

I came up with a (maybe too simple) solution.

## DataSource definitions in some detail

As we have seen DataSources can be defined in various locations, unfortunately they have different formats.

Under \`META-INF/context.xml\` (or any other "context") it looks like:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<Context>
  <Resource name="jdbc/mydatabase" auth="Container"
    type="javax.sql.DataSource" username="root" password=""
    driverClassName="com.mysql.cj.jdbc.Driver"
    url="jdbc:mysql://localhost/myschema" />
</Context>
\`\`\`

While in \`WEB-INF/resources.xml\`:

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<tomee>

<Resource id="jdbc/mydatabase" type="DataSource">
   JdbcDriver = com.mysql.cj.jdbc.Driver
   JdbcUrl = jdbc:mysql://localhost/myschema
   UserName = root
</Resource>

</tomee>
\`\`\`

So long story short, make sure you are using the right format at the right place.

## Links

- [[1] Tomcat JNDI Resources How-To](https://tomcat.apache.org/tomcat-9.0-doc/jndi-resources-howto.html)
- [[2] TomEE DataSource Configuration](http://tomee.apache.org/datasource-config.html)
`
  },
  {
    slug: 'poor-mans-continuous-deployment',
    title: 'A poor man\'s Continuous Deployment pipeline',
    description: 'Building a simple CD pipeline with webhooks, cron, and Docker for a cost-effective showcase environment',
    date: '2019-02-07',
    content: `# A poor man's Continuous Deployment pipeline

*Originally published on Medium, February 7, 2019*

In this article I will write about how I built a very simple Continuous Deployment pipeline for my "showcase host". Check out my previous article to read about my Dockerization efforts.

## Why not use a standard CD pipeline?

As some of my projects have private code, I cannot upload build artifacts into public repositories like Maven Central, NPM or Docker-Hub. For cost reasons, I also want to run all projects and their build processes on one host without the need of additional - resource hungry - build or repository applications.

Therefore I came up with my own simple CD workflow.

## Overview

The basic idea was to use a webhook from the git repository to trigger a REST API on my server which in turn triggers a build inside a docker container.

The process is composed of 5 objects:

- **[red]** a 14 lines php web page
- **[orange]** an (empty) filesystem directory
- **[green]** a 2 lines cron.d file
- **[yellow]** a 12 lines bash script
- **[grey]** existing docker-compose.yml files building and re-creating the docker containers

![Process flow overview](/cd-pipeline-flow.png)

## The process flow

1. My github/bitbucket repositories have a webhook configured, which executes on every git commit on the master a GET request to 
https://api.oglimmer.de/v1/push-complete.php?pwd=<password>&target=<name-of-git-repo>

2. The red box is an instance of docker image \`richarvey/nginx-php-fpm\`. This container mounts \`/var/opt/build-queue:/var/opt/build-queue\` and the php script writes a file into this directory for every valid incoming http request.

\`\`\`php
<?php
 if ($_REQUEST['pwd'] == 'PASSWORD') {
  $target = $_REQUEST['target'];
  $allowedTargets = array("cardgameassistance", "cyc", "ggo",
      "http", "junta", "linky", "lunchy", "scg", "toldyouso",
      "yatdg", "citybuilder");
  if (in_array($target, $allowedTargets)) {
   $fp = fopen('/var/opt/build-queue/' . $target, 'w');
   fwrite($fp, $target);
   fclose($fp);
   echo "ok";
  }
 }
?>
\`\`\`

3. The orange box represents a directory, which contains a marker file for every build request coming in through the php script originating from github/bitbucket.

4. The green box is as simple as

\`\`\`*
MAILTO="my-email@address.com"
* * * * * root /usr/local/bin/build-queue-processor.sh
\`\`\`

So the cron daemon will execute the script \`build-queue-processor.sh\` every minute, as we want to trigger a requested deployment - via a file in \`/var/opt/build-queue\` - as soon as possible.

5. The yellow box is the main script called \`build-queue-processor.sh\` and contains the core code of the setup. The script loops over all files in \`/var/opt/build-queue\` and executes a \`docker-compose up -d --build\` on the project given through the file's content.

\`\`\`bash
#!/usr/bin/env bash

[ -f /var/opt/build-queue.lock ] && exit 0
touch /var/opt/build-queue.lock

if [ -n "$(ls -A /var/opt/build-queue)" ]; then
 for filename in /var/opt/build-queue/*; do
  content=$(<$filename)
  cd /home/global-install/src/$content
  docker-compose up -d --build
  rm $filename
 done
fi

rm /var/opt/build-queue.lock
\`\`\`

All lines in regards to \`/var/opt/build-queue.lock\` ensure that there are never more than one script executions in parallel.

6. The grey box is the final part of the build pipeline. It's a \`docker-compose.yml\` file as the entry point from \`build-queue-processor.sh\`. Like all docker-compose files with a build attribute, my actual build script sits inside a Dockerfile.

While the docker-compose.yml and Dockerfile are not part of my particular CD pipeline, I would like to look at my project GridGameOne [play here] as an example here:

### docker-compose.yml

\`\`\`yaml
version: '2' # Use '2' for Docker Compose file format version
services:
  tomcat:
    build: .
    container_name: ggo-tomcat
    mem_limit: 90M
    ports:
      - 8094:8080
\`\`\`

The docker-compose.yml file is very simple and as mentioned in the last article I limit the memory for all my docker containers to make sure all 20 containers run on my 4GB machine. The exposed port on 8094 is picked up by an haproxy on the host.

### Dockerfile

\`\`\`dockerfile
FROM maven:3-jdk-11-slim as build-env

RUN apt-get -qq update && \
    apt-get -y --no-install-recommends install git && \
    apt-get -y autoremove && \
    apt-get -y autoclean

ADD https://api.github.com/repos/oglimmer/ggo/git/refs/heads/master /tmp/version.json

RUN cd /tmp && \
 git clone https://github.com/oglimmer/ggo.git --single-branch ggo-src && \
 cd ggo-src && \
 export OPENSSL_CONF=/etc/ssl/ && \
 mvn package

FROM oglimmer/adoptopenjdk-tomcat:tomcat9-openjdk11-openj9

COPY --from=build-env /tmp/ggo-src/web/target/grid.war  /usr/local/tomcat/webapps/ROOT.war
\`\`\`

This Dockerfile uses a multi-stage build.

In stage 0 - called \`build-env\` - a maven build is executed after a git repository is cloned. This stage contains a neat trick to work around the docker image cache by adding \`/git/refs/heads/master\` into \`/tmp/version.json\`. So the cache is invalidated when the HEAD of the master branch had changed. No need to use \`--no-cache\`.

The final stage of the Dockerfile just copies the previously built WAR file into it. As mentioned in my last article I use OpenJ9 instead of Oracle's Hotspot JVM to minimize the memory usage.

## Build log via email

As the build is executed from the cron daemon, I have \`MAILTO="my-email@address.com"\` on the top of my cron file, so I always get the entire build log output via email.

## Drawbacks

I have noticed two shortcomings:

- Build logs are not archived on the host and just send out via email once
- Build artifacts are not archived / versioned, if my host bursts into flames I need to rebuild everything from source again

## Conclusion

While this approach is certainly not the next industry standard, I would like to conclude that the solution is neither completely bad nor necessarily wrong.

For my use-case of a showcase / demo host it works quite well and it minimizes the operational costs.

The solution is very simple - so just 26 lines of code, an empty directory, a cron entry and Docker container running a php enabled webserver keep my server in sync with all of my github/bitbucket repositories.

---

**Update (March 2026):** The simple-build-server has been [rewritten in Go](/blog/rewriting-simple-build-server-in-go). Commit [917bcb8](https://github.com/oglimmer/simple-build-server/commit/917bcb8cbfd7f78e34411dd56fa3f4d752abce63) is the last one using the Apache/CGI/bash solution described in this post. Everything after that uses the new Go-based implementation.
`
  },
  {
    slug: 'dockerized-java-nodejs-4gb-ram',
    title: 'How many Dockerized Java and Nodejs applications run on a host with 4GB of RAM?',
    description: 'Exploring how to run 20 Docker containers with Java and Node.js applications on just 4GB of RAM for a cost-effective showcase environment',
    date: '2019-01-30',
    content: `# How many Dockerized Java and Nodejs applications run on a host with 4GB of RAM?

*Originally published on Medium, January 30, 2019*

As said in my previous article, I have written a couple of hobby or prototype projects over the course of the last 15 years. Those are mostly simple web games or things like link or lunch-place management systems. I want to showcase them as cheap as possible.

Those 7 games, 3 management systems and my 'homepages' always ran on a single server. So for years they were deployed on a 2GB host, running as a single Tomcat, a single MySQL, a single CouchDB, a single Apache and two Nodejs processes.

While this was working fine - and quite stable - all applications were deployed too close to each other, they were coupled too tightly and there were version dependencies between all of them.

At the dawn of Containerization I asked myself, how much memory does the host need to run all applications in Docker containers?

**The answer is: just 4GB.**

![Output of docker ps](/docker-ps-output.png)

So the host runs 20 Docker containers in total. But to run so many Docker containers on just 4GB of RAM, all containers need to have restricted memory.

Before we look into details, I would like to point out that this is not a recommendation for a production setup nor a recommendation in terms of how much memory one should assign to Docker containers. This just answers the question, "How many Dockerized Java and Nodejs applications can run on a host with 4GB of RAM" when stability and performance is not a priority. My goal is to run all my showcase applications as cheap as possible inside Docker. That's all.

Now let's look at the memory limits for the different container types.

## Tomcats

There are 8 Tomcats running and their memory settings go from 70M to 150M. Version 7 and 9 of Tomcat is being used and it seems there are no differences between those versions in terms of memory requirements.

## CouchDBs

The 4 CouchDBs use Version 1.7 and have 200M to 250M of memory assigned. CouchDB recommends way more memory, but this setting works for my showcase. I also noticed that Version 2.x needs more memory, so I decided to stay on 1.7.

## PouchDB

As one system doesn't use any fancy feature of CouchDB it can also run on PouchDB with memory limited to 90M.

## Nodejs's

The two nodejs containers have 50M respectively 200M max set. Both use version 11 of Nodejs. While Citybuilder uses just a few dependencies and runs with 50M, Linky has many dependencies plus Babel and Webpack and needs 200M to run.

## MySQLs

Both MySQL are Version 5 and memory is limited to 200M or 250M.

## Java processes

Two applications need separate Java backend processes. While one system is set to 150M, the other is set to 350M. Of course those settings highly depend on the process and its nature, so for this article I am just saying Java processes have varying memory needs.

## nginx

The nginx container with support for php is limited to 30M.

## JVM

I always use OpenJ9 instead of Oracle's Hotspot JVM. It has a smaller memory footprint which means it runs with less memory.

I tried to run containers with the same memory settings but with Oracle's Hotspot but they often get terminated by the OOM-killer. So I have build Tomcat running OpenJ9 images.

## Java Memory Settings

When using Java 8 or 9 you need to set 2 JVM parameters to ensure Java and Docker memory limits are in sync:

\`\`\`
-XX:+UnlockExperimentalVMOptions -XX:+UseCGroupMemoryLimitForHeap
\`\`\`

## Continuous Delivery Pipeline

As you might have realized a primary goal of my setup is to run everything on one host. Therefore my CD pipeline runs on the same host as well.

I will talk about this in a later article, but for now I would like to mention that for all builds Docker containers are started on this. Those containers don't have any memory limit set and (of course) are short lived.

## Additional non-Docker host setup

For the sake of completeness, I would like to say that the host itself is only running an haproxy and postfix. All web-servers, databases or other processes are inside a docker container.

This is how the overall memory situation:

![Output of free](/free-output.png)

## Closing notes

As said this setup is not recommended for a production host with low latency, stability, heavy load or many concurrent users in mind.

But for a showcase environment, with expectations on low operational cost, this is great news and it works better than expected.
`
  },
  {
    slug: 'fulgens-build-deploy-script-generator',
    title: 'Fulgens: a build & local deploy & run script generator',
    description: 'A tool to consistently build, deploy, and run projects locally with support for Docker, Vagrant, and various technologies',
    date: '2019-01-03',
    content: `This blog post and the related project are deprecated and archived. The setup described here has been superseded by Docker, Docker Compose, and Makefiles.
    
*Originally published on Medium, January 3, 2019*

## Motivation

Over the last 15 years I have built a couple of projects (all the stuff on www.oglimmer.de) and while it is very simple to build a Java project via a brain-friendly 'mvn package' it is always a bit cumbersome to start-up a project you haven't worked on for quite a while.

Starting a project usually needs a build, a local deployment of the webserver and the database, an initial set up of the database and sometimes a couple of config changes to connect everything together - how this all is done heavily depends on the project and the used technologies.

I wanted to have a system which builds, locally deploys and runs all of my projects with a consistent syntax.

It should be super easy to locally start a project and to play with different versions of Java, Node or database backends. And it should also support Docker and local deployments.

Now this is where Fulgens comes into play.

## Possible solutions with existing technologies

We have maven, gradle, npm and many other standardized build tools to install dependencies and easily build a piece of software. And in my opinion the most important features of these systems are, that you don't need any particular knowledge on how to build the software. A build is as easy as 'mvn package' or 'npm install'. So great, the problem how to build an unknown piece of software is already solved.

But how to start the software locally? 'npm start'? Oh wait, it needs a database…. And when it comes to Java you are lost even more. For sure, you could write a maven config to start a database and initialize it, but that gets really ugly, it isn't the purpose of maven and thus it is far away from 'easily starting the software locally'.

### But we have provisioning tools like Ansible/Chef/Puppet!

These system tend to have a high complexity, as they have been built to solve a much bigger problem: installing infrastructure - not providing a local setup! Maybe Ansible is easy enough - at least it's just an SSH-based remote shell command executor. Still Ansible needs a whole bunch of configuration files and the execution mechanism was made for SSH connections, it's again too complex for what we actually want: just a simple local deployment.

### Can't Docker spin up environments?

A docker-compose.yml file is well suited to spin up all software components of your project but it doesn't change your config files, it's not set up your database and most important it doesn't give you the flexibility to run your components outside of Docker. So even leaving the last aspect aside, you still need some bash code to cover the missing pieces to (initially) start your project.

## Defining our goals for a new solution

1. We want a single simple description file as the input configuration, a bit like Dockerfile, pom.xml or package.json.
2. We want a (generated) shell script with minimal dependencies that builds, deploys, configures and runs our project.
3. We want support for local builds as well as docker-based build.
4. Different runtime environments should be supported:
   - Downloaded temporary local software
   - Docker
   - Vagrant (VirtualBox)
   - (re-)usage of already installed local software
5. Initial and/or continuous setups in combination with temporary or permanent components should be supported.
6. Last but not least, the generated script should be self-describing, almost zero-knowledge should be needed to run it. Spinning up a working local environment should be as easy as 'mvn package'.

## Introducing Fulgens and the Fulgensfile.js

Let's assume we have a Java, web-based project, using a Mysql database.

To start this project, you would probably need to build the java project, start the Mysql database daemon, create a schema, set up some tables and data there and finally deploy the generated war file into a Tomcat server while adding a configuration file.

Let's write a Fulgensfile.js to describe the project:

\`\`\`javascript
module.exports = {
  config: {
    SchemaVersion: "1.0.0",
    Name: "JavaWebProjectExample"
  },
  software: {
    javaCode: {
      Source: "mvn",
      Artifact: "target/JavaWebProjectExample.war"
    },
    tomcat: {
      Source: "tomcat",
      Deploy: "javaCode"
    }
  }
}
\`\`\`

This is a minimal length Fulgensfile.js for a Java, web-based project as it describes how the Java code should be build and where the generated artifact can be found on the filesystem.

It also defines a Tomcat web server and connects the result of the first step into the Servlet container.

Let's add a database:

\`\`\`javascript
...
  software: {
    javaCode: {
      Source: "mvn",
      Artifact: "target/JavaWebProjectExample.war"
    },
    mysql: {
      Source: "mysql",
      Mysql: {
        Schema: "java_code",
        Create: [ "./src/db/mysql.dump" ]
      }
    },
    tomcat: {
      Source: "tomcat",
      Deploy: "javaCode"
    }
  }
...
\`\`\`

The new object "mysql" in the Fulgensfile.js will start a Mysql instance inside Docker, it will create a schema 'java_code' and import the sql file ./src/db/mysql.dump.

There is still one problem, the JavaCode.war doesn't know how to find the Mysql host if it is not 'localhost'.

\`\`\`javascript
...
software: {
  javaCode: {
    Source: "mvn",
    Artifact: "target/JavaWebProjectExample.war",
    configFile: {
      Name: "java.properties",
      Content: [{
        Source:"mysql",
        Regexp: ".*db.host.*",
        Line: "db.host": "$VALUE$""
      }],
      LoadDefaultContent: "src/main/resources/default.properties",
      AttachAsEnvVar: [
        "JAVA_OPTS", "-Dconfig.properties=$SELF_NAME$"
      ]
    }
  },
  mysql: {
    Source: "mysql",
    Mysql: {
      Schema: "java_code",
      Create: [ "./src/db/mysql.dump" ]
    }
  },
  tomcat: {
    Source: "tomcat",
    Deploy: "javaCode"
    }
  }
...
\`\`\`

The final piece defines a configuration file for our WAR. It specifies the db.host variable and assigns the mysql host name to it. Finally the file name will be assigned to a -D parameter called config.properties via the tomcat environment variable JAVA_OPTS.

To support Vagrant the Fulgensfile.js needs a section 'Vagrant' on the initial config object:

\`\`\`javascript
module.exports = {
  config: {
    SchemaVersion: "1.0.0",
    Name: "JavaWebProjectExample",
    Vagrant: {
      Box: 'ubuntu/xenial64',
      Install: 'maven openjdk-8-jdk-headless mysql-client-5.7 docker.io'
    }
  },
...
}
\`\`\`

This defines the packages needed on a fresh installation of Ubuntu 16.04.

## Generating the bash script

After installing Fulgens from the npm repository via \`npm -g install fulgens\`, a bash script can be generated using the command:

\`\`\`bash
fulgens Fulgensfile.js >run_local.sh
\`\`\`

(You need to give the generated bash script executable rights via \`chmod 755 run_local.sh\`)

The script can be started with \`-h\` to get the help information.

![Fulgens help output](/fulgens-help.jpeg)

## Executing the script to build, deploy and run the project

One of the most simple things one can do with the script is to start it via \`./run_local.sh -f\`. This will build the WAR file, start the Mysql database, set up the schema, table and initial data and finally start a Tomcat with the deployed WAR file. As we have given -f the script will finally tail Tomcat's log file.

If we want to start the Tomcat inside a Docker container, we use \`./run_local.sh -t tomcat:docker\`. This still builds the WAR file, starts the Mysql database, sets up the schema, table and initial data and finally starts a Tomcat within Docker with the deployed WAR file.

The build can also be done inside a Docker container. \`./run_local.sh -t javacode:docker\`. This will again build, deploy and start the project. But this time the maven build, called 'javacode', will be executed inside Docker.

To build, deploy and start the project inside a Vagrant (VirtualBox) environment, you can use \`./run_local.sh -V\`.

## Documenting and limiting versions

Fulgens can also be used to document and limit software versions.

Let's assume our project must be build with Java 1.8, the Mysql must be a Version 5.x and the Tomcat a 7.0.92 using JRE-8.

In this case a versions object can be added to the Fulgensfile.js:

\`\`\`javascript
...
versions: {
  javaCode: {
    Docker: "3-jdk-8",
    JavaLocal: "1.8",
    KnownMax: "Java 1.8"
  },
  mysql: {
    Docker: "5",
    KnownMax: "Mysql 5.x"
  },
  tomcat: {
    Docker: "7.0.92-jre8-slim",
    TestedWith: "7 on Java 8"
  }
}
...
\`\`\`

The attributes \`KnownMax\` and \`TestedWith\` are for documentation only and can hold any string. The attributes \`Docker\` and \`JavaLocal\` are actually limiting the Docker or Java versions used by Fulgens.

## Real world references

Here are some examples where I used Fulgens for my own projects:

- **Code Your Restaurant (cyc)**: Builds a Java project, starts a Couchdb with 3 views. The project consists of 2 parts: a backend server (plain Java) and a WAR file hosted on Tomcat. Both need config files.

- **Lunchy**: A Java web application using Mysql. Builds the Java project, starts Mysql, deploys the WAR file to Tomcat. Uses utf-8 config for Mysql, creates schema, tables and initial data.

- **Told You So**: Uses a different pom.xml for Java >= 9. Starts CouchDB and Tomcat.

- **Linky**: Clones Lucene git repository, builds it and starts it as a standalone Java process. Then starts CouchDB with 2 schemas and initial views. Finally starts a Node program with config files and environment variables.

- **Citybuilder**: Node.js project with CouchDB backend.

- **Grid Game One (ggo)**: Simple build and Tomcat deployment.

## Limitations

This project is in an early development stage and all features correlate strongly with what I needed for my projects. Further enhancements and extensions will depend on feedback from other users.

Currently Fulgens supports:

- maven (to build)
- java (to start)
- node (to start)
- shell script (to start)
- tomcat (to host war files)
- mysql (as a database backend)
- couchdb (as a database backend)
- redis (as a database backend)

---

*Check out the project on [GitHub](https://github.com/oglimmer/fulgens) and [npm](http://npmjs.com/package/fulgens).*`
  }
]
