// ====== المتغيرات العامة ======
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let studentName = '';
let totalQuestions = 0;

// ====== تحميل الوحدات عند اختيار الصف ======
document.getElementById('gradeSelect').addEventListener('change', function() {
    const grade = this.value;
    const unitSelect = document.getElementById('unitSelect');
    const lessonSelect = document.getElementById('lessonSelect');
    
    unitSelect.innerHTML = '<option value="">-- اختر الوحدة --</option>';
    lessonSelect.innerHTML = '<option value="">-- اختر الدرس --</option>';
    
    if (grade && questionsData[grade]) {
        const units = Object.keys(questionsData[grade].units);
        units.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit;
            unitSelect.appendChild(option);
        });
    }
});

// ====== تحميل الدروس عند اختيار الوحدة ======
document.getElementById('unitSelect').addEventListener('change', function() {
    const grade = document.getElementById('gradeSelect').value;
    const unit = this.value;
    const lessonSelect = document.getElementById('lessonSelect');
    
    lessonSelect.innerHTML = '<option value="">-- اختر الدرس --</option>';
    
    if (grade && unit && questionsData[grade] && questionsData[grade].units[unit]) {
        const lessons = Object.keys(questionsData[grade].units[unit].lessons);
        lessons.forEach(lesson => {
            const option = document.createElement('option');
            option.value = lesson;
            option.textContent = lesson;
            lessonSelect.appendChild(option);
        });
    }
});

// ====== بدء الاختبار العادي ======
document.getElementById('startBtn').addEventListener('click', function() {
    const name = document.getElementById('studentName').value.trim();
    const grade = document.getElementById('gradeSelect').value;
    const unit = document.getElementById('unitSelect').value;
    const lesson = document.getElementById('lessonSelect').value;
    
    if (!name) {
        alert('⚠️ من فضلك أدخل اسم الطالب');
        return;
    }
    
    if (!grade) {
        alert('⚠️ من فضلك اختر الصف');
        return;
    }
    
    if (!unit) {
        alert('⚠️ من فضلك اختر الوحدة');
        return;
    }
    
    if (!lesson) {
        alert('⚠️ من فضلك اختر الدرس');
        return;
    }
    
    let questions;
    try {
        questions = questionsData[grade].units[unit].lessons[lesson];
    } catch (e) {
        alert('⚠️ لا توجد أسئلة لهذا الدرس');
        return;
    }
    
    if (!questions || questions.length === 0) {
        alert('⚠️ لا توجد أسئلة');
        return;
    }
    
    currentQuestions = questions;
    currentIndex = 0;
    score = 0;
    totalQuestions = currentQuestions.length;
    studentName = name;
    
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'block';
    document.getElementById('resultScreen').style.display = 'none';
    
    document.getElementById('studentLabel').textContent = studentName;
    document.getElementById('questionCount').textContent = totalQuestions;
    document.getElementById('liveScore').textContent = score;
    
    showQuestion();
});

// =============================================
// بدء الامتحان (من examQuestions.js)
// =============================================
document.getElementById('examStartBtn').addEventListener('click', function() {
    const name = document.getElementById('studentName').value.trim();
    const grade = document.getElementById('examSelect').value;
    
    if (!name) {
        alert('⚠️ من فضلك أدخل اسم الطالب');
        return;
    }
    
    if (!grade) {
        alert('⚠️ من فضلك اختر الامتحان');
        return;
    }
    
    // ====== جلب الأسئلة من examQuestions ======
    let questions;
    let examTitle = '';
    
    try {
        // التحقق من وجود examQuestions
        if (typeof examQuestions === 'undefined') {
            alert('⚠️ ملف examQuestions.js لم يتم تحميله');
            console.error('examQuestions غير موجود');
            return;
        }
        
        const examData = examQuestions[grade];
        if (!examData) {
            alert('⚠️ لا توجد أسئلة لهذا الامتحان');
            return;
        }
        
        questions = examData.questions;
        examTitle = examData.title || 'الامتحان';
        
    } catch (e) {
        alert('⚠️ حدث خطأ في تحميل الأسئلة');
        console.error(e);
        return;
    }
    
    if (!questions || questions.length === 0) {
        alert('⚠️ لا توجد أسئلة');
        return;
    }
    
    // ====== بدء الاختبار ======
    currentQuestions = questions;
    currentIndex = 0;
    score = 0;
    totalQuestions = currentQuestions.length;
    studentName = name;
    
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'block';
    document.getElementById('resultScreen').style.display = 'none';
    
    document.getElementById('studentLabel').textContent = studentName;
    document.getElementById('questionCount').textContent = totalQuestions;
    document.getElementById('liveScore').textContent = score;
    
    showQuestion();
});

// ====== عرض السؤال ======
function showQuestion() {
    const question = currentQuestions[currentIndex];
    
    if (!question) {
        return;
    }
    
    document.getElementById('questionNumber').textContent = currentIndex + 1;
    document.getElementById('questionText').textContent = question.question || '';
    
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    // ==================================================
    // أسئلة مقالية (علل، ما المقصود، المفهوم العلمي)
    // ==================================================
    if (question.type === 'explain' || question.type === 'definition' || question.type === 'concept') {
        // مربع نص للإجابة
        const textarea = document.createElement('textarea');
        textarea.id = 'essayAnswer';
        textarea.placeholder = 'اكتب إجابتك هنا...';
        textarea.className = 'answer-input';
        textarea.rows = 5;
        textarea.style.cssText = 'width:100%;padding:15px;border:2px solid #ddd;border-radius:10px;font-size:16px;min-height:120px;resize:vertical;margin-bottom:15px;';
        container.appendChild(textarea);
        
        // زر التحقق
        const checkBtn = document.createElement('button');
        checkBtn.textContent = '✅ تحقق من الإجابة';
        checkBtn.className = 'answer-btn';
        checkBtn.style.cssText = 'padding:12px 30px;background:#667eea;color:white;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;width:100%;';
        checkBtn.onclick = function() {
            checkEssayAnswer();
        };
        container.appendChild(checkBtn);
        
        // مكان عرض النتيجة
        const feedback = document.createElement('div');
        feedback.id = 'essayFeedback';
        feedback.style.cssText = 'margin-top:15px;padding:15px;border-radius:10px;font-size:16px;display:none;';
        container.appendChild(feedback);
        
        document.getElementById('nextBtn').style.display = 'none';
        return;
    }
    
    // ==================================================
    // جميع الأسئلة الأخرى (MCQ + True/False)
    // ==================================================
    const options = question.options || [];
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'answer-btn';
        button.textContent = option;
        button.dataset.index = index;
        button.onclick = function() {
            selectAnswer(index);
        };
        container.appendChild(button);
    });
    
    const progress = totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0;
    document.getElementById('progressBar').style.width = progress + '%';
    document.getElementById('nextBtn').style.display = 'none';
}

// ====== اختيار إجابة ======
function selectAnswer(selectedIndex) {
    const question = currentQuestions[currentIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons.forEach(btn => btn.disabled = true);
    
    const correctIndex = question.correct;
    
    buttons.forEach((btn, index) => {
        if (index === correctIndex) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== correctIndex) {
            btn.classList.add('wrong');
        }
    });
    
    if (selectedIndex === correctIndex) {
        score++;
        document.getElementById('liveScore').textContent = score;
    }
    
    document.getElementById('nextBtn').style.display = 'block';
}

// ====== التحقق من الإجابة المقالية ======
function checkEssayAnswer() {
    const textarea = document.getElementById('essayAnswer');
    const feedback = document.getElementById('essayFeedback');
    const userAnswer = textarea.value.trim();
    
    if (!userAnswer) {
        feedback.style.display = 'block';
        feedback.style.background = '#fff3cd';
        feedback.style.color = '#856404';
        feedback.innerHTML = '⚠️ من فضلك اكتب إجابة قبل التحقق';
        return;
    }
    
    const question = currentQuestions[currentIndex];
    const correctAnswers = question.options;
    
    let isCorrect = false;
    
    for (let correct of correctAnswers) {
        const userClean = userAnswer.replace(/\s+/g, ' ').trim();
        const correctClean = correct.replace(/\s+/g, ' ').trim();
        
        if (userClean === correctClean) {
            isCorrect = true;
            break;
        }
        
        const userWords = userClean.split(' ');
        const correctWords = correctClean.split(' ');
        let matchCount = 0;
        for (let word of correctWords) {
            if (word.length > 2 && userClean.includes(word)) {
                matchCount++;
            }
        }
        if (matchCount >= correctWords.length * 0.6) {
            isCorrect = true;
            break;
        }
    }
    
    feedback.style.display = 'block';
    
    if (isCorrect) {
        feedback.style.background = '#d4edda';
        feedback.style.color = '#155724';
        feedback.innerHTML = `
            ✅ <strong>إجابة صحيحة! أحسنت 🎉</strong>
            <br><span style="font-size:14px;">إجابتك متطابقة مع الإجابة النموذجية.</span>
        `;
        score++;
        document.getElementById('liveScore').textContent = score;
    } else {
        feedback.style.background = '#f8d7da';
        feedback.style.color = '#721c24';
        feedback.innerHTML = `
            ❌ <strong>إجابة غير صحيحة</strong>
            <br><span style="font-size:14px;">حاول مرة أخرى أو راجع الدرس.</span>
            <br><span style="font-size:14px;margin-top:10px;display:block;">💡 الإجابات النموذجية المحتملة:</span>
            <ul style="margin-top:5px;padding-right:20px;">
                ${correctAnswers.map(ans => `<li style="font-size:14px;">${ans}</li>`).join('')}
            </ul>
        `;
    }
    
    textarea.disabled = true;
    const checkBtn = document.querySelector('.answer-btn');
    if (checkBtn) checkBtn.disabled = true;
    
    document.getElementById('nextBtn').style.display = 'block';
}

// ====== الانتقال للسؤال التالي ======
document.getElementById('nextBtn').addEventListener('click', function() {
    currentIndex++;
    
    if (currentIndex < totalQuestions) {
        showQuestion();
    } else {
        showResult();
    }
});

// ====== عرض النتيجة ======
function showResult() {
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'block';
    
    const percent = Math.round((score / totalQuestions) * 100);
    
    let gradeText = '';
    let emoji = '';
    
    if (percent >= 90) {
        gradeText = 'ممتاز';
        emoji = '🌟';
    } else if (percent >= 75) {
        gradeText = 'جيد جداً';
        emoji = '👍';
    } else if (percent >= 50) {
        gradeText = 'جيد';
        emoji = '📚';
    } else {
        gradeText = 'تحتاج للمزيد من المذاكرة';
        emoji = '💪';
    }
    
    document.getElementById('resultName').textContent = `👤 الطالب: ${studentName}`;
    document.getElementById('resultScore').textContent = `📊 الدرجة: ${score} من ${totalQuestions}`;
    document.getElementById('resultPercent').textContent = `📈 النسبة: ${percent}%`;
    document.getElementById('resultGrade').textContent = `${emoji} ${gradeText}`;
}

// ====== إعادة الاختبار ======
document.getElementById('restartBtn').addEventListener('click', function() {
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('studentName').value = '';
    document.getElementById('gradeSelect').value = '';
    document.getElementById('unitSelect').innerHTML = '<option value="">-- اختر الوحدة --</option>';
    document.getElementById('lessonSelect').innerHTML = '<option value="">-- اختر الدرس --</option>';
    document.getElementById('liveScore').textContent = '0';
    document.getElementById('progressBar').style.width = '0%';
});

// ====== إرسال الإجابات عبر واتساب ======

// ====== إرسال الإجابات عبر واتساب (نسخة مبسطة) ======

function sendAnswers() {

    const name =
        studentName ||
        'طالب';

    const scoreElement =
        document.getElementById('liveScore');

    const scoreText =
        scoreElement
            ? scoreElement.textContent.trim()
            : '0';

    const score =
        parseInt(scoreText) || 0;

    const total =
        currentQuestions &&
        Array.isArray(currentQuestions)
            ? currentQuestions.length
            : 0;

    const percent =
        total > 0
            ? Math.round(
                (score / total) * 100
            )
            : 0;

    const message =
`📊 نتيجة اختبار الطالب

👤 الاسم: ${name}

🏆 الدرجة: ${score} من ${total}

📈 النسبة: ${percent}%

🕐 التاريخ:
${new Date().toLocaleString('ar-EG')}

👨‍🏫 إعداد:
المهندس / أشرف موسى`;

    // رقم واتساب
    // مصر +20 بدون الصفر الأول
    const phone =
        '201100429783';

    const url =
        'https://wa.me/' +
        phone +
        '?text=' +
        encodeURIComponent(message);

    // فتح واتساب
    window.location.href = url;
}

// ====== الحصول على إجابة الطالب ======
function getUserAnswer(index) {
    const question = currentQuestions[index];
    
    // ====== لو السؤال مقالي (مربع كتابة) ======
    if (question.type === 'explain' || question.type === 'definition' || question.type === 'concept') {
        // جلب الإجابة من مربع النص
        const textarea = document.getElementById('essayAnswer');
        if (textarea) {
            return textarea.value.trim() || 'لم يجب';
        }
        return 'لم يجب';
    }
    
    // ====== لو السؤال اختيار من متعدد أو صح/خطأ ======
    const buttons = document.querySelectorAll('.answer-btn');
    let selectedText = '';
    
    buttons.forEach((btn, i) => {
        // الأزرار المختارة (صحيحة أو خاطئة) هي اللي الطالب اختارها
        if (btn.classList.contains('correct') || btn.classList.contains('wrong')) {
            // لكن لو السؤال صح/خطأ، الأزرار بتاعته هي 'صح' و 'خطأ'
            if (question.type === 'truefalse') {
                // نبحث عن الزر اللي عليه class correct أو wrong
                if (btn.classList.contains('correct') || btn.classList.contains('wrong')) {
                    selectedText = btn.textContent;
                }
            } else {
                // MCQ: نجيب النص من الـ options
                selectedText = question.options[i] || btn.textContent;
            }
        }
    });
    
    // لو مفيش اختيار، نرجع 'لم يجب'
    return selectedText || 'لم يجب';
}

// ====== نسخ النتيجة ======
function copyResult() {
    const name = studentName || 'طالب';
    const scoreText = document.getElementById('liveScore').textContent;
    const total = currentQuestions ? currentQuestions.length : 0;
    const percent = total > 0 ? Math.round((parseInt(scoreText) / total) * 100) : 0;
    
    const text = 
        `📊 نتيجة اختبار Science Quiz Pro\n` +
        `================================\n` +
        `👤 الطالب: ${name}\n` +
        `📊 الدرجة: ${scoreText} من ${total}\n` +
        `📈 النسبة: ${percent}%\n` +
        `================================\n` +
        `🕐 ${new Date().toLocaleString('ar-EG')}`;
    
    navigator.clipboard.writeText(text).then(() => {
        alert('✅ تم نسخ النتيجة! يمكنك لصقها في رسالة الآن.');
    }).catch(() => {
        alert('❌ فشل النسخ. حاول مرة أخرى.');
    });
}

// ====== عرض الامتحان كامل ======
function showExamPaper() {
    const grade = document.getElementById('examSelect').value;
    const name = document.getElementById('studentName').value.trim() || 'الطالب';
    
    if (!grade) {
        alert('⚠️ من فضلك اختر الامتحان أولاً');
        return;
    }
    
    let unit = 'الوحدة الأولى';
    let lesson = 'الدرس الأول';
    
    if (grade === 'prep2_exam') {
        lesson = 'الامتحان';
    }
    
    let questions;
    try {
        questions = questionsData[grade].units[unit].lessons[lesson];
    } catch (e) {
        alert('⚠️ لا توجد أسئلة لهذا الامتحان');
        return;
    }
    
    if (!questions || questions.length === 0) {
        alert('⚠️ لا توجد أسئلة');
        return;
    }
    
    // فتح صفحة جديدة للطباعة
    const win = window.open('', '_blank');
    win.document.write('<html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>الامتحان</title><style>body{font-family:Arial;padding:20px;max-width:800px;margin:auto;line-height:1.8;}h1{text-align:center;color:#667eea;}.q{margin:15px 0;padding:10px;border-bottom:1px solid #eee;}.options{margin-right:20px;}</style></head><body>');
    win.document.write('<h1>📝 الامتحان</h1>');
    win.document.write(`<p><strong>👤 اسم الطالب:</strong> _______________</p><hr>`);
    
    questions.forEach((q, i) => {
        win.document.write(`<div class="q"><strong>${i+1}. ${q.question}</strong><br>`);
        if (q.options && q.options.length > 0) {
            win.document.write('<div class="options">');
            q.options.forEach(opt => {
                win.document.write(`<div>⬜ ${opt}</div>`);
            });
            win.document.write('</div>');
        }
        win.document.write('</div>');
    });
    
    win.document.write('<hr><p style="text-align:center;color:#888;">تم إنشاء هذا الامتحان بواسطة Science Quiz Pro</p>');
    win.document.write('</body></html>');
    win.document.close();
}