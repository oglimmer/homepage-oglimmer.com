# Homepage: oglimmer.de

This repo builds the https://www.oglimmer.de web page.

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

## Open issues

There is an issue with the banner-image.jpg, it needs a sym-link for now:

```
mkdir $BASE/_nuxt/images/ 
ln -s $BASE/images/banner-image.jpg $BASE/_nuxt/images/banner-image.jpg
```
