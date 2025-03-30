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
    
    // 设置导出按钮事件
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
        <div class="result-section">
            <h4>我是谁？</h4>
            <p>${formElements['who-am-i'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
        <div class="result-section">
            <h4>我拥有什么？</h4>
            <p>${formElements['what-i-have'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
        <div class="result-section">
            <h4>能量来源</h4>
            <p>${formElements['energizers'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
    `;
    
    // 获取计划标题
    const planATitle = formElements['plan-a-title'].value || '最现实路径';
    const planBTitle = formElements['plan-b-title'].value || '替代方案';
    const planCTitle = formElements['plan-c-title'].value || '理想生活';
    
    // 更新计划A结果
    document.getElementById('plan-a-result-title').textContent = `Plan A - ${planATitle}`;
    document.getElementById('plan-a-result').innerHTML = `
        <div class="result-section">
            <h4>5年后的状态</h4>
            <p>${formElements['plan-a-desc'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
        <div class="result-section">
            <h4>关键里程碑</h4>
            <p>${formElements['plan-a-milestones'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
    `;
    
    // 更新计划B结果
    document.getElementById('plan-b-result-title').textContent = `Plan B - ${planBTitle}`;
    document.getElementById('plan-b-result').innerHTML = `
        <div class="result-section">
            <h4>5年后的状态</h4>
            <p>${formElements['plan-b-desc'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
        <div class="result-section">
            <h4>关键里程碑</h4>
            <p>${formElements['plan-b-milestones'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
    `;
    
    // 更新计划C结果
    document.getElementById('plan-c-result-title').textContent = `Plan C - ${planCTitle}`;
    document.getElementById('plan-c-result').innerHTML = `
        <div class="result-section">
            <h4>5年后的状态</h4>
            <p>${formElements['plan-c-desc'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
        <div class="result-section">
            <h4>关键里程碑</h4>
            <p>${formElements['plan-c-milestones'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
    `;
    
    // 确定最令人兴奋的计划名称
    let excitingPlanName = '';
    if (formElements['exciting-plan'].value === 'plan-a') {
        excitingPlanName = `Plan A - ${planATitle}`;
    } else if (formElements['exciting-plan'].value === 'plan-b') {
        excitingPlanName = `Plan B - ${planBTitle}`;
    } else if (formElements['exciting-plan'].value === 'plan-c') {
        excitingPlanName = `Plan C - ${planCTitle}`;
    } else {
        excitingPlanName = formElements['exciting-plan'].value;
    }
    
    // 更新评估结果
    document.getElementById('evaluation-result').innerHTML = `
        <div class="result-section">
            <h4>最令人兴奋的计划</h4>
            <p>${excitingPlanName}</p>
        </div>
        <div class="result-section">
            <h4>可行性分析</h4>
            <p>${formElements['feasibility'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
        <div class="result-section">
            <h4>行动计划</h4>
            <p>${formElements['action-steps'].value.split('\n').map(line => `<p>${line}</p>`).join('')}</p>
        </div>
    `;
}

// 设置导出按钮事件
function setupExportPDF() {
    document.getElementById('export-pdf').textContent = '导出图片';
    document.getElementById('export-pdf').addEventListener('click', function() {
        // 显示加载提示
        const loadingMsg = document.createElement('div');
        loadingMsg.textContent = '正在生成图片...';
        loadingMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 15px 30px;
            border-radius: 5px;
            z-index: 10000;
            font-size: 16px;
        `;
        document.body.appendChild(loadingMsg);
        
        // 禁用按钮
        const exportBtn = document.getElementById('export-pdf');
        exportBtn.disabled = true;
        exportBtn.textContent = '生成中...';
        
        // 确保切换到结果页面
        switchTab('results');
        
        // 获取结果容器
        const resultsContainer = document.getElementById('results');
        
        // 隐藏按钮等不需要导出的元素
        const buttons = resultsContainer.querySelectorAll('.btn-group');
        const originalButtonDisplay = [];
        buttons.forEach((btn, index) => {
            originalButtonDisplay[index] = btn.style.display;
            btn.style.display = 'none';
        });
        
        // 使用简单的延时确保DOM更新
        setTimeout(function() {
            // 使用dom-to-image生成图片
            domtoimage.toPng(resultsContainer, {
                bgcolor: '#ffffff',
                quality: 0.95,
                width: resultsContainer.offsetWidth,
                height: resultsContainer.offsetHeight,
                style: {
                    'background': 'white',
                    'transform': 'none'
                }
            })
            .then(function(dataUrl) {
                // 创建下载链接
                const link = document.createElement('a');
                link.download = '我的奥德赛计划.png';
                link.href = dataUrl;
                link.click();
                
                // 恢复按钮状态
                buttons.forEach((btn, index) => {
                    btn.style.display = originalButtonDisplay[index];
                });
                
                // 移除加载提示
                loadingMsg.textContent = '导出成功！';
                setTimeout(function() {
                    loadingMsg.remove();
                }, 1500);
                
                // 恢复按钮
                exportBtn.disabled = false;
                exportBtn.textContent = '导出图片';
            })
            .catch(function(error) {
                console.error('图片生成失败:', error);
                
                // 恢复按钮状态
                buttons.forEach((btn, index) => {
                    btn.style.display = originalButtonDisplay[index];
                });
                
                // 修改加载提示
                loadingMsg.textContent = '导出失败，请稍后重试';
                setTimeout(function() {
                    loadingMsg.remove();
                }, 2000);
                
                // 恢复按钮
                exportBtn.disabled = false;
                exportBtn.textContent = '导出图片';
            });
        }, 200);
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 