document.addEventListener('DOMContentLoaded', function() {
    // بيانات اللاعب
    const player = {
        level: 1,
        xp: 0,
        maxXp: 100,
        coins: 0,
        tasks: [],
        completedTasks: 0,
        inventory: [],
        settings: {
            theme: 'dark',
            notifications: true
        }
    };

    // المهام الافتراضية (كل مهمة 100 نقطة كما طلبت)
    const defaultTasks = [
        { id: 1, text: "إنهاء المشروع المطلوب", xp: 100, completed: false },
        { id: 2, text: "حل الواجبات الدراسية", xp: 100, completed: false },
        { id: 3, text: "التحضير للاجتماع المهم", xp: 100, completed: false }
    ];

    // المكافآت المتاحة
    const rewards = [
        { id: 1, name: "استراحة مميزة", icon: "fa-crown", cost: 200, description: "استراحة لمدة 30 دقيقة" },
        { id: 2, name: "وجبة لذيذة", icon: "fa-utensils", cost: 300, description: "استمتع بوجبة من اختيارك" },
        { id: 3, name: "جلسة ألعاب", icon: "fa-gamepad", cost: 400, description: "ساعة من وقت الألعاب" },
        { id: 4, name: "فيلم مسائي", icon: "fa-film", cost: 500, description: "شاهد فيلمك المفضل" },
        { id: 5, name: "خلفية مميزة", icon: "fa-image", cost: 600, description: "خلفية ذهبية للتطبيق" },
        { id: 6, name: "لقب مميز", icon: "fa-medal", cost: 800, description: "لقب يظهر بجانب اسمك" }
    ];

    // أذكار الصباح
    const morningAzkar = [
        {
            title: "آية الكرسي",
            content: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
            reference: "البقرة: 255",
            count: 1
        },
        {
            title: "المعوذات",
            content: "سورة الإخلاص (3 مرات)\nقُلْ هُوَ اللَّهُ أَحَدٌ\n\nسورة الفلق (3 مرات)\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ\n\nسورة الناس (3 مرات)\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ",
            count: 3
        },
        {
            title: "الدعاء العام",
            content: "أصبحنا وأصبح الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير. رب أسألك خير ما في هذا اليوم وخير ما بعده، وأعوذ بك من شر هذا اليوم وشر ما بعده، رب أعوذ بك من الكسل وسوء الكبر، رب أعوذ بك من عذاب في النار وعذاب في القبر.",
            count: 1
        },
        {
            title: "الدعاء بالغفران",
            content: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك عليّ، وأبوء بذنبي، فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.",
            count: 1
        },
        {
            title: "التوحيد والإقرار",
            content: "اللهم بك أصبحنا، وبك أمسينا، وبك نحيا، وبك نموت، وإليك النشور.",
            count: 3
        },
        {
            title: "التسبيح",
            content: "سبحان الله وبحمده، عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته.",
            count: 3
        },
        {
            title: "طلب العافية",
            content: "اللهم إني أسألك العافية في الدنيا والآخرة، اللهم إني أسألك العفو والعافية في ديني ودنياي، وأهلي ومالي، اللهم استر عوراتي، وآمن روعاتي، اللهم احفظني من بين يديّ، ومن خلفي، وعن يميني، وعن شمالي، ومن فوقي، وأعوذ بعظمتك أن أغتال من تحتي.",
            count: 3
        },
        {
            title: "الدعاء بالحفظ",
            content: "اللهم عالم الغيب والشهادة، فاطر السماوات والأرض، رب كل شيء ومليكه، أشهد أن لا إله إلا أنت، أعوذ بك من شر نفسي، ومن شر الشيطان وشركه، وأن أقترف على نفسي سوءًا أو أجره إلى مسلم.",
            count: 1
        },
        {
            title: "حسبي الله",
            content: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.",
            count: 7
        },
        {
            title: "بسم الله",
            content: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم.",
            count: 3
        },
        {
            title: "الرضا بالله",
            content: "رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد ﷺ نبيًا.",
            count: 3
        },
        {
            title: "الشهادة",
            content: "اللهم إني أصبحت أشهدك وأشهد حملة عرشك وملائكتك وجميع خلقك، أنك أنت الله لا إله إلا أنت، وحدك لا شريك لك، وأن محمدًا عبدك ورسولك.",
            count: 4
        },
        {
            title: "الحمد والشكر",
            content: "اللهم ما أصبح بي من نعمة أو بأحد من خلقك، فمنك وحدك لا شريك لك، فلك الحمد ولك الشكر.",
            count: 1
        },
        {
            title: "التكبير",
            content: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.",
            count: 100
        },
        {
            title: "الاستعاذة من الكفر والفقر",
            content: "اللهم إني أعوذ بك من الكفر والفقر، وأعوذ بك من عذاب القبر، لا إله إلا أنت.",
            count: 3
        },
        {
            title: "طلب العلم النافع",
            content: "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.",
            count: 1
        },
        {
            title: "الاستعاذة بكلمات الله",
            content: "أعوذ بكلمات الله التامات من شر ما خلق.",
            count: 3
        },
        {
            title: "يا حي يا قيوم",
            content: "يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله، ولا تكلني إلى نفسي طرفة عين.",
            count: 3
        },
        {
            title: "التسبيح المئة",
            content: "سبحان الله وبحمده.",
            count: 100
        },
        {
            title: "الصلاة على النبي",
            content: "اللهم صلِّ وسلم وبارك على نبينا محمد.",
            count: 10
        }
    ];

    // أذكار المساء
    const eveningAzkar = [
        {
            title: "آية الكرسي",
            content: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهُمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
            reference: "البقرة: 255",
            count: 1
        },
        {
            title: "المعوذات",
            content: "سورة الإخلاص (3 مرات)\nقُلْ هُوَ اللَّهُ أَحَدٌ\n\nسورة الفلق (3 مرات)\nقُلْ أَعُوذُ بِرَبِّ الْفَلَقِ\n\nسورة الناس (3 مرات)\nقُلْ أَعُوذُ بِرَبِّ النَّاسِ",
            count: 3
        },
        {
            title: "الدعاء العام",
            content: "أمسينا وأمسى الملك لله، والحمد لله، لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير. رب أسألك خير ما في هذه الليلة وخير ما بعدها، وأعوذ بك من شر هذه الليلة وشر ما بعدها، رب أعوذ بك من الكسل وسوء الكبر، رب أعوذ بك من عذاب في النار وعذاب في القبر.",
            count: 1
        },
        {
            title: "الدعاء بالغفران",
            content: "اللهم أنت ربي لا إله إلا أنت، خلقتني وأنا عبدك، وأنا على عهدك ووعدك ما استطعت، أعوذ بك من شر ما صنعت، أبوء لك بنعمتك عليّ، وأبوء بذنبي، فاغفر لي، فإنه لا يغفر الذنوب إلا أنت.",
            count: 1
        },
        {
            title: "التوحيد والإقرار",
            content: "اللهم بك أمسينا، وبك أصبحنا، وبك نحيا، وبك نموت، وإليك المصير.",
            count: 3
        },
        {
            title: "التسبيح",
            content: "سبحان الله وبحمده، عدد خلقه، ورضا نفسه، وزنة عرشه، ومداد كلماته.",
            count: 3
        },
        {
            title: "طلب العافية",
            content: "اللهم إني أسألك العافية في الدنيا والآخرة، اللهم إني أسألك العفو والعافية في ديني ودنياي، وأهلي ومالي، اللهم استر عوراتي، وآمن روعاتي، اللهم احفظني من بين يديّ، ومن خلفي، وعن يميني، وعن شمالي، ومن فوقي، وأعوذ بعظمتك أن أغتال من تحتي.",
            count: 3
        },
        {
            title: "الدعاء بالحفظ",
            content: "اللهم عالم الغيب والشهادة، فاطر السماوات والأرض، رب كل شيء ومليكه، أشهد أن لا إله إلا أنت، أعوذ بك من شر نفسي، ومن شر الشيطان وشركه، وأن أقترف على نفسي سوءًا أو أجره إلى مسلم.",
            count: 1
        },
        {
            title: "حسبي الله",
            content: "حسبي الله لا إله إلا هو عليه توكلت وهو رب العرش العظيم.",
            count: 7
        },
        {
            title: "بسم الله",
            content: "بسم الله الذي لا يضر مع اسمه شيء في الأرض ولا في السماء وهو السميع العليم.",
            count: 3
        },
        {
            title: "الرضا بالله",
            content: "رضيت بالله ربًا، وبالإسلام دينًا، وبمحمد ﷺ نبيًا.",
            count: 3
        },
        {
            title: "الشهادة",
            content: "اللهم إني أمسيت أشهدك وأشهد حملة عرشك وملائكتك وجميع خلقك، أنك أنت الله لا إله إلا أنت، وحدك لا شريك لك، وأن محمدًا عبدك ورسولك.",
            count: 4
        },
        {
            title: "الحمد والشكر",
            content: "اللهم ما أمسى بي من نعمة أو بأحد من خلقك، فمنك وحدك لا شريك لك، فلك الحمد ولك الشكر.",
            count: 1
        },
        {
            title: "التكبير",
            content: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير.",
            count: 100
        },
        {
            title: "الاستعاذة من الكفر والفقر",
            content: "اللهم إني أعوذ بك من الكفر والفقر، وأعوذ بك من عذاب القبر، لا إله إلا أنت.",
            count: 3
        },
        {
            title: "طلب العلم النافع",
            content: "اللهم إني أسألك علماً نافعاً، ورزقاً طيباً، وعملاً متقبلاً.",
            count: 1
        },
        {
            title: "الاستعاذة بكلمات الله",
            content: "أعوذ بكلمات الله التامات من شر ما خلق.",
            count: 3
        },
        {
            title: "يا حي يا قيوم",
            content: "يا حي يا قيوم برحمتك أستغيث، أصلح لي شأني كله، ولا تكلني إلى نفسي طرفة عين.",
            count: 3
        },
        {
            title: "التسبيح المئة",
            content: "سبحان الله وبحمده.",
            count: 100
        },
        {
            title: "الصلاة على النبي",
            content: "اللهم صلِّ وسلم وبارك على نبينا محمد.",
            count: 10
        }
    ];

    // عناصر DOM
    const taskList = document.getElementById('tasks-list');
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const playerLevel = document.getElementById('player-level');
    const playerXp = document.getElementById('player-xp');
    const maxXp = document.getElementById('max-xp');
    const playerCoins = document.getElementById('player-coins');
    const completedTasks = document.getElementById('completed-tasks');
    const xpProgress = document.getElementById('xp-progress');
    const tasksCount = document.getElementById('tasks-count');
    
    // عناصر المؤقت
    const timerModal = document.getElementById('timer-modal');
    const timerDisplay = document.getElementById('timer-display');
    const startTimerBtn = document.getElementById('start-timer');
    const resetTimerBtn = document.getElementById('reset-timer');
    const timerPresets = document.querySelectorAll('.preset-btn');
    
    // عناصر السبحة
    const tasbeehModal = document.getElementById('tasbeeh-modal');
    const tasbeehCount = document.getElementById('tasbeeh-count');
    const addTasbeehBtn = document.getElementById('add-tasbeeh');
    const resetTasbeehBtn = document.getElementById('reset-tasbeeh');
    const tasbeehTypes = document.querySelectorAll('.tasbeeh-type-btn');
    const currentDhikr = document.getElementById('current-dhikr');
    
    // عناصر الأذكار
    const azkarModal = document.getElementById('azkar-modal');
    const azkarTool = document.getElementById('azkar-tool');
    const morningAzkarList = document.getElementById('morning-azkar-list');
    const eveningAzkarList = document.getElementById('evening-azkar-list');
    const morningCheck = document.getElementById('morning-check');
    const eveningCheck = document.getElementById('evening-check');
    
    // عناصر الصلاة
    const prayerModal = document.getElementById('prayer-modal');
    const prayerTool = document.getElementById('prayer-tool');
    const fajrCheck = document.getElementById('fajr-check');
    const dhuhrCheck = document.getElementById('dhuhr-check');
    const asrCheck = document.getElementById('asr-check');
    const maghribCheck = document.getElementById('maghrib-check');
    const ishaCheck = document.getElementById('isha-check');
    const salahCheck = document.getElementById('salah-check');
    const prayerProgress = document.getElementById('prayer-progress');
    const prayerCount = document.getElementById('prayer-count');
    
    // الإشعارات
    const notification = document.getElementById('notification');
    
    // متغيرات المؤقت
    let timerInterval;
    let timerMinutes = 25;
    let timerSeconds = 0;
    let isTimerRunning = false;
    
    // متغيرات السبحة
    let dhikrCount = 0;
    let currentDhikrText = "سبحان الله";
    
    // تهيئة التطبيق
    function init() {
        loadPlayerData();
        renderTasks();
        updatePlayerStats();
        updateCurrentTime();
        setInterval(updateCurrentTime, 1000);
        requestNotificationPermission();
        
        // أحداث إضافة المهام
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
        
        // أحداث المؤقت
        timerTool.addEventListener('click', () => {
            timerModal.style.display = 'flex';
            updateTimerDisplay();
        });
        
        startTimerBtn.addEventListener('click', toggleTimer);
        resetTimerBtn.addEventListener('click', resetTimer);
        
        timerPresets.forEach(preset => {
            preset.addEventListener('click', () => {
                timerMinutes = parseInt(preset.dataset.minutes);
                timerSeconds = 0;
                updateTimerDisplay();
                if (isTimerRunning) {
                    resetTimer();
                    startTimer();
                }
            });
        });
        
        // أحداث السبحة
        tasbeehTool.addEventListener('click', () => {
            tasbeehModal.style.display = 'flex';
        });
        
        addTasbeehBtn.addEventListener('click', () => {
            dhikrCount++;
            tasbeehCount.textContent = dhikrCount;
            tasbeehCount.classList.add('pulse');
            setTimeout(() => tasbeehCount.classList.remove('pulse'), 500);
            
            // كسب 5 عملات لكل 10 تسبيحات
            if (dhikrCount % 10 === 0) {
                player.coins += 5;
                updatePlayerStats();
                showNotification(`تهانينا! كسبت 5 عملات لإكمال ${dhikrCount} تسبيحات`);
            }
        });
        
        resetTasbeehBtn.addEventListener('click', () => {
            dhikrCount = 0;
            tasbeehCount.textContent = dhikrCount;
        });
        
        tasbeehTypes.forEach(type => {
            type.addEventListener('click', () => {
                currentDhikrText = type.dataset.dhikr;
                currentDhikr.textContent = currentDhikrText;
                tasbeehTypes.forEach(t => t.classList.remove('active'));
                type.classList.add('active');
            });
        });
        
        // أحداث الأذكار
        azkarTool.addEventListener('click', () => {
            azkarModal.style.display = 'flex';
            renderAzkar();
        });
        
        // أحداث الصلاة
        prayerTool.addEventListener('click', () => {
            prayerModal.style.display = 'flex';
            updatePrayerStats();
        });
        
        // أحداث إغلاق النوافذ المنبثقة
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });
        
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });
        
        // تهيئة متتبع الصلوات
        setupPrayerTracker();
    }
    
    // تحميل بيانات اللاعب
    function loadPlayerData() {
        const savedPlayer = localStorage.getItem('eliteTaskPlayer');
        if (savedPlayer) {
            Object.assign(player, JSON.parse(savedPlayer));
        } else {
            player.tasks = [...defaultTasks];
            savePlayerData();
        }
    }
    
    // حفظ بيانات اللاعب
    function savePlayerData() {
        localStorage.setItem('eliteTaskPlayer', JSON.stringify(player));
    }
    
    // عرض المهام
    function renderTasks() {
        taskList.innerHTML = '';
        player.tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
                <span class="task-text">${task.text}</span>
                <span class="task-xp">+${task.xp} XP</span>
                <i class="fas fa-trash delete-task" data-id="${task.id}"></i>
            `;
            taskList.appendChild(taskItem);
        });
        
        // تحديث عدد المهام
        tasksCount.textContent = player.tasks.length;
        
        // إضافة الأحداث للمهام
        document.querySelectorAll('.task-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', toggleTask);
        });
        
        document.querySelectorAll('.delete-task').forEach(btn => {
            btn.addEventListener('click', deleteTask);
        });
    }
    
    // عرض الأذكار
    function renderAzkar() {
        morningAzkarList.innerHTML = '';
        eveningAzkarList.innerHTML = '';
        
        morningAzkar.forEach(zkr => {
            const zkrItem = document.createElement('div');
            zkrItem.className = 'azkar-item';
            zkrItem.innerHTML = `
                <h3>${zkr.title} (${zkr.count} مرة)</h3>
                <p>${zkr.content.replace(/\n/g, '<br>')}</p>
                ${zkr.reference ? `<div class="reference">${zkr.reference}</div>` : ''}
            `;
            morningAzkarList.appendChild(zkrItem);
        });
        
        eveningAzkar.forEach(zkr => {
            const zkrItem = document.createElement('div');
            zkrItem.className = 'azkar-item';
            zkrItem.innerHTML = `
                <h3>${zkr.title} (${zkr.count} مرة)</h3>
                <p>${zkr.content.replace(/\n/g, '<br>')}</p>
                ${zkr.reference ? `<div class="reference">${zkr.reference}</div>` : ''}
            `;
            eveningAzkarList.appendChild(zkrItem);
        });
        
        // تحميل حالة الأذكار
        const today = new Date().toDateString();
        morningCheck.checked = localStorage.getItem(`morningAzkar_${today}`) === 'true';
        eveningCheck.checked = localStorage.getItem(`eveningAzkar_${today}`) === 'true';
        
        // أحداث التغيير
        morningCheck.addEventListener('change', () => {
            localStorage.setItem(`morningAzkar_${today}`, morningCheck.checked);
            if (morningCheck.checked) {
                player.xp += 50;
                player.coins += 25;
                updatePlayerStats();
                showNotification('أحسنت! كسبت 50 XP و 25 عملة لإكمال أذكار الصباح');
            }
        });
        
        eveningCheck.addEventListener('change', () => {
            localStorage.setItem(`eveningAzkar_${today}`, eveningCheck.checked);
            if (eveningCheck.checked) {
                player.xp += 50;
                player.coins += 25;
                updatePlayerStats();
                showNotification('أحسنت! كسبت 50 XP و 25 عملة لإكمال أذكار المساء');
            }
        });
    }
    
    // تهيئة متتبع الصلوات
    function setupPrayerTracker() {
        const today = new Date().toDateString();
        
        // تحميل حالة الصلوات
        fajrCheck.checked = localStorage.getItem(`fajr_${today}`) === 'true';
        dhuhrCheck.checked = localStorage.getItem(`dhuhr_${today}`) === 'true';
        asrCheck.checked = localStorage.getItem(`asr_${today}`) === 'true';
        maghribCheck.checked = localStorage.getItem(`maghrib_${today}`) === 'true';
        ishaCheck.checked = localStorage.getItem(`isha_${today}`) === 'true';
        salahCheck.checked = localStorage.getItem(`salah_${today}`) === 'true';
        
        // أحداث التغيير
        fajrCheck.addEventListener('change', updatePrayerStatus);
        dhuhrCheck.addEventListener('change', updatePrayerStatus);
        asrCheck.addEventListener('change', updatePrayerStatus);
        maghribCheck.addEventListener('change', updatePrayerStatus);
        ishaCheck.addEventListener('change', updatePrayerStatus);
        salahCheck.addEventListener('change', updatePrayerStatus);
        
        function updatePrayerStatus(e) {
            const prayer = e.target.id.replace('-check', '');
            localStorage.setItem(`${prayer}_${today}`, e.target.checked);
            
            if (e.target.checked) {
                // مكافأة الصلاة
                if (prayer !== 'salah') {
                    player.xp += 100;
                    player.coins += 50;
                    showNotification(`أحسنت! كسبت 100 XP و 50 عملة لإكمال صلاة ${getPrayerName(prayer)}`);
                } else {
                    player.xp += 30;
                    player.coins += 15;
                    showNotification('أحسنت! كسبت 30 XP و 15 عملة للصلاة على النبي');
                }
                updatePlayerStats();
            }
            
            updatePrayerStats();
        }
        
        function getPrayerName(prayer) {
            const names = {
                fajr: 'الفجر',
                dhuhr: 'الظهر',
                asr: 'العصر',
                maghrib: 'المغرب',
                isha: 'العشاء'
            };
            return names[prayer] || '';
        }
    }
    
    // تحديث إحصائيات الصلاة
    function updatePrayerStats() {
        const today = new Date().toDateString();
        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        let completed = 0;
        
        prayers.forEach(prayer => {
            if (localStorage.getItem(`${prayer}_${today}`) === 'true') {
                completed++;
            }
        });
        
        const progress = (completed / 5) * 100;
        prayerProgress.style.width = `${progress}%`;
        prayerCount.textContent = `${completed}/5`;
        
        // مكافأة إكمال جميع الصلوات
        if (completed === 5 && localStorage.getItem(`prayerReward_${today}`) !== 'given') {
            player.xp += 200;
            player.coins += 100;
            localStorage.setItem(`prayerReward_${today}`, 'given');
            showNotification('تهانينا! كسبت 200 XP و 100 عملة لإكمال جميع الصلوات اليوم');
            updatePlayerStats();
        }
    }
    
    // تحديث إحصائيات اللاعب
    function updatePlayerStats() {
        playerLevel.textContent = player.level;
        playerXp.textContent = player.xp;
        maxXp.textContent = player.maxXp;
        playerCoins.textContent = player.coins;
        completedTasks.textContent = player.completedTasks;
        xpProgress.style.width = `${(player.xp / player.maxXp) * 100}%`;
        
        // التحقق من مستوى جديد
        if (player.xp >= player.maxXp) {
            player.level++;
            player.xp -= player.maxXp;
            player.maxXp = Math.floor(player.maxXp * 1.5);
            player.coins += player.level * 100;
            
            showNotification(`تهانينا! لقد وصلت للمستوى ${player.level}!`, true);
        }
        
        savePlayerData();
    }
    
    // إضافة مهمة جديدة
    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText) {
            const newTask = {
                id: Date.now(),
                text: taskText,
                xp: 100,
                completed: false
            };
            player.tasks.push(newTask);
            savePlayerData();
            renderTasks();
            taskInput.value = '';
            showNotification('تمت إضافة المهمة بنجاح!');
        }
    }
    
    // تبديل حالة المهمة
    function toggleTask(e) {
        const taskId = parseInt(e.target.dataset.id);
        const task = player.tasks.find(t => t.id === taskId);
        
        if (task) {
            task.completed = e.target.checked;
            
            if (task.completed) {
                player.xp += task.xp;
                player.coins += 50;
                player.completedTasks++;
                showNotification(`أحسنت! كسبت ${task.xp} XP و 50 عملة`);
            } else {
                player.xp -= task.xp;
                player.coins -= 50;
                player.completedTasks--;
            }
            
            savePlayerData();
            renderTasks();
            updatePlayerStats();
        }
    }
    
    // حذف مهمة
    function deleteTask(e) {
        const taskId = parseInt(e.target.dataset.id);
        const taskIndex = player.tasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
            if (player.tasks[taskIndex].completed) {
                player.xp -= player.tasks[taskIndex].xp;
                player.coins -= 50;
                player.completedTasks--;
            }
            
            player.tasks.splice(taskIndex, 1);
            savePlayerData();
            renderTasks();
            updatePlayerStats();
            showNotification('تم حذف المهمة');
        }
    }
    
    // عرض الإشعارات
    function showNotification(message, isLevelUp = false) {
        notification.textContent = message;
        notification.className = 'notification';
        notification.classList.add('show');
        
        if (isLevelUp) {
            notification.classList.add('error');
        }
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
        
        // إرسال إشعار نظام إذا كان مدعوماً
        if ('Notification' in window && Notification.permission === 'granted' && player.settings.notifications) {
            new Notification('إنجاز - إشعار', {
                body: message,
                icon: 'https://via.placeholder.com/128/121212/FFD700?text=إنجاز'
            });
        }
    }
    
    // طلب إذن الإشعارات
    function requestNotificationPermission() {
        if ('Notification' in window && Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('تم منح إذن الإشعارات');
                }
            });
        }
    }
    
    // تحديث الوقت الحالي
    function updateCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('current-time').textContent = timeString;
        
        // التحقق من وقت الأذكار
        checkAzkarTime(now);
    }
    
    // التحقق من وقت الأذكار
    function checkAzkarTime(now) {
        const hours = now.getHours();
        const today = new Date().toDateString();
        
        // وقت الصباح (من 4 صباحًا إلى 12 ظهرًا)
        if (hours >= 4 && hours < 12) {
            if (!localStorage.getItem(`morningAzkar_${today}`)) {
                showNotification('هل قرأت أذكار الصباح اليوم؟ اضغط على أيقونة الأذكار');
            }
        }
        // وقت المساء (من 3 عصرًا إلى 12 منتصف الليل)
        else if (hours >= 15 && hours < 24) {
            if (!localStorage.getItem(`eveningAzkar_${today}`)) {
                showNotification('هل قرأت أذكار المساء اليوم؟ اضغط على أيقونة الأذكار');
            }
        }
    }
    
    // وظائف المؤقت
    function updateTimerDisplay() {
        const mins = timerMinutes.toString().padStart(2, '0');
        const secs = timerSeconds.toString().padStart(2, '0');
        timerDisplay.textContent = `${mins}:${secs}`;
    }
    
    function toggleTimer() {
        if (isTimerRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }
    
    function startTimer() {
        if (timerMinutes === 0 && timerSeconds === 0) return;
        
        isTimerRunning = true;
        startTimerBtn.textContent = 'إيقاف';
        startTimerBtn.classList.remove('gold-button');
        startTimerBtn.classList.add('red-button');
        
        timerInterval = setInterval(() => {
            if (timerSeconds === 0) {
                if (timerMinutes === 0) {
                    timerFinished();
                    return;
                }
                timerMinutes--;
                timerSeconds = 59;
            } else {
                timerSeconds--;
            }
            updateTimerDisplay();
        }, 1000);
    }
    
    function pauseTimer() {
        isTimerRunning = false;
        clearInterval(timerInterval);
        startTimerBtn.textContent = 'بدء';
        startTimerBtn.classList.remove('red-button');
        startTimerBtn.classList.add('gold-button');
    }
    
    function resetTimer() {
        pauseTimer();
        timerMinutes = 25;
        timerSeconds = 0;
        updateTimerDisplay();
    }
    
    function timerFinished() {
        clearInterval(timerInterval);
        isTimerRunning = false;
        timerDisplay.textContent = "00:00";
        startTimerBtn.textContent = 'بدء';
        startTimerBtn.classList.remove('red-button');
        startTimerBtn.classList.add('gold-button');
        
        // مكافأة المؤقت
        player.coins += 20;
        updatePlayerStats();
        showNotification("انتهى الوقت! لقد كسبت 20 عملة لإكمال الجلسة.");
    }
    
    // بدء التطبيق
    init();
});