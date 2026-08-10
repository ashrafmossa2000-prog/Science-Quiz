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
    
    // تفريغ القوائم
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
    
    if (grade && unit && questionsData[grade].units[unit]) {
        const lessons = Object.keys(questionsData[grade].units[unit].lessons);
        lessons.forEach(lesson => {
            const option = document.createElement('option');
            option.value = lesson;
            option.textContent = lesson;
            lessonSelect.appendChild(option);
        });
    }
});

// ====== بدء الاختبار ======
document.getElementById('startBtn').addEventListener('click', function() {
    const grade = document.getElementById('gradeSelect').value;
    const unit = document.getElementById('unitSelect').value;
    const lesson = document.getElementById('lessonSelect').value;
    studentName = document.getElementById('studentName').value.trim();
    
    // التحقق من الإدخالات
    if (!studentName) {
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
    
    // جلب الأسئلة
    currentQuestions = questionsData[grade].units[unit].lessons[lesson];
    
    if (!currentQuestions || currentQuestions.length === 0) {
        alert('⚠️ لا توجد أسئلة لهذا الدرس');
        return;
    }
    
    // بدء الاختبار
    currentIndex = 0;
    score = 0;
    totalQuestions = currentQuestions.length;
    
    // إظهار شاشة الاختبار
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'block';
    document.getElementById('resultScreen').style.display = 'none';
    
    // تحديث معلومات الطالب
    document.getElementById('studentLabel').textContent = studentName;
    document.getElementById('questionCount').textContent = totalQuestions;
    document.getElementById('liveScore').textContent = score;
    
    // عرض السؤال الأول
    showQuestion();
});

// ====== عرض السؤال ======
function showQuestion() {
    const question = currentQuestions[currentIndex];
    
    // تحديث رقم السؤال
    document.getElementById('questionNumber').textContent = currentIndex + 1;
    
    // عرض نص السؤال
    document.getElementById('questionText').textContent = question.question;
    
    // عرض الخيارات
    const container = document.getElementById('answersContainer');
    container.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.className = 'answer-btn';
        button.dataset.index = index;
        button.onclick = () => selectAnswer(index);
        container.appendChild(button);
    });
    
    // تحديث شريط التقدم
    const progress = (currentIndex / totalQuestions) * 100;
    document.getElementById('progressBar').style.width = progress + '%';
    
    // إخفاء زر التالي
    document.getElementById('nextBtn').style.display = 'none';
}

// ====== اختيار إجابة ======
function selectAnswer(selectedIndex) {
    const question = currentQuestions[currentIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    
    // تعطيل جميع الأزرار
    buttons.forEach(btn => btn.disabled = true);
    
    // تلوين الإجابات
    buttons.forEach((btn, index) => {
        if (index === question.correct) {
            btn.classList.add('correct');
        } else if (index === selectedIndex && index !== question.correct) {
            btn.classList.add('wrong');
        }
    });
    
    // حساب الدرجة
    if (selectedIndex === question.correct) {
        score++;
        document.getElementById('liveScore').textContent = score;
    }
    
    // إظهار زر التالي
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
    
    // تقييم الطالب
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
    // إعادة ضبط كل شيء
    document.getElementById('resultScreen').style.display = 'none';
    document.getElementById('startScreen').style.display = 'block';
    document.getElementById('studentName').value = '';
    document.getElementById('gradeSelect').value = '';
    document.getElementById('unitSelect').innerHTML = '<option value="">-- اختر الوحدة --</option>';
    document.getElementById('lessonSelect').innerHTML = '<option value="">-- اختر الدرس --</option>';
    document.getElementById('liveScore').textContent = '0';
    document.getElementById('progressBar').style.width = '0%';
});