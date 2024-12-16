function writeToConsole(message) {
    const consoleContainer = document.getElementById('content');
    const messageElement = document.createElement('div');
    messageElement.className = 'output';
    messageElement.textContent = message;

    // 添加消息到容器中
    consoleContainer.appendChild(messageElement);

    // 滚动到底部以显示最新消息
    consoleContainer.scrollTop = consoleContainer.scrollHeight;
}

// 示例：写入一些信息到控制台
// writeToConsole("法克鱿");

document.querySelector('.close').addEventListener('click', () => {
    document.querySelector('.console').style.display = 'none';
});

document.querySelector('.minimize').addEventListener('click', () => {
    document.querySelector('.console-content').style.display =
        document.querySelector('.console-content').style.display === 'none' ? 'block' : 'none';
});

document.querySelector('.maximize').addEventListener('click', () => {
    document.querySelector('.console').style.width =
        document.querySelector('.console').style.width === '800px' ? '100%' : '800px';
});

