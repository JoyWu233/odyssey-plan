// 存储所有表单元素的引用
const formElements = {
    // 资源盘点
    'user-name': document.getElementById('user-name'),
    'who-am-i': document.getElementById('who-am-i'),
    'what-i-have': document.getElementById('what-i-have'),
    'energizers': document.getElementById('energizers'),
    
    // 计划A
    'plan-a-title': document.getElementById('plan-a-title'),
    'plan-a-desc': document.getElementById('plan-a-desc'),
    'plan-a-milestones': document.getElementById('plan-a-milestones'),
    'plan-a-resources': document.getElementById('plan-a-resources'),
    'plan-a-excitement': document.getElementById('plan-a-excitement'),
    'plan-a-confidence': document.getElementById('plan-a-confidence'),
    'plan-a-alignment': document.getElementById('plan-a-alignment'),
    
    // 计划B
    'plan-b-title': document.getElementById('plan-b-title'),
    'plan-b-desc': document.getElementById('plan-b-desc'),
    'plan-b-milestones': document.getElementById('plan-b-milestones'),
    'plan-b-resources': document.getElementById('plan-b-resources'),
    'plan-b-excitement': document.getElementById('plan-b-excitement'),
    'plan-b-confidence': document.getElementById('plan-b-confidence'),
    'plan-b-alignment': document.getElementById('plan-b-alignment'),
    
    // 计划C
    'plan-c-title': document.getElementById('plan-c-title'),
    'plan-c-desc': document.getElementById('plan-c-desc'),
    'plan-c-milestones': document.getElementById('plan-c-milestones'),
    'plan-c-resources': document.getElementById('plan-c-resources'),
    'plan-c-excitement': document.getElementById('plan-c-excitement'),
    'plan-c-confidence': document.getElementById('plan-c-confidence'),
    'plan-c-alignment': document.getElementById('plan-c-alignment'),
    
    // 评估
    'exciting-plan': document.getElementById('exciting-plan'),
    'feasibility': document.getElementById('feasibility'),
    'action-steps': document.getElementById('action-steps')
};

// 存储所有状态元素的引用
const statusElements = {
    'user-name': document.getElementById('user-name-status'),
    'who-am-i': document.getElementById('who-am-i-status'),
    'what-i-have': document.getElementById('what-i-have-status'),
    'energizers': document.getElementById('energizers-status'),
    'plan-a-title': document.getElementById('plan-a-title-status'),
    'plan-a-desc': document.getElementById('plan-a-desc-status'),
    'plan-a-milestones': document.getElementById('plan-a-milestones-status'),
    'plan-b-title': document.getElementById('plan-b-title-status'),
    'plan-b-desc': document.getElementById('plan-b-desc-status'),
    'plan-b-milestones': document.getElementById('plan-b-milestones-status'),
    'plan-c-title': document.getElementById('plan-c-title-status'),
    'plan-c-desc': document.getElementById('plan-c-desc-status'),
    'plan-c-milestones': document.getElementById('plan-c-milestones-status'),
    'exciting-plan': document.getElementById('exciting-plan-status'),
    'feasibility': document.getElementById('feasibility-status'),
    'action-steps': document.getElementById('action-steps-status')
};

// 定义标签页顺序
const tabOrder = ['resources', 'plans', 'evaluation', 'results'];

// 当前活动标签页
let currentTab = 'resources';

// 自动保存延迟时间（毫秒）
const AUTO_SAVE_DELAY = 500;

// 初始化函数
function init() {
    // 加载保存的数据
    loadSavedData();
    
    // 设置标签页切换事件
    setupTabNavigation();
    
    // 设置表单自动保存
    setupAutoSave();
    
    // 设置导航按钮事件
    setupNavigationButtons();
    
    // 设置导出按钮事件
    setupExportImage();
    
    // 设置仪表盘交互
    setupGauges();
    
    // 初始化仪表盘图像
    createGaugeImages();
}

// 加载保存的数据
function loadSavedData() {
    const savedData = localStorage.getItem('odysseyPlanData');
    if (savedData) {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach(key => {
            if (formElements[key]) {
                formElements[key].value = data[key];
                updateSaveStatus(key, true);
            }
        });
    }
}

// 保存数据到localStorage
function saveData() {
    const data = {};
    Object.keys(formElements).forEach(key => {
        if (formElements[key]) {
            if (formElements[key].type === 'range') {
                data[key] = formElements[key].value;
            } else {
                data[key] = formElements[key].value;
            }
        }
    });
    localStorage.setItem('odysseyPlanData', JSON.stringify(data));
}

// 设置标签页导航
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

// 切换标签页
function switchTab(tabId) {
    // 更新按钮状态
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        }
    });
    
    // 更新内容显示
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
        }
    });
    
    currentTab = tabId;
    
    // 如果切换到结果页面，确保刷新结果
    if (tabId === 'results') {
        generateResults();
    }
}

// 设置自动保存
function setupAutoSave() {
    Object.keys(formElements).forEach(key => {
        if (formElements[key]) {
            let timeout;
            formElements[key].addEventListener('input', () => {
                clearTimeout(timeout);
                updateSaveStatus(key, false);
                timeout = setTimeout(() => {
                    saveData();
                    updateSaveStatus(key, true);
                }, AUTO_SAVE_DELAY);
            });
            
            // 添加失焦保存
            formElements[key].addEventListener('blur', () => {
                saveData();
                updateSaveStatus(key, true);
            });
        }
    });
}

// 更新保存状态显示
function updateSaveStatus(key, saved) {
    if (statusElements[key]) {
        statusElements[key].textContent = saved ? '已保存' : '正在保存...';
        statusElements[key].style.color = saved ? '#28a745' : '#6c757d';
    }
}

// 设置导航按钮事件
function setupNavigationButtons() {
    // 下一步按钮
    document.getElementById('next-to-plans').addEventListener('click', () => {
        saveData(); // 确保保存数据
        switchTab('plans');
    });
    
    document.getElementById('next-to-evaluation').addEventListener('click', () => {
        saveData(); // 确保保存数据
        switchTab('evaluation');
    });
    
    document.getElementById('generate-results').addEventListener('click', () => {
        saveData(); // 确保保存数据
        generateResults();
        switchTab('results');
    });
    
    // 上一步按钮
    document.getElementById('back-to-resources').addEventListener('click', () => switchTab('resources'));
    document.getElementById('back-to-plans').addEventListener('click', () => switchTab('plans'));
    document.getElementById('back-to-evaluation').addEventListener('click', () => switchTab('evaluation'));
}

// 设置仪表盘交互功能
function setupGauges() {
    // 为所有滑块添加事件监听器
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        const barId = slider.id + '-bar';
        const bar = document.getElementById(barId);
        
        // 初始化进度条
        updateProgressBar(slider, bar);
        
        // 添加事件监听器
        slider.addEventListener('input', function() {
            updateProgressBar(this, bar);
            saveData();
        });
    });
}

// 更新进度条
function updateProgressBar(slider, bar) {
    if (bar) {
        const value = slider.value;
        bar.style.width = value + '%';
        bar.querySelector('.progress-text').textContent = value + '%';
    }
}

// 创建仪表盘图像
function createGaugeImages() {
    // 仪表盘URL模板
    const smallGaugeTemplate = 'https://quickchart.io/gauge?value=${value}&max=100&theme=dark&width=120&height=60&label=${label}';
    
    // 初始化Plan A仪表盘
    updatePlanGauges('a', 50, 50, 50, 50);
    
    // 初始化Plan B仪表盘
    updatePlanGauges('b', 50, 50, 50, 50);
    
    // 初始化Plan C仪表盘
    updatePlanGauges('c', 50, 50, 50, 50);
}

// 更新计划仪表盘
function updatePlanGauges(plan, resources, excitement, confidence, alignment) {
    // 改为使用直接的URL，不使用模板字符串，避免潜在问题
    const resourcesGauge = document.getElementById(`plan-${plan}-resources-gauge`);
    const excitementGauge = document.getElementById(`plan-${plan}-excitement-gauge`);
    const confidenceGauge = document.getElementById(`plan-${plan}-confidence-gauge`);
    const alignmentGauge = document.getElementById(`plan-${plan}-alignment-gauge`);
    
    // 使用正确的URL格式，确保仪表盘图像显示
    if (resourcesGauge) resourcesGauge.src = `https://quickchart.io/gauge?value=${resources}&max=100&theme=light&width=120&height=80&label=资源`;
    if (excitementGauge) excitementGauge.src = `https://quickchart.io/gauge?value=${excitement}&max=100&theme=light&width=120&height=80&label=喜欢程度`;
    if (confidenceGauge) confidenceGauge.src = `https://quickchart.io/gauge?value=${confidence}&max=100&theme=light&width=120&height=80&label=自信心`;
    if (alignmentGauge) alignmentGauge.src = `https://quickchart.io/gauge?value=${alignment}&max=100&theme=light&width=120&height=80&label=一致性`;
    
    // 更新仪表盘文本值
    const resourcesValue = document.getElementById(`plan-${plan}-resources-value`);
    const excitementValue = document.getElementById(`plan-${plan}-excitement-value`);
    const confidenceValue = document.getElementById(`plan-${plan}-confidence-value`);
    const alignmentValue = document.getElementById(`plan-${plan}-alignment-value`);
    
    if (resourcesValue) resourcesValue.textContent = `资源: ${resources}%`;
    if (excitementValue) excitementValue.textContent = `喜欢: ${excitement}%`;
    if (confidenceValue) confidenceValue.textContent = `自信: ${confidence}%`;
    if (alignmentValue) alignmentValue.textContent = `一致: ${alignment}%`;
}

// 更新结果页仪表盘
function updateResultGauges() {
    // 更新每个计划的仪表盘
    const planAResources = formElements['plan-a-resources'].value || 50;
    const planAExcitement = formElements['plan-a-excitement'].value || 50;
    const planAConfidence = formElements['plan-a-confidence'].value || 50;
    const planAAlignment = formElements['plan-a-alignment'].value || 50;
    updatePlanGauges('a', planAResources, planAExcitement, planAConfidence, planAAlignment);
    
    const planBResources = formElements['plan-b-resources'].value || 50;
    const planBExcitement = formElements['plan-b-excitement'].value || 50;
    const planBConfidence = formElements['plan-b-confidence'].value || 50;
    const planBAlignment = formElements['plan-b-alignment'].value || 50;
    updatePlanGauges('b', planBResources, planBExcitement, planBConfidence, planBAlignment);
    
    const planCResources = formElements['plan-c-resources'].value || 50;
    const planCExcitement = formElements['plan-c-excitement'].value || 50;
    const planCConfidence = formElements['plan-c-confidence'].value || 50;
    const planCAlignment = formElements['plan-c-alignment'].value || 50;
    updatePlanGauges('c', planCResources, planCExcitement, planCConfidence, planCAlignment);
}

// 生成结果
function generateResults() {
    // 更新仪表盘
    updateResultGauges();
    
    // 获取用户称呼
    const userName = formElements['user-name'].value || '我';
    
    // 更新页面标题
    document.querySelector('#results h2').textContent = `${userName}的奥德赛计划`;
    
    // 更新资源盘点结果
    const whoAmI = formElements['who-am-i'].value || '【未填写】';
    const whatIHave = formElements['what-i-have'].value || '【未填写】';
    const energizers = formElements['energizers'].value || '【未填写】';
    
    document.getElementById('resources-result').innerHTML = `
        <div class="result-section">
            <h4>我是谁？</h4>
            ${formatTextContent(whoAmI)}
        </div>
        <div class="result-section">
            <h4>我拥有什么？</h4>
            ${formatTextContent(whatIHave)}
        </div>
        <div class="result-section">
            <h4>能量来源</h4>
            ${formatTextContent(energizers)}
        </div>
    `;
    
    // 获取计划标题
    const planATitle = formElements['plan-a-title'].value || '最现实路径';
    const planBTitle = formElements['plan-b-title'].value || '替代方案';
    const planCTitle = formElements['plan-c-title'].value || '理想生活';
    
    // 更新计划A结果
    const planADesc = formElements['plan-a-desc'].value || '【未填写】';
    const planAMilestones = formElements['plan-a-milestones'].value || '【未填写】';
    const planAResources = formElements['plan-a-resources'].value || 50;
    const planAExcitement = formElements['plan-a-excitement'].value || 50;
    const planAConfidence = formElements['plan-a-confidence'].value || 50;
    const planAAlignment = formElements['plan-a-alignment'].value || 50;
    
    document.getElementById('plan-a-result-title').textContent = `Plan A - ${planATitle}`;
    document.getElementById('plan-a-result').innerHTML = `
        <div class="result-section">
            <h4>5年后的状态</h4>
            ${formatTextContent(planADesc)}
        </div>
        <div class="result-section">
            <h4>关键里程碑</h4>
            ${formatTextContent(planAMilestones)}
        </div>
    `;
    
    // 更新计划A的水平仪表盘
    document.getElementById('plan-a-resources-display').textContent = planAResources + '%';
    let resourcesBar = document.getElementById('plan-a-resources-progress');
    resourcesBar.parentNode.removeChild(resourcesBar);
    resourcesBar = document.createElement('div');
    resourcesBar.className = 'progress-bar resource-progress-bar';
    resourcesBar.id = 'plan-a-resources-progress';
    resourcesBar.style.width = planAResources + '%';
    document.querySelector('.plan-a-metrics .resource-metric .progress').appendChild(resourcesBar);

    document.getElementById('plan-a-excitement-display').textContent = planAExcitement + '%';
    let excitementBar = document.getElementById('plan-a-excitement-progress');
    excitementBar.parentNode.removeChild(excitementBar);
    excitementBar = document.createElement('div');
    excitementBar.className = 'progress-bar excitement-progress-bar';
    excitementBar.id = 'plan-a-excitement-progress';
    excitementBar.style.width = planAExcitement + '%';
    document.querySelector('.plan-a-metrics .excitement-metric .progress').appendChild(excitementBar);

    document.getElementById('plan-a-confidence-display').textContent = planAConfidence + '%';
    let confidenceBar = document.getElementById('plan-a-confidence-progress');
    confidenceBar.parentNode.removeChild(confidenceBar);
    confidenceBar = document.createElement('div');
    confidenceBar.className = 'progress-bar confidence-progress-bar';
    confidenceBar.id = 'plan-a-confidence-progress';
    confidenceBar.style.width = planAConfidence + '%';
    document.querySelector('.plan-a-metrics .confidence-metric .progress').appendChild(confidenceBar);

    document.getElementById('plan-a-alignment-display').textContent = planAAlignment + '%';
    let alignmentBar = document.getElementById('plan-a-alignment-progress');
    alignmentBar.parentNode.removeChild(alignmentBar);
    alignmentBar = document.createElement('div');
    alignmentBar.className = 'progress-bar alignment-progress-bar';
    alignmentBar.id = 'plan-a-alignment-progress';
    alignmentBar.style.width = planAAlignment + '%';
    document.querySelector('.plan-a-metrics .alignment-metric .progress').appendChild(alignmentBar);
    
    // 更新计划B结果
    const planBDesc = formElements['plan-b-desc'].value || '【未填写】';
    const planBMilestones = formElements['plan-b-milestones'].value || '【未填写】';
    const planBResources = formElements['plan-b-resources'].value || 50;
    const planBExcitement = formElements['plan-b-excitement'].value || 50;
    const planBConfidence = formElements['plan-b-confidence'].value || 50;
    const planBAlignment = formElements['plan-b-alignment'].value || 50;
    
    document.getElementById('plan-b-result-title').textContent = `Plan B - ${planBTitle}`;
    document.getElementById('plan-b-result').innerHTML = `
        <div class="result-section">
            <h4>5年后的状态</h4>
            ${formatTextContent(planBDesc)}
        </div>
        <div class="result-section">
            <h4>关键里程碑</h4>
            ${formatTextContent(planBMilestones)}
        </div>
    `;
    
    // 更新计划B的水平仪表盘
    document.getElementById('plan-b-resources-display').textContent = planBResources + '%';
    resourcesBar = document.getElementById('plan-b-resources-progress');
    resourcesBar.parentNode.removeChild(resourcesBar);
    resourcesBar = document.createElement('div');
    resourcesBar.className = 'progress-bar resource-progress-bar';
    resourcesBar.id = 'plan-b-resources-progress';
    resourcesBar.style.width = planBResources + '%';
    document.querySelector('.plan-b-metrics .resource-metric .progress').appendChild(resourcesBar);

    document.getElementById('plan-b-excitement-display').textContent = planBExcitement + '%';
    excitementBar = document.getElementById('plan-b-excitement-progress');
    excitementBar.parentNode.removeChild(excitementBar);
    excitementBar = document.createElement('div');
    excitementBar.className = 'progress-bar excitement-progress-bar';
    excitementBar.id = 'plan-b-excitement-progress';
    excitementBar.style.width = planBExcitement + '%';
    document.querySelector('.plan-b-metrics .excitement-metric .progress').appendChild(excitementBar);

    document.getElementById('plan-b-confidence-display').textContent = planBConfidence + '%';
    confidenceBar = document.getElementById('plan-b-confidence-progress');
    confidenceBar.parentNode.removeChild(confidenceBar);
    confidenceBar = document.createElement('div');
    confidenceBar.className = 'progress-bar confidence-progress-bar';
    confidenceBar.id = 'plan-b-confidence-progress';
    confidenceBar.style.width = planBConfidence + '%';
    document.querySelector('.plan-b-metrics .confidence-metric .progress').appendChild(confidenceBar);

    document.getElementById('plan-b-alignment-display').textContent = planBAlignment + '%';
    alignmentBar = document.getElementById('plan-b-alignment-progress');
    alignmentBar.parentNode.removeChild(alignmentBar);
    alignmentBar = document.createElement('div');
    alignmentBar.className = 'progress-bar alignment-progress-bar';
    alignmentBar.id = 'plan-b-alignment-progress';
    alignmentBar.style.width = planBAlignment + '%';
    document.querySelector('.plan-b-metrics .alignment-metric .progress').appendChild(alignmentBar);
    
    // 更新计划C结果
    const planCDesc = formElements['plan-c-desc'].value || '【未填写】';
    const planCMilestones = formElements['plan-c-milestones'].value || '【未填写】';
    const planCResources = formElements['plan-c-resources'].value || 50;
    const planCExcitement = formElements['plan-c-excitement'].value || 50;
    const planCConfidence = formElements['plan-c-confidence'].value || 50;
    const planCAlignment = formElements['plan-c-alignment'].value || 50;
    
    document.getElementById('plan-c-result-title').textContent = `Plan C - ${planCTitle}`;
    document.getElementById('plan-c-result').innerHTML = `
        <div class="result-section">
            <h4>5年后的状态</h4>
            ${formatTextContent(planCDesc)}
        </div>
        <div class="result-section">
            <h4>关键里程碑</h4>
            ${formatTextContent(planCMilestones)}
        </div>
    `;
    
    // 更新计划C的水平仪表盘
    document.getElementById('plan-c-resources-display').textContent = planCResources + '%';
    resourcesBar = document.getElementById('plan-c-resources-progress');
    resourcesBar.parentNode.removeChild(resourcesBar);
    resourcesBar = document.createElement('div');
    resourcesBar.className = 'progress-bar resource-progress-bar';
    resourcesBar.id = 'plan-c-resources-progress';
    resourcesBar.style.width = planCResources + '%';
    document.querySelector('.plan-c-metrics .resource-metric .progress').appendChild(resourcesBar);

    document.getElementById('plan-c-excitement-display').textContent = planCExcitement + '%';
    excitementBar = document.getElementById('plan-c-excitement-progress');
    excitementBar.parentNode.removeChild(excitementBar);
    excitementBar = document.createElement('div');
    excitementBar.className = 'progress-bar excitement-progress-bar';
    excitementBar.id = 'plan-c-excitement-progress';
    excitementBar.style.width = planCExcitement + '%';
    document.querySelector('.plan-c-metrics .excitement-metric .progress').appendChild(excitementBar);

    document.getElementById('plan-c-confidence-display').textContent = planCConfidence + '%';
    confidenceBar = document.getElementById('plan-c-confidence-progress');
    confidenceBar.parentNode.removeChild(confidenceBar);
    confidenceBar = document.createElement('div');
    confidenceBar.className = 'progress-bar confidence-progress-bar';
    confidenceBar.id = 'plan-c-confidence-progress';
    confidenceBar.style.width = planCConfidence + '%';
    document.querySelector('.plan-c-metrics .confidence-metric .progress').appendChild(confidenceBar);

    document.getElementById('plan-c-alignment-display').textContent = planCAlignment + '%';
    alignmentBar = document.getElementById('plan-c-alignment-progress');
    alignmentBar.parentNode.removeChild(alignmentBar);
    alignmentBar = document.createElement('div');
    alignmentBar.className = 'progress-bar alignment-progress-bar';
    alignmentBar.id = 'plan-c-alignment-progress';
    alignmentBar.style.width = planCAlignment + '%';
    document.querySelector('.plan-c-metrics .alignment-metric .progress').appendChild(alignmentBar);
    
    // 确定最令人兴奋的计划名称
    let excitingPlanName = '【未选择】';
    if (formElements['exciting-plan'].value === 'plan-a') {
        excitingPlanName = `Plan A - ${planATitle}`;
    } else if (formElements['exciting-plan'].value === 'plan-b') {
        excitingPlanName = `Plan B - ${planBTitle}`;
    } else if (formElements['exciting-plan'].value === 'plan-c') {
        excitingPlanName = `Plan C - ${planCTitle}`;
    }
    
    const feasibility = formElements['feasibility'].value || '【未填写】';
    const actionSteps = formElements['action-steps'].value || '【未填写】';
    
    // 更新评估结果
    document.getElementById('evaluation-result').innerHTML = `
        <div class="result-section">
            <h4>最令人兴奋的计划</h4>
            <p>${excitingPlanName}</p>
        </div>
        <div class="result-section">
            <h4>可行性分析</h4>
            ${formatTextContent(feasibility)}
        </div>
        <div class="result-section">
            <h4>行动计划</h4>
            ${formatTextContent(actionSteps)}
        </div>
    `;
    
    // 移除顶部仪表盘红框（如果存在）
    const topDashboard = document.querySelector('#results > div[style*="border: 1px solid red"]');
    if (topDashboard) {
        topDashboard.remove();
    }
}

// 将文本内容转换为HTML段落格式
function formatTextContent(text) {
    if (!text || text === '【未填写】') {
        return '<p>【未填写】</p>';
    }
    
    // 处理换行符并去除空行
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        return '<p>【未填写】</p>';
    }
    
    return lines.map(line => `<p>${line}</p>`).join('');
}

// 设置导出图片功能
function setupExportImage() {
    document.getElementById('export-pdf').textContent = '导出图片';
    document.getElementById('export-pdf').addEventListener('click', function() {
        // 确保数据已保存并刷新显示
        saveData();
        generateResults();
        switchTab('results');
        
        // 显示加载提示
        const loadingMsg = document.createElement('div');
        loadingMsg.textContent = '正在生成图片...';
        loadingMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 18px;
        `;
        document.body.appendChild(loadingMsg);
        
        // 禁用按钮
        const exportBtn = document.getElementById('export-pdf');
        exportBtn.disabled = true;
        exportBtn.textContent = '生成中...';
        
        try {
            // 创建一个全新的导出容器
            const exportContainer = document.createElement('div');
            exportContainer.style.cssText = `
                position: absolute;
                left: -9999px; 
                top: 0;
                width: 800px;
                padding: 40px;
                background-color: #FFFFFF;
                font-family: 'Segoe UI', 'Microsoft YaHei', sans-serif;
                color: #333333;
                box-sizing: border-box;
                z-index: -1;
            `;
            
            // 获取数据内容
            const userName = formElements['user-name'].value || '我';
            
            // 创建标题和副标题
            const titleHTML = `
                <h2 style="
                    text-align: center;
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 20px;
                    color: #000000;
                ">${userName}的奥德赛计划</h2>
                <p style="
                    text-align: center;
                    font-size: 16px;
                    color: #666666;
                    margin-bottom: 30px;
                ">以下是为你生成的三种未来可能性。</p>
                <p style="
                    text-align: center;
                    font-size: 14px;
                    color: #666666;
                    margin-bottom: 30px;
                ">生成日期: ${new Date().toLocaleDateString('zh-CN')}</p>
            `;
            
            // 获取资源盘点内容
            const whoAmI = formElements['who-am-i'].value || '【未填写】';
            const whatIHave = formElements['what-i-have'].value || '【未填写】';
            const energizers = formElements['energizers'].value || '【未填写】';
            
            const resourcesHTML = `
                <div style="
                    margin-bottom: 30px;
                    background-color: #FFFFFF;
                    border-radius: 8px;
                    padding: 0;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    border: 1px solid #E0E0E0;
                ">
                    <h3 style="
                        font-size: 22px;
                        font-weight: bold;
                        color: #ffffff;
                        margin: 0 0 15px 0;
                        padding: 15px 20px;
                        background-color: #4361ee;
                        border-radius: 8px 8px 0 0;
                    ">资源盘点</h3>
                    
                    <div style="padding: 0 20px 20px 20px;">
                        <div style="margin-bottom: 15px;">
                            <h4 style="
                                font-size: 18px;
                                color: #4361ee;
                                margin-bottom: 10px;
                            ">我是谁？</h4>
                            ${formatTextContentWithStyle(whoAmI)}
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h4 style="
                                font-size: 18px;
                                color: #4361ee;
                                margin-bottom: 10px;
                            ">我拥有什么？</h4>
                            ${formatTextContentWithStyle(whatIHave)}
                        </div>
                        
                        <div>
                            <h4 style="
                                font-size: 18px;
                                color: #4361ee;
                                margin-bottom: 10px;
                            ">能量来源</h4>
                            ${formatTextContentWithStyle(energizers)}
                        </div>
                    </div>
                </div>
            `;
            
            // 获取计划A内容
            const planATitle = formElements['plan-a-title'].value || '最现实路径';
            const planADesc = formElements['plan-a-desc'].value || '【未填写】';
            const planAMilestones = formElements['plan-a-milestones'].value || '【未填写】';
            const planAResources = formElements['plan-a-resources'].value || 50;
            const planAExcitement = formElements['plan-a-excitement'].value || 50;
            const planAConfidence = formElements['plan-a-confidence'].value || 50;
            const planAAlignment = formElements['plan-a-alignment'].value || 50;
            
            const planAHTML = `
                <div style="
                    margin-bottom: 30px;
                    background-color: #FFFFFF;
                    border-radius: 8px;
                    padding: 0;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    border: 1px solid #E0E0E0;
                ">
                    <h3 style="
                        font-size: 22px;
                        font-weight: bold;
                        color: #ffffff;
                        margin: 0 0 15px 0;
                        padding: 15px 20px;
                        background-color: #4361ee;
                        border-radius: 8px 8px 0 0;
                    ">Plan A - ${planATitle}</h3>
                    
                    <div style="padding: 0 20px 20px 20px;">
                        <div style="margin-bottom: 15px;">
                            <h4 style="
                                font-size: 18px;
                                color: #4361ee;
                                margin-bottom: 10px;
                            ">5年后的状态</h4>
                            ${formatTextContentWithStyle(planADesc)}
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h4 style="
                                font-size: 18px;
                                color: #4361ee;
                                margin-bottom: 10px;
                            ">关键里程碑</h4>
                            ${formatTextContentWithStyle(planAMilestones)}
                        </div>
                        
                        <div>
                            <h4 style="
                                font-size: 18px;
                                color: #4361ee;
                                margin-bottom: 10px;
                            ">计划评估</h4>
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                background-color: #f8f9fa;
                                border-radius: 8px;
                                padding: 15px;
                            ">
                                ${generateMetricHTML('资源', planAResources, 'a')}
                                ${generateMetricHTML('喜欢', planAExcitement, 'a')}
                                ${generateMetricHTML('自信', planAConfidence, 'a')}
                                ${generateMetricHTML('一致', planAAlignment, 'a')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // 获取计划B内容
            const planBTitle = formElements['plan-b-title'].value || '替代方案';
            const planBDesc = formElements['plan-b-desc'].value || '【未填写】';
            const planBMilestones = formElements['plan-b-milestones'].value || '【未填写】';
            const planBResources = formElements['plan-b-resources'].value || 50;
            const planBExcitement = formElements['plan-b-excitement'].value || 50;
            const planBConfidence = formElements['plan-b-confidence'].value || 50;
            const planBAlignment = formElements['plan-b-alignment'].value || 50;
            
            const planBHTML = `
                <div style="
                    margin-bottom: 30px;
                    background-color: #FFFFFF;
                    border-radius: 8px;
                    padding: 0;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    border: 1px solid #E0E0E0;
                ">
                    <h3 style="
                        font-size: 22px;
                        font-weight: bold;
                        color: #ffffff;
                        margin: 0 0 15px 0;
                        padding: 15px 20px;
                        background-color: #4895ef;
                        border-radius: 8px 8px 0 0;
                    ">Plan B - ${planBTitle}</h3>
                    
                    <div style="padding: 0 20px 20px 20px;">
                        <div style="margin-bottom: 15px;">
                            <h4 style="
                                font-size: 18px;
                                color: #4895ef;
                                margin-bottom: 10px;
                            ">5年后的状态</h4>
                            ${formatTextContentWithStyle(planBDesc)}
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h4 style="
                                font-size: 18px;
                                color: #4895ef;
                                margin-bottom: 10px;
                            ">关键里程碑</h4>
                            ${formatTextContentWithStyle(planBMilestones)}
                        </div>
                        
                        <div>
                            <h4 style="
                                font-size: 18px;
                                color: #4895ef;
                                margin-bottom: 10px;
                            ">计划评估</h4>
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                background-color: #f8f9fa;
                                border-radius: 8px;
                                padding: 15px;
                            ">
                                ${generateMetricHTML('资源', planBResources, 'b')}
                                ${generateMetricHTML('喜欢', planBExcitement, 'b')}
                                ${generateMetricHTML('自信', planBConfidence, 'b')}
                                ${generateMetricHTML('一致', planBAlignment, 'b')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // 获取计划C内容
            const planCTitle = formElements['plan-c-title'].value || '理想生活';
            const planCDesc = formElements['plan-c-desc'].value || '【未填写】';
            const planCMilestones = formElements['plan-c-milestones'].value || '【未填写】';
            const planCResources = formElements['plan-c-resources'].value || 50;
            const planCExcitement = formElements['plan-c-excitement'].value || 50;
            const planCConfidence = formElements['plan-c-confidence'].value || 50;
            const planCAlignment = formElements['plan-c-alignment'].value || 50;
            
            const planCHTML = `
                <div style="
                    margin-bottom: 30px;
                    background-color: #FFFFFF;
                    border-radius: 8px;
                    padding: 0;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    border: 1px solid #E0E0E0;
                ">
                    <h3 style="
                        font-size: 22px;
                        font-weight: bold;
                        color: #ffffff;
                        margin: 0 0 15px 0;
                        padding: 15px 20px;
                        background-color: #f72585;
                        border-radius: 8px 8px 0 0;
                    ">Plan C - ${planCTitle}</h3>
                    
                    <div style="padding: 0 20px 20px 20px;">
                        <div style="margin-bottom: 15px;">
                            <h4 style="
                                font-size: 18px;
                                color: #f72585;
                                margin-bottom: 10px;
                            ">5年后的状态</h4>
                            ${formatTextContentWithStyle(planCDesc)}
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h4 style="
                                font-size: 18px;
                                color: #f72585;
                                margin-bottom: 10px;
                            ">关键里程碑</h4>
                            ${formatTextContentWithStyle(planCMilestones)}
                        </div>
                        
                        <div>
                            <h4 style="
                                font-size: 18px;
                                color: #f72585;
                                margin-bottom: 10px;
                            ">计划评估</h4>
                            <div style="
                                display: flex;
                                justify-content: space-between;
                                background-color: #f8f9fa;
                                border-radius: 8px;
                                padding: 15px;
                            ">
                                ${generateMetricHTML('资源', planCResources, 'c')}
                                ${generateMetricHTML('喜欢', planCExcitement, 'c')}
                                ${generateMetricHTML('自信', planCConfidence, 'c')}
                                ${generateMetricHTML('一致', planCAlignment, 'c')}
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // 获取评估与行动计划内容
            let excitingPlanName = '【未选择】';
            if (formElements['exciting-plan'].value === 'plan-a') {
                excitingPlanName = `Plan A - ${planATitle}`;
            } else if (formElements['exciting-plan'].value === 'plan-b') {
                excitingPlanName = `Plan B - ${planBTitle}`;
            } else if (formElements['exciting-plan'].value === 'plan-c') {
                excitingPlanName = `Plan C - ${planCTitle}`;
            }
            
            const feasibility = formElements['feasibility'].value || '【未填写】';
            const actionSteps = formElements['action-steps'].value || '【未填写】';
            
            const evaluationHTML = `
                <div style="
                    background-color: #FFFFFF;
                    border-radius: 8px;
                    padding: 0;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    border: 1px solid #E0E0E0;
                ">
                    <h3 style="
                        font-size: 22px;
                        font-weight: bold;
                        color: #ffffff;
                        margin: 0 0 15px 0;
                        padding: 15px 20px;
                        background-color: #4361ee;
                        border-radius: 8px 8px 0 0;
                    ">评估与行动计划</h3>
                    
                    <div style="padding: 0 20px 20px 20px;">
                        <div style="margin-bottom: 15px;">
                            <h4 style="
                                font-size: 18px;
                                color: #4361ee;
                                margin-bottom: 10px;
                            ">最令人兴奋的计划</h4>
                            <p style="
                                margin: 0;
                                line-height: 1.6;
                                color: #333;
                            ">${excitingPlanName}</p>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <h4 style="
                                font-size: 18px;
                                color: #4361ee;
                                margin-bottom: 10px;
                            ">可行性分析</h4>
                            ${formatTextContentWithStyle(feasibility)}
                        </div>
                        
                        <div>
                            <h4 style="
                                font-size: 18px;
                                color: #4361ee;
                                margin-bottom: 10px;
                            ">行动计划</h4>
                            ${formatTextContentWithStyle(actionSteps)}
                        </div>
                    </div>
                </div>
            `;
            
            // 组合所有内容
            exportContainer.innerHTML = `
                ${titleHTML}
                ${resourcesHTML}
                ${planAHTML}
                ${planBHTML}
                ${planCHTML}
                ${evaluationHTML}
            `;
            
            // 添加到文档以便截图
            document.body.appendChild(exportContainer);
            
            // 使用html2canvas截图
            html2canvas(exportContainer, {
                scale: 2, // 提高清晰度
                backgroundColor: '#FFFFFF',
                logging: false,
                useCORS: true,
                allowTaint: true,
                width: 800
            }).then(function(canvas) {
                try {
                    // 导出为PNG图片
                    const dataUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = `${userName}的奥德赛计划.png`;
                    link.href = dataUrl;
                    link.click();
                    
                    // 显示成功消息
                    loadingMsg.textContent = '导出成功！';
                    loadingMsg.style.background = 'rgba(40, 167, 69, 0.8)';
                    setTimeout(() => loadingMsg.remove(), 1500);
                } catch (err) {
                    console.error('导出图片错误:', err);
                    loadingMsg.textContent = '导出失败，请稍后重试';
                    loadingMsg.style.background = 'rgba(220, 53, 69, 0.8)';
                    setTimeout(() => loadingMsg.remove(), 2000);
                } finally {
                    // 移除临时元素
                    if (exportContainer.parentNode) {
                        exportContainer.parentNode.removeChild(exportContainer);
                    }
                    
                    // 恢复按钮
                    exportBtn.disabled = false;
                    exportBtn.textContent = '导出图片';
                }
            }).catch(function(error) {
                console.error('html2canvas错误:', error);
                
                // 移除临时元素
                if (exportContainer.parentNode) {
                    exportContainer.parentNode.removeChild(exportContainer);
                }
                
                // 显示错误消息
                loadingMsg.textContent = '导出失败，请稍后重试';
                loadingMsg.style.background = 'rgba(220, 53, 69, 0.8)';
                setTimeout(() => loadingMsg.remove(), 2000);
                
                // 恢复按钮
                exportBtn.disabled = false;
                exportBtn.textContent = '导出图片';
            });
        } catch (error) {
            console.error('导出过程出错:', error);
            
            // 显示错误消息
            loadingMsg.textContent = '导出失败，请稍后重试';
            loadingMsg.style.background = 'rgba(220, 53, 69, 0.8)';
            setTimeout(() => loadingMsg.remove(), 2000);
            
            // 恢复按钮
            exportBtn.disabled = false;
            exportBtn.textContent = '导出图片';
        }
    });
}

// 生成指标HTML
function generateMetricHTML(label, value, planType) {
    // 根据计划类型设置固定的主色调，不再使用不同指标不同颜色
    let mainColor = '#4361ee'; // Plan A的蓝色
    
    if (planType === 'b') {
        mainColor = '#4895ef'; // Plan B的青色
    } else if (planType === 'c') {
        mainColor = '#f72585'; // Plan C的粉色
    }
    
    // 使用水平进度条样式，标签和数值在同一行，统一使用计划的主色调
    return `
        <div style="width: 23%; text-align: center;">
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
            ">
                <div style="
                    font-size: 14px;
                    font-weight: bold;
                    color: #333;
                ">${label}</div>
                <div style="
                    font-size: 16px;
                    font-weight: bold;
                    color: ${mainColor};
                ">${value}%</div>
            </div>
            <div style="
                background: #e9ecef;
                border-radius: 20px;
                height: 16px;
                position: relative;
                overflow: hidden;
                box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
            ">
                <div style="
                    background: ${mainColor};
                    width: ${value}%;
                    height: 100%;
                    border-radius: 20px;
                "></div>
            </div>
        </div>
    `;
}

// 格式化文本内容带样式
function formatTextContentWithStyle(text) {
    if (!text || text === '【未填写】') {
        return '<p style="margin: 0 0 8px 0; line-height: 1.6; color: #888;">【未填写】</p>';
    }
    
    // 处理换行符并去除空行
    const lines = text.split('\n').filter(line => line.trim() !== '');
    if (lines.length === 0) {
        return '<p style="margin: 0 0 8px 0; line-height: 1.6; color: #888;">【未填写】</p>';
    }
    
    return lines.map(line => `<p style="margin: 0 0 8px 0; line-height: 1.6; color: #333;">${line}</p>`).join('');
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 