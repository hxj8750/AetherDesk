// console.log("main.js is running!"); 

document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM is ready!"); 

    const container = document.querySelector('.container');
    const quadrants = document.querySelectorAll('.longterm, .shortterm, .thoughts, .completed');

    //储存四个内容框内的数据
    let appData = {
        longterm: [],
        shortterm: [],
        thoughts: [],
        completed: []
    };

    // 初始化时获取并渲染内容框的内容
    loadData();
    renderAll();

    quadrants.forEach(quad => {
        // 遍历每一个面板，为它们绑定三击事件
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

        // 按下添加按钮后的逻辑
        const addItemForm = quad.querySelector('.add-item-form');
        const addBtn = quad.querySelector('.add-item-btn');
        const addInput = quad.querySelector('.add-item-input');
        const contentList = quad.querySelector('.content-list');

        addBtn.addEventListener('click',()=>{
            const isEditing = addItemForm.classList.contains('is-editing');

            if (isEditing) {
                const text = addInput.value.trim(); //获取输入框的数据 去掉空格
                if (text) {
                    const quadrantKey = quad.classList[0]; //获取当前是哪一个内容框
                    appData[quadrantKey].push(text); //把内容保存到对应数组

                    //这里还需要一个将appData更新到localstorage的函数saveData
                    saveData();

                    //重新渲染界面
                    renderQuadrant(quad);

                }

                // 清空输入框
                addInput.value = '';

                // 关闭编辑模式
                addItemForm.classList.remove('is-editing');
            } else {
                //进入编辑模式
                addItemForm.classList.add('is-editing');
                addInput.focus();
            }
        })

        //处理输入框失焦事件
        addInput.addEventListener('blur',()=>{
            if (addInput.value.trim()==='') {
                addItemForm.classList.remove('is-editing');
            }
        })



    });

    function saveData() {
        localStorage.setItem('aetherDeskData', JSON.stringify(appData)); //ls只能存储字符串 这个函数是把第二个参数转换成json作为value赋值给第一个参数key
        console.log('Data saved');
    }

    function loadData() { //该函数用于在初始化时加载ls里的数据
        const savedData = localStorage.getItem('aetherDeskData');
        if (savedData) {
            appData = JSON.parse(savedData); //将JSON字符串转换回js对象
            console.log('Data loaded');
        }
    }

    function renderQuadrant(quad) { //专门渲染一个内容框内的元素
        const quarantKey = quad.classList[0]; //获取该框名称
        const contentList = quad.querySelector('.content-list');
        const items = appData[quarantKey]; //获取该框对应数据

        // 清空当前列表，防止重复渲染
        contentList.innerHTML = '';

        // 为每一条数据添加HTML元素
        items.forEach(text=>{
            const newItem = document.createElement('div');
            newItem.classList.add('goal-item'); // 一个事先设置好的样式
            newItem.textContent = text;
            contentList.appendChild(newItem);
        });
    }

    function renderAll() { //主要用于初始化时渲染每个内容框
        quadrants.forEach(quad =>{
            renderQuadrant(quad);
        });

    }
});