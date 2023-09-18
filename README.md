# Bungee

A simple library for creatign web applications using the Bun JavaScript Runtime. Bungee has been inspired by Node's Express library.

# Usage

```Typescript
const app = Bungee();

app.get("/", (req) => {
    const { query } = req;
    return new Response(`Hello ${req?.name}`)
})

app.start("0.0.0.0", 8080)
```

```bash
wget localhost:8080/?name=World
> Hello World
```