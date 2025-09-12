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
