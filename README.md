# Patreon Lightbox Exercise

## Usage

1. Include an element in your page that contains elements with `title`, `close`, `prev`, `next`, `image`, and `loading-animation` as their classes.
2. Include [`css/lightbox.css`](css/lightbox.css) in your page.
3. Include [`js/image-sources.js`](js/image-sources.js) and then [`js/lightbox.js`](js/lightbox.js) (in that order) in your page.
4. Create an `ImageSource` object (e.g. `GiphyImageSource`) in your JavaScript.
5. Create a `LightboxGallery` object. The initializer takes an `ImageSource`, the element from **step 1** (e.g. `document.getElementById('lightbox')`), and the URL of an image that will be used as a "Loading ..." animation (e.g. the included `images/ajax-loader.gif`).
6. Call `prefetchImages()` on your LightboxGallery object when you are ready to show the gallery.

See [`js/main.js`](js/main.js) for a complete usage example.
