


// ●●●●●●●●●●●● 검색창(모달팝업)
const modal = document.querySelector('.modal');
const modalOpen = document.querySelector('.modal_btn');
const modalClose = document.querySelector('.close_btn');

// //열기 버튼을 눌렀을 때 모달팝업이 열림
// modalOpen.addEventListener('click',function(){
//     modal.classList.add('on');
// });
// //닫기 버튼을 눌렀을 때 모달팝업이 닫힘
// modalClose.addEventListener('click',function(){
//     modal.classList.remove('on');
// });

// 2. 스타일 직접 변경
//열기 버튼을 눌렀을 때 모달팝업이 열림
modalOpen.addEventListener('click',function(){
    modal.style.display = 'block';
});
//닫기 버튼을 눌렀을 때 모달팝업이 닫힘
modalClose.addEventListener('click',function(){
    modal.style.display = 'none';
});








// ●●●●●●●●●●●● 전체메뉴(펼침메뉴)
        const dropdown = document.querySelector('.dropdown');
        const dropdownButton = document.querySelector('.dropdown-button');
        const closeButton = document.querySelector('.close-button');

        dropdownButton.addEventListener('click', function() {
            dropdown.classList.toggle('active');
        });

        closeButton.addEventListener('click', function() {
            dropdown.classList.remove('active');
        });

        // 메뉴 외부 클릭 시 닫기
        document.addEventListener('click', function(event) {
            const dropdownMenu = document.querySelector('.dropdown-menu');
            if (!dropdown.contains(event.target) && !dropdownMenu.contains(event.target)) {
                dropdown.classList.remove('active');
            }
        });
  

        var gk_isXlsx = false;
        var gk_xlsxFileLookup = {};
        var gk_fileData = {};
        function filledCell(cell) {
          return cell !== '' && cell != null;
        }
        function loadFileData(filename) {
        if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
            try {
                var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
                var firstSheetName = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[firstSheetName];

                // Convert sheet to JSON to filter blank rows
                var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
                // Filter out blank rows (rows where all cells are empty, null, or undefined)
                var filteredData = jsonData.filter(row => row.some(filledCell));

                // Heuristic to find the header row by ignoring rows with fewer filled cells than the next row
                var headerRowIndex = filteredData.findIndex((row, index) =>
                  row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
                );
                // Fallback
                if (headerRowIndex === -1 || headerRowIndex > 25) {
                  headerRowIndex = 0;
                }

                // Convert filtered JSON back to CSV
                var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex)); // Create a new sheet from filtered array of arrays
                csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
                return csv;
            } catch (e) {
                console.error(e);
                return "";
            }
        }
        return gk_fileData[filename] || "";
        }









// ● 상단카테고리 (마우스오버시 하위메뉴 노출)
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





// ●●●●●●●●●●●● 메인슬라이드
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
    const slideMargin = 15; // ★ CSS의 좌우 마진값과 동일하게 설정 ★
    // ★ 슬라이드 너비와 좌우 마진을 합한 실제 차지 너비 계산 ★
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


    
// ★ 슬라이드 크기 업데이트 함수 추가 ★
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
    
    // ★ 컨트롤 업데이트 시 슬라이드 크기 업데이트 호출 ★
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
    
    // ★ 슬라이드 이동 시작 시 크기 업데이트 ★
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






// ●●●●●●●●●●●● 초보엄빠
document.addEventListener('DOMContentLoaded', () => {
    const tabItems = document.querySelectorAll('.tab-akb-item');
    const contentItems = document.querySelectorAll('.content-item');
    const leftTabs = document.querySelector('.left-tabs');
    const rightContent = document.querySelector('.right-content');
    const sliderContainer = document.querySelector('.slider-container');

    // --- 설정 변수 (script에서 쉽게 조정) ---
    const config = {
        autoplay: true,        // 자동 재생 여부
        autoplayInterval: 3000, // 자동 재생 간격 (밀리초)
        transitionSpeed: 500,  // 탭 및 콘텐츠 전환 속도 (밀리초, CSS transition과 일치)
        initialLoadDelay: 500, // 초기 로딩 후 첫 콘텐츠 표시 지연 (밀리초)
        loopTabs: true         // 마지막 탭에서 다시 첫 탭으로 돌아갈지 여부
    };
    // ------------------------------------------

    let currentTabIndex = 0;
    let autoplayTimer;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;

    // 탭 활성화 함수
    const activateTab = (index) => {
        // 모든 탭과 콘텐츠의 'active' 클래스 제거
        tabItems.forEach(item => item.classList.remove('active'));
        contentItems.forEach(item => item.classList.remove('active'));

        // 선택된 탭과 콘텐츠에 'active' 클래스 추가
        tabItems[index].classList.add('active');
        contentItems[index].classList.add('active');

        currentTabIndex = index; // 현재 인덱스 업데이트

        // 자동 재생 타이머 재설정 (수동 클릭 시)
        resetAutoplayTimer();
    };

    // 자동 재생 시작
    const startAutoplay = () => {
        if (!config.autoplay) return;

        autoplayTimer = setInterval(() => {
            currentTabIndex = (currentTabIndex + 1) % tabItems.length;
            if (!config.loopTabs && currentTabIndex === 0) { // 루프가 아니면 마지막 탭에서 정지
                currentTabIndex = tabItems.length - 1;
                stopAutoplay();
                return;
            }
            activateTab(currentTabIndex);
        }, config.autoplayInterval);
    };

    // 자동 재생 정지
    const stopAutoplay = () => {
        clearInterval(autoplayTimer);
    };

    // 자동 재생 타이머 재설정
    const resetAutoplayTimer = () => {
        stopAutoplay();
        startAutoplay();
    };

    // 각 탭 아이템에 클릭 이벤트 리스너 추가
    tabItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            activateTab(index);
        });
    });

    // --- 드래그 및 터치 컨트롤 ---

    // 드래그 시작
    const dragStart = (e) => {
        isDragging = true;
        sliderContainer.classList.add('dragging');
        stopAutoplay(); // 드래그 중에는 자동 재생 정지

        if (e.type.includes('mouse')) {
            startPos = e.clientX;
        } else if (e.type.includes('touch')) {
            startPos = e.touches[0].clientX;
        }
        prevTranslate = currentTranslate; // 이전 위치 저장
    };

    // 드래그 중
    const drag = (e) => {
        if (!isDragging) return;

        let currentPosition;
        if (e.type.includes('mouse')) {
            currentPosition = e.clientX;
        } else if (e.type.includes('touch')) {
            currentPosition = e.touches[0].clientX;
        }

        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;

        // 시각적 피드백 (optional: 실제 요소 이동은 아니지만, 드래그 느낌을 줄 수 있음)
        // leftTabs.style.transform = `translateX(${currentTranslate}px)`;
        // rightContent.style.transform = `translateX(${currentTranslate * 0.5}px)`; // 오른쪽은 더 적게 움직이게
    };

    // 드래그 끝
    const dragEnd = (e) => {
        if (!isDragging) return;
        isDragging = false;
        sliderContainer.classList.remove('dragging');
        startAutoplay(); // 드래그 끝나면 자동 재생 다시 시작

        const movedBy = currentTranslate - prevTranslate;

        // 일정 거리 이상 드래그 시 탭 전환
        if (Math.abs(movedBy) > 50) { // 50px 이상 드래그 시 전환
            if (movedBy < 0) { // 왼쪽으로 드래그 (다음 탭)
                currentTabIndex = (currentTabIndex + 1) % tabItems.length;
            } else { // 오른쪽으로 드래그 (이전 탭)
                currentTabIndex = (currentTabIndex - 1 + tabItems.length) % tabItems.length;
            }
            activateTab(currentTabIndex);
        }

        currentTranslate = 0; // 초기화
        prevTranslate = 0;
        // leftTabs.style.transform = `translateX(0px)`; // 위치 초기화
        // rightContent.style.transform = `translateX(0px)`;
    };

    // 이벤트 리스너 등록 (마우스)
    sliderContainer.addEventListener('mousedown', dragStart);
    sliderContainer.addEventListener('mousemove', drag);
    sliderContainer.addEventListener('mouseup', dragEnd);
    sliderContainer.addEventListener('mouseleave', dragEnd); // 컨테이너 밖으로 마우스 나가면 드래그 종료

    // 이벤트 리스너 등록 (터치)
    sliderContainer.addEventListener('touchstart', dragStart);
    sliderContainer.addEventListener('touchmove', drag);
    sliderContainer.addEventListener('touchend', dragEnd);


    // 초기 로딩 후 첫 탭 활성화 및 자동 재생 시작
    setTimeout(() => {
        activateTab(0); // 0번째 탭 활성화
        startAutoplay();
    }, config.initialLoadDelay);
});






// ●●●●●●●●●●●● 제품리뷰
document.addEventListener('DOMContentLoaded', () => {
        console.log("DOM content loaded. Starting slider initialization.");

        // ----- [1. 슬라이더 설정 가능한 변수들] -----
        const config = {
            slideDuration: 600,         // [조정 가능] 슬라이드 애니메이션 속도 (밀리초)
                                        // CSS의 `--slide-animation-duration`과 일치해야 애니메이션이 부드럽습니다.
            autoplayEnabled: true,      // [조정 가능] 자동 재생 활성화 여부 (true/false)
            autoplayInterval: 3000,     // [조정 가능] 자동 재생 간격 (밀리초, 1000ms = 1초)
            initialAutoplayDelay: 1000, // [조정 가능] 페이지 로드 후 첫 자동 재생 시작까지의 지연 시간 (밀리초)
            slideCountPerPage: 1,       // [조정 가능] 한 번에 슬라이드 되는 li 요소의 개수 (요청사항: 1개)
            draggableThreshold: 50,     // [조정 가능] 드래그/터치로 슬라이드 전환이 일어나는 최소 거리 (픽셀)
            seamlessLoopDuplicates: 3   // [조조정 가능] 무한루프를 위한 앞뒤 복제 아이템 개수. 이 값을 늘릴수록 무한처럼 보이는 구간이 길어져 더 부드럽게 느껴짐.
                                        // `slideCountPerPage`보다 크게 설정하는 것이 좋습니다. 최소 1개는 복제해야 합니다.
        };
        console.log("Slider config:", config);

        // ----- [2. DOM 요소 선택] -----
        const sliderContainer = document.querySelector('.slider-container');
        const sliderWrapper = document.querySelector('.slider-wrapper');
        const originalItems = Array.from(sliderWrapper.querySelectorAll('.slider-item'));
        const leftNavButton = document.querySelector('.slider-nav-button.left');
        const rightNavButton = document.querySelector('.slider-nav-button.right');
        const progressBar = document.querySelector('.progress-bar');
        
        // 유효성 검사: 필수 요소가 없으면 스크립트 실행 중단
        if (!sliderContainer || !sliderWrapper || originalItems.length === 0 || !leftNavButton || !rightNavButton || !progressBar) {
            console.error("Slider elements not found. Please check HTML structure.");
            return; // 필수 요소가 없으면 스크립트 실행 중단
        }

        let currentOriginalIndex = 0; // 현재 활성화된 원본 아이템의 인덱스 (0 ~ totalOriginalSlides-1)
        let totalOriginalSlides = originalItems.length;
        let currentTransformX = 0; // slider-wrapper의 현재 translateX 값 (픽셀)
        let autoplayIntervalId;
        let initialAutoplayTimeoutId;
        let isDragging = false;
        let dragStartX = 0;
        let dragCurrentX = 0;
        let isTransitioning = false; // 슬라이드 전환 애니메이션 중 여부 플래그
        let itemWidthWithGap = 0; // li 요소의 실제 너비 (width + margin-right)

        // CSS 변수로부터 값 가져오기 (DOM 로드 후 정확한 계산)
        function calculateItemDimensions() {
            const rootStyles = getComputedStyle(document.documentElement);
            const itemWidth = parseFloat(rootStyles.getPropertyValue('--slide-width'));
            const itemGap = parseFloat(rootStyles.getPropertyValue('--slide-gap'));
            itemWidthWithGap = itemWidth + itemGap;
            console.log(`Calculated itemWidth: ${itemWidth}, itemGap: ${itemGap}, itemWidthWithGap: ${itemWidthWithGap}`);
            if (isNaN(itemWidthWithGap) || itemWidthWithGap === 0) {
                console.error("Failed to calculate item dimensions from CSS variables. Check --slide-width and --slide-gap.");
                itemWidthWithGap = 320; // 계산 실패 시 기본값 (300px width + 20px gap)
            }
        }
        calculateItemDimensions(); // 초기 계산

        // ----- [3. 무한 루프를 위한 아이템 복제 및 초기 위치 설정] -----
        // [복제된 뒤쪽 아이템들 ... 원본 아이템들 ... 복제된 앞쪽 아이템들] 형태로 만듦
        function setupSeamlessLoop() {
            sliderWrapper.innerHTML = ''; // 래퍼 내부를 비움

            // 복제할 아이템들 생성 (클래스 추가로 원본과 구별)
            const prependItems = originalItems.slice(-config.seamlessLoopDuplicates).map(item => {
                const cloned = item.cloneNode(true);
                cloned.classList.add('is-cloned');
                return cloned;
            });
            const appendItems = originalItems.slice(0, config.seamlessLoopDuplicates).map(item => {
                const cloned = item.cloneNode(true);
                cloned.classList.add('is-cloned');
                return cloned;
            });

            // DOM에 추가
            prependItems.forEach(item => sliderWrapper.appendChild(item));
            originalItems.forEach(item => sliderWrapper.appendChild(item));
            appendItems.forEach(item => sliderWrapper.appendChild(item));
            
            // 초기 위치 조정: 복제된 아이템들을 건너뛰고 첫 번째 원본 아이템으로 이동
            // (애니메이션 없이 즉시 이동해야 하므로 transition을 'none'으로 설정)
            currentTransformX = -(config.seamlessLoopDuplicates * itemWidthWithGap);
            sliderWrapper.style.transition = 'none';
            sliderWrapper.style.transform = `translateX(${currentTransformX}px)`;
            console.log("Seamless loop setup complete. Initial transform:", currentTransformX);

            // 다음 프레임에서 transition 다시 활성화
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    sliderWrapper.style.transition = `transform ${config.slideDuration / 1000}s ease-in-out`;
                });
            });
        }

        // ----- [4. 슬라이드 이동 핵심 함수] -----
        // 이 함수는 '원본 아이템 인덱스'를 기준으로 동작합니다.
        function goToSlide(targetOriginalIndex, animated = true) {
            if (isTransitioning) {
                console.log("Transition already in progress. Skipping.");
                return;
            }
            isTransitioning = true;
            
            console.log(`Attempting to go to original index: ${targetOriginalIndex}, animated: ${animated}`);

            // 슬라이드할 최종 목표 원본 인덱스 (0 ~ totalOriginalSlides-1 범위)
            let finalTargetOriginalIndex = targetOriginalIndex;
            // 만약 현재 인덱스가 원본의 범위를 넘어섰다면, 나중에 무한루프 처리 시 사용
            // 예: 0번에서 -1번으로 가려고 하면, 마지막 번호로 이동시켜야 함.
            // 예: (total-1)번에서 total번으로 가려고 하면, 0번으로 이동시켜야 함.
            
            // 실제 DOM에서의 타겟 인덱스 (복제된 아이템 포함)
            // 즉, 복제된 아이템들이 붙어 있는 확장된 `sliderWrapper` 내에서 몇 번째 아이템으로 가야 하는가
            const realDomTargetIndex = targetOriginalIndex + config.seamlessLoopDuplicates;
            const targetTransformX = -(realDomTargetIndex * itemWidthWithGap);

            console.log(`Original target index: ${targetOriginalIndex}, Real DOM target index: ${realDomTargetIndex}, targetTransformX: ${targetTransformX}`);

            // 애니메이션 적용 여부
            if (!animated) {
                sliderWrapper.style.transition = 'none'; // 애니메이션 일시 중지
            } else {
                sliderWrapper.style.transition = `transform ${config.slideDuration / 1000}s ease-in-out`;
            }

            sliderWrapper.style.transform = `translateX(${targetTransformX}px)`;
            currentTransformX = targetTransformX; // 현재 위치 업데이트

            // 프로그레스 바는 '실제' 원본 아이템 기준으로 업데이트
            if (targetOriginalIndex < 0) { // 맨 앞으로 넘어가는 경우 (ex: 0에서 -1로 이동)
                updateProgressBar(totalOriginalSlides - 1);
            } else if (targetOriginalIndex >= totalOriginalSlides) { // 맨 뒤로 넘어가는 경우 (ex: total-1에서 total로 이동)
                updateProgressBar(0);
            } else { // 정상 범위 내에서 이동
                updateProgressBar(targetOriginalIndex);
            }

            // 애니메이션 완료 처리 (가장 중요한 부분!)
            const transitionEndHandler = () => {
                sliderWrapper.removeEventListener('transitionend', transitionEndHandler);
                isTransitioning = false;

                // **여기가 무한루프의 핵심**: 애니메이션이 끝난 후 경계를 넘어갔는지 확인하고 순간 이동
                if (targetOriginalIndex < 0) { // 복제된 마지막 아이템으로 이동 완료 (실제로는 첫 번째 원본 앞에서 보임)
                    console.log("Reached cloned start (effectively past end). Snapping to real end.");
                    currentOriginalIndex = totalOriginalSlides - 1; // 원본 마지막 인덱스로 설정
                    const snapDomIndex = currentOriginalIndex + config.seamlessLoopDuplicates;
                    sliderWrapper.style.transition = 'none'; // 애니메이션 없이 순간 이동
                    sliderWrapper.style.transform = `translateX(-${snapDomIndex * itemWidthWithGap}px)`;
                    currentTransformX = -(snapDomIndex * itemWidthWithGap);
                } else if (targetOriginalIndex >= totalOriginalSlides) { // 복제된 첫 번째 아이템으로 이동 완료 (실제로는 마지막 원본 뒤에서 보임)
                    console.log("Reached cloned end (effectively past start). Snapping to real start.");
                    currentOriginalIndex = 0; // 원본 첫 번째 인덱스로 설정
                    const snapDomIndex = currentOriginalIndex + config.seamlessLoopDuplicates;
                    sliderWrapper.style.transition = 'none'; // 애니메이션 없이 순간 이동
                    sliderWrapper.style.transform = `translateX(-${snapDomIndex * itemWidthWithGap}px)`;
                    currentTransformX = -(snapDomIndex * itemWidthWithGap);
                } else {
                    currentOriginalIndex = targetOriginalIndex; // 정상 범위 내에서는 그대로 업데이트
                }
                
                console.log(`Slide animation completed. Final currentOriginalIndex: ${currentOriginalIndex}`);
                // 다음 슬라이드부터 애니메이션 적용을 위해 transition 다시 활성화
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        sliderWrapper.style.transition = `transform ${config.slideDuration / 1000}s ease-in-out`;
                    });
                });
            };

            // animated가 true일 때만 transitionend 이벤트를 기다림
            if (animated) {
                sliderWrapper.addEventListener('transitionend', transitionEndHandler);
            } else {
                // animated가 false면 즉시 처리 (setupSeamlessLoop 같은 초기화 호출 시)
                transitionEndHandler(); 
            }
        }

        // ----- [5. 프로그레스 바 업데이트] -----
        // 이 함수는 '원본 아이템 인덱스'를 기준으로 동작합니다.
        function updateProgressBar(idxToDisplay) {
            const progressWidth = ((idxToDisplay + 1) / totalOriginalSlides) * 100;
            progressBar.style.width = `${progressWidth}%`;
            console.log(`Progress bar updated. Index for display: ${idxToDisplay}, Total: ${totalOriginalSlides}, Width: ${progressWidth}%`);
        }

        // ----- [6. 자동 재생 시작/정지] -----
        function startAutoplay() {
            stopAutoplay(); // 기존 타이머 중복 실행 방지
            if (config.autoplayEnabled) {
                console.log(`Autoplay scheduled to start in ${config.initialAutoplayDelay}ms.`);
                initialAutoplayTimeoutId = setTimeout(() => { // 초기 지연 후 시작
                    autoplayIntervalId = setInterval(() => {
                        console.log("Autoplay moving to next slide.");
                        goToSlide(currentOriginalIndex + config.slideCountPerPage);
                    }, config.autoplayInterval);
                }, config.initialAutoplayDelay);
            }
        }

        function stopAutoplay() {
            console.log("Stopping autoplay.");
            clearTimeout(initialAutoplayTimeoutId);
            clearInterval(autoplayIntervalId);
        }

        // ----- [7. 이벤트 리스너 설정] -----

        // 네비게이션 버튼 클릭 이벤트
        rightNavButton.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(currentOriginalIndex + config.slideCountPerPage);
            startAutoplay(); // 다시 자동 재생 시작
        });

        leftNavButton.addEventListener('click', () => {
            stopAutoplay();
            goToSlide(currentOriginalIndex - config.slideCountPerPage);
            startAutoplay(); // 다시 자동 재생 시작
        });

        // 마우스 드래그 / 터치 컨트롤
        let touchStartX = 0;
        let touchCurrentX = 0; // 드래그 중인 현재 X 위치 (handleDragMove에서 사용)
        let initialTransformXOnDragStart = 0; // 드래그 시작 시 sliderWrapper의 실제 transformX 값

        function handleDragStart(e) {
            if (isTransitioning) return; // 슬라이드 전환 중에는 드래그 막기
            isDragging = true;
            sliderWrapper.classList.add('grabbing'); // CSS에서 커서 변경 (grab -> grabbing)
            stopAutoplay();
            
            dragStartX = e.clientX || e.touches[0].clientX;
            initialTransformXOnDragStart = currentTransformX; // 드래그 시작 시 wrapper의 실제 transformX 값 저장
            
            // 드래그 중에는 애니메이션 제거하여 부드러운 반응
            sliderWrapper.style.transition = 'none';
            console.log("Drag started. StartX:", dragStartX);
        }

        function handleDragMove(e) {
            if (!isDragging) return;
            
            touchCurrentX = e.clientX || e.touches[0].clientX; // 현재 X 위치 업데이트
            const dragDeltaX = touchCurrentX - dragStartX; // 드래그 이동량
            
            // 슬라이더 래퍼를 드래그 이동량만큼 임시로 움직임
            sliderWrapper.style.transform = `translateX(${initialTransformXOnDragStart + dragDeltaX}px)`;

            // 터치 스크롤 방지 (수평 드래그일 때만)
            if (e.type.includes('touch')) {
                const currentY = e.touches[0].clientY;
                const diffY = currentY - (e.changedTouches ? e.changedTouches[0].clientY : e.touches[0].clientY); // 시작 Y와 현재 Y 비교
                if (Math.abs(dragDeltaX) > Math.abs(diffY)) { // 수평 이동량이 수직 이동량보다 크면
                    e.preventDefault(); // 기본 터치 스크롤 동작 방지
                }
            }
        }

        function handleDragEnd(e) {
            if (!isDragging) return;
            isDragging = false;
            sliderWrapper.classList.remove('grabbing');
            
            const dragEndX = e.clientX || e.changedTouches[0].clientX; // 마우스업/터치엔드 시점의 X
            const finalDragDeltaX = dragEndX - dragStartX; // 최종 드래그 이동량

            if (Math.abs(finalDragDeltaX) >= config.draggableThreshold) { // 임계값 이상 드래그했을 때만 슬라이드 전환
                if (finalDragDeltaX < 0) { // 왼쪽으로 드래그 (다음 슬라이드)
                    console.log("Swipe left detected.");
                    goToSlide(currentOriginalIndex + config.slideCountPerPage);
                } else { // 오른쪽으로 드래그 (이전 슬라이드)
                    console.log("Swipe right detected.");
                    goToSlide(currentOriginalIndex - config.slideCountPerPage);
                }
            } else {
                // 드래그했지만 임계값 미만이므로 원래 위치로 부드럽게 되돌리기
                console.log("Drag below threshold. Resetting position.");
                sliderWrapper.style.transition = `transform ${config.slideDuration / 1000}s ease-in-out`;
                sliderWrapper.style.transform = `translateX(${currentTransformX}px)`;
                isTransitioning = true; // 되돌아가는 것도 애니메이션으로 간주
                setTimeout(() => { isTransitioning = false; }, config.slideDuration);
            }
            startAutoplay(); // 다시 자동 재생 시작
        }

        sliderWrapper.addEventListener('mousedown', handleDragStart);
        sliderWrapper.addEventListener('mousemove', handleDragMove);
        sliderWrapper.addEventListener('mouseup', handleDragEnd);
        sliderWrapper.addEventListener('mouseleave', handleDragEnd); // 마우스가 슬라이더를 벗어나면 드래그 종료

        sliderWrapper.addEventListener('touchstart', handleDragStart, { passive: false }); // preventDefault를 위해 false
        sliderWrapper.addEventListener('touchmove', handleDragMove, { passive: false });
        sliderWrapper.addEventListener('touchend', handleDragEnd);

        // ----- [8. 초기화 함수 호출] -----
        setupSeamlessLoop(); // 무한 루프 구조 설정 및 초기 위치 지정
        // updateProgressBar(); // updateProgressBar는 goToSlide 안에서 호출되도록 변경
        startAutoplay();     // 자동 재생 시작
        
        // 윈도우 크기 변경 시 아이템 크기 재계산 (반응형)
        window.addEventListener('resize', () => {
            calculateItemDimensions(); // itemWidthWithGap 재계산
            // 무한 루프 설정을 다시 하여 슬라이드 위치를 조정합니다.
            setupSeamlessLoop(); // 아이템들을 다시 복제하고 초기 위치를 잡음
            goToSlide(currentOriginalIndex, false); // 애니메이션 없이 현재 슬라이드 위치로 이동
        });

        console.log("Slider initialization complete.");
    });