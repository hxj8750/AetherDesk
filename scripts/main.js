// console.log("main.js is running!"); 

document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM is ready!"); 

    const container = document.querySelector('.container');
    const quadrants = document.querySelectorAll('.longterm, .shortterm, .thoughts, .completed');

    // 遍历每一个面板，为它们绑定双击事件
    quadrants.forEach(quad => {
        let clickTimeout = null; // 用一个变量来存储定时器
        let clickCount = 0;   // 记录点击次数
    
        quad.addEventListener('click', () => {
            clickCount++; // 每次点击，计数器加1
    
            if (clickCount === 1) {
                // 如果是第一次点击，启动一个定时器
                clickTimeout = setTimeout(() => {
                    clickCount = 0;
                }, 600); 
            } else if (clickCount === 3) {
                // 如果是第三次点击
                clearTimeout(clickTimeout); // 清除掉之前的定时器
                clickCount = 0; // 重置计数器
    
                // ----- 在这里执行你的双击逻辑！-----
                console.log(quad.dataset.title + ' was double-clicked (simulated)!');
    
                const isAlreadyFocused = quad.classList.contains('is-focused');
                quadrants.forEach(q => q.classList.remove('is-focused'));
    
                if (isAlreadyFocused) {
                    container.classList.remove('focused-mode');
                } else {
                    quad.classList.add('is-focused');
                    container.classList.add('focused-mode');
                }
                // ------------------------------------
            }
        });
    });
});