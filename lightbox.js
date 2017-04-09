/* jshint esversion: 6 */

class LightboxGallery {
  constructor(imageSource, lightboxEl) {
    this.imageSource = imageSource;
    this.offset = 0;
    this.images = [];
    this.preloadImageCount = 0;
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

  showCurrentImage() {
    this.images.forEach((image) => { image.classList.add('hidden'); });
    this.setTitle('Loading ...');

    const currentImage = this.images[this.offset];

    if (!currentImage) {
      this.elements.loadingAnimation.classList.remove('hidden');
      const gallery = this;
      this.fetchImageAt(this.offset, (image) => { gallery.showCurrentImage(); });
    } else {
      this.setTitle(currentImage.getAttribute('data-title'));

      this.elements.loadingAnimation.classList.add('hidden');
      currentImage.classList.remove('hidden');
    }
  }

  prefetchImages() {
    const gallery = this;

    function showImageWhenAllHaveLoaded() {
      gallery.preloadImageCount += 1;
      if (gallery.preloadImageCount === gallery.preloadImageMax) {
        gallery.showCurrentImage();
      }
    }

    Array.from({ length: this.preloadImageMax }, (none, index) => {
      this.fetchImageAt(index, showImageWhenAllHaveLoaded);
    });
  }

  fetchImageAt(index, onLoadImage) {
    const image = document.createElement('img');
    image.id = `image-${index}`;
    image.setAttribute('src', './ajax-loader.gif');

    this.images.push(image);

    this.imageSource.fetchImage(index, (imageTitle, imageURL) => {
      image.setAttribute('data-title', imageTitle);
      image.setAttribute('src', imageURL);
      image.classList.add('hidden');

      this.elements.lightboxImage.appendChild(image);

      const gallery = this;

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
