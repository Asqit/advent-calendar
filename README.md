# Calendar

A Advent Calendar full of digital goodies for my beautiful girlfriend. 


## Tech. Stack

- Backend
	1. HTTP: Express.js
	2. Storage: Deno KV
	3. Runtime: Deno V2
- Frontend
	1. Bundling: Vite
	2. Styling: Shadcn + tailwindcss
	3. HTTP&Cache: Tanstack Query
	4. UI: React

## Running

As mentioned before, this app uses `Deno` instead of `Node.js` for the `JS` language runtime.
As such I asume you will continue with `Deno`.

### Server

```shell
$ deno install
$ deno task dev
```

### Client

Client is basic vite app, which has to be build in order to be shared via express server
That being said, the scripts are standard: 

1. dev: `yarn dev` | `npm run dev`
2. build: `yarn build` | `npm run build`
3. static linting: `yarn lint` | `npm run lint`
4. preview: `yarn preview` | `npm run preview`
