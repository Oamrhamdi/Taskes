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
        },
        timerSessions: 0,
        totalTasbeeh: 0,
        rewardsClaimed: 0,
        unlockedAchievements: [],
        spirituality: {
            morningAdhkar: false,
            eveningAdhkar: false,
            fajrPrayer: false,
            dhuhrPrayer: false,
            asrPrayer: false,
            maghribPrayer: false,
            ishaPrayer: false,
            salawat: false,
            lastUpdated: null,
            spiritualPoints: 0,
            adhkarStreak: 0,
            dailyPrayersCompleted: 0
        }
    };

    // المهام الافتراضية
    const defaultTasks = [
        { id: 1, text: "إنهاء المشروع المطلوب", xp: 100, completed: false },
        { id: 2, text: "حل الواجبات الدراسية", xp: 100, completed: false },
        { id: 3, text: "التحضير للاجتماع المهم", xp: 100, completed: false }
    ];

    // المكافآت المتاحة
    const rewards = [
        { id: 1, name: "استراحة مميزة", icon: "fa-crown", cost: 200, description: "استراحة لمدة 30 دقيقة" },
        { id: 2, name: "وجبة لذيذة", icon: "fa-utensils", cost: 300, description: "استمتع بوجبة من اختي��رك" },
        { id: 3, name: "جلسة ألعاب", icon: "fa-gamepad", cost: 400, description: "ساعة من وقت الألعاب" },
        { id: 4, name: "فيلم مسائي", icon: "fa-film", cost: 500, description: "شاهد فيلمك المفضل" },
        { id: 5, name: "خلفية مميزة", icon: "fa-image", cost: 600, description: "خلفية ذهبية للتطبيق" },
        { id: 6, name: "لقب مميز", icon: "fa-medal", cost: 800, description: "لقب يظهر بجانب اسمك" }
    ];

    // الإنجازات المتاحة
    const achievements = [
        {
            id: 1,
            title: "المبتدئ",
            description: "أكمل أول مهمة لك",
            icon: "fa-star",
            condition: (player) => player.completedTasks >= 1,
            reward: { coins: 50 },
            progress: (player) => Math.min(player.completedTasks / 1, 1)
        },
        {
            id: 2,
            title: "منتج",
            description: "أكمل 10 مهام",
            icon: "fa-tasks",
            condition: (player) => player.completedTasks >= 10,
            reward: { coins: 200, xp: 100 },
            progress: (player) => Math.min(player.completedTasks / 10, 1)
        },
        {
            id: 3,
            title: "محترف المؤقت",
            description: "استخدم المؤقت 5 مرات",
            icon: "fa-stopwatch",
            condition: (player) => player.timerSessions >= 5,
            reward: { coins: 150 },
            progress: (player) => Math.min((player.timerSessions || 0) / 5, 1)
        },
        {
            id: 4,
            title: "مستوى متقدم",
            description: "صل إلى المستوى 5",
            icon: "fa-level-up-alt",
            condition: (player) => player.level >= 5,
            reward: { coins: 500, xp: 300 },
            progress: (player) => Math.min(player.level / 5, 1)
        },
        {
            id: 5,
            title: "مسبح نشيط",
            description: "أكمل 50 تسبيحة",
            icon: "fa-praying-hands",
            condition: (player) => player.totalTasbeeh >= 50,
            reward: { coins: 100 },
            progress: (player) => Math.min((player.totalTasbeeh || 0) / 50, 1)
        },
        {
            id: 6,
            title: "جامع المكافآت",
            description: "احصل على 5 مكافآت",
            icon: "fa-award",
            condition: (player) => player.rewardsClaimed >= 5,
            reward: { coins: 300 },
            progress: (player) => Math.min((player.rewardsClaimed || 0) / 5, 1)
        },
        {
            id: 7,
            title: "المحافظ على الأذكار",
            description: "أكمل أذكار الصباح والمساء 7 أيام متتالية",
            icon: "fa-book-quran",
            condition: (player) => player.spirituality.adhkarStreak >= 7,
            reward: { coins: 400, xp: 200 },
            progress: (player) => Math.min((player.spirituality.adhkarStreak || 0) / 7, 1)
        },
        {
            id: 8,
            title: "المحافظ على الصلاة",
            description: "أكمل الصلوات الخمس ليوم كامل",
            icon: "fa-mosque",
            condition: (player) => player.spirituality.dailyPrayersCompleted >= 1,
            reward: { coins: 300, xp: 150 },
            progress: (player) => Math.min((player.spirituality.dailyPrayersCompleted || 0) / 1, 1)
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
    
    // عناصر المكافآت
    const rewardsModal = document.getElementById('rewards-modal');
    const rewardsGrid = document.getElementById('rewards-grid');
    
    // عناصر الإنجازات
    const achievementsModal = document.getElementById('achievements-modal');
    
    // عناصر الروحانيات
    const spiritualityModal = document.getElementById('spirituality-modal');
    const morningAdhkarBtn = document.getElementById('morning-adhkar-btn');
    const eveningAdhkarBtn = document.getElementById('evening-adhkar-btn');
    const fajrPrayerBtn = document.getElementById('fajr-prayer-btn');
    const dhuhrPrayerBtn = document.getElementById('dhuhr-prayer-btn');
    const asrPrayerBtn = document.getElementById('asr-prayer-btn');
    const maghribPrayerBtn = document.getElementById('maghrib-prayer-btn');
    const ishaPrayerBtn = document.getElementById('isha-prayer-btn');
    const salawatBtn = document.getElementById('salawat-btn');
    const spiritualPointsEl = document.getElementById('spiritual-points');
    
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
        renderRewards();
        updatePlayerStats();
        updateCurrentTime();
        updateSpiritualityUI();
        setInterval(updateCurrentTime, 1000);
        requestNotificationPermission();
        
        // أحداث إضافة المهام
        addTaskBtn.addEventListener('click', addTask);
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTask();
        });
        
        // أحداث المؤقت
        document.getElementById('timer-tool').addEventListener('click', () => {
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
        document.getElementById('tasbeeh-tool').addEventListener('click', () => {
            tasbeehModal.style.display = 'flex';
        });
        
        addTasbeehBtn.addEventListener('click', () => {
            dhikrCount++;
            tasbeehCount.textContent = dhikrCount;
            tasbeehCount.classList.add('pulse');
            setTimeout(() => tasbeehCount.classList.remove('pulse'), 500);
            
            player.totalTasbeeh = (player.totalTasbeeh || 0) + 1;
            checkAchievements();
            
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
        
        // أحداث المكافآت
        document.getElementById('rewards-tool').addEventListener('click', () => {
            rewardsModal.style.display = 'flex';
        });
        
        // أحداث الإنجازات
        document.getElementById('achievements-tool').addEventListener('click', () => {
            achievementsModal.style.display = 'flex';
            renderAchievements();
        });
        
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderAchievements(btn.dataset.tab);
            });
        });
        
        // أحداث الروحانيات
        document.getElementById('spirituality-tool').addEventListener('click', () => {
            spiritualityModal.style.display = 'flex';
            updateSpiritualityUI();
        });
        
        morningAdhkarBtn.addEventListener('click', () => toggleSpiritualityItem('morningAdhkar'));
        eveningAdhkarBtn.addEventListener('click', () => toggleSpiritualityItem('eveningAdhkar'));
        fajrPrayerBtn.addEventListener('click', () => toggleSpiritualityItem('fajrPrayer'));
        dhuhrPrayerBtn.addEventListener('click', () => toggleSpiritualityItem('dhuhrPrayer'));
        asrPrayerBtn.addEventListener('click', () => toggleSpiritualityItem('asrPrayer'));
        maghribPrayerBtn.addEventListener('click', () => toggleSpiritualityItem('maghribPrayer'));
        ishaPrayerBtn.addEventListener('click', () => toggleSpiritualityItem('ishaPrayer'));
        salawatBtn.addEventListener('click', () => toggleSpiritualityItem('salawat'));
        
        // إغلاق النوافذ المنبثقة
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
        
        // التحقق من تاريخ آخر تحديث للروحانيات
        checkSpiritualityReset();
    }
    
    // تحميل بيانات اللاعب
    function loadPlayerData() {
        const savedPlayer = localStorage.getItem('eliteTaskPlayer');
        if (savedPlayer) {
            const parsedData = JSON.parse(savedPlayer);
            
            // دمج البيانات مع الحفاظ على القيم الافتراضية للخصائص الجديدة
            Object.keys(parsedData).forEach(key => {
                if (key === 'spirituality') {
                    Object.keys(parsedData[key]).forEach(subKey => {
                        player[key][subKey] = parsedData[key][subKey];
                    });
                } else {
                    player[key] = parsedData[key];
                }
            });
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
    
    // عرض المكافآت
    function renderRewards() {
        rewardsGrid.innerHTML = '';
        rewards.forEach(reward => {
            const rewardItem = document.createElement('div');
            rewardItem.className = 'reward-item';
            rewardItem.innerHTML = `
                <i class="fas ${reward.icon}"></i>
                <h3>${reward.name}</h3>
                <p>${reward.description}</p>
                <div class="reward-cost">${reward.cost} <i class="fas fa-coins"></i></div>
            `;
            rewardItem.addEventListener('click', () => purchaseReward(reward));
            rewardsGrid.appendChild(rewardItem);
        });
    }
    
    // تحديث إحصائيات اللاعب
    function updatePlayerStats() {
        playerLevel.textContent = player.level;
        playerXp.textContent = player.xp;
        maxXp.textContent = player.maxXp;
        playerCoins.textContent = player.coins;
        completedTasks.textContent = player.completedTasks;
        xpProgress.style.width = `${(player.xp / player.maxXp) * 100}%`;
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
                checkLevelUp();
            } else {
                player.xp -= task.xp;
                player.coins -= 50;
                player.completedTasks--;
            }
            
            checkAchievements();
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
    
    // التحقق من مستوى جديد
    function checkLevelUp() {
        if (player.xp >= player.maxXp) {
            player.level++;
            player.xp -= player.maxXp;
            player.maxXp = Math.floor(player.maxXp * 1.5);
            player.coins += player.level * 100;
            
            showNotification(`تهانينا! لقد وصلت للمستوى ${player.level}!`, true);
            savePlayerData();
            updatePlayerStats();
            
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification(`المستوى ${player.level}!`, {
                    body: `تهانينا! لقد تقدمت إلى المستوى ${player.level}`,
                    icon: 'https://via.placeholder.com/128/121212/FFD700?text=LV+' + player.level
                });
            }
        }
    }
    
    // شراء مكافأة
    function purchaseReward(reward) {
        if (player.coins >= reward.cost) {
            player.coins -= reward.cost;
            player.inventory.push(reward);
            player.rewardsClaimed = (player.rewardsClaimed || 0) + 1;
            checkAchievements();
            savePlayerData();
            updatePlayerStats();
            showNotification(`لقد اشتريت ${reward.name}! استمتع بمكافأتك.`);
            
            setTimeout(() => {
                rewardsModal.style.display = 'none';
            }, 1500);
        } else {
            showErrorMessage("ليس لديك ما يكفي من العملات لشراء هذه المكافأة.");
        }
    }
    
    // عرض الإنجازات
    function renderAchievements(tab = 'unlocked') {
        const container = document.getElementById('achievements-list');
        container.innerHTML = '';
        
        achievements.forEach(achievement => {
            const isUnlocked = player.unlockedAchievements.includes(achievement.id);
            
            if ((tab === 'unlocked' && isUnlocked) || (tab === 'locked' && !isUnlocked)) {
                const achievementEl = document.createElement('div');
                achievementEl.className = `achievement-item ${isUnlocked ? '' : 'locked'}`;
                
                achievementEl.innerHTML = `
                    <i class="fas ${achievement.icon} achievement-icon"></i>
                    <div class="achievement-details">
                        <div class="achievement-title">${achievement.title}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                        ${!isUnlocked ? `
                        <div class="achievement-progress">
                            <div class="achievement-progress-bar" style="width: ${achievement.progress(player) * 100}%"></div>
                        </div>
                        ` : ''}
                        ${achievement.reward ? `
                        <div class="achievement-reward">
                            <span>المكافأة: </span>
                            ${achievement.reward.coins ? `<span>${achievement.reward.coins} <i class="fas fa-coins"></i></span>` : ''}
                            ${achievement.reward.xp ? `<span>${achievement.reward.xp} <i class="fas fa-star"></i></span>` : ''}
                        </div>
                        ` : ''}
                    </div>
                `;
                
                container.appendChild(achievementEl);
            }
        });
    }
    
    // التحقق من الإنجازات
    function checkAchievements() {
        achievements.forEach(achievement => {
            if (!player.unlockedAchievements.includes(achievement.id)) {
                if (achievement.condition(player)) {
                    unlockAchievement(achievement);
                }
            }
        });
    }
    
    // فتح إنجاز جديد
    function unlockAchievement(achievement) {
        player.unlockedAchievements.push(achievement.id);
        
        if (achievement.reward) {
            if (achievement.reward.coins) {
                player.coins += achievement.reward.coins;
            }
            if (achievement.reward.xp) {
                player.xp += achievement.reward.xp;
                checkLevelUp();
            }
        }
        
        savePlayerData();
        updatePlayerStats();
        
        showNotification(`تهانينا! لقد حققت إنجاز ${achievement.title} وكسبت ${achievement.reward.coins || 0} عملة`, true);
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`إنجاز جديد: ${achievement.title}`, {
                body: achievement.description,
                icon: 'https://via.placeholder.com/128/121212/FFD700?text=✓'
            });
        }
    }
    
    // تحديث واجهة الروحانيات
    function updateSpiritualityUI() {
        // تحديث حالة الأذكار
        document.getElementById('morning-adhkar-status').innerHTML = 
            player.spirituality.morningAdhkar ? '<i class="fas fa-check success-icon"></i>' : '<i class="fas fa-times red-icon"></i>';
        document.getElementById('evening-adhkar-status').innerHTML = 
            player.spirituality.eveningAdhkar ? '<i class="fas fa-check success-icon"></i>' : '<i class="fas fa-times red-icon"></i>';
        
        // تحديث حالة الصلوات
        document.getElementById('fajr-prayer-status').innerHTML = 
            player.spirituality.fajrPrayer ? '<i class="fas fa-check success-icon"></i>' : '<i class="fas fa-times red-icon"></i>';
        document.getElementById('dhuhr-prayer-status').innerHTML = 
            player.spirituality.dhuhrPrayer ? '<i class="fas fa-check success-icon"></i>' : '<i class="fas fa-times red-icon"></i>';
        document.getElementById('asr-prayer-status').innerHTML = 
            player.spirituality.asrPrayer ? '<i class="fas fa-check success-icon"></i>' : '<i class="fas fa-times red-icon"></i>';
        document.getElementById('maghrib-prayer-status').innerHTML = 
            player.spirituality.maghribPrayer ? '<i class="fas fa-check success-icon"></i>' : '<i class="fas fa-times red-icon"></i>';
        document.getElementById('isha-prayer-status').innerHTML = 
            player.spirituality.ishaPrayer ? '<i class="fas fa-check success-icon"></i>' : '<i class="fas fa-times red-icon"></i>';
        
        // تحديث حالة الصلاة على النبي
        document.getElementById('salawat-status').innerHTML = 
            player.spirituality.salawat ? '<i class="fas fa-check success-icon"></i>' : '<i class="fas fa-times red-icon"></i>';
        
        // تحديث النقاط الروحانية
        spiritualPointsEl.textContent = player.spirituality.spiritualPoints || 0;
        
        // تحديث أزرار الروحانيات
        updateSpiritualityButtons();
    }
    
    // تحديث أزرار الروحانيات
    function updateSpiritualityButtons() {
        const buttons = [
            { id: 'morning-adhkar-btn', condition: player.spirituality.morningAdhkar },
            { id: 'evening-adhkar-btn', condition: player.spirituality.eveningAdhkar },
            { id: 'fajr-prayer-btn', condition: player.spirituality.fajrPrayer },
            { id: 'dhuhr-prayer-btn', condition: player.spirituality.dhuhrPrayer },
            { id: 'asr-prayer-btn', condition: player.spirituality.asrPrayer },
            { id: 'maghrib-prayer-btn', condition: player.spirituality.maghribPrayer },
            { id: 'isha-prayer-btn', condition: player.spirituality.ishaPrayer },
            { id: 'salawat-btn', condition: player.spirituality.salawat }
        ];
        
        buttons.forEach(btn => {
            const buttonEl = document.getElementById(btn.id);
            if (btn.condition) {
                buttonEl.classList.remove('gold-button');
                buttonEl.classList.add('success-button');
                buttonEl.innerHTML = '<i class="fas fa-check"></i> تمت';
            } else {
                buttonEl.classList.remove('success-button');
                buttonEl.classList.add('gold-button');
                buttonEl.innerHTML = 'تمت';
            }
        });
    }
    
    // تبديل حالة العنصر الروحاني
    function toggleSpiritualityItem(item) {
        player.spirituality[item] = !player.spirituality[item];
        
        // حساب النقاط الروحانية
        if (player.spirituality[item]) {
            let points = 0;
            
            switch(item) {
                case 'morningAdhkar':
                case 'eveningAdhkar':
                    points = 20;
                    break;
                case 'fajrPrayer':
                case 'dhuhrPrayer':
                case 'asrPrayer':
                case 'maghribPrayer':
                case 'ishaPrayer':
                    points = 30;
                    break;
                case 'salawat':
                    points = 10;
                    break;
            }
            
            player.spirituality.spiritualPoints += points;
            player.xp += points;
            
            // التحقق من إكمال الأذكار اليومية
            checkDailyAdhkar();
            
            // التحقق من إكمال الصلوات اليومية
            checkDailyPrayersCompleted();
            
            checkLevelUp();
        } else {
            let points = 0;
            
            switch(item) {
                case 'morningAdhkar':
                case 'eveningAdhkar':
                    points = 20;
                    break;
                case 'fajrPrayer':
                case 'dhuhrPrayer':
                case 'asrPrayer':
                case 'maghribPrayer':
                case 'ishaPrayer':
                    points = 30;
                    break;
                case 'salawat':
                    points = 10;
                    break;
            }
            
            player.spirituality.spiritualPoints -= points;
            player.xp -= points;
        }
        
        // تحديث تاريخ آخر تعديل
        player.spirituality.lastUpdated = new Date().toISOString().split('T')[0];
        
        savePlayerData();
        updatePlayerStats();
        updateSpiritualityUI();
        checkAchievements();
        
        showNotification(player.spirituality[item] ? 
            `تم تسجيل ${getSpiritualityItemName(item)} بنجاح!` : 
            `تم إلغاء تسجيل ${getSpiritualityItemName(item)}`);
    }
    
    // الحصول على اسم العنصر الروحاني
    function getSpiritualityItemName(item) {
        const names = {
            morningAdhkar: "أذكار الصباح",
            eveningAdhkar: "أذكار المساء",
            fajrPrayer: "صلاة الفجر",
            dhuhrPrayer: "صلاة الظهر",
            asrPrayer: "صلاة العصر",
            maghribPrayer: "صلاة المغرب",
            ishaPrayer: "صلاة العشاء",
            salawat: "الصلاة على النبي"
        };
        return names[item] || item;
    }
    
    // التحقق من إكمال الأذكار اليومية
    function checkDailyAdhkar() {
        if (player.spirituality.morningAdhkar && player.spirituality.eveningAdhkar) {
            player.spirituality.adhkarStreak = (player.spirituality.adhkarStreak || 0) + 1;
            showNotification("أحسنت! لقد أكملت أذكار الصباح والمساء اليوم", true);
        }
    }
    
    // التحقق من إكمال جميع الصلوات اليومية
    function checkDailyPrayersCompleted() {
        const prayers = ['fajrPrayer', 'dhuhrPrayer', 'asrPrayer', 'maghribPrayer', 'ishaPrayer'];
        const allPrayersCompleted = prayers.every(prayer => player.spirituality[prayer]);
        
        if (allPrayersCompleted) {
            player.spirituality.dailyPrayersCompleted = 1;
            showNotification("تهانينا! لقد أكملت جميع الصلوات اليومية!", true);
        }
    }
    
    // التحقق من تاريخ آخر تحديث للروحانيات وإعادة تعيينها إذا كان اليوم جديدًا
    function checkSpiritualityReset() {
        const today = new Date().toISOString().split('T')[0];
        
        if (player.spirituality.lastUpdated !== today) {
            // إذا كان اليوم مختلفًا عن آخر تحديث، نتحقق من استمرارية الأذكار
            if (player.spirituality.lastUpdated && 
                !(player.spirituality.morningAdhkar && player.spirituality.eveningAdhkar)) {
                player.spirituality.adhkarStreak = 0;
            }
            
            // إعادة تعيين جميع العناصر الروحانية اليومية
            player.spirituality.morningAdhkar = false;
            player.spirituality.eveningAdhkar = false;
            player.spirituality.fajrPrayer = false;
            player.spirituality.dhuhrPrayer = false;
            player.spirituality.asrPrayer = false;
            player.spirituality.maghribPrayer = false;
            player.spirituality.ishaPrayer = false;
            player.spirituality.salawat = false;
            player.spirituality.dailyPrayersCompleted = 0;
            player.spirituality.lastUpdated = today;
            
            savePlayerData();
            updateSpiritualityUI();
        }
    }
    
    // عرض الإشعارات
    function showNotification(message, isLevelUp = false) {
        notification.textContent = message;
        notification.classList.add('show');
        
        if (isLevelUp) {
            notification.style.backgroundColor = 'var(--red)';
        } else {
            notification.style.backgroundColor = 'var(--gold)';
        }
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
        
        if ('Notification' in window && Notification.permission === 'granted' && player.settings.notifications) {
            new Notification('إنجاز - إشعار', {
                body: message,
                icon: 'https://via.placeholder.com/128/121212/FFD700?text=إنجاز'
            });
        }
    }
    
    // عرض رسالة خطأ
    function showErrorMessage(message) {
        notification.textContent = message;
        notification.classList.add('show');
        notification.style.backgroundColor = 'var(--red)';
        
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
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
        
        player.coins += 20;
        player.timerSessions = (player.timerSessions || 0) + 1;
        checkAchievements();
        updatePlayerStats();
        showNotification("انتهى الوقت! لقد كسبت 20 عملة لإكمال الجلسة.");
        
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('انتهت الجلسة!', {
                body: 'لقد أكملت جلسة المؤقت بنجاح وكسبت 20 عملة',
                icon: 'https://via.placeholder.com/128/121212/FFD700?text=✓'
            });
        }
    }
    
    // بدء التطبيق
    init();
});