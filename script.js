// 存储所有表单元素的引用
const formElements = {
    // 资源盘点
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
    
    // 展示Plan A的评估数据
    document.getElementById('plan-a-resources-value').textContent = `资源: ${planAResources}%`;
    document.getElementById('plan-a-excitement-value').textContent = `喜欢: ${planAExcitement}%`;
    document.getElementById('plan-a-confidence-value').textContent = `自信: ${planAConfidence}%`;
    document.getElementById('plan-a-alignment-value').textContent = `一致: ${planAAlignment}%`;
    
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
    
    // 展示Plan B的评估数据
    document.getElementById('plan-b-resources-value').textContent = `资源: ${planBResources}%`;
    document.getElementById('plan-b-excitement-value').textContent = `喜欢: ${planBExcitement}%`;
    document.getElementById('plan-b-confidence-value').textContent = `自信: ${planBConfidence}%`;
    document.getElementById('plan-b-alignment-value').textContent = `一致: ${planBAlignment}%`;
    
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
    
    // 展示Plan C的评估数据
    document.getElementById('plan-c-resources-value').textContent = `资源: ${planCResources}%`;
    document.getElementById('plan-c-excitement-value').textContent = `喜欢: ${planCExcitement}%`;
    document.getElementById('plan-c-confidence-value').textContent = `自信: ${planCConfidence}%`;
    document.getElementById('plan-c-alignment-value').textContent = `一致: ${planCAlignment}%`;
    
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
        
        // 创建临时容器（A4纸张比例：210mm × 297mm = 1:1.414）
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            left: -9999px;
            top: -9999px;
            width: 800px;
            background: #FFFFFF;
            padding: 40px;
            box-sizing: border-box;
            font-family: 'Microsoft YaHei', sans-serif;
            overflow: hidden;
        `;
        document.body.appendChild(container);
        
        try {
            // 获取内容文本
            const whoAmI = formElements['who-am-i'].value || '【未填写】';
            const whatIHave = formElements['what-i-have'].value || '【未填写】';
            const energizers = formElements['energizers'].value || '【未填写】';
            
            const planATitle = formElements['plan-a-title'].value || '最现实路径';
            const planADesc = formElements['plan-a-desc'].value || '【未填写】';
            const planAMilestones = formElements['plan-a-milestones'].value || '【未填写】';
            const planAResources = formElements['plan-a-resources'].value || 50;
            const planAExcitement = formElements['plan-a-excitement'].value || 50;
            const planAConfidence = formElements['plan-a-confidence'].value || 50;
            const planAAlignment = formElements['plan-a-alignment'].value || 50;
            
            const planBTitle = formElements['plan-b-title'].value || '替代方案';
            const planBDesc = formElements['plan-b-desc'].value || '【未填写】';
            const planBMilestones = formElements['plan-b-milestones'].value || '【未填写】';
            const planBResources = formElements['plan-b-resources'].value || 50;
            const planBExcitement = formElements['plan-b-excitement'].value || 50;
            const planBConfidence = formElements['plan-b-confidence'].value || 50;
            const planBAlignment = formElements['plan-b-alignment'].value || 50;
            
            const planCTitle = formElements['plan-c-title'].value || '理想生活';
            const planCDesc = formElements['plan-c-desc'].value || '【未填写】';
            const planCMilestones = formElements['plan-c-milestones'].value || '【未填写】';
            const planCResources = formElements['plan-c-resources'].value || 50;
            const planCExcitement = formElements['plan-c-excitement'].value || 50;
            const planCConfidence = formElements['plan-c-confidence'].value || 50;
            const planCAlignment = formElements['plan-c-alignment'].value || 50;
            
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
            
            // 获取仪表盘图像URL - 修改为正确的格式
            const smallGaugeTemplate = 'https://quickchart.io/gauge?value=${value}&max=100&theme=light&width=120&height=80&label=${label}';
            
            // 构建HTML内容
            container.innerHTML = `
                <style>
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: 'Microsoft YaHei', sans-serif;
                        color: #000;
                        line-height: 1.5;
                    }
                    .page-header {
                        text-align: center;
                        margin-bottom: 30px;
                        padding-bottom: 20px;
                        border-bottom: 2px solid #4361ee;
                    }
                    .main-title {
                        font-size: 32px;
                        color: #1a46e5;
                        margin-bottom: 10px;
                        font-weight: bold;
                    }
                    .date {
                        font-size: 14px;
                        color: #666;
                    }
                    .description {
                        font-size: 14px;
                        color: #555;
                        margin-bottom: 20px;
                    }
                    .gauge-row {
                        display: flex;
                        justify-content: space-between;
                        margin: 15px 0;
                        background-color: #f9f9f9;
                        padding: 15px;
                        border-radius: 8px;
                    }
                    .gauge-item {
                        text-align: center;
                        width: 23%;
                    }
                    .gauge-title {
                        font-size: 14px;
                        color: #444;
                        margin-top: 5px;
                        font-weight: bold;
                    }
                    .gauge-img {
                        width: 100%;
                        max-width: 120px;
                        height: auto;
                    }
                    .card {
                        margin-bottom: 30px;
                        border: 1px solid #e0e0e0;
                        border-radius: 10px;
                        overflow: hidden;
                    }
                    .card-header {
                        padding: 15px 20px;
                        color: white;
                        font-weight: bold;
                        font-size: 18px;
                    }
                    .resources-header {
                        background-color: #4361ee;
                    }
                    .plan-a-header {
                        background-color: #4361ee;
                    }
                    .plan-b-header {
                        background-color: #4895ef;
                    }
                    .plan-c-header {
                        background-color: #f72585;
                    }
                    .evaluation-header {
                        background-color: #3f37c9;
                    }
                    .card-body {
                        padding: 20px;
                        background-color: #fff;
                    }
                    .section {
                        margin-bottom: 15px;
                    }
                    .section-title {
                        font-size: 16px;
                        font-weight: bold;
                        color: #202b8d;
                        margin-bottom: 10px;
                    }
                    .section-content {
                        font-size: 14px;
                        color: #333;
                        white-space: pre-line;
                    }
                    .empty {
                        color: #999;
                        font-style: italic;
                    }
                    .footer {
                        text-align: center;
                        margin-top: 30px;
                        font-size: 12px;
                        color: #999;
                    }
                </style>
                
                <div class="page-header">
                    <h1 class="main-title">我的奥德赛计划</h1>
                    <p class="date">生成日期: ${new Date().toLocaleDateString('zh-CN')}</p>
                </div>
                
                <p class="description">以下是为你生成的三种未来可能性。</p>
                
                <div class="card">
                    <div class="card-header resources-header">资源盘点</div>
                    <div class="card-body">
                        <div class="section">
                            <div class="section-title">我是谁？</div>
                            <div class="section-content ${whoAmI === '【未填写】' ? 'empty' : ''}">${whoAmI}</div>
                        </div>
                        <div class="section">
                            <div class="section-title">我拥有什么？</div>
                            <div class="section-content ${whatIHave === '【未填写】' ? 'empty' : ''}">${whatIHave}</div>
                        </div>
                        <div class="section">
                            <div class="section-title">能量来源</div>
                            <div class="section-content ${energizers === '【未填写】' ? 'empty' : ''}">${energizers}</div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header plan-a-header">Plan A - ${planATitle}</div>
                    <div class="card-body">
                        <div class="section">
                            <div class="section-title">5年后的状态</div>
                            <div class="section-content ${planADesc === '【未填写】' ? 'empty' : ''}">${planADesc}</div>
                        </div>
                        <div class="section">
                            <div class="section-title">关键里程碑</div>
                            <div class="section-content ${planAMilestones === '【未填写】' ? 'empty' : ''}">${planAMilestones}</div>
                        </div>
                        <div class="gauge-row">
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planAResources).replace('${label}', '资源')}" alt="Plan A资源仪表盘">
                                <div class="gauge-title">资源: ${planAResources}%</div>
                            </div>
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planAExcitement).replace('${label}', '喜欢程度')}" alt="Plan A喜欢程度仪表盘">
                                <div class="gauge-title">喜欢: ${planAExcitement}%</div>
                            </div>
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planAConfidence).replace('${label}', '自信心')}" alt="Plan A自信心仪表盘">
                                <div class="gauge-title">自信: ${planAConfidence}%</div>
                            </div>
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planAAlignment).replace('${label}', '一致性')}" alt="Plan A一致性仪表盘">
                                <div class="gauge-title">一致: ${planAAlignment}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header plan-b-header">Plan B - ${planBTitle}</div>
                    <div class="card-body">
                        <div class="section">
                            <div class="section-title">5年后的状态</div>
                            <div class="section-content ${planBDesc === '【未填写】' ? 'empty' : ''}">${planBDesc}</div>
                        </div>
                        <div class="section">
                            <div class="section-title">关键里程碑</div>
                            <div class="section-content ${planBMilestones === '【未填写】' ? 'empty' : ''}">${planBMilestones}</div>
                        </div>
                        <div class="gauge-row">
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planBResources).replace('${label}', '资源')}" alt="Plan B资源仪表盘">
                                <div class="gauge-title">资源: ${planBResources}%</div>
                            </div>
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planBExcitement).replace('${label}', '喜欢程度')}" alt="Plan B喜欢程度仪表盘">
                                <div class="gauge-title">喜欢: ${planBExcitement}%</div>
                            </div>
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planBConfidence).replace('${label}', '自信心')}" alt="Plan B自信心仪表盘">
                                <div class="gauge-title">自信: ${planBConfidence}%</div>
                            </div>
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planBAlignment).replace('${label}', '一致性')}" alt="Plan B一致性仪表盘">
                                <div class="gauge-title">一致: ${planBAlignment}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header plan-c-header">Plan C - ${planCTitle}</div>
                    <div class="card-body">
                        <div class="section">
                            <div class="section-title">5年后的状态</div>
                            <div class="section-content ${planCDesc === '【未填写】' ? 'empty' : ''}">${planCDesc}</div>
                        </div>
                        <div class="section">
                            <div class="section-title">关键里程碑</div>
                            <div class="section-content ${planCMilestones === '【未填写】' ? 'empty' : ''}">${planCMilestones}</div>
                        </div>
                        <div class="gauge-row">
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planCResources).replace('${label}', '资源')}" alt="Plan C资源仪表盘">
                                <div class="gauge-title">资源: ${planCResources}%</div>
                            </div>
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planCExcitement).replace('${label}', '喜欢程度')}" alt="Plan C喜欢程度仪表盘">
                                <div class="gauge-title">喜欢: ${planCExcitement}%</div>
                            </div>
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planCConfidence).replace('${label}', '自信心')}" alt="Plan C自信心仪表盘">
                                <div class="gauge-title">自信: ${planCConfidence}%</div>
                            </div>
                            <div class="gauge-item">
                                <img class="gauge-img" src="${smallGaugeTemplate.replace('${value}', planCAlignment).replace('${label}', '一致性')}" alt="Plan C一致性仪表盘">
                                <div class="gauge-title">一致: ${planCAlignment}%</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header evaluation-header">评估与行动计划</div>
                    <div class="card-body">
                        <div class="section">
                            <div class="section-title">最令人兴奋的计划</div>
                            <div class="section-content ${excitingPlanName === '【未选择】' ? 'empty' : ''}">${excitingPlanName}</div>
                        </div>
                        <div class="section">
                            <div class="section-title">可行性分析</div>
                            <div class="section-content ${feasibility === '【未填写】' ? 'empty' : ''}">${feasibility}</div>
                        </div>
                        <div class="section">
                            <div class="section-title">行动计划</div>
                            <div class="section-content ${actionSteps === '【未填写】' ? 'empty' : ''}">${actionSteps}</div>
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    奥德赛计划生成器 · odyssey-plan.com
                </div>
            `;
            
            // 使用html2canvas截图
            html2canvas(container, {
                scale: 2,
                backgroundColor: '#FFFFFF',
                logging: false,
                useCORS: true,
                allowTaint: true,
                onclone: function(clone) {
                    // 确保克隆元素样式正确应用
                    const cloneContainer = clone.querySelector('div');
                    if (cloneContainer) {
                        cloneContainer.style.position = 'static';
                        cloneContainer.style.left = '0';
                        cloneContainer.style.top = '0';
                    }
                }
            }).then(function(canvas) {
                try {
                    // 导出为PNG图片
                    const dataUrl = canvas.toDataURL('image/png');
                    const link = document.createElement('a');
                    link.download = '我的奥德赛计划.png';
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
                    // 清理临时元素
                    document.body.removeChild(container);
                    
                    // 恢复按钮
                    exportBtn.disabled = false;
                    exportBtn.textContent = '导出图片';
                }
            }).catch(function(error) {
                console.error('html2canvas错误:', error);
                
                // 清理临时元素
                document.body.removeChild(container);
                
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
            
            // 清理临时元素
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
            
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 