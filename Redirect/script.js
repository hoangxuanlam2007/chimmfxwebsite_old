// Dung co ma copy code
//Tao lam cai nay met vcl
//         - ChimmFX 2021

(function() {
    var buttonContainer = document.querySelector('.download-button-container');
    var button = buttonContainer.querySelector('.download-button');
    var ball = buttonContainer.querySelector('.button-ball');
    var circularProgress = buttonContainer.querySelector('.button-circular-progress');
    var circularProgressLength = circularProgress.getTotalLength();
    var linearProgress = buttonContainer.querySelector('.button-linear-progress-bar');
    var borderPath = buttonContainer.querySelector('.border-path');
    var iconSquarePath = buttonContainer.querySelector('.button-icon-path-square');
    var iconLinePath = buttonContainer.querySelector('.button-icon-path-line');
    var circularProgressBar = new Segment(circularProgress, 0, 0);
    var iconSquare = new Segment(iconSquarePath, '30%', '70%');
    var iconLine = new Segment(iconLinePath, 0, '100%');
    var downloading = false;
    var completed = false;
    var progressTimer = 0;
    var download = "../Momo-Tool/index.html";

    // Click Event
    button.addEventListener('click', function () {
        if (!completed) { 
            if (downloading) { // If click on the processing button, stop download
                stopDownload();
            } else { // Start download
                startDownload();
            }
        }
    });

    // Start download
    function startDownload() {
        // Animation
        downloading = true;
        buttonContainer.classList.add('downloading');
        animateIcon();
        // Update progress after 1s
        progressTimer = setTimeout(function () {
            buttonContainer.classList.add('progressing');
            animateProgress();
        }, 1000);
    }

    // Stop the download
    function stopDownload() {
        // Download processing done
        downloading = false;
        clearTimeout(progressTimer);
        buttonContainer.classList.remove('downloading');
        buttonContainer.classList.remove('progressing');
        // Stop progress, reverse the button to normal
        stopProgress();
        iconLine.draw(0, '100%', 1, {easing: anime.easings['easeOutCubic']});
        iconSquare.draw('30%', '70%', 1, {easing: anime.easings['easeOutQuad']});
    }

    function animateIcon() {
        iconLine.draw(0, 0, 0.5);
        iconSquare.draw(0, '100%', 1);
    }

    function stopProgress() {
        circularProgressBar.stop();
        circularProgressBar.draw(0, 0, 0);
        updateProgress(circularProgressBar, true);
    }

    // Update the circular and bar
    function updateProgress(instance, keepBallPosition) {
        if (!keepBallPosition) {
            var point = instance.path.getPointAtLength(instance.end);
            ball.style.transform = 'translate(' + point.x + 'px, ' + point.y + 'px)';
        }
        linearProgress.style.transform = 'translateY(-'+ instance.end * 100 / circularProgressLength +'%)';
    }

    // Progress animation
    function animateProgress() {
        circularProgressBar.draw(0, '100%', 2.5, {easing: anime.easings['easeInQuart'], update: updateProgress, callback: completedAnimation});
    }

    // Animation
    function completedAnimation() {
        completed = true;
        buttonContainer.classList.add('completed');
        // 1s delay
        setTimeout(function () {
            button.classList.add('button-hidden');
            ball.classList.add('hidden');
            borderPath.classList.remove('hidden');
            var morph = anime({
                targets: borderPath,
                d: 'M 40 3.5 a 36.5 36.5 0 0 0 -36.5 36.5 a 36.5 36.5 0 0 0 10.5 26.5 C 35 86.5 90 91.5 120 91.5 S 205 86.5 226 66.5 a 36.5 36.5 0 0 0 10.5 -26.5 a 36.5 36.5 0 0 0 -36.5 -36.5 Z',
                duration: 100,
                easing: 'linear',
                complete: function () {
                    morph = anime({
                        targets: borderPath,
                        d: 'M 40 3.5 a 36.5 36.5 0 0 0 -36.5 36.5 a 36.5 36.5 0 0 0 36.5 36.5 C 70 76.5 90 76.5 120 76.5 S 170 76.5 200 76.5 a 36.5 36.5 0 0 0 36.5 -36.5 a 36.5 36.5 0 0 0 -36.5 -36.5 Z',
                        duration: 1000,
                        elasticity: 600,
                        complete: function () {
                            completed = false;
                            setTimeout(function () {
                                buttonContainer.classList.remove('completed');
                                button.classList.remove('button-hidden');
                                ball.classList.remove('hidden');
                                borderPath.classList.add('hidden');
                                stopDownload();
                            }, 500);
                            window.location.href = download;
                        }
                    });
                }
            });

        }, 1000);
    }

})();