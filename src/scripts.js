const alquranlite = localStorage.getItem('alquranlite'),
    bookmarks = new Map(
        JSON.parse(localStorage.getItem('bookmarks') || '[]')
    ),
    loader = document.getElementById("loader"),
    index = document.getElementById("index"),
    header = document.getElementById("header");

index.style.marginTop = `${header.offsetHeight + 5}px`;

let chapterArea = document.getElementById("chapter"),
    pageArea = document.getElementById("page"),
    navArea = document.getElementById("nav"),
    chapterSelect = document.getElementById("goto-chapter");

const verseSection = document.getElementById("verse"),
    bodySection = document.getElementById("body"),
    backButton = document.getElementById("back-btn"),
    prevNextBtn = document.getElementById("prev-next-btn");

const ppBgColor = document.getElementById("pp-bg-color"),
    arabicFS = document.getElementById("arabic-fs"),
    englishFS = document.getElementById("english-fs"),
    banglaFS = document.getElementById("bangla-fs"),
    ppWrap = document.getElementById("pp-wrap"),
    ppAr = document.getElementById("pp-ar"),
    ppEn = document.getElementById("pp-en"),
    ppBn = document.getElementById("pp-bn");
let defaultBgColor, defaultArFontSize, defaultEnFontSize, defaultBnFontSize;
const customSelect = document.querySelectorAll(".custom-select"),
    selectList = document.querySelectorAll(".select-list"),
    selectItem = document.querySelectorAll(".select-item"),
    closeSetting = document.querySelectorAll(".close-setting");


function appendFragment(area, temp) {
    const fragment = document.createDocumentFragment();

    while (temp.firstChild) {
        fragment.appendChild(temp.firstChild);
    }

    area.appendChild(fragment);
}


if (alquranlite === null) {
    fetch('./src/al-quran-ul-kareem.json')
        .then(response => response.json())
        .then(data => {
            localStorage.setItem('alquranlite', JSON.stringify([...data]));
            renderAllData();
        })
        .catch(error => {
            console.error('Error:', error);
        });
} else {
    renderAllData();
}


function renderAllData() {
    const data = JSON.parse(localStorage.getItem('alquranlite') || []);

    chapterArea.innerHTML = '';
    pageArea.innerHTML = '';
    chapterSelect.innerHTML = '<option value="">Select chapter</option>';

    const chapterTemp = document.createElement('div'),
        pageTemp = document.createElement('div');

    let chapterHtml = '',
        pageHtml = '';

    let row,
        rukuCount = 0,
        rukuSign = '',
        key,
        pinClass = '';

    for (let i = 0; i < data.length; i++) {
        row = data[i];

        if ('v_ar' in row) {
            key = `${'chapter-' + row.ch_no}_${'verse-' + row.ch_no + '-' + row.v_no + '-' + row.rk_no}`;
            pinClass = 'pin-btn';
            rukuSign = '';

            if (bookmarks.has(key)) {
                pinClass += ' pinned';
            }
            if (rukuCount !== row.rk_no) {
                rukuCount = row.rk_no;
                rukuSign = '<label>&#10048;</label>';
            }

            pageHtml += '<div id="verse-' + row.ch_no + '-' + row.v_no + '" class="line">'
                + '<div>'
                + '<button id="verse-' + row.ch_no + '-' + row.v_no + '-' + row.rk_no + '" class="' + pinClass + '">'
                + '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke-width="1.5" stroke="currentColor" class="size-6" viewBox="3.75 2.25 16.5 19.5">'
                + '<path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z"></path>'
                + '</svg>' + row.ch_no + ':' + row.v_no + ':' + row.rk_no
                + '</button>'
                + rukuSign
                + '</div>'
                + '<p>' + row.v_ar + '</p>'
                + '<span>' + row.v_en + '</span>'
                + '<span>' + row.v_bn + '</span>'
                + '</div>';

        } else if ('ch_ar' in row) {
            chapterHtml += '<div class="in-wrapper" id="chapter-' + row.ch_no + '" data-title="' + row.ch_no + '. ' + row.ch_pron + '">'
                + '<div class="in-left">' + String(row.ch_no).padStart(3, '0') + '</div>'
                + '<div class="in-right">'
                + '<div class="in-top">'
                + '<span>' + row.ch_pron + '</span>'
                + '<span class="' + row.ch_type + '">' + row.ch_ar + '</span>'
                + '</div>'
                + '<div class="in-bottom ' + row.ch_type + '">' + row.ch_en + ' &#10022; ' + row.verses + ' &#10022; ' + row.ch_type + '</div>'
                + '</div>'
                + '</div>';

            if (row.ch_no > 1) {
                pageHtml += '</div>';
            }

            pageHtml += '<div id="chapter-' + row.ch_no + '-verse" class="chapter d-none">'
                + '<div class="ch-title">'
                + '<p class="' + row.ch_type + '">' + row.ch_ar + '</p>'
                + '<span>' + row.ch_pron + '</span>'
                + '<span>' + row.ch_en + ' &#10045; ' + row.ch_bn + '</span>'
                + '<small class="' + row.ch_type + '">Chapter-' + row.ch_no + ' &#10022; Verses-' + row.verses + ' &#10022; ' + row.ch_type + '</small>'
                + '</div>';

            if (row.ch_no > 1) {
                pageHtml += '<div class="bismillah">'
                    + '<img src="icons/bismillah.svg" />'
                    + '</div>';
            }

            chapterSelect.innerHTML += '<option value="' + row.ch_no + '" data-verses="' + row.verses + '">' + row.ch_no + '. ' + row.ch_pron + '</option>';

        }
    }

    chapterTemp.innerHTML = chapterHtml;
    appendFragment(chapterArea, chapterTemp);

    pageTemp.innerHTML = pageHtml;
    appendFragment(pageArea, pageTemp);

    bookmarkSection();
}


function bookmarkSection() {
    let bookmarkArea = document.getElementById("bookmark");
    bookmarkArea.innerHTML = '';
    const bookmarkTemp = document.createElement('div');
    let bookmarkHtml = '',
        mark = '',
        v = '',
        k = 1;

    for (const [key, value] of bookmarks) {
        mark = key.split("_");
        v = value.split(". ");

        bookmarkHtml += '<div class="bm-wrapper">'
            + '<div class="in-wrapper bookmark" id="' + key + '" data-chapter="' + mark[0] + '" data-verse="' + mark[1] + '">'
            + '<div class="in-left">' + k++ + '</div>'
            + '<div class="in-right">'
            + '<div class="in-top">'
            + '<span>' + v[1] + '</span>'
            + '<span></span>'
            + '</div>'
            + '<div class="in-bottom">' + mark[0] + ' &xhArr; ' + mark[1] + '</div>'
            + '</div>'
            + '</div>'
            + '<button class="unmark">'
            + '<img src="icons/unmark.svg" />'
            + '</button>'
            + '</div>';
    }

    if (bookmarkHtml === '') {
        bookmarkHtml += '<div class="bm-wrapper">'
            + '<small>No bookmark found</small>'
            + '</div>';
    }

    bookmarkTemp.innerHTML = bookmarkHtml;
    appendFragment(bookmarkArea, bookmarkTemp);
}


document.addEventListener("DOMContentLoaded", function () {
    let viewOnChapter = '',
        viewOnTitle = '',
        viewOnVerse = '',
        lastScrollY = window.scrollY,
        ticking = false;

    function onScroll() {
        const currentScrollY = window.scrollY;

        if (currentScrollY > lastScrollY && currentScrollY > header.offsetHeight) {
            header.style.top = "-100%";
        } else {
            header.style.top = "0";
        }

        lastScrollY = currentScrollY;
        ticking = false;
    }

    window.addEventListener("scroll", function () {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }
    }, { passive: true });


    function onClickTitle(e, mt = 10) {
        if (e.classList.contains('bookmark')) {
            viewOnVerse = e.dataset.verse;
            onClickTitle(document.getElementById(e.dataset.chapter));
        } else {
            document.getElementById("nav-title").textContent = e.dataset.title;
            document.getElementById(e.id + "-verse").classList.remove("d-none");
            viewOnChapter = e.id;
            viewOnTitle = e.dataset.title;
            verseSection.classList.remove("d-none");
            bodySection.classList.add("of-hidden");

            if (viewOnVerse) {
                const vovSection = document.getElementById(viewOnVerse);
                vovSection.style.scrollMarginTop = `${navArea.offsetHeight + mt}px`;

                vovSection.scrollIntoView({
                    block: "start"
                });
            } else {
                verseSection.scrollTo({
                    top: 0
                    // behavior: "smooth"
                });
            }
        }
    }


    let chapterSection;

    function onClickBack() {
        if (!chapterSection) {
            chapterSection = document.querySelectorAll(".chapter");
        }

        chapterSection.forEach((el) => {
            el.classList.add("d-none");
        });

        viewOnChapter = '';
        viewOnTitle = '';
        viewOnVerse = '';
        prevNextBtn.classList.remove("d-none");
        verseSection.classList.add("d-none");
        bodySection.classList.remove("of-hidden");
    }

    backButton.addEventListener("click", function () {
        onClickBack();
    });


    function onClickBookmark(e) {
        const key = `${viewOnChapter}_${e.id}`;

        if (bookmarks.has(key)) {
            bookmarks.delete(key);
        } else {
            bookmarks.set(key, viewOnTitle);
        }

        e.classList.toggle("pinned");
        localStorage.setItem('bookmarks', JSON.stringify(Array.from(bookmarks)));
        bookmarkSection();
    }

    function prevAndNext(e) {
        const currentType = viewOnChapter.split("-");
        let newNumber = 0;

        if (e.classList.contains('prev-btn')) {
            newNumber = parseInt(currentType[1], 10) - 1;
        } else if (e.classList.contains('next-btn')) {
            newNumber = parseInt(currentType[1], 10) + 1;
        }
        if (currentType[0] == 'chapter' && newNumber > 0 && newNumber < 115) {
            onClickBack();
            onClickTitle(document.getElementById('chapter-' + newNumber));
        }
    }


    const goToVerse = document.getElementById("goto-verse"),
        goToButton = document.getElementById("goto-btn");
    let goToChapter;

    goToButton.addEventListener("click", function () {
        viewOnVerse = '';
        goToChapter = chapterSelect.selectedOptions[0];
        let cvInt = goToChapter.dataset.verses !== undefined ? parseInt(goToChapter.dataset.verses, 10) : 0,
            vInt = goToVerse.value !== '' ? parseInt(goToVerse.value, 10) : 0;

        if (cvInt < 1) {
            chapterSelect.style.borderColor = 'rgba(255, 0, 0, 0.2)';
            return;
        } else {
            chapterSelect.style.borderColor = 'rgba(0, 0, 0, 0.1)';
        }

        if (vInt < 1 || vInt > cvInt) {
            goToVerse.style.borderColor = 'rgba(255, 0, 0, 0.2)';
            return;
        } else {
            goToVerse.style.borderColor = 'rgba(0, 0, 0, 0.1)';
        }

        viewOnVerse = 'verse-' + goToChapter.value + '-' + goToVerse.value;
        onClickTitle(document.getElementById('chapter-' + goToChapter.value), 30);

    });


    function setDefaultConfig(init = false) {
        defaultBgColor = localStorage.getItem('backgroundcolor') ?? 'bgColor1';
        defaultArFontSize = localStorage.getItem('arfontsize') ?? 'arfont24';
        defaultEnFontSize = localStorage.getItem('enfontsize') ?? 'enfont12';
        defaultBnFontSize = localStorage.getItem('bnfontsize') ?? 'bnfont14';

        verseSection.className = "d-none " + defaultBgColor;
        pageArea.className = defaultArFontSize + ' ' + defaultEnFontSize + ' ' + defaultBnFontSize;
        ppWrap.className = defaultBgColor;
        ppAr.className = defaultArFontSize;
        ppEn.className = defaultEnFontSize;
        ppBn.className = defaultBnFontSize;

        if (init) {
            selectItem.forEach(function (item) {
                let hasAny = [defaultBgColor, defaultArFontSize, defaultEnFontSize, defaultBnFontSize].some(c => item.classList.contains(c));

                if (hasAny) {
                    item.classList.add("selected");
                    let liClass = document.getElementById("pp-" + item.dataset.lic);

                    if (item.dataset.sic !== undefined) {
                        liClass.className = item.dataset.sic;
                    } else {
                        liClass.textContent = item.textContent;
                    }
                }
            });
        }
    }

    setDefaultConfig(true);


    function validateVerseInput(e) {
        let val = e.target.value.replace(/\D/g, '');

        if (!val) {
            e.target.value = '';
            return;
        }

        let num = parseInt(val, 10);

        if (num >= 1 && num <= 286) {
            e.target.value = num;
        } else {
            e.target.value = val.slice(0, -1);
        }
    }

    ['paste', 'input'].forEach(eventType => {
        goToVerse.addEventListener(eventType, (e) => {
            validateVerseInput(e);
        });
    });


    document.addEventListener("click", function (e) {
        const inWrapperCls = e.target.closest(".in-wrapper");
        if (inWrapperCls) {
            viewOnChapter = '';
            viewOnTitle = '';
            viewOnVerse = '';
            onClickTitle(inWrapperCls);
            return;
        }

        const pinBtnCls = e.target.closest(".pin-btn");
        if (pinBtnCls) {
            onClickBookmark(pinBtnCls);
            return;
        }

        const prevNextBtnCls = e.target.closest(".prev-next-btn");
        if (prevNextBtnCls) {
            prevAndNext(prevNextBtnCls);
            return;
        }

        const unmarkCls = e.target.closest(".unmark");
        if (unmarkCls) {
            let bmElement = unmarkCls.previousElementSibling;

            if (bmElement.classList.contains('bookmark')) {
                let key = bmElement.id;

                if (bookmarks.has(key)) {
                    const verseEl = document.getElementById(bmElement.dataset.verse);
                    if (verseEl) {
                        verseEl.classList.remove('pinned');
                    }
                    bookmarks.delete(key);
                    localStorage.setItem('bookmarks', JSON.stringify([...bookmarks]));
                    bookmarkSection();
                }
            }
            return;
        }
    });


    const navButton = document.querySelectorAll(".nav-btn"),
        navDataSection = document.querySelectorAll(".data-section");

    navButton.forEach(function (btn) {
        btn.addEventListener("click", function () {
            navButton.forEach(function (el) {
                el.classList.remove("active-nav");
            });
            btn.classList.add("active-nav");
            navDataSection.forEach(function (el) {
                el.classList.add("d-none");
            });
            document.getElementById(btn.dataset.section).classList.remove("d-none");

            window.scrollTo({
                top: 0,
                // behavior: "smooth"
            });
        });
    });


    customSelect.forEach(function (selector) {
        selector.addEventListener("click", function () {
            selectList.forEach(function (el) {
                el.classList.add("d-none");
            });

            document.getElementById(selector.dataset.sid).classList.remove("d-none");
        });
    });

    selectItem.forEach(function (item) {
        item.addEventListener("click", function () {
            let liClass = item.dataset.lic;
            const licList = document.querySelectorAll("." + liClass);

            licList.forEach(function (el) {
                el.classList.remove("selected");
            });

            item.classList.add("selected");
            liClass = document.getElementById("pp-" + liClass);
            let key = liClass.dataset.key,
                value = '';

            if (item.dataset.sic !== undefined) {
                liClass.className = item.dataset.sic;
                value = item.dataset.sic;
            } else {
                liClass.textContent = item.textContent;
                value = key.replace("size", item.textContent);
            }

            localStorage.setItem(key, value);
            setDefaultConfig();
        });
    });

    closeSetting.forEach(function (closer) {
        closer.addEventListener("click", function () {
            selectList.forEach(function (el) {
                el.classList.add("d-none");
            });
        });
    });

    loader.className = 'd-none';

});

