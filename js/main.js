/* jshint esversion: 6 */

const GIPHY_PUBLIC_BETA_KEY = 'dc6zaTOxFJmzC';
const LOADING_IMAGE_URL = 'images/ajax-loader.gif';

const imageSource = new GiphyImageSource(GIPHY_PUBLIC_BETA_KEY);
const lightboxGallery = new LightboxGallery(imageSource, document.getElementById('lightbox'), LOADING_IMAGE_URL);

document.addEventListener("DOMContentLoaded", () => { lightboxGallery.prefetchImages(); });