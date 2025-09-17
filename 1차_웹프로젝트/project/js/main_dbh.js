// 상단카테고리 (마우스오버시 하위메뉴 노출)
$(document).ready(function() {
    $('.cate > li').hover(function() {
        $(this).find('ul.sub_dep_1').stop(true, true).slideDown(200);
    }, function() {
        $(this).find('ul.sub_dep_1').stop(true, true).slideUp(200);
    });

    $('.sub_dep_1 > li').hover(function() {
        $(this).find('ul.sub_dep_2').stop(true, true).slideDown(200);
    }, function() {
        $(this).find('ul.sub_dep_2').stop(true, true).slideUp(200);
    });
});



// 메인슬라이드
    document.addEventListener('DOMContentLoaded', function() {
        var swiper = new Swiper(".glaubeSwifer", {
            speed: 1100,
            loop: true,
            slidesPerView: 'auto',
            spaceBetween: 25,
            centeredSlides: true,
            parallax: true,
            autoplay: {
                delay: 7000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                type: "bullets",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
            grabCursor: true,
            mousewheel: false,
        });

        const progressFill = document.querySelector('.progress-fill');
        const playPauseBtn = document.querySelector('.play-pause-btn');

        // SVG 아이콘 정의
        const pauseSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-pause"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';
        const playSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-play"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';


        function resetProgress() {
            progressFill.style.transition = 'none';
            progressFill.style.width = '0';
        }

        function startProgress() {
            resetProgress();
            setTimeout(() => {
                progressFill.style.transition = 'width 7s linear';
                progressFill.style.width = '100%';
            }, 10);
        }

        // 슬라이드 전환 시마다 프로그레스 바 시작
        swiper.on('slideChangeTransitionStart', function() {
            if (swiper.autoplay.running) {
                startProgress();
            }
        });

        // 일시정지/재생 버튼 동작
        playPauseBtn.addEventListener('click', function(e) {
            e.preventDefault(); // 기본 이벤트 방지
            if (swiper.autoplay.running) {
                // 일시정지
                swiper.autoplay.stop();
                progressFill.style.transition = 'none'; // 즉시 정지
                const currentWidth = progressFill.style.width; // 현재 너비 유지
                progressFill.style.width = currentWidth;
                playPauseBtn.innerHTML = playSVG; // 재생 아이콘으로 변경
            } else {
                // 재생
                swiper.autoplay.start();
                playPauseBtn.innerHTML = pauseSVG; // 일시정지 아이콘으로 변경
                const currentWidth = parseFloat(progressFill.style.width) || 0;
                const remainingTime = 7000 * (1 - currentWidth / 100); // 남은 시간 계산
                progressFill.style.transition = `width ${remainingTime}ms linear`; // 남은 시간만큼 진행
                progressFill.style.width = '100%';
            }
        });

        // 초기 시작
        startProgress();
    });





    // 슬라이드(이벤트)
    const sliderWrapper = document.getElementById('sliderWrapper');
    const sliderContainer = document.getElementById('sliderContainer');
    const slidesContainer = document.getElementById('slidesContainer');
    let originalSlides = Array.from(slidesContainer.children);
    const progressBar = document.getElementById('progressBar');
    const pausePlayBtn = document.getElementById('pausePlayBtn');
    const pagination = document.getElementById('pagination');

    const slideWidth = 820;
    const slideMargin = 15; // ★★★ CSS의 좌우 마진값과 동일하게 설정 ★★★
    // ★★★ 슬라이드 너비와 좌우 마진을 합한 실제 차지 너비 계산 ★★★
    const effectiveSlideWidth = slideWidth + slideMargin * 2;
    const originalTotalSlides = originalSlides.length;

    const centerScale = 1.2;
    const sideScale = 0.85;

    let currentIndex = 1;
    let autoPlayInterval;
    let autoPlayDelay = 5000;
    let isPaused = false;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isTransitioning = false;
    let slides;
    let totalSlidesWithClones;
    let wrapperWidth = 0;


    // calculateTranslateX 함수는 effectiveSlideWidth를 사용하므로 수정 불필요
    function calculateTranslateX(index) {
        const wrapperCenter = wrapperWidth / 2;
        // 각 슬라이드 요소의 시작점 + 요소 너비의 절반 = 슬라이드 중심점
        // index * effectiveSlideWidth = 현재 슬라이드 이전까지의 총 너비 (마진 포함)
        // effectiveSlideWidth / 2 = 현재 슬라이드 너비의 절반 (마진 포함된 너비 기준)
        const slideCenter = (index * effectiveSlideWidth) + (effectiveSlideWidth / 2);
        return wrapperCenter - slideCenter;
    }

    function setupInfiniteLoop() {
        const firstClone = originalSlides[0].cloneNode(true);
        const lastClone = originalSlides[originalTotalSlides - 1].cloneNode(true);
        slidesContainer.appendChild(firstClone);
        slidesContainer.insertBefore(lastClone, originalSlides[0]);
        slides = Array.from(slidesContainer.children);
        totalSlidesWithClones = slides.length;
        setWrapperWidthAndPosition(); // 초기 위치 설정
    }

    function setWrapperWidthAndPosition(animate = false) {
        wrapperWidth = sliderWrapper.offsetWidth;
        // effectiveSlideWidth가 마진 포함 계산되었으므로 calculateTranslateX는 정확한 값 반환
        currentTranslate = calculateTranslateX(currentIndex);
        prevTranslate = currentTranslate;
        updateSliderPosition(animate);
    }

    function updateSliderPosition(animate = true) {
        if (animate) {
            slidesContainer.style.transition = 'transform 0.5s ease-in-out';
        } else {
            slidesContainer.style.transition = 'none';
        }
        slidesContainer.style.transform = `translateX(${currentTranslate}px)`;
    }


    
// ★★★ 슬라이드 크기 업데이트 함수 추가 ★★★
function updateSlideSizes() {
    slides.forEach((slide, index) => {
        if (index === currentIndex) {
            slide.style.transform = `scale(${centerScale})`;
            slide.style.zIndex = '10';
        } else if (index === currentIndex - 1 || index === currentIndex + 1) {
            slide.style.transform = `scale(${sideScale})`;
            slide.style.zIndex = '5';
        } else {
            slide.style.transform = 'scale(0.8)';
            slide.style.zIndex = '1';
        }
    });
}

function updateControls() {
    let displayIndex = currentIndex;
    if (currentIndex === 0) displayIndex = originalTotalSlides;
    else if (currentIndex === totalSlidesWithClones - 1) displayIndex = 1;
    pagination.textContent = `${displayIndex} / ${originalTotalSlides}`;
    resetProgressBar();
    if (!isPaused && !isDragging) startProgressBar();
    pausePlayBtn.innerHTML = isPaused ? '►' : '❚❚';
    
    // ★★★ 컨트롤 업데이트 시 슬라이드 크기 업데이트 호출 ★★★
    updateSlideSizes();
}

function resetProgressBar() {
    progressBar.classList.remove('animate');
    progressBar.style.animation = 'none'; void progressBar.offsetWidth;
}
function startProgressBar() {
    if (isPaused || isDragging) return;
    resetProgressBar();
    progressBar.style.animation = `progressBarAnimation ${autoPlayDelay / 1000}s linear forwards`;
    progressBar.classList.add('animate');
}

function goToSlide(index, animate = true) {
    if (isTransitioning) return;
    isTransitioning = true;
    currentIndex = index;
    currentTranslate = calculateTranslateX(currentIndex);
    updateSliderPosition(animate);
    
    // ★★★ 슬라이드 이동 시작 시 크기 업데이트 ★★★
    updateSlideSizes();
}

slidesContainer.addEventListener('transitionend', () => {
    isTransitioning = false;
    let jumped = false;

    if (currentIndex === 0) {
        currentIndex = originalTotalSlides;
        currentTranslate = calculateTranslateX(currentIndex);
        updateSliderPosition(false);
        jumped = true;
    } else if (currentIndex === totalSlidesWithClones - 1) {
        currentIndex = 1;
        currentTranslate = calculateTranslateX(currentIndex);
        updateSliderPosition(false);
        jumped = true;
    }

    prevTranslate = currentTranslate;
    updateControls();

    if (!isPaused && !isDragging) {
        startAutoPlay();
    }
});

function moveSlideManual(direction) {
    if (isTransitioning) return;
    stopAutoPlay();
    goToSlide(currentIndex + direction);
}

function startAutoPlay() {
    clearInterval(autoPlayInterval); autoPlayInterval = null;
    if (isPaused || isDragging || isTransitioning) return;
    isPaused = false; pausePlayBtn.innerHTML = '❚❚';
    startProgressBar();
    autoPlayInterval = setInterval(() => { goToSlide(currentIndex + 1); }, autoPlayDelay);
}
function stopAutoPlay() {
    clearInterval(autoPlayInterval); autoPlayInterval = null;
    if(progressBar.classList.contains('animate')) { progressBar.style.animationPlayState = 'paused'; }
}
function togglePlayPause() {
    isPaused = !isPaused;
    if (isPaused) { stopAutoPlay(); pausePlayBtn.innerHTML = '►'; }
    else {
        isPaused = false; pausePlayBtn.innerHTML = '❚❚';
        if (!isTransitioning && !isDragging) {
            resetProgressBar();
            startProgressBar();
            startAutoPlay();
        }
    }
}

// --- 드래그 이벤트 핸들러 ---
function dragStart(event) {
    if (isTransitioning) return;
    isDragging = true;
    startPos = getPositionX(event);
    slidesContainer.style.transition = 'none';
    stopAutoPlay();
    if(progressBar.classList.contains('animate')) { progressBar.style.animationPlayState = 'paused'; }
    sliderContainer.style.cursor = 'grabbing';
    prevTranslate = currentTranslate;
}

function dragMove(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
    updateSliderPosition(false);
}

function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    sliderContainer.style.cursor = 'grab';

    const movedBy = currentTranslate - prevTranslate;
    const threshold = effectiveSlideWidth / 5;

    let targetIndex = currentIndex;

    if (movedBy < -threshold) {
        targetIndex = currentIndex + 1;
    } else if (movedBy > threshold) {
        targetIndex = currentIndex - 1;
    }

    goToSlide(targetIndex);
}

function getPositionX(event) { return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX; }

// --- 이벤트 리스너 연결 ---
pausePlayBtn.addEventListener('click', togglePlayPause);
slidesContainer.addEventListener('mousedown', dragStart);
document.addEventListener('mousemove', dragMove);
document.addEventListener('mouseup', dragEnd);
slidesContainer.addEventListener('touchstart', dragStart, { passive: false });
document.addEventListener('touchmove', dragMove, { passive: false });
document.addEventListener('touchend', dragEnd);

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    stopAutoPlay();
    resizeTimeout = setTimeout(() => {
        setWrapperWidthAndPosition(false);
        updateControls();
        if (!isPaused && !isDragging) {
            startAutoPlay();
        }
    }, 250);
});

sliderContainer.addEventListener('mouseenter', () => { if (!isPaused) stopAutoPlay(); });
sliderContainer.addEventListener('mouseleave', () => {
    if (!isPaused && !isDragging && !isTransitioning) {
        startAutoPlay();
    }
});

// --- 초기화 ---
window.onload = () => {
    setupInfiniteLoop();
    updateControls();
    startAutoPlay();
};