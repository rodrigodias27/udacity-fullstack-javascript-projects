# Image Processing API

API that can be used in two different ways. As a simple placeholder API, the first allows you to place images into your frontend with the size set via URL parameters (and additional stylization if you choose) for rapid prototyping. The second use case is as a library to serve properly scaled versions of your images to the front end to reduce page load size. Rather than needing to resize and upload multiple copies of the same image to be used throughout your site, the API you create will handle resizing and serving stored images for you.

# Getting started

## Starting server:
```bash
node dist/index.js
```
Server will be served on http://localhost:3000

## Using API

### Endpoint images

```GET /api/images```

Params:
   - image=<desired_image>
   - width=<desired_width>
   - height=<desired_height>

Example:
```
http://localhost:3000/images?image=fjord&width=200&height=200
```

> **Available images**
> - encenadaport
> - fjord
> - icelandwaterfall
> - palmtunnel
> - santamonica

# Development

Run prettier and eslint:
```bash
npm run lint
```

Start server using nodemon:
```bash
npm run start
```

Build:
```bash
npm run build
```

Test:
```bash
npm run jasmine
```

Build and test:
```bash
npm run test
```

## License

[License](../LICENSE.txt)
