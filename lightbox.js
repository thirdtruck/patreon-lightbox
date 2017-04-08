const PUBLIC_BETA_KEY = 'dc6zaTOxFJmzC'
const GIPHY_PARAMS = 'rating=g'
const GIPHY_URL = `http://api.giphy.com/v1/gifs/random?tag=funny+cat&api_key=${PUBLIC_BETA_KEY}&${GIPHY_PARAMS}`

const lightboxImageEl = document.getElementById('image')
const lightboxImageTitleEl = document.getElementById('title')

function onLoadImageInfo(imageTitle, imageURL) {
  lightboxImageTitleEl.innerText = imageTitle
  lightboxImageEl.innerHTML = `<img src="${imageURL}" />`
}

function fetchImage() {
  const httpRequest = new XMLHttpRequest()

  httpRequest.onreadystatechange = (result) => {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        console.log('Success', httpRequest.responseText)

        const imageData = JSON.parse(httpRequest.responseText)['data']

        console.log('image data', imageData)

        const imageTitle = imageData['id']
        const imageURL = imageData['image_url']

        onLoadImageInfo(imageTitle, imageURL)
      } else {
        console.log('Error', httpRequest.readyState)
      }
    } else {
      console.log('Loading ...')
    }
  }

  httpRequest.open('GET', GIPHY_URL)
  httpRequest.send()
}

function onClickImage(evt) {
  fetchImage()
}

lightboxImageEl.onclick = onClickImage

document.addEventListener("DOMContentLoaded", () => { fetchImage() })
