/* jshint esversion: 6 */

class ImageSource {
  constructor() {
    this.params = { /* source-specific URL parameters go here */ };
    this.sourceURL = 'Placeholder';
  }

  fetchImage(offset, onFetchImage) {
    this.offset = offset;

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

    httpRequest.open('GET', this._fetchURL);
    httpRequest.send();
  }

  /* Overridden by subclasses to handle their source's particular data format */
  onFetchImageData(data, onFetchImage) {
    const imageTitle = 'Placeholder';
    const imageURL = 'Placeholder';

    onFetchImage(imageTitle, imageURL);
  }

  /* Subclasses may have to override this */
  get offsetParam() {
    return `offset=${this.offset}`;
  }

  get _fetchURL() {
    let paramStrings = Object.keys(this.params).map((key) => {
      if (Array.isArray(this.params[key])) {
        return `${key}=${this.params[key].join('+')}`;
      } else {
        return `${key}=${this.params[key]}`;
      }
    });

    paramStrings.push(this.offsetParam);

    return `${this.sourceURL}?${paramStrings.join('&')}`;
  }
}

class GiphyImageSource extends ImageSource {
  constructor(apiKey, params={}) {
    super();

    this.sourceURL = '//api.giphy.com/v1/gifs/search';

    this.params = {
      limit: 1,
      rating: 'g',
      fmt: 'json',
      q: ['funny', 'cat'],
      api_key: apiKey,
    };

    Object.assign(this.params, params); // Override default params
  }

  onFetchImageData(data, onFetchImage) {
    const imageData = JSON.parse(data).data[0];

    const imageSlug = imageData.slug;
    const imageTitle = GiphyImageSource._titleFromSlug(imageSlug);
    const imageURL = imageData.images.fixed_width.url;

    onFetchImage(imageTitle, imageURL);
  }

  static _titleFromSlug(slug) {
    let words = slug.split('-');

    // In case the slug has no tags in it
    if (words.length === 1) {
      return words[0];
    }

    words.pop(); // Cut off the randomized trailing section
    words = words.map((word) => { return word[0].toUpperCase() + word.slice(1); }); // Capitalize each word

    return words.join(' ');
  }
}
