const PUBLIC_BETA_KEY = 'dc6zaTOxFJmzC'
const GIPHY_PARAMS = 'limit=1&rating=g&fmt=json'
const GIPHY_URL = `http://api.giphy.com/v1/gifs/search?q=funny+cat&api_key=${PUBLIC_BETA_KEY}&${GIPHY_PARAMS}`

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

        const imageData = JSON.parse(httpRequest.responseText)['data'][0]

        console.log('image data', imageData)

        const imageTitle = imageData['slug']
        const imageURL = imageData['images']['fixed_height']['url']

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

fetchImage()
