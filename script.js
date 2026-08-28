
/* ===== نظام الدخول والحماية ===== */

// قائمة الأكواد المسموح بها (غيرها بأكوادك الخاصة)
const validCodes = {
      "AAA002": "ايه اشرف",
    "AAA003": "اياد اشرف",
    "AAA004": "اروى اشرف",
    "AAA005": "الاء اشرف",
    "AAA001": "اشرف موسى"
};

// عناصر شاشة الدخول
const loginScreen = document.getElementById('loginScreen');
const startScreen = document.getElementById('startScreen');
const loginBtn = document.getElementById('loginBtn');
const loginStudentName = document.getElementById('loginStudentName');
const loginCode = document.getElementById('loginCode');
const loginError = document.getElementById('loginError');

// عند الضغط على زر الدخول
loginBtn.addEventListener('click', function() {
    const name = loginStudentName.value.trim();
    const code = loginCode.value.trim().toUpperCase();

    // التحقق من الاسم والكود
    if (validCodes[code] && validCodes[code] === name) {
        // الدخول صحيح
        loginError.style.display = 'none';
        loginScreen.style.display = 'none';
        startScreen.style.display = 'flex'; // إظهار شاشة البداية
        
        // وضع اسم الطالب في الترحيب وفي شاشة النتيجة
        document.getElementById('welcomeName').textContent = name;
        document.getElementById('studentName').value = name;
        document.getElementById('studentLabel').textContent = name;
        document.getElementById('resultName').textContent = name;
    } else {
        // خطأ في الدخول
        loginError.style.display = 'block';
        loginError.textContent = "❌ كود الدخول أو الاسم غير صحيح، حاول مرة أخرى.";
    }
});

/* =============================================
   (من هنا يبدأ الكود القديم الخاص بك script.js)
   ============================================= */

// ====== المتغيرات العامة ======
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let studentName = '';
let totalQuestions = 0;

// ============================================================
// دالة الحصول على معلومات الوحدة والدرس
// ============================================================
function getUnitAndLessonInfo() {
    const gradeSelect = document.getElementById('gradeSelect');
    const unitSelect = document.getElementById('unitSelect');
    const lessonSelect = document.getElementById('lessonSelect');
    
    let gradeName = gradeSelect ? gradeSelect.options[gradeSelect.selectedIndex]?.text || 'غير محدد' : 'غير محدد';
    let unitName = unitSelect ? unitSelect.options[unitSelect.selectedIndex]?.text || 'غير محدد' : 'غير محدد';
    let lessonName = lessonSelect ? lessonSelect.options[lessonSelect.selectedIndex]?.text || 'غير محدد' : 'غير محدد';
    
    return { gradeName, unitName, lessonName };
}

// ============================================================
// دالة الحصول على إجابة الطالب
// ============================================================
function getUserAnswer(index) {
    const question = currentQuestions[index];
    
    if (question.type === 'explain' || question.type === 'definition' || question.type === 'concept') {
        const textarea = document.getElementById('essayAnswer');
        if (textarea) {
            return textarea.value.trim() || 'لم يجب';
        }
        return 'لم يجب';
    }
    
    const buttons = document.querySelectorAll('.answer-btn');
    let selectedText = '';
    
    buttons.forEach((btn, i) => {
        if (btn.classList.contains('correct') || btn.classList.contains('wrong')) {
            if (question.type === 'truefalse') {
                if (btn.classList.contains('correct') || btn.classList.contains('wrong')) {
                    selectedText = btn.textContent;
                }
            } else {
                selectedText = question.options[i] || btn.textContent;
            }
        }
    });
    
    return selectedText || 'لم يجب';
}

// ============================================================
// دالة إرسال النتيجة عبر واتساب
// ============================================================
function sendAnswers() {
    const name = studentName || 'طالب';
    const scoreElement = document.getElementById('liveScore');
    const scoreText = scoreElement ? scoreElement.textContent.trim() : '0';
    const score = parseInt(scoreText) || 0;
    const total = currentQuestions && Array.isArray(currentQuestions) ? currentQuestions.length : 0;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const programName = '🧪 Science Quiz Pro';
    const { gradeName, unitName, lessonName } = getUnitAndLessonInfo();
    const message =
`📊 نتيجة اختبار الطالب

📚 البرنامج: ${programName}
📖 الصف: ${gradeName}
📖 الوحدة: ${unitName}
📝 الدرس: ${lessonName}

👤 الاسم: ${name}

🏆 الدرجة: ${score} من ${total}

📈 النسبة: ${percent}%

🕐 التاريخ:
${new Date().toLocaleString('ar-EG')}

👨‍🏫 إعداد:
المهندس / أشرف موسى`;
    const phone = '201100429783';
    window.location.href = 'https://wa.me/' + phone + '?text=' + encodeURIComponent(message);
}

// ============================================================
// دالة نسخ النتيجة
// ============================================================
function copyResult() {
    const name = studentName || 'طالب';
    const scoreElement = document.getElementById('liveScore');
    const scoreText = scoreElement ? scoreElement.textContent.trim() : '0';
    const score = parseInt(scoreText) || 0;
    const total = currentQuestions && Array.isArray(currentQuestions) ? currentQuestions.length : 0;
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const programName = '🧪 Science Quiz Pro';
    const { gradeName, unitName, lessonName } = getUnitAndLessonInfo();
    const message =
`📊 نتيجة اختبار الطالب

📚 البرنامج: ${programName}
📖 الصف: ${gradeName}
📖 الوحدة: ${unitName}
📝 الدرس: ${lessonName}

👤 الاسم: ${name}

🏆 الدرجة: ${score} من ${total}

📈 النسبة: ${percent}%

🕐 التاريخ:
${new Date().toLocaleString('ar-EG')}

👨‍🏫 إعداد:
المهندس / أشرف موسى`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(message).then(() => alert('✅ تم نسخ النتيجة بنجاح!')).catch(() => fallbackCopy(message));
    } else { fallbackCopy(message); }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try { document.execCommand('copy'); alert('✅ تم نسخ النتيجة بنجاح!'); } catch (err) { alert('❌ حدث خطأ أثناء النسخ.'); }
    document.body.removeChild(textarea);
}

// ============================================================
// دالة عرض الامتحان كامل
// ============================================================
function showExamPaper() {
    const grade = document.getElementById('examSelect').value;
    const name = document.getElementById('studentName').value.trim() || 'الطالب';
    if (!grade) { alert('⚠️ من فضلك اختر الامتحان أولاً'); return; }
    let unit = 'الوحدة الأولى';
    let lesson = 'الدرس الأول';
    if (grade === 'prep2_exam') { lesson = 'الامتحان'; }
    let questions;
    try { questions = questionsData[grade].units[unit].lessons[lesson]; } catch (e) { alert('⚠️ لا توجد أسئلة لهذا الامتحان'); return; }
    if (!questions || questions.length === 0) { alert('⚠️ لا توجد أسئلة'); return; }
    const win = window.open('', '_blank');
    win.document.write('<html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>الامتحان</title><style>body{font-family:Arial;padding:20px;max-width:800px;margin:auto;line-height:1.8;}h1{text-align:center;color:#667eea;}.q{margin:15px 0;padding:10px;border-bottom:1px solid #eee;}.options{margin-right:20px;}</style></head><body>');
    win.document.write('<h1>📝 الامتحان</h1>');
    win.document.write(`<p><strong>👤 اسم الطالب:</strong> _______________</p><hr>`);
    questions.forEach((q, i) => {
        win.document.write(`<div class="q"><strong>${i+1}. ${q.question}</strong><br>`);
        if (q.options && q.options.length > 0) {
            win.document.write('<div class="options">');
            q.options.forEach(opt => { win.document.write(`<div>⬜ ${opt}</div>`); });
            win.document.write('</div>');
        }
        win.document.write('</div>');
    });
    win.document.write('<hr><p style="text-align:center;color:#888;">تم إنشاء هذا الامتحان بواسطة Science Quiz Pro</p>');
    win.document.write('</body></html>');
    win.document.close();
}

// ============================================================
// ✅ الدالة الجديدة: طباعة الأسئلة PDF
// ============================================================

function printQuestionsAsPDF() {
    const gradeSelect = document.getElementById('gradeSelect');
    const unitSelect = document.getElementById('unitSelect');
    const lessonSelect = document.getElementById('lessonSelect');
    const studentNameInput = document.getElementById('studentName');
    const student = studentNameInput.value.trim() || 'الطالب';
    const gradeText = gradeSelect ? gradeSelect.options[gradeSelect.selectedIndex]?.text || 'غير محدد' : 'غير محدد';
    const unitText = unitSelect ? unitSelect.options[unitSelect.selectedIndex]?.text || 'غير محدد' : 'غير محدد';
    const lessonText = lessonSelect ? lessonSelect.options[lessonSelect.selectedIndex]?.text || 'غير محدد' : 'غير محدد';

    const gradeVal = gradeSelect ? gradeSelect.value : '';
    const unitVal = unitSelect ? unitSelect.value : '';
    const lessonVal = lessonSelect ? lessonSelect.value : '';
    let questions = [];
    
    if (gradeVal && unitVal && lessonVal && questionsData[gradeVal] && questionsData[gradeVal].units[unitVal] && questionsData[gradeVal].units[unitVal].lessons[lessonVal]) {
        questions = questionsData[gradeVal].units[unitVal].lessons[lessonVal];
    } else {
        const examVal = document.getElementById('examSelect')?.value;
        if (examVal && typeof examQuestions !== 'undefined' && examQuestions[examVal]) {
            questions = examQuestions[examVal].questions || [];
        }
    }
    
    if (!questions || questions.length === 0) {
        alert('⚠️ لا توجد أسئلة للطباعة. يرجى اختيار صف/وحدة/درس أو امتحان.');
        return;
    }

    // ============================================================
    // ✅ تصنيف الأسئلة حسب النوع
    // ============================================================
    const groupedQuestions = {
        mcq: { title: '📝 اختر الإجابة الصحيحة', questions: [] },
        truefalse: { title: '📝 صح أم خطأ', questions: [] },
        concept: { title: '📝 أكمل العبارات', questions: [] },
        definition: { title: '📝 ما المقصود بـ', questions: [] },
        explain: { title: '📝 علّل', questions: [] },
        other: { title: '📝 أسئلة متنوعة', questions: [] }
    };

    questions.forEach(q => {
        if (q.type === 'mcq') {
            groupedQuestions.mcq.questions.push(q);
        } else if (q.type === 'truefalse') {
            groupedQuestions.truefalse.questions.push(q);
        } else if (q.type === 'concept') {
            groupedQuestions.concept.questions.push(q);
        } else if (q.type === 'definition') {
            groupedQuestions.definition.questions.push(q);
        } else if (q.type === 'explain') {
            groupedQuestions.explain.questions.push(q);
        } else {
            groupedQuestions.other.questions.push(q);
        }
    });

    // إزالة الأقسام الفارغة
    const sections = [];
    for (const key in groupedQuestions) {
        if (groupedQuestions[key].questions.length > 0) {
            sections.push(groupedQuestions[key]);
        }
    }

    if (sections.length === 0) {
        alert('⚠️ لا توجد أسئلة للطباعة.');
        return;
    }

    // ============================================================
    // ✅ بناء صفحة PDF
    // ============================================================
    const win = window.open('', '_blank');
    win.document.write(`<html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>أسئلة للطباعة</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            padding: 25px; 
            max-width: 900px; 
            margin: auto; 
            line-height: 2;
            background: #fff;
        }
        .header-info { 
            text-align: center; 
            margin-bottom: 20px; 
            border-bottom: 2px solid #667eea; 
            padding-bottom: 15px;
        }
        .header-info h1 { 
            color: #667eea; 
            font-size: 1.6em; 
            margin-bottom: 8px;
        }
        .header-info .student-name { 
            font-size: 1.3em; 
            font-weight: bold; 
            color: #2c3e50; 
            margin-bottom: 3px;
        }
        .header-info .details { 
            font-size: 1em; 
            color: #555;
        }
        .header-info .details span { 
            margin: 0 6px;
        }
        .section-title {
            font-size: 1.2em;
            font-weight: bold;
            color: #667eea;
            margin: 20px 0 10px 0;
            padding: 5px 10px;
            background: #f0f2ff;
            border-radius: 8px;
            border-right: 4px solid #667eea;
        }
        .question-block { 
            margin: 10px 0; 
            padding: 8px 15px; 
            border-bottom: 1px dashed #ddd;
            page-break-inside: avoid;
        }
        .question-block .q-text { 
            font-weight: bold; 
            font-size: 1.05em; 
        }
        .options-row { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 10px 25px; 
            padding-right: 20px;
            margin-top: 3px;
        }
        .options-row .opt { 
            font-size: 0.95em; 
            color: #333;
        }
        .answer-space {
            border-bottom: 1px solid #ccc;
            min-height: 35px;
            margin-top: 5px;
            margin-right: 20px;
        }
        .truefalse-brackets {
            display: inline-block;
            margin-left: 10px;
            font-size: 1.2em;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .footer { 
            text-align: center; 
            margin-top: 30px; 
            color: #888; 
            border-top: 1px solid #ccc; 
            padding-top: 15px; 
            font-size: 0.95em;
        }
        @media print { 
            body { padding: 12px; } 
            .question-block { page-break-inside: avoid; }
            .answer-space { border-bottom: 1px solid #000; }
            .section-title { background: #e8ebff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
    </style>
    </head><body>`);
    
    // ============================================================
    // ✅ رأس الصفحة
    // ============================================================
    win.document.write(`
        <div class="header-info">
            <h1>📝 أسئلة الاختبار</h1>
            <div class="student-name">👤 ${student}</div>
            <div class="details">
                📚 ${gradeText} 
                <span>|</span> 
                📖 ${unitText} 
                <span>|</span> 
                📝 ${lessonText}
            </div>
        </div>
    `);
    
    // ============================================================
    // ✅ عرض الأسئلة مجمعة حسب النوع
    // ============================================================
    let questionCounter = 1;
    
    sections.forEach(section => {
        // عنوان القسم (مرة واحدة)
        win.document.write(`<div class="section-title">${section.title}</div>`);
        
        section.questions.forEach(q => {
            win.document.write(`<div class="question-block">`);
            
            // ============================================================
            // معالجة كل نوع
            // ============================================================
            
            // 1️⃣ MCQ - اختيار من متعدد
            if (q.type === 'mcq') {
                win.document.write(`<div class="q-text">${questionCounter}. ${q.question}</div>`);
                if (q.options && q.options.length > 0) {
                    win.document.write(`<div class="options-row">`);
                    q.options.forEach((opt, idx) => {
                        win.document.write(`<div class="opt">${idx+1} - ${opt}</div>`);
                    });
                    win.document.write(`</div>`);
                }
            }
            
            // 2️⃣ True/False - صح/خطأ
            else if (q.type === 'truefalse') {
                win.document.write(`<div class="q-text">${questionCounter}. <span class="truefalse-brackets">( )</span> ${q.question}</div>`);
            }
            
            // 3️⃣ Concept - أكمل الفراغات
            else if (q.type === 'concept') {
                win.document.write(`<div class="q-text">${questionCounter}. ${q.question}</div>`);
            }
            
            // 4️⃣ Definition - ما المقصود بـ
            else if (q.type === 'definition') {
                win.document.write(`<div class="q-text">${questionCounter}. ${q.question}</div>`);
                win.document.write(`<div class="answer-space"></div>`);
            }
            
            // 5️⃣ Explain - علّل
            else if (q.type === 'explain') {
                win.document.write(`<div class="q-text">${questionCounter}. ${q.question}</div>`);
                win.document.write(`<div class="answer-space"></div>`);
            }
            
            // 6️⃣ أي نوع تاني
            else {
                win.document.write(`<div class="q-text">${questionCounter}. ${q.question}</div>`);
                if (q.options && q.options.length > 0) {
                    win.document.write(`<div class="options-row">`);
                    q.options.forEach((opt, idx) => {
                        win.document.write(`<div class="opt">${idx+1} - ${opt}</div>`);
                    });
                    win.document.write(`</div>`);
                } else {
                    win.document.write(`<div class="answer-space"></div>`);
                }
            }
            
            win.document.write(`</div>`);
            questionCounter++;
        });
    });
    
    // ============================================================
    // ✅ تذييل الصفحة
    // ============================================================
    win.document.write(`<div class="footer">👨‍🏫 إعداد: المهندس / أشرف موسى</div>`);
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
}

// ============================================================
// ====== باقي الكود الأصلي (نفسه من غير تغيير) ======
// ============================================================

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
    if (!name) { alert('⚠️ من فضلك أدخل اسم الطالب'); return; }
    if (!grade) { alert('⚠️ من فضلك اختر الصف'); return; }
    if (!unit) { alert('⚠️ من فضلك اختر الوحدة'); return; }
    if (!lesson) { alert('⚠️ من فضلك اختر الدرس'); return; }
    let questions;
    try { questions = questionsData[grade].units[unit].lessons[lesson]; } catch (e) { alert('⚠️ لا توجد أسئلة لهذا الدرس'); return; }
    if (!questions || questions.length === 0) { alert('⚠️ لا توجد أسئلة'); return; }
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

// ====== بدء الامتحان ======
document.getElementById('examStartBtn').addEventListener('click', function() {
    const name = document.getElementById('studentName').value.trim();
    const grade = document.getElementById('examSelect').value;
    if (!name) { alert('⚠️ من فضلك أدخل اسم الطالب'); return; }
    if (!grade) { alert('⚠️ من فضلك اختر الامتحان'); return; }
    let questions;
    try {
        if (typeof examQuestions === 'undefined') { alert('⚠️ ملف examQuestions.js لم يتم تحميله'); return; }
        const examData = examQuestions[grade];
        if (!examData) { alert('⚠️ لا توجد أسئلة لهذا الامتحان'); return; }
        questions = examData.questions;
    } catch (e) { alert('⚠️ حدث خطأ في تحميل الأسئلة'); return; }
    if (!questions || questions.length === 0) { alert('⚠️ لا توجد أسئلة'); return; }
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
    if (!question) return;
    document.getElementById('questionNumber').textContent = currentIndex + 1;
    document.getElementById('questionText').textContent = question.question || '';
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    if (question.type === 'explain' || question.type === 'definition' || question.type === 'concept') {
        const textarea = document.createElement('textarea');
        textarea.id = 'essayAnswer';
        textarea.placeholder = 'اكتب إجابتك هنا...';
        textarea.className = 'answer-input';
        textarea.rows = 5;
        textarea.style.cssText = 'width:100%;padding:15px;border:2px solid #ddd;border-radius:10px;font-size:16px;min-height:120px;resize:vertical;margin-bottom:15px;';
        container.appendChild(textarea);
        const checkBtn = document.createElement('button');
        checkBtn.textContent = '✅ تحقق من الإجابة';
        checkBtn.className = 'answer-btn';
        checkBtn.style.cssText = 'padding:12px 30px;background:#667eea;color:white;border:none;border-radius:10px;font-size:16px;font-weight:bold;cursor:pointer;width:100%;';
        checkBtn.onclick = function() { checkEssayAnswer(); };
        container.appendChild(checkBtn);
        const feedback = document.createElement('div');
        feedback.id = 'essayFeedback';
        feedback.style.cssText = 'margin-top:15px;padding:15px;border-radius:10px;font-size:16px;display:none;';
        container.appendChild(feedback);
        document.getElementById('nextBtn').style.display = 'none';
        return;
    }
    const options = question.options || [];
    options.forEach((option, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'answer-btn';
        button.textContent = option;
        button.dataset.index = index;
        button.onclick = function() { selectAnswer(index); };
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
        if (index === correctIndex) { btn.classList.add('correct'); }
        else if (index === selectedIndex && index !== correctIndex) { btn.classList.add('wrong'); }
    });
    if (selectedIndex === correctIndex) { score++; document.getElementById('liveScore').textContent = score; }
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
    let correctAnswers = question.options || question.answer || question.correct || [];
    if (!Array.isArray(correctAnswers)) { correctAnswers = [correctAnswers]; }
    function normalizeArabic(text) {
        return String(text).replace(/[\u064B-\u065F\u0670]/g, '').replace(/ـ/g, '').replace(/[أإآ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/[.,،؛:!?؟()"'\[\]{}]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
    }
    function similarity(text1, text2) {
        const a = normalizeArabic(text1);
        const b = normalizeArabic(text2);
        if (!a || !b) return 0;
        if (a === b) return 100;
        const matrix = [];
        for (let i = 0; i <= b.length; i++) { matrix[i] = [i]; }
        for (let j = 0; j <= a.length; j++) { matrix[0][j] = j; }
        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) { matrix[i][j] = matrix[i - 1][j - 1]; }
                else { matrix[i][j] = Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1); }
            }
        }
        const distance = matrix[b.length][a.length];
        const maxLength = Math.max(a.length, b.length);
        return Math.round((1 - distance / maxLength) * 100);
    }
    function wordSimilarity(studentAnswer, correctAnswer) {
        const studentWords = normalizeArabic(studentAnswer).split(' ').filter(Boolean);
        const correctWords = normalizeArabic(correctAnswer).split(' ').filter(Boolean);
        if (correctWords.length === 0) return 0;
        let matchedWords = 0;
        correctWords.forEach(correctWord => {
            const found = studentWords.some(studentWord => studentWord === correctWord);
            if (found) matchedWords++;
        });
        return Math.round((matchedWords / correctWords.length) * 100);
    }
    let bestSimilarity = 0, bestWordSimilarity = 0, bestAnswer = '';
    correctAnswers.forEach(correctAnswer => {
        const textSimilarity = similarity(userAnswer, correctAnswer);
        const wordsSimilarity = wordSimilarity(userAnswer, correctAnswer);
        if (textSimilarity > bestSimilarity) { bestSimilarity = textSimilarity; bestAnswer = correctAnswer; }
        if (wordsSimilarity > bestWordSimilarity) { bestWordSimilarity = wordsSimilarity; }
    });
    const isCorrect = bestSimilarity >= 50 || bestWordSimilarity >= 50;
    feedback.style.display = 'block';
    if (isCorrect) {
        feedback.style.background = '#d4edda';
        feedback.style.color = '#155724';
        feedback.innerHTML = `✅ <strong>إجابة صحيحة! أحسنت 🎉</strong><br><span style="font-size:14px;">نسبة تطابق إجابتك: <strong>${Math.max(bestSimilarity, bestWordSimilarity)}%</strong></span>`;
        score++;
        document.getElementById('liveScore').textContent = score;
    } else {
        feedback.style.background = '#f8d7da';
        feedback.style.color = '#721c24';
        feedback.innerHTML = `❌ <strong>إجابة غير صحيحة</strong><br><span style="font-size:14px;">نسبة التطابق: <strong>${Math.max(bestSimilarity, bestWordSimilarity)}%</strong><br>الحد الأدنى لقبول الإجابة: <strong>50%</strong></span><br><span style="font-size:14px;margin-top:10px;display:block;">💡 الإجابة النموذجية:</span><ul style="margin-top:5px;padding-right:20px;">${correctAnswers.map(ans => `<li style="font-size:14px;">${ans}</li>`).join('')}</ul>`;
    }
    textarea.disabled = true;
    const checkBtn = document.querySelector('.answer-btn');
    if (checkBtn) { checkBtn.disabled = true; }
    document.getElementById('nextBtn').style.display = 'block';
}

// ====== الانتقال للسؤال التالي ======
document.getElementById('nextBtn').addEventListener('click', function() {
    currentIndex++;
    if (currentIndex < totalQuestions) { showQuestion(); }
    else { showResult(); }
});

// ====== عرض النتيجة ======
function showResult() {
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'block';
    const percent = Math.round((score / totalQuestions) * 100);
    let gradeText = '', emoji = '';
    if (percent >= 90) { gradeText = 'ممتاز'; emoji = '🌟'; }
    else if (percent >= 75) { gradeText = 'جيد جداً'; emoji = '👍'; }
    else if (percent >= 50) { gradeText = 'جيد'; emoji = '📚'; }
    else { gradeText = 'تحتاج للمزيد من المذاكرة'; emoji = '💪'; }
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

// ============================================================
// ✅ ربط زر الطباعة بالدالة الجديدة
// ============================================================
document.getElementById('printPdfBtn').addEventListener('click', printQuestionsAsPDF);