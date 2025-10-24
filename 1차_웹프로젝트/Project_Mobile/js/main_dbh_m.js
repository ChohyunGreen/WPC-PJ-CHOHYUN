/* 슬라이드(이벤트) */
var swiper = new Swiper(".mySwiper", {
    spaceBetween: 30,
    centeredSlides: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });








  /* 슬라이드(초보엄빠) */
  const tabs = document.querySelectorAll('.tab');
  const contents = document.querySelectorAll('.content');
  let currentIndex = 0;
  const autoSlideInterval = 3000; // 자동 슬라이드 시간 (밀리초)

  function showTab(index) {
      tabs.forEach((tab, i) => {
          tab.classList.toggle('active', i === index);
          contents[i].classList.toggle('active', i === index);
      });
  }

  function nextTab() {
      currentIndex = (currentIndex + 1) % tabs.length;
      showTab(currentIndex);
  }

  tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
          currentIndex = parseInt(tab.getAttribute('data-index'));
          showTab(currentIndex);
      });
  });

  // 자동 슬라이드 시작
  setInterval(nextTab, autoSlideInterval);

  // 초기 탭 표시
  showTab(currentIndex);








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