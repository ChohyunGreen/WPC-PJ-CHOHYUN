        // 사이드바 메뉴 토글 기능
        const menuToggle = document.getElementById('menuToggle');
        const closeMenu = document.getElementById('closeMenu');
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('overlay');
        
        menuToggle.addEventListener('click', function() {
            sidebar.classList.add('active');
            overlay.classList.add('active');
        });
        
        closeMenu.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });
        
        // 하위메뉴 토글 기능
        const hasSubmenu = document.querySelectorAll('.has-submenu');
        
        hasSubmenu.forEach(item => {
            item.addEventListener('click', function(e) {
                // 링크가 아닌 메뉴 항목 클릭 시에만 하위메뉴 토글
                if (e.target.tagName === 'A') {
                    e.preventDefault();
                    
                    // 다른 모든 하위메뉴 닫기
                    hasSubmenu.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // 현재 하위메뉴 토글
                    item.classList.toggle('active');
                    
                    // 하위메뉴 표시/숨김
                    const submenu = item.querySelector('.submenu');
                    if (item.classList.contains('active')) {
                        submenu.style.display = 'block';
                    } else {
                        submenu.style.display = 'none';
                    }
                }
            });
        });
        
        // 슬라이더 기능
        const slides = document.getElementById('slides');
        const sliderDots = document.querySelectorAll('.slider-dot');
        let currentSlide = 0;
        
        function showSlide(index) {
            slides.style.transform = `translateX(-${index * 100}%)`;
            
            // 모든 도트 비활성화
            sliderDots.forEach(dot => dot.classList.remove('active'));
            // 현재 도트 활성화
            sliderDots[index].classList.add('active');
            
            currentSlide = index;
        }
        
        // 도트 클릭 이벤트
        sliderDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                showSlide(index);
            });
        });
        
        // 자동 슬라이드
        setInterval(() => {
            let nextSlide = (currentSlide + 1) % sliderDots.length;
            showSlide(nextSlide);
        }, 4000);
        
        // PC 웹사이트 링크 설정
        // 여기에 실제 PC 버전 웹사이트 주소를 설정하세요
        document.getElementById('pcVersionLink').href = "https://your-pc-website.com";




        



