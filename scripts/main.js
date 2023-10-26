document.addEventListener("DOMContentLoaded", function() {
    const backgroundImages = [
        '/resourses/bg02.webp',
        '/resourses/bg03.avif',
        '/resourses/bg04.jpeg',
    ];

    let currentIndex = 0;

    function changeBackground() {
        currentIndex = (currentIndex + 1) % backgroundImages.length;
        const newBackground = `url(${backgroundImages[currentIndex]})`;
        document.body.style.backgroundImage = newBackground;
    }

    // Change background every 5 seconds (5000 milliseconds)
    setInterval(changeBackground, 3000);
});
