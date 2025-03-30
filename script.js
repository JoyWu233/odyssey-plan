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
    
    // 计划B
    'plan-b-title': document.getElementById('plan-b-title'),
    'plan-b-desc': document.getElementById('plan-b-desc'),
    'plan-b-milestones': document.getElementById('plan-b-milestones'),
    
    // 计划C
    'plan-c-title': document.getElementById('plan-c-title'),
    'plan-c-desc': document.getElementById('plan-c-desc'),
    'plan-c-milestones': document.getElementById('plan-c-milestones'),
    
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
const AUTO_SAVE_DELAY = 1000;

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
    
    // 设置导出PDF按钮事件
    setupExportPDF();
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
            data[key] = formElements[key].value;
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
}

// 设置自动保存
function setupAutoSave() {
    Object.keys(formElements).forEach(key => {
        if (formElements[key]) {
            let timeout;
            formElements[key].addEventListener('input', () => {
                clearTimeout(timeout);
                timeout = setTimeout(() => {
                    saveData();
                    updateSaveStatus(key, true);
                }, AUTO_SAVE_DELAY);
            });
        }
    });
}

// 更新保存状态显示
function updateSaveStatus(key, saved) {
    if (statusElements[key]) {
        statusElements[key].textContent = saved ? '已保存' : '未保存';
        statusElements[key].style.color = saved ? '#28a745' : '#6c757d';
    }
}

// 设置导航按钮事件
function setupNavigationButtons() {
    // 下一步按钮
    document.getElementById('next-to-plans').addEventListener('click', () => switchTab('plans'));
    document.getElementById('next-to-evaluation').addEventListener('click', () => switchTab('evaluation'));
    document.getElementById('generate-results').addEventListener('click', () => {
        generateResults();
        switchTab('results');
    });
    
    // 上一步按钮
    document.getElementById('back-to-resources').addEventListener('click', () => switchTab('resources'));
    document.getElementById('back-to-plans').addEventListener('click', () => switchTab('plans'));
    document.getElementById('back-to-evaluation').addEventListener('click', () => switchTab('evaluation'));
}

// 生成结果
function generateResults() {
    // 更新资源盘点结果
    document.getElementById('resources-result').innerHTML = `
        <p><strong>我是谁：</strong>${formElements['who-am-i'].value}</p>
        <p><strong>我拥有什么：</strong>${formElements['what-i-have'].value}</p>
        <p><strong>能量来源：</strong>${formElements['energizers'].value}</p>
    `;
    
    // 更新计划A结果
    document.getElementById('plan-a-result-title').textContent = formElements['plan-a-title'].value || 'Plan A';
    document.getElementById('plan-a-result').innerHTML = `
        <p><strong>5年后的状态：</strong>${formElements['plan-a-desc'].value}</p>
        <p><strong>关键里程碑：</strong>${formElements['plan-a-milestones'].value}</p>
    `;
    
    // 更新计划B结果
    document.getElementById('plan-b-result-title').textContent = formElements['plan-b-title'].value || 'Plan B';
    document.getElementById('plan-b-result').innerHTML = `
        <p><strong>5年后的状态：</strong>${formElements['plan-b-desc'].value}</p>
        <p><strong>关键里程碑：</strong>${formElements['plan-b-milestones'].value}</p>
    `;
    
    // 更新计划C结果
    document.getElementById('plan-c-result-title').textContent = formElements['plan-c-title'].value || 'Plan C';
    document.getElementById('plan-c-result').innerHTML = `
        <p><strong>5年后的状态：</strong>${formElements['plan-c-desc'].value}</p>
        <p><strong>关键里程碑：</strong>${formElements['plan-c-milestones'].value}</p>
    `;
    
    // 更新评估结果
    document.getElementById('evaluation-result').innerHTML = `
        <p><strong>最令人兴奋的计划：</strong>${formElements['exciting-plan'].value}</p>
        <p><strong>可行性分析：</strong>${formElements['feasibility'].value}</p>
        <p><strong>行动计划：</strong>${formElements['action-steps'].value}</p>
    `;
}

// 设置导出PDF按钮事件
function setupExportPDF() {
    document.getElementById('export-pdf').addEventListener('click', () => {
        // 这里可以添加导出PDF的功能
        alert('PDF导出功能正在开发中...');
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 