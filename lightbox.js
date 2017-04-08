/* jshint esversion: 6 */
const PUBLIC_BETA_KEY = 'dc6zaTOxFJmzC';
const GIPHY_PARAMS = 'limit=1&rating=g&fmt=json';
const GIPHY_URL = `http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=${PUBLIC_BETA_KEY}&${GIPHY_PARAMS}`;

class LightboxGallery {
	constructor(imageSource, elements) {
		this.imageSource = imageSource;
		this.offset = 0;
		this.elements = elements;

		this.elements.lightboxImageEl.onclick = () => { this.onClickImage() };
		this.elements.prevButton.onclick = () => { this.prevImage() };
		this.elements.nextButton.onclick = () => { this.nextImage() };
	}

	fetchImage() {
		const httpRequest = new XMLHttpRequest();

		httpRequest.onreadystatechange = (result) => {
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				if (httpRequest.status === 200) {
					const imageData = JSON.parse(httpRequest.responseText).data[0];

					const imageSlug = imageData.slug;
					const imageTitle = LightboxGallery.titleFromSlug(imageSlug);
					const imageURL = imageData.images.fixed_width.url;

					this.setTitle(imageTitle);
					this.createImage(imageURL);
				} else {
					console.log('Error', httpRequest.readyState);
				}
			} else {
				console.log('Loading ...');
			}
		};

		httpRequest.open('GET', `${GIPHY_URL}&offset=${this.offset}`);
		httpRequest.send();
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
}

const elements = {
  lightboxImageEl: document.getElementById('image'),
  lightboxImageTitleEl: document.getElementById('title'),
  prevButton: document.getElementById('prev'),
  nextButton: document.getElementById('next'),
};

const lightboxGallery = new LightboxGallery(null, elements);

document.addEventListener("DOMContentLoaded", () => { lightboxGallery.fetchImage(); });
