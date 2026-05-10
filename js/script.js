/* Combined JS from index.html */

/* Vegas Background Slider Initialization */
jQuery(document).ready(function ($) {
    // Header Slider
    var headerSelector = ".elementor-element-62fd7efb[data-eae-slider=39019]";
    var $header = jQuery(headerSelector);
    if ($header.length) {
        $header.prepend('<div class="eae-section-bs"><div class="eae-section-bs-inner"></div></div>');
        $header.children('.eae-section-bs').children('.eae-section-bs-inner').vegas({
            slides: [{ "src": "" }],
            transition: 'zoomOut',
            animation: 'kenburns',
            overlay: 'https://vitee.id/wp-content/plugins/addon-elements-for-elementor-page-builder//assets/lib/vegas/overlays/01.png',
            cover: true,
            delay: 5000,
            timer: true
        });
    }

    // Secondary Slider
    var secondarySelector = ".elementor-element-54dfac7a[data-eae-slider=22908]";
    var $secondary = jQuery(secondarySelector);
    if ($secondary.length) {
        $secondary.prepend('<div class="eae-section-bs"><div class="eae-section-bs-inner"></div></div>');
        $secondary.children('.eae-section-bs').children('.eae-section-bs-inner').vegas({
            slides: [{ "src": "" }],
            transition: 'zoomOut',
            animation: 'kenburns',
            overlay: 'https://vitee.id/wp-content/plugins/addon-elements-for-elementor-page-builder//assets/lib/vegas/overlays/01.png',
            cover: true,
            delay: 5000,
            timer: true
        });
    }
});

/* Interaction Listeners */
document.addEventListener('DOMContentLoaded', function () {
    // Column Toggle
    var wdpButton = document.querySelector('.wdp-button-wrapper button');
    if (wdpButton) {
        wdpButton.addEventListener('click', function () {
            var kolomPertama = document.querySelector('.kolom-pertama');
            if (kolomPertama) kolomPertama.style.display = 'block';
        });
    }

    // Invitation Button
    var tombolBuka = document.getElementById("tombol-buka");
    if (tombolBuka) {
        tombolBuka.onclick = function () {
            document.body.style.overflowY = "unset";
            enableScrolling();
            playAudio();
        };
    }
});

/* Scroll & Audio Helpers */
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};

// Initial state
disableScrolling();
document.body.style.overflowY = "hidden";
document.body.style.height = "100vh";

function disableScrolling() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () {
        window.scrollTo(x, y);
    };
}

function enableScrolling() {
    window.onscroll = function () { };
}

function playAudio() {
    var isYT = false;
    var song = document.getElementById("song");
    if (song) {
        song.play();
    } else if (typeof player !== 'undefined' && player.playVideo) {
        player.playVideo();
    }
}

/* Lazyload Observer */
const lazyloadRunObserver = () => {
    const lazyloadBackgrounds = document.querySelectorAll('.e-con.e-parent:not(.e-lazyloaded)');
    const lazyloadBackgroundObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                let lazyloadBackground = entry.target;
                if (lazyloadBackground) {
                    lazyloadBackground.classList.add('e-lazyloaded');
                }
                lazyloadBackgroundObserver.unobserve(entry.target);
            }
        });
    }, { rootMargin: '200px 0px 200px 0px' });

    lazyloadBackgrounds.forEach((lazyloadBackground) => {
        lazyloadBackgroundObserver.observe(lazyloadBackground);
    });
};

document.addEventListener('DOMContentLoaded', lazyloadRunObserver);
document.addEventListener('elementor/lazyload/observe', lazyloadRunObserver);

/* Dynamic Guest Name Handler (?to=NamaTamu) */
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');

    if (guestName) {
        const decodedName = decodeURIComponent(guestName);

        // Update all elements with the guest name
        const elements = ['guest-name-1', 'guest-name-2'];
        elements.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.textContent = decodedName;
        });

        // Update RSVP author input if it exists
        const authorInput = document.getElementById('author');
        if (authorInput) authorInput.value = decodedName;
    }
});

