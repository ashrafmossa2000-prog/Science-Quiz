/* ============================================================
   نظام الدخول والحماية
   ============================================================ */

const validCodes = {
    "AAA001": "اشرف موسى",
    "AAA002": "ايه اشرف",
    "AAA003": "اياد اشرف",
    "AAA004": "اروى اشرف",
    "AAA006": "سلمى عمرو",
    "AAA007": "بتول محمد",
    "AAA005": "الاء اشرف",
    "AAA008": "رنا محمد",
    "AAA010": "فاطمة حسن",
    "AAA011": "عمر خالد",
    "AAA012": "زينب عبدالله",
    "AAA013": "خديجة رجب",
    "AAA014": "محمد سعيد",
    "AAA015": "نورا إبراهيم",
    "AAA016": "علياء مصطفى",
    "AAA017": "حسن يوسف",
    "AAA018": "منى سامي",
    "AAA019": "كريم طارق",
    "AAA020": "ليلى عمرو",
    "AAA021": "محمود فتحي",
    "AAA022": "سارة حسين",
    "AAA023": "إسلام شعبان",
    "AAA024": "هدى سليمان",
    "AAA025": "أحمد رضا"
};

const REPORT_PAGE_URL = 'https://ashrafmossa2000-prog.github.io/All-subjects-test/report.html';

// عناصر شاشة الدخول
const loginScreen = document.getElementById('loginScreen');
const startScreen = document.getElementById('startScreen');
const loginBtn = document.getElementById('loginBtn');
const loginStudentName = document.getElementById('loginStudentName');
const loginStudentPhone = document.getElementById('loginStudentPhone');
const loginCode = document.getElementById('loginCode');
const loginError = document.getElementById('loginError');

let studentPhoneNumber = '';
let currentSubject = 'science';

/* ============================================================
   استرجاع البيانات المحفوظة
   ============================================================ */
document.addEventListener('DOMContentLoaded', function() {
    const savedPhone = localStorage.getItem('studentPhone');
    const savedName = localStorage.getItem('studentName');
    
    if (savedPhone) {
        studentPhoneNumber = savedPhone;
        if (loginStudentPhone) loginStudentPhone.value = savedPhone;
    }
    
    if (savedName && loginStudentName) {
        loginStudentName.value = savedName;
    }
    
    const resultScreen = document.getElementById('resultScreen');
    if (resultScreen) {
        let clickCount = 0;
        let clickTimer = null;
        
        resultScreen.addEventListener('click', function(e) {
            if (e.target.tagName === 'BUTTON') return;
            clickCount++;
            if (clickTimer) clearTimeout(clickTimer);
            clickTimer = setTimeout(() => { clickCount = 0; }, 1000);
            
            if (clickCount >= 5) {
                clickCount = 0;
                const teacherActions = document.getElementById('teacherActions');
                if (teacherActions) {
                    if (teacherActions.style.display === 'none' || teacherActions.style.display === '') {
                        teacherActions.style.display = 'block';
                        teacherActions.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        teacherActions.style.display = 'none';
                    }
                }
            }
        });
    }
});

/* ============================================================
   تسجيل الدخول
   ============================================================ */
loginBtn.addEventListener('click', function() {
    const name = loginStudentName.value.trim();
    const phone = loginStudentPhone.value.trim().replace(/[^0-9]/g, '');
    const code = loginCode.value.trim().toUpperCase();

    if (phone.length < 10) {
        loginError.style.display = 'block';
        loginError.textContent = "❌ رقم الواتساب غير صحيح. يجب أن يحتوي على رمز الدولة (مثال: 201012345678)";
        return;
    }

    if (validCodes[code] && validCodes[code] === name) {
        loginError.style.display = 'none';
        loginScreen.style.display = 'none';
        startScreen.style.display = 'flex';
        
        studentPhoneNumber = phone;
        localStorage.setItem('studentPhone', phone);
        localStorage.setItem('studentName', name);
        
        document.getElementById('welcomeName').textContent = name;
        document.getElementById('studentName').value = name;
        document.getElementById('studentLabel').textContent = name;
        document.getElementById('resultName').textContent = name;
    } else {
        loginError.style.display = 'block';
        loginError.textContent = "❌ كود الدخول أو الاسم غير صحيح، حاول مرة أخرى.";
    }
});

/* =============================================
   المتغيرات العامة
   ============================================= */
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let studentName = '';
let totalQuestions = 0;
let wrongQuestions = [];
let studentAnswers = [];
let examStartTime = null;
let examEndTime = null;

/* ============================================================
   التعامل مع قائمة المواد المنسدلة
   ============================================================ */
const subjectSelect = document.getElementById('subjectSelect');

if (subjectSelect) {
    subjectSelect.addEventListener('change', function() {
        currentSubject = this.value;
        console.log('📚 تم اختيار المادة:', currentSubject);
        
        const unitSelect = document.getElementById('unitSelect');
        const lessonSelect = document.getElementById('lessonSelect');
        unitSelect.innerHTML = '<option value="">-- اختر الوحدة --</option>';
        lessonSelect.innerHTML = '<option value="">-- اختر الدرس --</option>';
        
        const gradeSelect = document.getElementById('gradeSelect');
        if (gradeSelect.value) {
            loadUnitsForSubject(currentSubject, gradeSelect.value);
        }
    });
}

function loadUnitsForSubject(subject, grade) {
    const unitSelect = document.getElementById('unitSelect');
    const lessonSelect = document.getElementById('lessonSelect');
    
    unitSelect.innerHTML = '<option value="">-- اختر الوحدة --</option>';
    lessonSelect.innerHTML = '<option value="">-- اختر الدرس --</option>';
    
    if (!questionsData[subject]) {
        console.warn('⚠️ لا توجد بيانات للمادة:', subject);
        return;
    }
    
    if (!questionsData[subject][grade]) {
        console.warn('⚠️ لا توجد بيانات للصف', grade, 'في مادة', subject);
        return;
    }
    
    const units = Object.keys(questionsData[subject][grade].units || {});
    units.forEach(unit => {
        const option = document.createElement('option');
        option.value = unit;
        option.textContent = unit;
        unitSelect.appendChild(option);
    });
}

document.getElementById('gradeSelect').addEventListener('change', function() {
    const grade = this.value;
    loadUnitsForSubject(currentSubject, grade);
});

document.getElementById('unitSelect').addEventListener('change', function() {
    const grade = document.getElementById('gradeSelect').value;
    const unit = this.value;
    const lessonSelect = document.getElementById('lessonSelect');
    lessonSelect.innerHTML = '<option value="">-- اختر الدرس --</option>';
    
    if (grade && unit && questionsData[currentSubject] && 
        questionsData[currentSubject][grade] && 
        questionsData[currentSubject][grade].units[unit]) {
        
        const lessons = Object.keys(questionsData[currentSubject][grade].units[unit].lessons || {});
        lessons.forEach(lesson => {
            const option = document.createElement('option');
            option.value = lesson;
            option.textContent = lesson;
            lessonSelect.appendChild(option);
        });
    }
});

/* ============================================================
   بدء الاختبار العادي
   ============================================================ */
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
    try {
        questions = questionsData[currentSubject][grade].units[unit].lessons[lesson];
    } catch (e) {
        alert('⚠️ لا توجد أسئلة لهذا الدرس في مادة ' + currentSubject);
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
    wrongQuestions = [];
    studentAnswers = [];
    
    examStartTime = new Date();
    examEndTime = null;
    
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'flex';
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('studentLabel').textContent = studentName;
    document.getElementById('questionCount').textContent = totalQuestions;
    document.getElementById('liveScore').textContent = score;
    showQuestion();
});

/* ============================================================
   بدء الامتحان
   ============================================================ */
document.getElementById('examStartBtn').addEventListener('click', function() {
    const name = document.getElementById('studentName').value.trim();
    const grade = document.getElementById('examSelect').value;
    
    if (!name) { alert('⚠️ من فضلك أدخل اسم الطالب'); return; }
    if (!grade) { alert('⚠️ من فضلك اختر الامتحان'); return; }
    
    let questions;
    try {
        if (typeof examQuestions === 'undefined') {
            alert('⚠️ ملف examQuestions.js لم يتم تحميله');
            return;
        }
        const examData = examQuestions[grade];
        if (!examData) {
            alert('⚠️ لا توجد أسئلة لهذا الامتحان');
            return;
        }
        questions = examData.questions;
    } catch (e) {
        alert('⚠️ حدث خطأ في تحميل الأسئلة');
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
    wrongQuestions = [];
    studentAnswers = [];
    
    examStartTime = new Date();
    examEndTime = null;
    
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'flex';
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('studentLabel').textContent = studentName;
    document.getElementById('questionCount').textContent = totalQuestions;
    document.getElementById('liveScore').textContent = score;
    showQuestion();
});

/* ============================================================
   عرض السؤال
   ============================================================ */
function showQuestion() {
    const question = currentQuestions[currentIndex];
    if (!question) return;
    
    document.getElementById('questionNumber').textContent = currentIndex + 1;
    document.getElementById('questionText').textContent = question.question || '';
    
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    const nextBtn = document.getElementById('nextBtn');
    nextBtn.style.display = 'none';
    
    if (question.type === 'explain' || question.type === 'definition' || question.type === 'concept') {
        const textarea = document.createElement('textarea');
        textarea.id = 'essayAnswer';
        textarea.placeholder = 'اكتب إجابتك هنا...';
        textarea.rows = 5;
        container.appendChild(textarea);
        nextBtn.style.display = 'block';
        nextBtn.textContent = '➡️ السؤال التالي';
        
        const progress = totalQuestions > 0 ? (currentIndex / totalQuestions) * 100 : 0;
        document.getElementById('progressBar').style.width = progress + '%';
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
}

/* ============================================================
   اختيار إجابة
   ============================================================ */
function selectAnswer(selectedIndex) {
    const question = currentQuestions[currentIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons.forEach(btn => btn.disabled = true);
    buttons.forEach((btn, index) => {
        if (index === selectedIndex) {
            btn.classList.add('selected');
        }
    });
    
    const selectedAnswer = question.options ? question.options[selectedIndex] : '';
    studentAnswers.push({
        questionIndex: currentIndex,
        answer: selectedAnswer,
        selectedIndex: selectedIndex
    });
    
    document.getElementById('nextBtn').style.display = 'block';
}

/* ============================================================
   الانتقال للسؤال التالي
   ============================================================ */
document.getElementById('nextBtn').addEventListener('click', function() {
    const question = currentQuestions[currentIndex];
    
    if (question && (question.type === 'explain' || question.type === 'definition' || question.type === 'concept')) {
        const textarea = document.getElementById('essayAnswer');
        if (textarea) {
            studentAnswers.push({
                questionIndex: currentIndex,
                answer: textarea.value.trim() || 'لم يجب'
            });
        }
    }
    
    currentIndex++;
    if (currentIndex < totalQuestions) { 
        showQuestion(); 
    } else { 
        showResult(); 
    }
});

/* ============================================================
   عرض النتيجة
   ============================================================ */
function showResult() {
    examEndTime = new Date();
    score = 0;
    wrongQuestions = [];
    
    currentQuestions.forEach((question, index) => {
        const studentAnswer = studentAnswers.find(a => a.questionIndex === index);
        
        if (question.type === 'explain' || question.type === 'definition' || question.type === 'concept') {
            const userAnswer = studentAnswer ? studentAnswer.answer : 'لم يجب';
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
            
            let bestSimilarity = 0, bestWordSimilarity = 0;
            correctAnswers.forEach(correctAnswer => {
                const textSimilarity = similarity(userAnswer, correctAnswer);
                const wordsSimilarity = wordSimilarity(userAnswer, correctAnswer);
                if (textSimilarity > bestSimilarity) bestSimilarity = textSimilarity;
                if (wordsSimilarity > bestWordSimilarity) bestWordSimilarity = wordsSimilarity;
            });
            
            const isCorrect = bestSimilarity >= 50 || bestWordSimilarity >= 50;
            
            if (isCorrect) {
                score++;
            } else {
                wrongQuestions.push({
                    question: question.question,
                    type: question.type,
                    studentAnswer: userAnswer,
                    correctAnswer: correctAnswers.join(' | '),
                    isEssay: true
                });
            }
        } else {
            const selectedIndex = studentAnswer ? studentAnswer.selectedIndex : -1;
            const correctIndex = question.correct;
            
            if (selectedIndex === correctIndex) {
                score++;
            } else {
                wrongQuestions.push({
                    question: question.question,
                    type: question.type,
                    studentAnswer: question.options ? (question.options[selectedIndex] || 'لم يجب') : 'لم يجب',
                    correctAnswer: question.options ? question.options[correctIndex] : '',
                    correctIndex: correctIndex,
                    selectedIndex: selectedIndex,
                    allOptions: question.options || []
                });
            }
        }
    });
    
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultScreen').style.display = 'flex';
    
    const percent = Math.round((score / totalQuestions) * 100);
    let gradeText = '', emoji = '';
    if (percent >= 90) { gradeText = 'ممتاز'; emoji = '🌟'; }
    else if (percent >= 75) { gradeText = 'جيد جداً'; emoji = '👍'; }
    else if (percent >= 50) { gradeText = 'جيد'; emoji = '📚'; }
    else { gradeText = 'تحتاج للمزيد من المذاكرة'; emoji = '💪'; }
    
    const elapsedTime = getElapsedTime();
    
    document.getElementById('resultName').textContent = studentName;
    document.getElementById('resultScore').textContent = `${score} من ${totalQuestions}`;
    document.getElementById('resultPercent').textContent = `${percent}%`;
    document.getElementById('resultTime').textContent = elapsedTime;
    document.getElementById('resultGrade').textContent = `${emoji} ${gradeText}`;
    
    const teacherActions = document.getElementById('teacherActions');
    if (teacherActions) {
        teacherActions.style.display = 'none';
    }
}

/* ============================================================
   إعادة الاختبار
   ============================================================ */
document.getElementById('restartBtn').addEventListener('click', function() {
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'flex';
    document.getElementById('gradeSelect').value = '';
    document.getElementById('unitSelect').innerHTML = '<option value="">-- اختر الوحدة --</option>';
    document.getElementById('lessonSelect').innerHTML = '<option value="">-- اختر الدرس --</option>';
    document.getElementById('liveScore').textContent = '0';
    document.getElementById('progressBar').style.width = '0%';
    wrongQuestions = [];
    studentAnswers = [];
    examStartTime = null;
    examEndTime = null;
});

/* ============================================================
   ربط زر الطباعة
   ============================================================ */
document.getElementById('printPdfBtn').addEventListener('click', printQuestionsAsPDF);

/* ============================================================
   دالة الحصول على معلومات الوحدة والدرس
   ============================================================ */
function getUnitAndLessonInfo() {
    const gradeSelect = document.getElementById('gradeSelect');
    const unitSelect = document.getElementById('unitSelect');
    const lessonSelect = document.getElementById('lessonSelect');
    
    let gradeName = gradeSelect ? gradeSelect.options[gradeSelect.selectedIndex]?.text || 'غير محدد' : 'غير محدد';
    let unitName = unitSelect ? unitSelect.options[unitSelect.selectedIndex]?.text || 'غير محدد' : 'غير محدد';
    let lessonName = lessonSelect ? lessonSelect.options[lessonSelect.selectedIndex]?.text || 'غير محدد' : 'غير محدد';
    
    const subjectNames = {
        science: 'العلوم',
        arabic: 'اللغة العربية',
        math: 'الرياضيات',
        social: 'الدراسات الاجتماعية',
        english: 'اللغة الإنجليزية'
    };
    let subjectName = subjectNames[currentSubject] || currentSubject;
    
    return { gradeName, unitName, lessonName, subjectName };
}

/* ============================================================
   دالة حساب الوقت المستغرق
   ============================================================ */
function getElapsedTime() {
    if (!examStartTime || !examEndTime) return 'غير محدد';
    
    const diffMs = examEndTime - examStartTime;
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    let result = '';
    if (hours > 0) result += `${hours} ساعة `;
    if (minutes > 0) result += `${minutes} دقيقة `;
    result += `${seconds} ثانية`;
    
    return result.trim();
}

/* ============================================================
   دالة حساب النتيجة الصحيحة
   ============================================================ */
function getCorrectScore() {
    const total = currentQuestions && Array.isArray(currentQuestions) ? currentQuestions.length : 0;
    const wrongCount = wrongQuestions.length;
    const correctCount = total - wrongCount;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    
    return {
        total: total,
        correct: correctCount,
        wrong: wrongCount,
        percent: percent
    };
}

/* ============================================================
   ✅ دالة بناء رابط التقرير
   ============================================================ */
function buildReportUrl() {
    const name = studentName || 'طالب';
    const result = getCorrectScore();
    const { gradeName, unitName, lessonName, subjectName } = getUnitAndLessonInfo();
    const elapsedTime = getElapsedTime();

    // ✅ استخدام localStorage مباشرة لضمان الحصول على الرقم
    const savedPhone = localStorage.getItem('studentPhone') || studentPhoneNumber || '';

    // ✅ عدد الأخطاء المرسلة في الرابط
    const MAX_WRONG_IN_URL = 25;
    const wrongForUrl = wrongQuestions.slice(0, MAX_WRONG_IN_URL);

    const reportData = {
        student: name,
        phone: savedPhone,
        subject: subjectName,
        grade: gradeName,
        unit: unitName,
        lesson: lessonName,
        score: result.correct,
        total: result.total,
        percent: result.percent,
        time: elapsedTime,
        date: new Date().toLocaleString('ar-EG'),
        totalWrong: wrongQuestions.length,
        wrongQuestions: wrongForUrl.map(q => ({
            question: String(q.question || '').substring(0, 100),
            studentAnswer: String(q.studentAnswer || '').substring(0, 50),
            correctAnswer: String(q.correctAnswer || '').substring(0, 50),
            isEssay: q.isEssay || false
        }))
    };

    let encodedData = '';
    try {
        if (typeof LZString !== 'undefined') {
            encodedData = LZString.compressToEncodedURIComponent(JSON.stringify(reportData));
        } else {
            encodedData = encodeURIComponent(btoa(unescape(encodeURIComponent(JSON.stringify(reportData)))));
        }
    } catch (e) {
        console.error('❌ خطأ في تشفير البيانات:', e);
        encodedData = '';
    }

    const reportUrl = REPORT_PAGE_URL + '?data=' + encodedData;

    console.log('🔗 طول رابط التقرير:', reportUrl.length, '| عدد الأخطاء الكلي:', wrongQuestions.length, '| عدد الأخطاء في الرابط:', wrongForUrl.length);
    console.log('📱 رقم الطالب المحفوظ:', savedPhone);

    return { reportUrl, encodedData, reportData };
}

/* ============================================================
   إرسال النتيجة (مع ضغط البيانات)
   ============================================================ */
function sendAnswers() {
    const name = studentName || 'طالب';
    const result = getCorrectScore();
    const programName = '🧪 Science Quiz Pro';
    const { gradeName, unitName, lessonName, subjectName } = getUnitAndLessonInfo();
    const elapsedTime = getElapsedTime();

    // ✅ استخدام localStorage مباشرة لضمان الحصول على الرقم
    const savedPhone = localStorage.getItem('studentPhone') || studentPhoneNumber || 'غير محدد';

    const { reportUrl } = buildReportUrl();

    let message =
`📊 نتيجة اختبار الطالب

📚 البرنامج: ${programName}
📖 المادة: ${subjectName}
📖 الصف: ${gradeName}
📖 الوحدة: ${unitName}
📝 الدرس: ${lessonName}

👤 الاسم: ${name}
📱 رقم الواتساب: ${savedPhone}

🏆 الدرجة: ${result.correct} من ${result.total}
📈 النسبة: ${result.percent}%
⏱️ الوقت المستغرق: ${elapsedTime}

🕐 التاريخ:
${new Date().toLocaleString('ar-EG')}

━━━━━━━━━━━━━━━━━━━

📋 لعرض الأخطاء وإرسالها للطالب:

🔗 اضغط على الرابط التالي:
${reportUrl}

━━━━━━━━━━━━━━━━━━━

👨‍🏫 إعداد:
المهندس / أشرف موسى

📞 للتواصل:
01110547129 - 01100429783`;

    const teacherPhone = '201100429783';
    window.location.href = 'https://wa.me/' + teacherPhone + '?text=' + encodeURIComponent(message);
}

/* ============================================================
   إرسال الأخطاء للطالب
   ============================================================ */
function sendWrongQuestionsToStudent() {
    if (wrongQuestions.length === 0) {
        alert('🎉 لا توجد أخطاء لإرسالها! أحسنت!');
        return;
    }

    // ✅ استخدام localStorage مباشرة
    const savedPhone = localStorage.getItem('studentPhone') || studentPhoneNumber;
    
    if (!savedPhone || savedPhone.length < 10) {
        alert('❌ لم يتم العثور على رقم الطالب.\n\nتأكد من إدخال رقم الواتساب عند تسجيل الدخول.');
        return;
    }

    const name = studentName || 'طالب';
    const result = getCorrectScore();
    const { gradeName, unitName, lessonName, subjectName } = getUnitAndLessonInfo();
    const elapsedTime = getElapsedTime();

    let message = `📋 تصحيح الأخطاء

📖 المادة: ${subjectName}
📚 الصف: ${gradeName}
📖 الوحدة: ${unitName}
📝 الدرس: ${lessonName}

👤 الطالب: ${name}

🏆 الدرجة: ${result.correct} من ${result.total}
⏱️ الوقت المستغرق: ${elapsedTime}

━━━━━━━━━━━━━━━━━━━

❌ الأخطاء وتصحيحها:

`;

    wrongQuestions.forEach((item, index) => {
        message += `سؤال ${index + 1}:\n`;
        message += `📝 ${item.question}\n\n`;
        
        if (item.isEssay) {
            message += `✏️ إجابتك: ${item.studentAnswer}\n`;
            message += `✅ الإجابة الصحيحة: ${item.correctAnswer}\n`;
        } else {
            message += `❌ إجابتك (خطأ): ${item.studentAnswer}\n`;
            message += `✅ الإجابة الصحيحة: ${item.correctAnswer}\n`;
        }
        
        message += `\n━━━━━━━━━━━━━━━━━━━\n\n`;
    });

    message += `🕐 التاريخ:\n${new Date().toLocaleString('ar-EG')}\n\n`;
    message += `👨‍🏫 إعداد:\nالمهندس / أشرف موسى\n\n`;
    message += `📞 للتواصل:\n01110547129 - 01100429783`;

    window.location.href = 'https://wa.me/' + savedPhone + '?text=' + encodeURIComponent(message);
    
    alert('✅ تم فتح واتساب لإرسال الأخطاء للطالب على الرقم: ' + savedPhone);
}

/* ============================================================
   إرسال التقرير الكامل للمعلم
   ============================================================ */
function sendFullReportToTeacher() {
    const name = studentName || 'طالب';
    const result = getCorrectScore();
    const { gradeName, unitName, lessonName, subjectName } = getUnitAndLessonInfo();
    const elapsedTime = getElapsedTime();

    // ✅ استخدام localStorage مباشرة
    const savedPhone = localStorage.getItem('studentPhone') || studentPhoneNumber || 'غير محدد';

    let message = `📋 تقرير مفصل للاختبار

📖 المادة: ${subjectName}
📚 الصف: ${gradeName}
📖 الوحدة: ${unitName}
📝 الدرس: ${lessonName}

👤 اسم الطالب: ${name}
📱 رقم الواتساب: ${savedPhone}

━━━━━━━━━━━━━━━━━━━

📊 الإحصائيات:
✅ إجابات صحيحة: ${result.correct}
❌ إجابات خاطئة: ${result.wrong}
🏆 الدرجة: ${result.correct} من ${result.total}
📈 النسبة: ${result.percent}%
⏱️ الوقت المستغرق: ${elapsedTime}

━━━━━━━━━━━━━━━━━━━

`;

    if (wrongQuestions.length > 0) {
        message += `❌ الأسئلة الخاطئة:\n\n`;
        
        wrongQuestions.forEach((item, index) => {
            message += `🔴 سؤال ${index + 1}:\n`;
            message += `📝 ${item.question}\n\n`;
            
            if (item.isEssay) {
                message += `✏️ إجابة الطالب: ${item.studentAnswer}\n`;
                message += `✅ الإجابة الصحيحة: ${item.correctAnswer}\n`;
            } else {
                message += `✏️ إجابة الطالب (خطأ): ${item.studentAnswer}\n`;
                message += `✅ الإجابة الصحيحة: ${item.correctAnswer}\n`;
            }
            
            message += `\n━━━━━━━━━━━━━━━━━━━\n\n`;
        });
    } else {
        message += `🎉 ممتاز! لا توجد أخطاء\n\n`;
    }

    message += `🕐 التاريخ:\n${new Date().toLocaleString('ar-EG')}\n\n`;
    message += `👨‍🏫 إعداد:\nالمهندس / أشرف موسى\n\n`;
    message += `📞 للتواصل:\n01110547129 - 01100429783`;

    const teacherPhone = '201100429783';
    window.location.href = 'https://wa.me/' + teacherPhone + '?text=' + encodeURIComponent(message);
}

/* ============================================================
   نسخ النتيجة
   ============================================================ */
function copyResult() {
    const name = studentName || 'طالب';
    const result = getCorrectScore();
    const programName = '🧪 Science Quiz Pro';
    const { gradeName, unitName, lessonName, subjectName } = getUnitAndLessonInfo();
    const elapsedTime = getElapsedTime();
    
    const message =
`📊 نتيجة اختبار الطالب

📚 البرنامج: ${programName}
📖 المادة: ${subjectName}
📖 الصف: ${gradeName}
📖 الوحدة: ${unitName}
📝 الدرس: ${lessonName}

👤 الاسم: ${name}

🏆 الدرجة: ${result.correct} من ${result.total}
📈 النسبة: ${result.percent}%
⏱️ الوقت المستغرق: ${elapsedTime}

🕐 التاريخ:
${new Date().toLocaleString('ar-EG')}

👨‍🏫 إعداد:
المهندس / أشرف موسى

📞 للتواصل:
01110547129 - 01100429783`;
    
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

/* ============================================================
   عرض الامتحان كامل
   ============================================================ */
function showExamPaper() {
    const grade = document.getElementById('examSelect').value;
    const name = document.getElementById('studentName').value.trim() || 'الطالب';
    if (!grade) { alert('⚠️ من فضلك اختر الامتحان أولاً'); return; }
    
    let unit = 'الوحدة الأولى';
    let lesson = 'الدرس الأول';
    if (grade === 'prep2_exam') { lesson = 'الامتحان'; }
    
    let questions;
    try { 
        questions = questionsData[currentSubject][grade].units[unit].lessons[lesson]; 
    } catch (e) { 
        alert('⚠️ لا توجد أسئلة لهذا الامتحان'); 
        return; 
    }
    
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

/* ============================================================
   طباعة الأسئلة PDF
   ============================================================ */
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
    
    if (gradeVal && unitVal && lessonVal && questionsData[currentSubject] && 
        questionsData[currentSubject][gradeVal] && 
        questionsData[currentSubject][gradeVal].units[unitVal] && 
        questionsData[currentSubject][gradeVal].units[unitVal].lessons[lessonVal]) {
        questions = questionsData[currentSubject][gradeVal].units[unitVal].lessons[lessonVal];
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

    const groupedQuestions = {
        mcq: { title: '📝 اختر الإجابة الصحيحة', questions: [] },
        truefalse: { title: '📝 صح أم خطأ', questions: [] },
        concept: { title: '📝 أكمل العبارات', questions: [] },
        definition: { title: '📝 ما المقصود بـ', questions: [] },
        explain: { title: '📝 علّل', questions: [] },
        other: { title: '📝 أسئلة متنوعة', questions: [] }
    };

    questions.forEach(q => {
        if (q.type === 'mcq') groupedQuestions.mcq.questions.push(q);
        else if (q.type === 'truefalse') groupedQuestions.truefalse.questions.push(q);
        else if (q.type === 'concept') groupedQuestions.concept.questions.push(q);
        else if (q.type === 'definition') groupedQuestions.definition.questions.push(q);
        else if (q.type === 'explain') groupedQuestions.explain.questions.push(q);
        else groupedQuestions.other.questions.push(q);
    });

    const sections = [];
    for (const key in groupedQuestions) {
        if (groupedQuestions[key].questions.length > 0) sections.push(groupedQuestions[key]);
    }

    if (sections.length === 0) { alert('⚠️ لا توجد أسئلة للطباعة.'); return; }

    const win = window.open('', '_blank');
    win.document.write(`<html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>أسئلة للطباعة</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 25px; max-width: 900px; margin: auto; line-height: 2; background: #fff; padding-bottom: 50px; }
        .print-footer { position: fixed; bottom: 0; left: 0; right: 0; background: #e8ebff; border-top: 2px solid #6366f1; text-align: center; padding: 10px 0; font-weight: bold; color: #333; font-size: 14px; z-index: 1000; }
        .header-info { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #6366f1; padding-bottom: 15px; }
        .header-info h1 { color: #6366f1; font-size: 1.6em; margin-bottom: 8px; }
        .header-info .student-name { font-size: 1.3em; font-weight: bold; color: #2c3e50; margin-bottom: 3px; }
        .header-info .details { font-size: 1em; color: #555; }
        .section-title { font-size: 1.2em; font-weight: bold; color: #6366f1; margin: 20px 0 10px 0; padding: 5px 10px; background: #f0f2ff; border-radius: 8px; border-right: 4px solid #6366f1; }
        .question-block { margin: 10px 0; padding: 8px 15px; border-bottom: 1px dashed #ddd; page-break-inside: avoid; }
        .question-block .q-text { font-weight: bold; font-size: 1.05em; }
        .options-row { display: flex; flex-wrap: wrap; gap: 10px 25px; padding-right: 20px; margin-top: 3px; }
        .options-row .opt { font-size: 0.95em; color: #333; }
        .answer-space { border-bottom: 1px solid #ccc; min-height: 35px; margin-top: 5px; margin-right: 20px; }
        .truefalse-brackets { display: inline-block; margin-left: 10px; font-size: 1.2em; font-weight: bold; letter-spacing: 3px; }
        @media print { body { padding: 12px; padding-bottom: 50px; } .question-block { page-break-inside: avoid; } .answer-space { border-bottom: 1px solid #000; } .section-title { background: #e8ebff !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    </style></head><body>`);
    
    win.document.write(`
        <div class="header-info">
            <h1>📝 أسئلة الاختبار</h1>
            <div class="student-name">👤 ${student}</div>
            <div class="details">📚 ${gradeText} | 📖 ${unitText} | 📝 ${lessonText}</div>
        </div>
    `);
    
    let questionCounter = 1;
    
    sections.forEach(section => {
        win.document.write(`<div class="section-title">${section.title}</div>`);
        
        section.questions.forEach(q => {
            win.document.write(`<div class="question-block">`);
            
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
            else if (q.type === 'truefalse') {
                win.document.write(`<div class="q-text">${questionCounter}. <span class="truefalse-brackets">( )</span> ${q.question}</div>`);
            }
            else if (q.type === 'concept') {
                win.document.write(`<div class="q-text">${questionCounter}. ${q.question}</div>`);
            }
            else if (q.type === 'definition' || q.type === 'explain') {
                win.document.write(`<div class="q-text">${questionCounter}. ${q.question}</div>`);
                win.document.write(`<div class="answer-space"></div>`);
            }
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
    
    win.document.write(`
        <div class="print-footer">
            إعداد المهندس/ اشرف موسى &nbsp;|&nbsp; 📞 01110547129 - 01100429783
        </div>
    `);
    
    win.document.write('</body></html>');
    win.document.close();
    win.focus();
    win.print();
}

/* ============================================================
   عرض الأسئلة الخاطئة
   ============================================================ */
function showWrongQuestions() {
    if (wrongQuestions.length === 0) {
        alert('🎉 لا توجد أخطاء! أحسنت!');
        return;
    }
    
    const result = getCorrectScore();
    const { subjectName } = getUnitAndLessonInfo();
    
    const win = window.open('', '_blank');
    win.document.write(`
        <html dir="rtl" lang="ar"><head><meta charset="UTF-8"><title>مراجعة الأخطاء</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, sans-serif; padding: 30px; max-width: 900px; margin: auto; line-height: 1.8; background: #f8f9fa; }
            h1 { text-align: center; color: #ef4444; margin-bottom: 10px; }
            .subtitle { text-align: center; color: #666; margin-bottom: 30px; font-size: 1.1em; }
            .summary-box { background: #fff; padding: 20px; border-radius: 12px; margin-bottom: 25px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); text-align: center; border-right: 5px solid #6366f1; }
            .summary-box p { font-size: 1.1em; margin: 5px 0; color: #333; }
            .summary-box strong { color: #6366f1; }
            .question-card { background: white; border-radius: 15px; padding: 25px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-right: 5px solid #ef4444; }
            .question-number { display: inline-block; background: #ef4444; color: white; padding: 3px 12px; border-radius: 20px; font-weight: bold; font-size: 0.9em; margin-bottom: 10px; }
            .question-text { font-size: 1.2em; font-weight: bold; color: #333; margin-bottom: 15px; }
            .answer-box { padding: 12px 18px; border-radius: 10px; margin: 10px 0; font-size: 1.05em; }
            .wrong-answer { background: #fef2f2; border: 2px solid #ef4444; color: #991b1b; }
            .correct-answer { background: #ecfdf5; border: 2px solid #10b981; color: #065f46; }
            .label { font-weight: bold; display: block; margin-bottom: 5px; }
            .footer { text-align: center; color: #888; margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; font-size: 0.95em; }
        </style></head><body>
        <h1>📋 مراجعة الأخطاء</h1>
        <div class="subtitle">👤 ${studentName} | 📖 ${subjectName}</div>
        <div class="summary-box">
            <p>🏆 الدرجة: <strong>${result.correct} من ${result.total}</strong></p>
            <p>📈 النسبة: <strong>${result.percent}%</strong></p>
            <p>❌ عدد الأخطاء: <strong>${wrongQuestions.length}</strong></p>
        </div>
    `);
    
    wrongQuestions.forEach((item, index) => {
        win.document.write(`
            <div class="question-card">
                <span class="question-number">السؤال ${index + 1}</span>
                <div class="question-text">${item.question}</div>
        `);
        
        if (item.isEssay) {
            win.document.write(`
                <div class="answer-box wrong-answer"><span class="label">❌ إجابتك:</span>${item.studentAnswer}</div>
                <div class="answer-box correct-answer"><span class="label">✅ الإجابة الصحيحة:</span>${item.correctAnswer}</div>
            `);
        } else {
            win.document.write(`
                <div class="answer-box wrong-answer"><span class="label">❌ إجابتك (خطأ):</span>${item.studentAnswer}</div>
                <div class="answer-box correct-answer"><span class="label">✅ الإجابة الصحيحة:</span>${item.correctAnswer}</div>
            `);
            
            if (item.allOptions && item.allOptions.length > 0) {
                win.document.write(`<div style="margin-top:15px;padding:10px;background:#f1f3f5;border-radius:8px;"><strong>📝 جميع الخيارات:</strong><ul style="margin-top:8px;padding-right:20px;">`);
                item.allOptions.forEach((opt, i) => {
                    let style = '';
                    if (i === item.correctIndex) style = 'color:#10b981;font-weight:bold;';
                    else if (i === item.selectedIndex) style = 'color:#ef4444;text-decoration:line-through;';
                    win.document.write(`<li style="${style}">${opt}</li>`);
                });
                win.document.write(`</ul></div>`);
            }
        }
        
        win.document.write(`</div>`);
    });
    
    win.document.write(`
        <div class="footer">👨‍🏫 إعداد: المهندس / أشرف موسى<br>📞 01110547129 - 01100429783</div>
        </body></html>
    `);
    win.document.close();
}

/* ============================================================
   إظهار أدوات المعلم بمفتاح سري (Ctrl + Shift + T)
   ============================================================ */
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.shiftKey && (e.key === 'T' || e.key === 't' || e.code === 'KeyT')) {
        e.preventDefault();
        const teacherActions = document.getElementById('teacherActions');
        if (teacherActions) {
            if (teacherActions.style.display === 'none' || teacherActions.style.display === '') {
                teacherActions.style.display = 'block';
                teacherActions.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                teacherActions.style.display = 'none';
            }
        }
    }
});