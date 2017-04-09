/* jshint esversion: 6 */

const GIPHY_PUBLIC_BETA_KEY = 'dc6zaTOxFJmzC';

const imageSource = new GiphyImageSource(GIPHY_PUBLIC_BETA_KEY);
const lightboxGallery = new LightboxGallery(imageSource, document.getElementById('lightbox'));

document.addEventListener("DOMContentLoaded", () => { lightboxGallery.prefetchImages(); });
