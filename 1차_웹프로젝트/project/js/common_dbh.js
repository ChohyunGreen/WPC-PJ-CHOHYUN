// ●●●●●●●●●●●● 퀵메뉴(하단)
	(function(){
	   var $window=$(window);
	   var $document=$(document);
	   var $quick=$('.quick');
	   var windowHeight=$window.height();
	   var documentHeight=$document.height();
	   var scrollTop=0;
	   var scrollGap=200;
	   var speed=600;
	   $window.scroll(function(){
			winScroll();
	   });
	   winScroll();
	   function winScroll(){
			scrollTop=$(this).scrollTop();        
			windowHeight=$window.height();
			documentHeight=$document.height();
			console.log(scrollTop,documentHeight,documentHeight - windowHeight - scrollGap)
			if(windowHeight!=documentHeight){
				if (scrollTop < scrollGap) {                                         //상단
					$quick.addClass('down');
					$quick.removeClass('up');
				}else if (scrollTop > documentHeight - windowHeight - scrollGap) {   //하단
					$quick.addClass('up');
					$quick.removeClass('down');
				}else{                                                               //그외영역
					$quick.addClass('up down');   
				}
			}else{
				$quick.removeClass('down');
			}
		}		

		$quick.find('.top').on('click',function(){
			$('html,body').stop().animate({'scrollTop':0},speed);
		});
		$quick.find('.bottom').on('click',function(){
			$('html,body').stop().animate({'scrollTop':$document.height()-$window.height()},speed);
		})
	})();







  
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




