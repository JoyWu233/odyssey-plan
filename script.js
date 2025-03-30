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

// 生成结果
function generateResults() {
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
    
    // 更新计划B结果
    const planBDesc = formElements['plan-b-desc'].value || '【未填写】';
    const planBMilestones = formElements['plan-b-milestones'].value || '【未填写】';
    
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
    
    // 更新计划C结果
    const planCDesc = formElements['plan-c-desc'].value || '【未填写】';
    const planCMilestones = formElements['plan-c-milestones'].value || '【未填写】';
    
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
        // 确保数据已保存
        saveData();
        
        // 确保刷新结果显示
        generateResults();
        
        // 确保切换到结果页面
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
            // 获取结果容器
            const resultsContainer = document.getElementById('results');
            
            // 记录原始样式
            const originalBackground = resultsContainer.style.background;
            const originalColor = resultsContainer.style.color;
            
            // 设置背景为白色
            resultsContainer.style.background = '#ffffff';
            resultsContainer.style.color = '#333333';
            
            // 查找并暂时隐藏按钮
            const btnGroup = resultsContainer.querySelector('.btn-group');
            const btnGroupDisplay = btnGroup.style.display;
            btnGroup.style.display = 'none';
            
            // 添加标题和日期
            const titleHeader = document.createElement('div');
            const date = new Date();
            const dateStr = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
            
            titleHeader.innerHTML = `
                <div style="text-align: center; margin-bottom: 20px; padding-top: 20px;">
                    <h2 style="color: #4361ee; font-size: 28px; margin-bottom: 5px;">我的奥德赛计划</h2>
                    <p style="color: #666666; font-size: 14px;">生成日期: ${dateStr}</p>
                </div>
            `;
            
            resultsContainer.insertBefore(titleHeader, resultsContainer.firstChild);
            
            // 强制设置所有文本颜色
            const allTextElements = resultsContainer.querySelectorAll('p, h2, h3, h4');
            const originalStyles = [];
            
            allTextElements.forEach(el => {
                originalStyles.push({
                    element: el,
                    color: el.style.color
                });
                
                if (el.tagName === 'H2') {
                    el.style.color = '#4361ee';
                } else if (el.tagName === 'H3') {
                    el.style.color = '#4361ee';
                } else if (el.tagName === 'H4') {
                    el.style.color = '#3f37c9';
                } else if (el.tagName === 'P') {
                    el.style.color = '#333333';
                }
            });
            
            // 设置所有卡片背景
            const allCards = resultsContainer.querySelectorAll('.result-card');
            const originalCardStyles = [];
            
            allCards.forEach(card => {
                originalCardStyles.push({
                    element: card,
                    background: card.style.background,
                    boxShadow: card.style.boxShadow
                });
                
                card.style.background = '#ffffff';
                card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            });
            
            // 使用简单配置进行转换
            setTimeout(() => {
                html2canvas(resultsContainer, {
                    backgroundColor: '#ffffff',
                    scale: 2,  // 使用2倍缩放获得更清晰的图像
                    useCORS: true,
                    allowTaint: true,
                    scrollX: 0,
                    scrollY: 0,
                    windowWidth: document.documentElement.offsetWidth,
                    windowHeight: document.documentElement.offsetHeight,
                    onclone: function(clonedDoc) {
                        const clonedResults = clonedDoc.getElementById('results');
                        clonedResults.style.background = '#ffffff';
                        clonedResults.style.padding = '20px';
                        
                        // 确保克隆中的所有文本颜色正确
                        const clonedTexts = clonedResults.querySelectorAll('p, h2, h3, h4');
                        clonedTexts.forEach(el => {
                            if (el.tagName === 'H2') {
                                el.style.color = '#4361ee';
                            } else if (el.tagName === 'H3') {
                                el.style.color = '#4361ee';
                            } else if (el.tagName === 'H4') {
                                el.style.color = '#3f37c9';
                            } else if (el.tagName === 'P') {
                                el.style.color = '#333333';
                            }
                        });
                        
                        // 确保克隆中的所有卡片背景正确
                        const clonedCards = clonedResults.querySelectorAll('.result-card');
                        clonedCards.forEach(card => {
                            card.style.background = '#ffffff';
                            card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                        });
                    }
                }).then(canvas => {
                    // 创建下载链接
                    canvas.toBlob(function(blob) {
                        const url = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.download = '我的奥德赛计划.png';
                        link.href = url;
                        link.click();
                        URL.revokeObjectURL(url);
                        
                        // 恢复原始样式
                        resultsContainer.style.background = originalBackground;
                        resultsContainer.style.color = originalColor;
                        
                        btnGroup.style.display = btnGroupDisplay;
                        resultsContainer.removeChild(titleHeader);
                        
                        // 恢复所有文本元素的原始颜色
                        originalStyles.forEach(item => {
                            item.element.style.color = item.color;
                        });
                        
                        // 恢复所有卡片的原始样式
                        originalCardStyles.forEach(item => {
                            item.element.style.background = item.background;
                            item.element.style.boxShadow = item.boxShadow;
                        });
                        
                        // 显示成功消息
                        loadingMsg.textContent = '导出成功！';
                        loadingMsg.style.background = 'rgba(40, 167, 69, 0.8)';
                        setTimeout(() => loadingMsg.remove(), 1500);
                        
                        // 恢复按钮
                        exportBtn.disabled = false;
                        exportBtn.textContent = '导出图片';
                    }, 'image/png', 1.0);
                }).catch(err => {
                    console.error('生成图片出错:', err);
                    
                    // 恢复原始样式
                    resultsContainer.style.background = originalBackground;
                    resultsContainer.style.color = originalColor;
                    
                    btnGroup.style.display = btnGroupDisplay;
                    if (resultsContainer.contains(titleHeader)) {
                        resultsContainer.removeChild(titleHeader);
                    }
                    
                    // 恢复所有文本元素的原始颜色
                    originalStyles.forEach(item => {
                        item.element.style.color = item.color;
                    });
                    
                    // 恢复所有卡片的原始样式
                    originalCardStyles.forEach(item => {
                        item.element.style.background = item.background;
                        item.element.style.boxShadow = item.boxShadow;
                    });
                    
                    // 显示错误消息
                    loadingMsg.textContent = '导出失败，请稍后重试';
                    loadingMsg.style.background = 'rgba(220, 53, 69, 0.8)';
                    setTimeout(() => loadingMsg.remove(), 2000);
                    
                    // 恢复按钮
                    exportBtn.disabled = false;
                    exportBtn.textContent = '导出图片';
                });
            }, 300);
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

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 