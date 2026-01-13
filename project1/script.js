// 时间线数据存储
let timelineData = JSON.parse(localStorage.getItem('timelineData')) || [];

// DOM元素
const addBtn = document.getElementById('addBtn');
const formModal = document.getElementById('formModal');
const closeBtn = document.getElementById('closeBtn');
const timelineForm = document.getElementById('timelineForm');
const timelineContainer = document.getElementById('timelineContainer');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    renderTimeline();
    setupEventListeners();
});

// 设置事件监听器
function setupEventListeners() {
    addBtn.addEventListener('click', () => {
        formModal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        formModal.classList.remove('active');
        timelineForm.reset();
    });

    formModal.addEventListener('click', (e) => {
        if (e.target === formModal) {
            formModal.classList.remove('active');
            timelineForm.reset();
        }
    });

    timelineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTimelineItem();
    });
}

// 添加时间点
function addTimelineItem() {
    const date = document.getElementById('date').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const image = document.getElementById('image').value;

    const newItem = {
        id: Date.now(),
        date: date,
        title: title,
        description: description,
        image: image
    };

    timelineData.push(newItem);
    timelineData.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    saveTimelineData();
    renderTimeline();
    
    formModal.classList.remove('active');
    timelineForm.reset();
}

// 删除时间点
function deleteTimelineItem(id) {
    if (confirm('确定要删除这个时间点吗？')) {
        timelineData = timelineData.filter(item => item.id !== id);
        saveTimelineData();
        renderTimeline();
    }
}

// 切换时间点展开/收起
function toggleTimelineItem(id) {
    const item = document.querySelector(`[data-id="${id}"]`);
    if (item) {
        const isActive = item.classList.contains('active');
        
        // 关闭所有其他展开的项目
        document.querySelectorAll('.timeline-item.active').forEach(activeItem => {
            if (activeItem !== item) {
                activeItem.classList.remove('active');
            }
        });
        
        // 切换当前项目
        item.classList.toggle('active', !isActive);
    }
}

// 渲染时间线
function renderTimeline() {
    if (timelineData.length === 0) {
        timelineContainer.innerHTML = '<div class="empty-state">暂无时间点，点击上方按钮添加</div>';
        return;
    }

    let html = '<div class="timeline-line"></div>';
    
    timelineData.forEach(item => {
        const dateStr = formatDate(item.date);
        html += `
            <div class="timeline-item" data-id="${item.id}" onclick="toggleTimelineItem(${item.id})">
                <div class="timeline-point"></div>
                <div class="timeline-date">${dateStr}</div>
                <div class="timeline-title">${escapeHtml(item.title)}</div>
                <div class="timeline-content">
                    ${item.description ? `<div class="timeline-description">${escapeHtml(item.description)}</div>` : ''}
                    ${item.image ? `<img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" class="timeline-image" onerror="this.style.display='none'">` : ''}
                    <button class="delete-btn" onclick="event.stopPropagation(); deleteTimelineItem(${item.id})">删除</button>
                </div>
            </div>
        `;
    });

    timelineContainer.innerHTML = html;
}

// 格式化日期
function formatDate(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// HTML转义
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 保存数据到本地存储
function saveTimelineData() {
    localStorage.setItem('timelineData', JSON.stringify(timelineData));
}

// 将toggleTimelineItem函数暴露到全局作用域
window.toggleTimelineItem = toggleTimelineItem;
window.deleteTimelineItem = deleteTimelineItem;
