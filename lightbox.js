/* jshint esversion: 6 */
const GIPHY_PUBLIC_BETA_KEY = 'dc6zaTOxFJmzC';

/* Presented as a template that future ImageSources would emulate. */
class ImageSource {
  constructor() {
    this.params = { /* source-specific URL parameters go here */ };
    this.sourceURL = 'Placeholder';
  }

  /* Subclasses overwrite this method to extract a title and image URL from their source's raw data,
   * which they then pass to the callback.
   */
  onFetchImageData(data, onFetchImage) {
    const imageTitle = 'Placeholder';
    const imageURL = 'Placeholder';

    onFetchImage(imageTitle, imageURL);
  }

  get fetchURL() {
    const paramStrings = Object.keys(this.params).map((key) => {
      if (Array.isArray(this.params[key])) {
        return `${key}=${this.params[key].join('+')}`;
      } else {
        return `${key}=${this.params[key]}`;
      }
    });

    return `${this.sourceURL}?${paramStrings.join('&')}`;
  }

  fetchImage(offset, onFetchImage) {
    const httpRequest = new XMLHttpRequest();

    httpRequest.onreadystatechange = (result) => {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          this.onFetchImageData(httpRequest.responseText, onFetchImage);
        } else {
          console.log('Error', httpRequest.readyState);
        }
      } else {
        console.log('Loading ...');
      }
    };

    httpRequest.open('GET', `${this.fetchURL}&offset=${offset}`);
    httpRequest.send();
  }
}

class GiphyImageSource extends ImageSource {
  constructor(apiKey) {
    super();
    this.params = {
      limit: 1,
      rating: 'g',
      fmt: 'json',
      q: ['funny', 'cat'],
      api_key: apiKey
    };
    this.sourceURL = 'http://api.giphy.com/v1/gifs/search';
  }

  static titleFromSlug(slug) {
    let words = slug.split('-');

    // In case the slug has no tags in it
    if (words.length === 1) {
      return words[0];
    }

    words.pop(); // Cut off the randomized trailing section
    words = words.map((word) => { return word[0].toUpperCase() + word.slice(1); }); // Capitalize each word

    return words.join(' ');
  }

  onFetchImageData(data, onFetchImage) {
    const imageData = JSON.parse(data).data[0];

    const imageSlug = imageData.slug;
    const imageTitle = GiphyImageSource.titleFromSlug(imageSlug);
    const imageURL = imageData.images.fixed_width.url;

    onFetchImage(imageTitle, imageURL);
  }
}

class LightboxGallery {
  constructor(imageSource, elements) {
    this.imageSource = imageSource;
    this.offset = 0;
    this.elements = elements;

    this.elements.lightboxImageEl.onclick = () => { this.onClickImage(); };
    this.elements.prevButton.onclick = () => { this.prevImage(); };
    this.elements.nextButton.onclick = () => { this.nextImage(); };
  }

  fetchImage() {
    this.imageSource.fetchImage(this.offset, (imageTitle, imageURL) => {
      this.setTitle(imageTitle);
      this.createImage(imageURL);
    });
  }

  nextImage() {
    this.offset += 1;

    this.fetchImage();
  }

  prevImage() {
    this.offset -= 1;

    // Don't fetch the image unless we're actually fetching a new one
    if (this.offset < 0) {
      this.offset = 0;
    } else {
      this.fetchImage();
    }
  }

  onClickImage(evt) {
    this.fetchImage();
  }

  setTitle(title) {
    this.elements.lightboxImageTitleEl.innerText = title;
  }

  createImage(imageURL) {
    this.elements.lightboxImageEl.innerHTML = `<img src="${imageURL}" />`;
  }
}

const imageSource = new GiphyImageSource(GIPHY_PUBLIC_BETA_KEY);
const lightboxGallery = new LightboxGallery(imageSource, {
  lightboxImageEl: document.getElementById('image'),
  lightboxImageTitleEl: document.getElementById('title'),
  prevButton: document.getElementById('prev'),
  nextButton: document.getElementById('next'),
});

document.addEventListener("DOMContentLoaded", () => { lightboxGallery.fetchImage(); });
