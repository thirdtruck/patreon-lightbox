const PUBLIC_BETA_KEY = 'dc6zaTOxFJmzC'
const GIPHY_PARAMS = 'limit=1&rating=g&fmt=json'
const GIPHY_URL = `http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=${PUBLIC_BETA_KEY}&${GIPHY_PARAMS}`

const lightboxImageEl = document.getElementById('image')
const lightboxImageTitleEl = document.getElementById('title')
const prevButton = document.getElementById('prev')
const nextButton = document.getElementById('next')

let offset = 0

function titleFromSlug(slug) {
	words = slug.split('-')

	// In case the slug has no tags in it
	if (words.length === 1) {
		return words[0]
	}

	words.pop() // Cut off the randomized trailing section
	words = words.map((word) => { return word[0].toUpperCase() + word.slice(1) }) // Capitalize each word

  return words.join(' ')
}

function setTitle(slug) {
  lightboxImageTitleEl.innerText = titleFromSlug(slug)
}

function createImage(imageURL) {
  lightboxImageEl.innerHTML = `<img src="${imageURL}" />`
}

function onLoadImageInfo(imageSlug, imageURL) {
	setTitle(imageSlug)
	createImage(imageURL)
}

function fetchImage() {
  const httpRequest = new XMLHttpRequest()

  httpRequest.onreadystatechange = (result) => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log('Success', httpRequest.responseText)

        const imageData = JSON.parse(httpRequest.responseText)['data'][0]

        console.log('image data', imageData)

        const imageSlug = imageData['slug']
        const imageURL = imageData['images']['fixed_width']['url']

        onLoadImageInfo(imageSlug, imageURL)
      } else {
        console.log('Error', httpRequest.readyState)
      }
    } else {
      console.log('Loading ...')
    }
  }

  httpRequest.open('GET', `${GIPHY_URL}&offset=${offset}`)
  httpRequest.send()
}

function onClickImage(evt) {
  fetchImage()
}

function nextImage() {
  offset += 1

  fetchImage()
}

function prevImage() {
  offset -= 1

  // Don't fetch the image unless we're actually fetching a new one
  if (offset < 0) {
    offset = 0
  } else {
    fetchImage()
  }
}

lightboxImageEl.onclick = onClickImage
prevButton.onclick = prevImage
nextButton.onclick = nextImage

document.addEventListener("DOMContentLoaded", () => { fetchImage() })
