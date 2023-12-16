# How to

Based on Boostrap 5 and Nuxt 3

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
