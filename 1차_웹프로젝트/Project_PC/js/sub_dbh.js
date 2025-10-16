
// ●●●●●●●●●●●● 글자타이핑 (브랜드스토리)
    const text = "세상의 모든 아기들 .. 그 모습 그대로 빛나도록 밝은모습으로 자라날 수 있도록 소중한 꿈을 지켜줍니다."; // 타이핑할 문구
    let index = 0;
    let speed = 100; // 기본 타이핑 속도 (밀리초 단위)
    let pauseDuration = 5000; // 기본 대기 시간 (밀리초 단위)

    function typeWriter() {
      if (index < text.length) {
        document.getElementById("text").textContent += text.charAt(index);
        index++;
        setTimeout(typeWriter, speed);
      } else {
        // 문장 완성 후 pauseDuration 동안 대기
        setTimeout(() => {
          index = 0;
          document.getElementById("text").textContent = "";
          setTimeout(typeWriter, speed);
        }, pauseDuration);
      }
    }

    function updateSpeed() {
      const newSpeed = parseInt(document.getElementById("speedInput").value);
      if (newSpeed >= 50 && newSpeed <= 1000) {
        speed = newSpeed;
      } else {
        alert("속도는 50ms에서 1000ms 사이로 설정할것.");
      }
    }

    function updatePause() {
      const newPause = parseInt(document.getElementById("pauseInput").value);
      if (newPause >= 500 && newPause <= 5000) {
        pauseDuration = newPause;
      } else {
        alert("대기 시간은 500ms에서 5000ms 사이로 설정할것.");
      }
    }

    typeWriter();








// ●●●●●●●●●●●● 중앙슬라이드 (브랜드스토리)
    var swiper = new Swiper(".mySwiper", {
      spaceBetween: 30,
      centeredSlides: true,
      loop: true,
      speed: 1300,
      clickable: true,
      autoplay: {
        delay: 4000,
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



