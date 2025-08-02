console.log("main.js is running!"); 

document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM is ready!"); 

    const container = document.querySelector('.container');
    const quadrants = document.querySelectorAll('.longterm, .shortterm, .thoughts, .completed');

    // 遍历每一个面板，为它们绑定双击事件
    quadrants.forEach(quad => {
        quad.addEventListener('dblclick', () => {
            
            // 检查当前是否已经有面板处于焦点状态
            const isAlreadyFocused = quad.classList.contains('is-focused');

            // 在做任何操作前，先把所有面板的 is-focused 类都去掉
            quadrants.forEach(q => q.classList.remove('is-focused'));

            if (isAlreadyFocused) {
                // 如果当前面板已经是焦点，说明想退出焦点模式
                container.classList.remove('focused-mode');
            } else {
                // 如果当前面板不是焦点，说明想进入焦点模式
                quad.classList.add('is-focused'); // 给被双击的面板加上焦点类
                container.classList.add('focused-mode'); // 切换容器到焦点模式
            }
        });
    });

});