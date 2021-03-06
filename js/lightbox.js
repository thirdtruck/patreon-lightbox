/* jshint esversion: 6 */

class LightboxGallery {
  constructor(params) {
    this.elements = {};
    this.offset = 0;
    this.images = [];

    this.preloadImageMax = params.preloadImageMax || 5;
    this.imageSource = params.imageSource;
    this.loadingImageURL = params.loadingImageURL || 'images/ajax-loader.gif';
    this.elements.lightbox = params.lightboxEl;

    /* We assume that each of the child elements exists and that there is only one for
     * the sake of convenience.
     * More advanced code would skip operations on non-existent elements so that devs
     * could easy opt out of features and e.g. have no title.
     *
     * If this was intended for production, we might generate all of the child elements
     * ourselves in order to simplify the process of including the lightbox in a page.
     */
    const lightboxEl = this.elements.lightbox;
    this.elements.close = lightboxEl.getElementsByClassName('close')[0];
    this.elements.lightboxImage = lightboxEl.getElementsByClassName('images')[0];
    this.elements.lightboxImageTitle = lightboxEl.getElementsByClassName('title')[0];
    this.elements.prevButton = lightboxEl.getElementsByClassName('prev')[0];
    this.elements.nextButton = lightboxEl.getElementsByClassName('next')[0];
    this.elements.loadingAnimation = lightboxEl.getElementsByClassName('loading-animation')[0];

    this._disableEl(this.elements.prevButton);
    this._disableEl(this.elements.nextButton);

    // Note the fat arrows here and elsewhere and how they preserve the current scope of `this`.
    this.elements.close.addEventListener('click', () => { this.closeLightbox(); });
    this.elements.prevButton.addEventListener('click', () => { this.prevImage(); });
    this.elements.nextButton.addEventListener('click', () => { this.nextImage(); });
  }

  /* Public Methods */

  /* Not all of these public methods are utilized in the example usage code but I've made use of such
   * methods in enough real-world lightbox examples to know they will be useful sooner rather than later.
   */

  openLightbox() {
    /* A more advanced lightbox might create all of its child elements from scratch when initially opened. */
    this._showEl(this.elements.lightbox);
  }

  closeLightbox() {
    /* A more advanced lightbox might delete (or at least detach) all of its child elements when closed in 
     * order to reduce its footprint
     */
    this._hideEl(this.elements.lightbox);
  }

  prefetchImages() {
    Array.from({ length: this.preloadImageMax }, (none, index) => {
      this._fetchImageAt(index, () => { this._showCurrentImageWhenAllHaveLoaded(); this._updateButtons(); });
    });
  }

  nextImage() {
    this.offset += 1;
    const lookAheadIndex = this.offset+this.preloadImageMax;

    // Perform a look-ahead image fetch so that it starts loading even before the user navigates to it
    if (!this.images[lookAheadIndex]) {
      this._fetchImageAt(lookAheadIndex);
    }

    this._showCurrentImage();
    this._updateButtons();
  }

  prevImage() {
    this.offset -= 1;

    // Don't fetch the image unless we're actually fetching a new one
    if (this.offset < 0) {
      this.offset = 0;
    } else {
      this._showCurrentImage();
    }

    this._updateButtons();
  }

  setTitle(title) {
    this.elements.lightboxImageTitle.textContent = title;
  }

  /* Private Methods */

  /* We could use function closure to create genuinely private methods if necessary,
   * but this naming convention suffices.
   */

  _showEl(element) {
    element.classList.remove('hidden');
  }

  _hideEl(element) {
    element.classList.add('hidden');
  }

  _disableEl(element) {
    element.classList.add('disabled');
    element.setAttribute('disabled', 'disabled');
  }

  _enableEl(element) {
    element.classList.remove('disabled');
    element.removeAttribute('disabled');
  }

  _showCurrentImage() {
    this.images.forEach((image) => { this._hideEl(image); });
    this.setTitle('Loading ...');

    const currentImage = this.images[this.offset];

    if (!currentImage) {
      this._showEl(this.elements.loadingAnimation);
      this._fetchImageAt(this.offset, (image) => { this._showCurrentImage(); });
    } else {
      this.setTitle(currentImage.getAttribute('data-title'));
      this._hideEl(this.elements.loadingAnimation);
      this._showEl(currentImage);
    }
  }

  _showCurrentImageWhenAllHaveLoaded() {
    let allLoaded = true;

    for (let i = 0; i < this.preloadedImageMax; i += 1) {
      if (! this.images[i].completed) {
        allLoaded = false;
      }
    }

    if (allLoaded) {
      this._showCurrentImage();
    }
  }

  _updateButtons() {
    /* A more advanced lightbox might e.g. watch for 404s when prefetching images and disable
     * the next button before the user would navigate past the assumed last image. For now,
     * we'll just assume there's an unlimited number of images.
     */
    if (this.offset === 0) {
      this._disableEl(this.elements.prevButton);
      this._enableEl(this.elements.nextButton);
    } else {
      this._enableEl(this.elements.prevButton);
      this._enableEl(this.elements.nextButton);
    }
  }

  _fetchImageAt(index, onLoadImage) {
    const image = document.createElement('img');
    image.id = `image-${index}`;
    image.classList.add('gallery-image');
    /* A more advanced lightbox might show/hide the original loading image instead of making it
     * the initial image source, but this is an adequate compromise for now.
     */
    image.setAttribute('src', this.loadingImageURL);

    this.images[index] = image;

    this.imageSource.fetchImage(index, (imageTitle, imageURL) => {
      image.setAttribute('data-title', imageTitle);
      image.setAttribute('src', imageURL);
      this._hideEl(image);

      this.elements.lightboxImage.appendChild(image);

      image.onload = onLoadImage;
    });
  }
}
