/**
 * Handle to search form
 * @type {HTMLElement}
 */
const searchForm = document.getElementById( 'search-form' );

/**
 * Handle to input field in the search form
 * @type {HTMLElement}
 */
const searchInput = document.getElementById( 'search-input' );

/**
 * Add event listener to submit button search form
 */
searchForm.addEventListener( 'submit', e => {
    
    /**
     * Get search term entered by the user
     * @type {string}
     */
    const searchTerm = searchInput.value;

    /**
     * Value of Sort By 
     * @type {string}
     */
    const sortBy = document.querySelector( 'input[type=radio][name=sortby]:checked' ).value;

    /**
     * Value of Limit selected in the form
     * @type {number}
     */
    const searchLimit = document.querySelector( '#limit' )
    .value;

    // Check that search field is not empty
    if ( searchTerm === '' ) {
        // Show error message if the search term is empty
        showMessage( 'Please input a search term', 'alert-danger' );
    }

    // Clear the search input field once the value is processed
    searchInput.value = '';

    // Search for the term via Reddit API
    search( searchTerm, searchLimit, sortBy ) 
        .then( results => {
            
            let output = '<div class="card-columns">';
            results.forEach( post => {
                const image = post.preview 
                ? post.preview.images[ 0 ].source.url 
                : 'https://cdn.comparitech.com/wp-content/uploads/2017/08/reddit-1.jpg';
                output += `
                <div class="card">
                <img class="card-img-top" src="${image}" alt="Card image cap">
                <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${truncateText( post.selftext, 100 )}</p>
                    <a href="${post.url}" target="_blank" class="btn btn-primary">Read More..</a>
                    <hr>
                    <span class="badge badge-secondary">Subreddit: ${post.subreddit}</span>
                    <span class="badge badge-secondary">Score: ${post.score}</span>
                </div>
                </div>
                `;
            })
            output += '</div>';
            document.getElementById( 'results' ).innerHTML = output;
        });

    e.preventDefault();
})

/**
 * This function creates a div element to show the error message
 * @param {string} message Error message
 * @param {string} className Bootstrap alert class 
 */
function showMessage( message, className ) {
    // Create elemnt to insert error message
    const div = document.createElement( 'div' );
    // Add classes
    div.className = `alert ${className}`;
    // Add text
    div.appendChild( document.createTextNode( message ) );
    //Get the parent container
    const searchContainer = document.getElementById( 'search-container' );

     // Get the search container
    const search = document.getElementById ( 'search' );

    // Insert the element
    searchContainer.insertBefore( div, search );

    /**
   * Remove the alert element after 2 seconds
   */
   setTimeout( () => document.querySelector( '.alert').remove(), 2000 );
}

/**
 * Truncate text shown on the card in the results
 * @param {string} text String to truncate
 * @param {number} limit Minimum characters in the string
 * @returns {string} Returns the shortened string
 */
function truncateText( text, limit ) {
    const shortened = text.indexOf( ' ', limit );
    if( shortened == -1 ) return text;
    return text.substring( 0, shortened );
}

/**
 * Use fetch API to search for user input on Reddit
 * @param {string} searchTerm Search term 
 * @param {number} searchLimit Total number of posts to fetch
 * @param {string} sortBy Order by Relevance or latest posts
 * @returns {Promise} Promise object returns the list of posts
 */
function search( searchTerm, searchLimit, sortBy ) {
    return fetch(
        `http://www.reddit.com/search.json?q=${searchTerm}&sort=${sortBy}&limit=${searchLimit}`
      )
        .then( res => res.json() )
        .then( data => {
          return data.data.children.map( data => data.data );
        })
        .catch( err => console.log( err ) );
    }
