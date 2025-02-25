let currentGameType = '';
let currentSection = [];
let correctAnswers = 0;
let wrongAnswers = 0;
let questionCount = 0;
let score = 0;
let timeLeft = 30;
let timer;
let reviewIndex = 0;

// 模式選擇
document.querySelectorAll('.mode-card').forEach(card => {
    card.addEventListener('click', function() {
        currentGameType = this.dataset.mode;
        document.getElementById('mode-selection').style.display = 'none';
        document.getElementById('section-selection').style.display = 'block';
        loadSections();
    });
});

// 加載章節
function loadSections() {
    const sectionsDiv = document.getElementById('sections');
    sectionsDiv.innerHTML = '';
    
    // 創建章節卡片（每8句為一章）
    for(let i = 0; i < poem.length; i += 8) {
        const sectionCard = document.createElement('div');
        sectionCard.className = 'section-card';
        sectionCard.innerHTML = `
            <h2>第 ${(i/8)+1} 章</h2>
            <p>${poem.slice(i, i+8).join('<br>')}</p>
        `;
        sectionCard.addEventListener('click', () => startGame(i));
        sectionsDiv.appendChild(sectionCard);
    }
}

// 開始遊戲
function startGame(startIndex) {
    currentSection = poem.slice(startIndex, startIndex + 8);
    document.getElementById('section-selection').style.display = 'none';
    
    if(currentGameType === 'fill') {
        initFillGame();
    } else if(currentGameType === 'timed') {
        initTimedGame();
    } else if(currentGameType === 'review') {
        initReviewGame();
    }
}

// 初始化填空遊戲
function initFillGame() {
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    questionCount = 0;
    document.getElementById('fill-game').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('timesults').style.display = 'none';
    loadFillQuestion();
}

// 初始化限時遊戲
function initTimedGame() {
    score = 0;
    correctAnswers = 0;
    wrongAnswers = 0;
    timeLeft = 30;
    document.getElementById('timed-game').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('timesults').style.display = 'none';
    startTimer();
    loadTimedQuestion();
}

// 初始化複習模式
function initReviewGame() {
    reviewIndex = 0;
    document.getElementById('review-game').style.display = 'block';
    document.getElementById('results').style.display = 'none';
    document.getElementById('timesults').style.display = 'none';
    loadReviewPhrase();
}

// 填空遊戲邏輯
function loadFillQuestion() {
    if (questionCount >= 5) {
        endGame();
        return;
    }

    // 隨機選擇4個連續的句子
    const startIndex = Math.floor(Math.random() * (currentSection.length - 3));
    const phrases = currentSection.slice(startIndex, startIndex + 4);
    const questionIndex = Math.floor(Math.random() * phrases.length);
    const correctAnswer = phrases[questionIndex];

    // 生成問題
    const question = phrases
        .map((phrase, index) => (index === questionIndex ? "___" : phrase))
        .join("，");

    // 生成選項
    const options = [correctAnswer, ...getRandomPhrases(3)];


    let ih = "";
    for (let i = 1; i <= 4; i++) {
        const start = (i == 1) ? 0 : ((i == 2) ? 4 : ((i == 3) ? 8 : 12));
        const q = question.slice(start, start + 3);
        if (q !== "___") {
            console.log(bpm);
            console.log(q.split(""));
            console.log(bpm[q.split])
            bpm[q].split('|').forEach((char, idx) => {
                ih += q[idx];
                ih += "<rt>";
                ih += char;
                ih += "</rt>";
            });
        } else {
            ih += "<rb>___</rb>";
            ih += "<rt></rt>";
        }
        if (i <= 3) {
            ih += "，";
        }
    }
    document.getElementById('question').innerHTML = ih;
    document.getElementById('question-count').textContent = `${questionCount + 1}/5`;
    
    const optionsDiv = document.getElementById('options');
    optionsDiv.innerHTML = shuffle(options).map(opt => `
        <div class="section-card answer-option" data-ans="${opt}">
            <ruby>${opt[0] + "<rt>" + bpm[opt].split('|')[0] + "</rt>" + opt[1] + "<rt>" + bpm[opt].split('|')[1] + "</rt>" + opt[2] + "<rt>" + bpm[opt].split('|')[2] + "</rt>"}</ruby>
        </div>
    `).join('');

    optionsDiv.querySelectorAll('.answer-option').forEach(opt => {
        opt.addEventListener('click', () => {
            if (opt.dataset.ans.trim() === correctAnswer) {
                score += 10;
                correctAnswers++;
                opt.style.background = '#4CAF50';
            } else {
                wrongAnswers++;
                opt.style.background = '#f44336';
            }
            questionCount++;
            updateScoreDisplay();
            setTimeout(loadFillQuestion, 250);
        });
    });
}

// 限時遊戲邏輯
function loadTimedQuestion() {
    if (timeLeft <= 0) return;

    // 隨機選擇4個連續的句子
    const startIndex = Math.floor(Math.random() * (currentSection.length - 3));
    const phrases = currentSection.slice(startIndex, startIndex + 4);
    const questionIndex = Math.floor(Math.random() * phrases.length);
    const correctAnswer = phrases[questionIndex];

    // 生成問題
    const question = phrases
        .map((phrase, index) => (index === questionIndex ? "___" : phrase))
        .join("，");

    // 生成選項
    const options = [correctAnswer, ...getRandomPhrases(3)];

    let ih = "";
    for (let i = 1; i <= 4; i++) {
        const start = (i == 1) ? 0 : ((i == 2) ? 4 : ((i == 3) ? 8 : 12));
        const q = question.slice(start, start + 3);
        if (q !== "___") {
            console.log(bpm);
            console.log(q.split(""));
            console.log(bpm[q.split])
            bpm[q].split('|').forEach((char, idx) => {
                ih += "<rb>";
                ih += q[idx];
                ih += "</rb>";
                ih += "<rt>";
                ih += char;
                ih += "</rt>";
            });
        } else {
            ih += "<rb>___</rb>";
            ih += "<rt></rt>";
        }
        if (i <= 3) {
            ih += "，";
        }
    }
    document.getElementById('timed-question').innerHTML = ih;
    
    const optionsDiv = document.getElementById('timed-options');
    optionsDiv.innerHTML = shuffle(options).map(opt => `
        <div class="section-card answer-option" data-ans="${opt}">
            <ruby>${opt[0] + "<rt>" + bpm[opt].split('|')[0] + "</rt>" + opt[1] + "<rt>" + bpm[opt].split('|')[1] + "</rt>" + opt[2] + "<rt>" + bpm[opt].split('|')[2] + "</rt>"}</ruby>
        </div>
    `).join('');

    optionsDiv.querySelectorAll('.answer-option').forEach(opt => {
        opt.addEventListener('click', () => {
            if (opt.dataset.ans.trim() === correctAnswer) {
                score += 10;
                correctAnswers++;
                opt.style.background = '#4CAF50';
            } else {
                wrongAnswers++;
                opt.style.background = '#f44336';
            }

            updateTimedDisplay();
            setTimeout(loadTimedQuestion, 250);
            // loadTimedQuestion();
        });
    });
}

// 複習模式邏輯
function loadReviewPhrase() {
    let ih = "";
    bpm[currentSection[reviewIndex]].split('|').forEach((char, idx) => {
        ih += currentSection[reviewIndex][idx];
        ih += "<rt>";
        ih += char;
        ih += "</rt>";
    });
    document.getElementById('review-phrase').innerHTML = ih;
    document.getElementById('review-definition').textContent = definitions[currentSection[reviewIndex]];
    document.getElementById('review-index').textContent = reviewIndex + 1;
    document.getElementById('review-total').textContent = currentSection.length;
    document.getElementById('aud-button').dataset.phrase = pronunciations[currentSection[reviewIndex]] + "。" + defPro[currentSection[reviewIndex]];
}

function hearReviewPhrase(audio) {
    const voices = window.speechSynthesis.getVoices();
    const msg = new SpeechSynthesisUtterance(audio.dataset.phrase);
    // msg.voice = voices[7];
    msg.rate = 0.75;
    msg.lang = "zh-TW";
    window.speechSynthesis.speak(msg);
}

function nextReviewPhrase() {
    reviewIndex = (reviewIndex + 1) % currentSection.length;
    loadReviewPhrase();
}

function prevReviewPhrase() {
    reviewIndex = reviewIndex == 0 ? (currentSection.length - 1) : (reviewIndex - 1);
    loadReviewPhrase();
}

// 結束遊戲
function endGame() {
    document.getElementById('fill-game').style.display = 'none';
    document.getElementById('timed-game').style.display = 'none';
    document.getElementById('review-game').style.display = 'none';
    document.getElementById('results').style.display = 'block';
    document.getElementById('timesults').style.display = 'none';
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('wrong-answers').textContent = wrongAnswers;
    document.getElementById('final-score').textContent = score;
}

// 結束限時遊戲
function endTime() {
    document.getElementById('fill-game').style.display = 'none';
    document.getElementById('timed-game').style.display = 'none';
    document.getElementById('review-game').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('timesults').style.display = 'block';
    document.getElementById('correct-timesers').textContent = correctAnswers;
    document.getElementById('wrong-timesers').textContent = wrongAnswers;
    document.getElementById('final-timesers').textContent = score;
}

// 更新限時遊戲顯示
function updateTimedDisplay() {
    document.getElementById('timed-score').textContent = score;
}

// 開始計時器
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            endTime();
        }
    }, 1000);
}

// 獲取隨機句子
function getRandomPhrases(count) {
    const randomPhrases = [];
    while (randomPhrases.length < count) {
        const randomPhrase = poem[Math.floor(Math.random() * poem.length)];
        if (!currentSection.includes(randomPhrase) && !randomPhrases.includes(randomPhrase)) {
            randomPhrases.push(randomPhrase);
        }
    }
    return randomPhrases;
}

// 打亂陣列
function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
}

// 更新分數顯示
function updateScoreDisplay() {
    document.getElementById('score').textContent = score;
}

// 導航功能
function showModeSelection() {
    document.getElementById('section-selection').style.display = 'none';
    document.getElementById('mode-selection').style.display = 'block';
}

function returnToSectionSelection() {
    document.getElementById('fill-game').style.display = 'none';
    document.getElementById('timed-game').style.display = 'none';
    document.getElementById('review-game').style.display = 'none';
    document.getElementById('results').style.display = 'none';
    document.getElementById('timesults').style.display = 'none';
    document.getElementById('section-selection').style.display = 'block';
    clearInterval(timer);
}
