document.addEventListener("DOMContentLoaded", function() {
    // Select all elements with the 'fade-in' class
    const fadeElems = document.querySelectorAll('.fade-in');

    // Use a small delay to make the transition visible on page load
    setTimeout(() => {
        fadeElems.forEach(elem => {
            // Add the 'visible' class to trigger the CSS transition
            elem.classList.add('visible');
        });
    }, 200); // The delay is set to 100 milliseconds
});


// put in mian class class="fade-in"