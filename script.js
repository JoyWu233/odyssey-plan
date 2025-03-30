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
        loadingMsg.textContent = '正在准备内容...';
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
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        document.body.appendChild(loadingMsg);
        
        // 禁用按钮
        const exportBtn = document.getElementById('export-pdf');
        exportBtn.disabled = true;
        exportBtn.textContent = '生成中...';
        
        // 确保切换到结果页面
        switchTab('results');
        
        try {
            // 使用HTML2Canvas直接渲染整个结果页面
            const resultsContainer = document.getElementById('results');
            
            // 备份原始样式
            const originalStyle = resultsContainer.getAttribute('style') || '';
            const originalBackground = document.body.style.background;
            
            // 临时设置body背景为纯白
            document.body.style.background = '#ffffff';
            
            // 临时隐藏按钮
            const buttons = resultsContainer.querySelectorAll('.btn-group');
            buttons.forEach(btn => btn.style.display = 'none');
            
            // 临时调整结果容器样式以优化导出效果
            resultsContainer.style.width = '800px';
            resultsContainer.style.margin = '0 auto';
            resultsContainer.style.padding = '40px';
            resultsContainer.style.background = '#ffffff';
            resultsContainer.style.boxShadow = 'none';
            resultsContainer.style.color = '#333333';
            
            // 临时增强文本样式以提高清晰度
            const cardElements = resultsContainer.querySelectorAll('.result-card');
            const originalCardStyles = [];
            cardElements.forEach((card, i) => {
                originalCardStyles[i] = card.getAttribute('style') || '';
                card.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                card.style.marginBottom = '30px';
                card.style.backgroundColor = '#ffffff';
                card.style.borderRadius = '8px';
                card.style.padding = '25px';
            });
            
            const headings = resultsContainer.querySelectorAll('h3');
            const originalHeadingStyles = [];
            headings.forEach((h, i) => {
                originalHeadingStyles[i] = h.getAttribute('style') || '';
                h.style.fontSize = '28px';
                h.style.color = '#4361ee';
                h.style.fontWeight = 'bold';
                h.style.marginBottom = '20px';
                h.style.borderBottom = '2px solid #4895ef';
                h.style.paddingBottom = '10px';
            });
            
            const subHeadings = resultsContainer.querySelectorAll('h4');
            const originalSubHeadingStyles = [];
            subHeadings.forEach((h, i) => {
                originalSubHeadingStyles[i] = h.getAttribute('style') || '';
                h.style.fontSize = '22px';
                h.style.color = '#3f37c9';
                h.style.fontWeight = 'bold';
                h.style.marginBottom = '15px';
            });
            
            const paragraphs = resultsContainer.querySelectorAll('p');
            const originalParagraphStyles = [];
            paragraphs.forEach((p, i) => {
                originalParagraphStyles[i] = p.getAttribute('style') || '';
                p.style.fontSize = '16px';
                p.style.color = '#333333';
                p.style.lineHeight = '1.8';
                p.style.marginBottom = '12px';
            });
            
            // 增加顶部标题
            const titleDiv = document.createElement('div');
            titleDiv.style.cssText = `
                text-align: center;
                margin-bottom: 30px;
            `;
            titleDiv.innerHTML = `
                <h1 style="color: #4361ee; font-size: 32px; margin-bottom: 10px; font-weight: bold;">奥德赛计划</h1>
                <p style="color: #666; font-size: 16px;">生成日期：${new Date().toLocaleDateString('zh-CN')}</p>
            `;
            resultsContainer.insertBefore(titleDiv, resultsContainer.firstChild);
            
            loadingMsg.textContent = '正在生成超清图片...';
            
            // 获取设备像素比
            const pixelRatio = window.devicePixelRatio || 1;
            const scale = Math.max(2.5, pixelRatio); // 适中的缩放
            
            setTimeout(() => {
                html2canvas(resultsContainer, {
                    scale: scale,
                    useCORS: true,
                    allowTaint: true,
                    backgroundColor: '#ffffff',
                    logging: false,
                    letterRendering: true,
                    removeContainer: false
                }).then(canvas => {
                    loadingMsg.textContent = '正在保存图片...';
                    
                    // 处理图片并下载
                    try {
                        canvas.toBlob(function(blob) {
                            if (blob) {
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.download = '我的奥德赛计划.png';
                                link.href = url;
                                link.click();
                                URL.revokeObjectURL(url);
                                
                                loadingMsg.textContent = '导出成功！';
                                setTimeout(() => loadingMsg.remove(), 1500);
                            } else {
                                throw new Error('Failed to create blob');
                            }
                        }, 'image/png', 1.0);
                    } catch (e) {
                        console.error('处理图片出错:', e);
                        
                        // 备用方案：尝试使用toDataURL
                        try {
                            const imgData = canvas.toDataURL('image/png');
                            const link = document.createElement('a');
                            link.download = '我的奥德赛计划.png';
                            link.href = imgData;
                            link.click();
                            
                            loadingMsg.textContent = '导出成功！';
                            setTimeout(() => loadingMsg.remove(), 1500);
                        } catch (innerError) {
                            console.error('备用导出方法失败:', innerError);
                            loadingMsg.textContent = '导出失败，请稍后重试';
                            setTimeout(() => loadingMsg.remove(), 2000);
                        }
                    }
                    
                    // 移除临时添加的标题
                    if (titleDiv && titleDiv.parentNode) {
                        titleDiv.parentNode.removeChild(titleDiv);
                    }
                    
                    // 恢复原始样式
                    resultsContainer.setAttribute('style', originalStyle);
                    document.body.style.background = originalBackground;
                    
                    // 恢复所有元素的原始样式
                    cardElements.forEach((card, i) => card.setAttribute('style', originalCardStyles[i]));
                    headings.forEach((h, i) => h.setAttribute('style', originalHeadingStyles[i]));
                    subHeadings.forEach((h, i) => h.setAttribute('style', originalSubHeadingStyles[i]));
                    paragraphs.forEach((p, i) => p.setAttribute('style', originalParagraphStyles[i]));
                    buttons.forEach(btn => btn.style.display = '');
                    
                    // 恢复按钮
                    exportBtn.disabled = false;
                    exportBtn.textContent = '导出图片';
                    
                }).catch(err => {
                    console.error('生成图片出错:', err);
                    loadingMsg.textContent = '导出失败，请稍后重试';
                    setTimeout(() => loadingMsg.remove(), 2000);
                    
                    // 移除临时添加的标题
                    if (titleDiv && titleDiv.parentNode) {
                        titleDiv.parentNode.removeChild(titleDiv);
                    }
                    
                    // 恢复原始样式
                    resultsContainer.setAttribute('style', originalStyle);
                    document.body.style.background = originalBackground;
                    
                    // 恢复所有元素的原始样式
                    cardElements.forEach((card, i) => card.setAttribute('style', originalCardStyles[i]));
                    headings.forEach((h, i) => h.setAttribute('style', originalHeadingStyles[i]));
                    subHeadings.forEach((h, i) => h.setAttribute('style', originalSubHeadingStyles[i]));
                    paragraphs.forEach((p, i) => p.setAttribute('style', originalParagraphStyles[i]));
                    buttons.forEach(btn => btn.style.display = '');
                    
                    // 恢复按钮
                    exportBtn.disabled = false;
                    exportBtn.textContent = '导出图片';
                });
            }, 500);
            
        } catch (error) {
            console.error('导出过程出错:', error);
            loadingMsg.textContent = '导出失败，请稍后重试';
            setTimeout(() => loadingMsg.remove(), 2000);
            
            // 恢复按钮
            exportBtn.disabled = false;
            exportBtn.textContent = '导出图片';
        }
    });
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init); 