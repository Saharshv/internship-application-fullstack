class ElementHandler {
  element(element) {
    // Changing tab title to Saharsh Vedi
    if(element.tagName == "title")
      element.setInnerContent("Saharsh Vedi");

    // Changing h1#title to Saharsh Vedi's variant 1/2
    if(element.tagName == "h1" && element.getAttribute("id") == "title")
      element.prepend("Saharsh Vedi's ");

    // Changing p#description
    if(element.tagName == "p" && element.getAttribute("id") == "description")
      element.setInnerContent("This is Saharsh's variant of the take home project.");

    // Changing a#url to my github page
    if(element.tagName == "a" && element.getAttribute("id") == "url"){
      element.setInnerContent("Have a look at Saharsh's Github.");
      element.setAttribute("href","https://github.com/saharshv/");
    }
  }
}

// Initializing HTMLRewriter
const rewriter = new HTMLRewriter().on('*', new ElementHandler());

/**
 * Retrieves the cookie by name
 * @param {Request} request 
 * @param {String} name 
 */
function getCookie(request, name) {
  let result = null
  let cookieString = request.headers.get('Cookie')
  console.log(cookieString);
  if (cookieString) {
    let cookies = cookieString.split(';')
    cookies.forEach(cookie => {
      let cookieName = cookie.split('=')[0].trim()
      if (cookieName === name) {
        let cookieVal = cookie.split('=')[1]
        result = cookieVal
      }
    })
  }
  return result
}

/**
 * Returns one of the two URLs
 */
async function getURL() {
  return fetch('https://cfw-takehome.developers.workers.dev/api/variants')
    .then((response) => {
      return response;
    })
    .then((data) => {
      return data.json()
    })
    .then((data) => {
      return data.variants[Math.floor(Math.random() * 2)];
    })
}

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with the webpage to show
 * @param {Request} request
 */
async function handleRequest(request) {
  const cookie = getCookie(request, 'userURL')
  if(cookie) {
    //console.log("cookie found!")
    let response = await fetch(cookie)
    return rewriter.transform(response);
  }

  //console.log("Cookie not found!")
  let url = await getURL();
  let response = await fetch(url);
  response = new Response(response.body, response);
  const myCookie = 'userURL=' + url + '; Expires=Mon, 21 Oct 2030 07:28:00 GMT;';
  response.headers.set('Set-Cookie', myCookie)
  return rewriter.transform(response);
}
