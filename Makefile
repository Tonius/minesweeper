NODEBIN = ./node_modules/.bin
ANTI_CACHING_HASH = $(shell cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 12 | head -n 1)


build: copy_assets
	NODE_ENV=production $(NODEBIN)/webpack --optimize-minimize --output-public-path /assets/ src/index.tsx dist/assets/bundle.js

server: copy_assets
	NODE_ENV=development $(NODEBIN)/webpack-dev-server --content-base dist/ --output-public-path /assets/ --devtool inline-source-map --watch-poll --inline src/index.tsx

copy_assets:
	rm -rf dist/
	mkdir -p dist/
	cp src/index.html dist/
	sed -i 's/_ANTI_CACHING_HASH_/$(ANTI_CACHING_HASH)/g' dist/index.html

deps:
	rm -rf node_modules/
	rm -f package-lock.json
	npm install
