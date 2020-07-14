function qs(el) {
    return document.querySelector(el)
}

function ce(el) {
    return document.createElement(el)
}

const quoteList = qs('ul#quote-list')
const quoteForm = qs('form#new-quote-form')
const quoteUrl = 'http://localhost:3000/quotes'
const likesUrl = 'http://localhost:3000/likes'
let sorted = false

const sortBtn = ce('button')
sortBtn.innerText = 'Sort by Author'
sortBtn.addEventListener("click", (e) => {
    sorted = !sorted
    quoteList.innerHTML = null
    e.target.innerText = sorted ? 'Remove Sorting' : 'Sort by Author'
    fetchQuotes()
})
document.querySelector('div').prepend(sortBtn)


function deleteQuote(quote) {
    debugger
    fetch(`${quoteUrl}/${quote.id}`, {method: "DELETE"})
}

function displayQuote(quote) {
    const quoteCard = ce('li')
    quoteCard.className = 'quote-card'

    quoteCard.innerHTML = `
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
    </blockquote>`

    quoteList.append(quoteCard)

    const likeBtn = ce('button')
    likeBtn.className = 'btn-success'
    likeBtn.innerHTML = `Likes: <span>${quote.likes ? quote.likes.length : 0}</span>`
    likeBtn.addEventListener("click", (e) => {
        const likeObj = {
            quoteId: quote.id
        }
        const configObj = {
            method : "POST",
            headers : {"Content-Type": "application/json", "Accept": "application/json"},
            body : JSON.stringify(likeObj)
        }
        fetch(likesUrl, configObj).then(res => res.json()).then(like => {
            if (!(quote.likes)) {quote[likes]=[]}
            quote.likes.push(like)
            e.target.children[0].innerText = quote.likes.length
        })
    })

    
    const delBtn = ce('button')
    delBtn.className = 'btn-danger'
    delBtn.innerText = 'Delete'
    delBtn.addEventListener("click", () => {
        deleteQuote(quote)
        quoteCard.remove()
    })
    quoteCard.querySelector('.blockquote').append(likeBtn, delBtn)
}

function showQuotes(quotes) {
    quotes = sorted ? quotes.sort((a, b) => (a.author > b.author) ? 1 : -1) : quotes
    quotes.forEach(quote => displayQuote(quote))
}

function fetchQuotes() {
    fetch(`${quoteUrl}?_embed=likes`).then(res => res.json()).then(quotes => showQuotes(quotes))
}

fetchQuotes()

quoteForm.addEventListener("submit", (e) => {
    e.preventDefault()
    const quoteObj = {
        quote: quoteForm[0].value,
        author: quoteForm[1].value,
        createdAt: Date.now()
    }
    const configObj = {
        method : "POST",
        headers : {"Content-Type": "application/json", "Accept": "application/json"},
        body : JSON.stringify(quoteObj)
    }
    quoteForm.reset()
    fetch(quoteUrl, configObj).then(res => res.json()).then(quote => displayQuote(quote))
})