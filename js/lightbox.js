/* jshint esversion: 6 */

class LightboxGallery {
  constructor(imageSource, lightboxEl, loadingImageURL) {
    this.imageSource = imageSource;
    this.loadingImageURL = loadingImageURL;

    this.offset = 0;
    this.images = [];
    this.preloadImageMax = 5;

    this.elements = {};
    this.elements.lightbox = lightboxEl;

    /* We assume that each of the child elements exists and that there is only one for
     * the sake of convenience.
     * More advanced code would skip operations on non-existent elements so that devs
     * could easy opt out of features and e.g. have no title.
     */
    this.elements.lightboxImage = lightboxEl.getElementsByClassName('image')[0];
    this.elements.lightboxImageTitle = lightboxEl.getElementsByClassName('title')[0];
    this.elements.prevButton = lightboxEl.getElementsByClassName('prev')[0];
    this.elements.nextButton = lightboxEl.getElementsByClassName('next')[0];
    this.elements.loadingAnimation = lightboxEl.getElementsByClassName('loading-animation')[0];

    this.elements.prevButton.onclick = () => { this.prevImage(); };
    this.elements.nextButton.onclick = () => { this.nextImage(); };
  }

  showEl(element) {
    element.classList.remove('hidden');
  }

  hideEl(element) {
    element.classList.add('hidden');
  }

  showCurrentImage() {
    const gallery = this;

    this.images.forEach((image) => { gallery.hideEl(image) });
    this.setTitle('Loading ...');

    const currentImage = this.images[this.offset];

    if (!currentImage) {
      this.showEl(this.elements.loadingAnimation);
      this.fetchImageAt(this.offset, (image) => { gallery.showCurrentImage(); });
    } else {
      this.setTitle(currentImage.getAttribute('data-title'));
      this.hideEl(this.elements.loadingAnimation);
      this.showEl(currentImage);
    }
  }

  showCurrentImageWhenAllHaveLoaded() {
    let allLoaded = true;

    for (let i = 0; i < this.preloadedImageMax; i += 1) {
      if (! this.images[i].completed) {
        allLoaded = false;
      }
    }

    if (allLoaded) {
      this.showCurrentImage();
    }
  }

  prefetchImages() {
    const gallery = this;

    Array.from({ length: this.preloadImageMax }, (none, index) => {
      this.fetchImageAt(index, () => { gallery.showCurrentImageWhenAllHaveLoaded(); });
    });
  }

  fetchImageAt(index, onLoadImage) {
    const gallery = this;
    const image = document.createElement('img');
    image.id = `image-${index}`;
    image.setAttribute('src', this.loadingImageURL);

    this.images.push(image);

    this.imageSource.fetchImage(index, (imageTitle, imageURL) => {
      image.setAttribute('data-title', imageTitle);
      image.setAttribute('src', imageURL);
      gallery.hideEl(image)

      this.elements.lightboxImage.appendChild(image);

      image.onload = onLoadImage;
    });
  }

  nextImage() {
    this.offset += 1;
    const lookAheadIndex = this.offset+this.preloadImageMax;

    // Perform a look-ahead image fetch so that it starts loading even before the user navigates to it
    if (!this.images[lookAheadIndex]) {
      this.fetchImageAt(lookAheadIndex);
    }

    this.showCurrentImage();
  }

  prevImage() {
    this.offset -= 1;

    // Don't fetch the image unless we're actually fetching a new one
    if (this.offset < 0) {
      this.offset = 0;
    } else {
      this.showCurrentImage();
    }
  }

  setTitle(title) {
    this.elements.lightboxImageTitle.innerText = title;
  }
}
