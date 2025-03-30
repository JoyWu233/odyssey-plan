# 奥德赛计划 - 设计你的三种未来

这是一个帮助用户规划未来人生的交互式网页应用。通过这个应用，用户可以创建三种不同的人生路径（奥德赛计划），综合评估并选择最适合自己的发展方向。

## 核心功能

1. **资源盘点**：评估个人资源（我是谁、我拥有什么、能量来源）
2. **三方案设计**：设计三种不同的未来计划（A/B/C方案）
3. **多维度评估**：通过资源充足度、喜欢程度、自信心和一致性四个维度评估
4. **行动计划**：确定短期可执行的行动步骤
5. **结果导出**：生成完整的奥德赛计划报告和高质量PNG图片

## 文件结构

```
odyssey-plan/
├── index.html          # 主HTML文件，包含所有页面结构和CSS样式
├── script.js           # JavaScript脚本，处理所有交互逻辑和数据处理
├── README.md           # 项目说明文档
├── DEPLOYMENT_GUIDE.md # 阿里云部署指南
└── .gitignore          # Git忽略文件配置
```

## 技术实现细节

### 前端技术栈

- **HTML5**: 语义化标签构建页面结构
- **CSS3**: 自适应布局、动画效果和主题设计
- **原生JavaScript**: 无依赖实现所有交互功能
- **LocalStorage API**: 自动保存用户输入数据
- **html2canvas**: 将页面内容转换为高质量图片
- **QuickChart API**: 生成仪表盘图表

### 核心功能实现

1. **标签页导航**: 
   - 实现四个主要步骤的标签页切换
   - 通过 `switchTab()` 函数处理标签页切换逻辑

2. **数据存储**:
   - 利用 `localStorage` 实现数据自动保存
   - 通过 `saveData()` 和 `loadSavedData()` 函数处理数据持久化

3. **仪表盘评估系统**:
   - 每个计划有四个评估维度: 资源充足度、喜欢程度、自信心、一致性
   - 使用滑块控件进行直观评分，范围0-100
   - 通过 `setupGauges()` 函数实现仪表盘交互

4. **结果生成**:
   - `generateResults()` 函数根据用户输入生成结构化结果页面
   - 自动计算所有评估指标并展示

5. **图片导出**:
   - 使用 `html2canvas` 库将结果页面转换为高质量PNG图片
   - 通过 `setupExportImage()` 函数处理导出逻辑
   - 优化处理小百分比值的显示问题

6. **WeChat ID复制功能**:
   - 实现一键复制微信ID功能
   - 提供用户反馈的复制成功状态提示

## 使用方法

1. **资源盘点**:
   - 输入您的个人称呼（会在结果中显示）
   - 填写"我是谁"、"我拥有什么"和"能量来源"三个部分
   - 点击"下一步"继续

2. **计划设计**:
   - 为三个不同的未来路径分别设置标题、5年目标和关键里程碑
   - 使用滑块评估每个计划的四个维度
   - 点击"下一步"继续

3. **评估与选择**:
   - 选择最令您兴奋的计划
   - 分析各计划的可行性和风险
   - 制定未来3个月的具体行动步骤
   - 点击"生成我的奥德赛计划"查看结果

4. **查看与导出结果**:
   - 查看完整的三方案比较结果
   - 点击"导出图片"将结果保存为PNG图片
   - 图片会以"[您的称呼]的奥德赛计划.png"命名自动下载

## 自定义主题色

三个计划使用了不同的主题色以便区分：
- **Plan A**: 蓝色 (#4361ee) - 代表现实路径
- **Plan B**: 青色 (#4895ef) - 代表替代方案
- **Plan C**: 粉色 (#f72585) - 代表理想生活

这些颜色在所有相关元素中保持一致，包括标题、进度条和评估指标。

## 部署指南

### 本地部署

1. 克隆仓库:
   ```
   git clone https://github.com/JoyWu233/odyssey-plan.git
   ```

2. 直接在浏览器中打开 `index.html` 文件，或使用本地服务器:
   ```
   # 使用Python内置服务器
   python -m http.server
   
   # 或使用Node.js的http-server
   npx http-server
   ```

### 线上部署

#### 阿里云OSS部署（推荐，适合中国大陆访问）

我们提供了详细的阿里云OSS部署指南，请参考项目中的 [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) 文件，按照步骤操作即可快速部署。

主要步骤包括：
1. 创建阿里云OSS存储桶（设置为公共读）
2. 上传网站文件（index.html和script.js）
3. 配置静态网站托管
4. 测试访问

#### 阿里云轻量应用服务器部署

1. 购买轻量应用服务器（推荐2核4G配置）
2. 选择宝塔Linux面板镜像
3. 通过宝塔面板配置网站:
   - 创建站点
   - 上传项目文件
   - 配置SSL证书（可选）
4. 设置域名解析（如有）

#### GitHub Pages部署（适合海外访问）

1. Fork仓库到您的GitHub账号
2. 进入仓库设置(Settings)
3. 导航到Pages选项
4. 选择main分支作为源
5. 保存设置，等待GitHub Pages建立

## 开发指南

### 添加新功能

1. **修改HTML结构**:
   - 在 `index.html` 中适当位置添加新元素
   - 保持与现有CSS样式一致

2. **添加JavaScript逻辑**:
   - 在 `script.js` 中添加新功能函数
   - 在 `init()` 函数中初始化新功能
   - 更新 `formElements` 对象以包含新表单元素

3. **扩展数据存储**:
   - 确保新添加的表单元素在 `saveData()` 和 `loadSavedData()` 中处理

### 修改样式

1. 所有CSS样式都定义在 `index.html` 的 `<style>` 标签中
2. 主题色定义:
   - 计划A: `#4361ee`
   - 计划B: `#4895ef`
   - 计划C: `#f72585`

### 故障排除

如果遇到问题，请检查:
- **图片导出失败**: 检查是否有跨域资源或不支持的CSS属性
- **数据保存问题**: 检查浏览器LocalStorage是否启用
- **样式不一致**: 确保CSS选择器正确匹配DOM结构

## 在线访问

访问 [https://JoyWu233.github.io/odyssey-plan](https://JoyWu233.github.io/odyssey-plan) 即可使用应用。

## 联系方式

如果您在使用过程中有任何问题或建议，请通过以下方式联系我们:

- **微信**: largewind
- **GitHub Issues**: 在项目仓库创建Issue
- **Pull Requests**: 欢迎提交改进代码

## 许可证

本项目采用MIT许可证 - 详情请参见LICENSE文件
