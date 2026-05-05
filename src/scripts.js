const bookmarks = new Map(
    JSON.parse(localStorage.getItem('bookmarks') || '[]')
),
    loader = document.getElementById("loader"),
    index = document.getElementById("index"),
    header = document.getElementById("header");

let chapterArea = document.getElementById("chapter"),
    pageArea = document.getElementById("page"),
    navArea = document.getElementById("nav"),
    bookmarkArea = document.getElementById("bookmark"),
    chapterSelect = document.getElementById("goto-chapter"),
    lastreadvalue;

const verseSection = document.getElementById("verse"),
    bodySection = document.getElementById("body"),
    backButton = document.getElementById("back-btn"),
    prevNextBtn = document.getElementById("prev-next-btn"),
    lastRead = document.getElementById("last-read"),
    pagePreview = document.getElementById("page-preview"),
    selectList = document.querySelectorAll(".select-list"),
    importFile = document.getElementById("importFile");


index.style.marginTop = `${header.offsetHeight + 5}px`;


function appendFragment(area, temp) {
    const fragment = document.createDocumentFragment();

    while (temp.firstChild) {
        fragment.appendChild(temp.firstChild);
    }

    area.appendChild(fragment);
}


fetch('./src/al-quran-ul-kareem.json')
    .then(response => response.json())
    .then(data => {
        renderAllData(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });


function renderAllData(data) {
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
            if (rukuCount < row.rk_no) {
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
    updateLastRead();
}


function bookmarkSection() {
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
        bookmarkHtml = '<div class="bm-wrapper">'
            + '<small>No bookmark found</small>'
            + '</div>';
    }

    bookmarkTemp.innerHTML = bookmarkHtml;
    appendFragment(bookmarkArea, bookmarkTemp);
}


function updateLastRead() {
    lastreadvalue = localStorage.getItem('lastread') ?? '';
    lastRead.className = '';

    if (lastreadvalue === '') {
        lastRead.className = 'd-none';
    } else {
        let lrvSplit = lastreadvalue.split("-");
        lastRead.dataset.chapter = 'chapter-' + lrvSplit[1];
        lastRead.dataset.verse = lastreadvalue;
        lastRead.querySelector('span').textContent = 'C-' + lrvSplit[1] + ' : ' + 'V-' + lrvSplit[2];
    }
}


const bmFileName = 'al-quran-ul-kareem_bookmarks.json';

function importBookmark() {
    importFile.click();
}

function exportBookmark() {
    const bmData = localStorage.getItem('bookmarks'),
        bmDataMap = new Map(JSON.parse(bmData || '[]'));

    if (bmDataMap.size === 0) {
        alert("No bookmark found to export.");
        return;
    }

    const blob = new Blob([bmData], { type: 'application/json' }),
        url = URL.createObjectURL(blob),
        a = document.createElement('a');
    a.href = url;
    a.download = bmFileName;
    a.click();

    URL.revokeObjectURL(url);
}

async function resetCache() {
    if (!navigator.onLine) {
        alert("No internet connection, unable to reset and clean caches");
        return;
    }

    if (confirm("Are you sure to reset and clean caches?")) {
        try {
            const swReg = await navigator.serviceWorker.getRegistration();
            if (swReg) {
                await swReg.update();
            }

            const cKeys = await caches.keys();
            await Promise.all(cKeys.map(key => caches.delete(key)));

            const lsKeys = ['bookmarks', 'lastread', 'backgroundcolor', 'arfontfamily', 'arfontsize', 'enfontfamily', 'enfontsize', 'bnfontfamily', 'bnfontsize'];
            lsKeys.forEach(key => localStorage.removeItem(key));

            location.reload();
        } catch (error) {
            console.error('Error:', error);
        }
    } else {
        return;
    }
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
            lastRead.style.bottom = "-100%";
        } else {
            header.style.top = "0";
            lastRead.style.bottom = "10px";
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

            observeLastRead();
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
        updateLastRead();
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
            chapterSelect.style.borderColor = 'rgba(255, 0, 0, 0.3)';
            return;
        } else {
            chapterSelect.style.borderColor = 'rgba(0, 0, 0, 0.1)';
        }

        if (vInt < 1 || vInt > cvInt) {
            goToVerse.style.borderColor = 'rgba(255, 0, 0, 0.3)';
            return;
        } else {
            goToVerse.style.borderColor = 'rgba(0, 0, 0, 0.1)';
        }

        viewOnVerse = 'verse-' + goToChapter.value + '-' + goToVerse.value;
        onClickTitle(document.getElementById('chapter-' + goToChapter.value), 30);

    });


    function applyConfig(key = '*') {
        if (key == 'backgroundcolor' || key == '*') {
            const defaultBgColor = localStorage.getItem('backgroundcolor') ?? 'FAF7F2';
            document.documentElement.style.setProperty('--bg-color', '#' + defaultBgColor);
            if (key == '*') {
                document.querySelectorAll('input[name="bg-color"]').forEach(radio => {
                    radio.checked = (radio.value == defaultBgColor);
                });
            }
        }

        let defaultFontFamily, defaultFontSize;

        if (key == 'arfontfamily' || key == '*') {
            defaultFontFamily = localStorage.getItem('arfontfamily') ?? 'Hafs';
            document.documentElement.style.setProperty('--ar-font-family', "'" + String(defaultFontFamily));
            if (key == '*') {
                document.getElementById('arfontfamily').value = defaultFontFamily;
            }
        }
        if (key == 'arfontsize' || key == '*') {
            defaultFontSize = localStorage.getItem('arfontsize') ?? '24';
            document.documentElement.style.setProperty('--ar-font-size', defaultFontSize + 'px');
            if (key == '*') {
                document.getElementById('arfontsize').value = defaultFontSize;
            }
        }
        if (key == 'enfontfamily' || key == '*') {
            defaultFontFamily = localStorage.getItem('enfontfamily') ?? 'Courier New';
            document.documentElement.style.setProperty('--en-font-family', "'" + String(defaultFontFamily));
            if (key == '*') {
                document.getElementById('enfontfamily').value = defaultFontFamily;
            }
        }
        if (key == 'enfontsize' || key == '*') {
            defaultFontSize = localStorage.getItem('enfontsize') ?? '12';
            document.documentElement.style.setProperty('--en-font-size', defaultFontSize + 'px');
            if (key == '*') {
                document.getElementById('enfontsize').value = defaultFontSize;
            }
        }
        if (key == 'bnfontfamily' || key == '*') {
            defaultFontFamily = localStorage.getItem('bnfontfamily') ?? 'Bornomala';
            document.documentElement.style.setProperty('--bn-font-family', "'" + String(defaultFontFamily));
            if (key == '*') {
                document.getElementById('bnfontfamily').value = defaultFontFamily;
            }
        }
        if (key == 'bnfontsize' || key == '*') {
            defaultFontSize = localStorage.getItem('bnfontsize') ?? '14';
            document.documentElement.style.setProperty('--bn-font-size', defaultFontSize + 'px');
            if (key == '*') {
                document.getElementById('bnfontsize').value = defaultFontSize;
            }
        }
    }

    applyConfig();


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
                    localStorage.setItem('bookmarks', JSON.stringify(Array.from(bookmarks)));
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

            const sectionId = btn.dataset.section;
            document.getElementById(btn.dataset.section).classList.remove("d-none");

            window.scrollTo({
                top: 0,
                // behavior: "smooth"
            });

            if (sectionId == 'search') {
                chapterSelect.value = '';
                goToVerse.value = '';
                importFile.value = '';
            }
        });
    });


    selectList.forEach(function (selector) {
        selector.addEventListener("change", function () {
            localStorage.setItem(selector.id, selector.value);
            applyConfig(selector.id);

            pagePreview.scrollIntoView({
                block: "start"
            });
        });
    });


    document.addEventListener('change', function (e) {
        if (e.target.matches('input[name="bg-color"]')) {
            localStorage.setItem("backgroundcolor", e.target.value);
            applyConfig('backgroundcolor');

            pagePreview.scrollIntoView({
                block: "start"
            });
        }
    });


    function observeLastRead() {
        const lines = document.querySelectorAll('#' + viewOnChapter + '-verse > div.line');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                    const id = entry.target.id;

                    if (lastreadvalue !== id) {
                        lastreadvalue = id;
                        localStorage.setItem('lastread', id);
                    }
                }
            });
        }, {
            threshold: [0.5]
        });

        lines.forEach(section => observer.observe(section));
    }


    lastRead.addEventListener("click", function () {
        viewOnVerse = lastRead.dataset.verse;
        onClickTitle(document.getElementById(lastRead.dataset.chapter));
    });


    const bmKeyRegex = /^chapter-\d+_verse-\d+-\d+-\d+$/,
        bmValRegex = /^\d+\.\s.+$/;

    importFile.addEventListener('change', function (event) {
        const file = event.target.files[0];

        if (!file) {
            importFile.value = '';
            return;
        } else if (file.name !== bmFileName) {
            alert("Invalid file name/type to import.");
            importFile.value = '';
            return;
        }

        const reader = new FileReader();

        reader.onload = function (e) {
            try {
                const data = JSON.parse(e.target.result);
                let key = '',
                    val = '',
                    vid = '',
                    flag = false;

                for (let i = 0; i < data.length; i++) {
                    key = data[i][0];
                    val = data[i][1];

                    if (bmKeyRegex.test(key) && bmValRegex.test(val)) {
                        if (!bookmarks.has(key)) {
                            bookmarks.set(key, val);

                            vid = key.split("_")[1];
                            document.getElementById(vid).classList.toggle("pinned");
                        }
                    } else {
                        flag = true;
                    }
                }

                localStorage.setItem('bookmarks', JSON.stringify(Array.from(bookmarks)));
                bookmarkSection();

                if (flag) {
                    alert("Invalid data found in the file.");
                } else {
                    alert("Bookmarks have been imported.");
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        reader.readAsText(file);
        importFile.value = '';
    });


    loader.className = 'd-none';
});
