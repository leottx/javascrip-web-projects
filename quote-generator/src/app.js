const URL = 'https://type.fit/api/quotes';

const $quoteContainer = document.getElementById('quote-container');
const $quote = document.getElementById('quote');
const $author = document.getElementById('author');
const $twitterBtn = document.getElementById('twitter');
const $newQuoteBtn = document.getElementById('new-quote');
const $loader = document.getElementById('loader');

function showLoadingSpinner() {
  $loader.hidden = false;
  $quoteContainer.hidden = true;
}

function hideLoadingSpinner() {
  $loader.hidden = true;
  $quoteContainer.hidden = false;
}

// Fetching quotes from server
function getQuote() {
  showLoadingSpinner();
  return fetch(URL)
    .then(res => res.json())
    .then(quotes => {
      const quote = quotes[Math.floor(Math.random() * (quotes.length + 1))];
      return quote;
    })
    .catch(error => console.log(error));
}

function renderQuote(quote) {
  // Check if author is null and replace it with 'Unknown'
  if (!quote.author) {
      $author.textContent = 'Unknown';
    } else {
      $author.textContent = quote.author;
    }
    
  // Dynammically reduce font size for long quotes
  if (quote.text.length > 120) {
    $quote.classList.add('long-quote');
  } else {
    $quote.classList.remove('long-quote');
  }
  $quote.textContent = quote.text;
  hideLoadingSpinner();
}

function tweetQuote() {
  const twitterUrl = `https://twitter.com/intent/tweet?text=${$quote.textContent} - ${$author.textContent}`; 
  // Open the URL on a new tab
  window.open(twitterUrl, '_blank');
}

$twitterBtn.addEventListener('click', () => {
  tweetQuote();
})

$newQuoteBtn.addEventListener('click', () => {
  getQuote()
    .then(quote => renderQuote(quote));
});

getQuote()
.then(quote => renderQuote(quote));