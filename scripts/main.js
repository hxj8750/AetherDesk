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
    
        quad.addEventListener('click', (event) => {
            if (event.target !== quad) {
                return;
            }

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

        const quadrantKey = quad.classList[0];

        let deleteTimer = null; //跟踪取消定时器

        
        if (true) { //懒得删除这个条件判断了
            contentList.addEventListener('mousedown',(event)=> {
                // 只响应鼠标左建点击
                if (event.button !== 0) {
                    return;
                }

                if (!container.classList.contains('focused-mode')) { // 如果不是聚焦模式 单击视为完成
                    // 只为非已完成内容框添加完成功能
                    if (quadrantKey !== 'completed') {
                        // 找到被点击的条目
                        const clickedItem = event.target.closest('.goal-item');
                        if (!clickedItem) {
                            return;
                        }

                        // 从data-index获取其在数组中的索引
                        const itemIndex = parseInt(clickedItem.dataset.index, 10);

                        if (isNaN(itemIndex)) return; // 索引为空则返回

                        completeItem(quadrantKey,itemIndex,clickedItem);
                    }
                } else {
                    const clickedItem = event.target.closest('.goal-item');
                    if (!clickedItem) {
                        return;
                    }
                    
                    // 检查是否处于待删除状态
                    if (clickedItem.classList.contains('is-deleting')) {
                        // 第二次点击 确认删除

                        clearTimeout(deleteTimer); //清除定时器

                        const itemIndex = parseInt(clickedItem.dataset.index, 10);

                        clickedItem.classList.remove('is-deleting'); //移除血条动画
                        clickedItem.classList.add('is-disappearing'); //消失动画

                        if (!isNaN(itemIndex)) {
                            deleteItem(quadrantKey, itemIndex, clickedItem);
                        }


                    } else {
                        // 第一次点击 进入待删除状态
                        // 先取消其它条目的待删除状态
                        contentList.querySelectorAll('.is-deleting').forEach(item => {
                            item.classList.remove('is-deleting');
                        });       
                        
                        clearTimeout(deleteTimer); //清除旧的定时器

                        // 触发晃动和血条动画
                        clickedItem.classList.add('is-deleting');

                        // 启动2秒定时器 不操作则恢复
                        deleteTimer = setTimeout(() => {
                            clickedItem.classList.remove('is-deleting');
                        }, 2000);
                    }    
                }
    })
        }


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
        const qudrantKey = quad.classList[0]; //获取该框名称
        const contentList = quad.querySelector('.content-list');
        const items = appData[qudrantKey]; //获取该框对应数据

        // 清空当前列表，防止重复渲染
        contentList.innerHTML = '';

        // 为每一条数据添加HTML元素
        items.forEach((text,index)=>{
            const newItem = document.createElement('div');
            newItem.classList.add('goal-item'); // 一个事先设置好的样式
            newItem.textContent = text;

            newItem.dataset.index = index; 

            contentList.appendChild(newItem);
        });
    }

    function renderAll() { //主要用于初始化时渲染每个内容框
        quadrants.forEach(quad =>{
            renderQuadrant(quad);
        });

    }

    function completeItem(sourceKey, itemIndex, itemElement) {
        // 1. 为被点击的元素添加一个“正在消失”的动画类
        itemElement.classList.add('is-disappearing');
    
        // 2. 监听这个动画的结束事件
        itemElement.addEventListener('animationend', () => {
            // --- 动画播放完毕后，执行以下操作 ---
    
            // a. 数据操作：从原数组中移除，并添加到 'completed' 数组
            const itemText = appData[sourceKey].splice(itemIndex, 1)[0];
            appData.completed.unshift(itemText);
            
            // b. 持久化：将更新后的 appData 保存到 localStorage
            saveData();
    
            // c. 重新渲染所有象限，以确保界面与数据完全同步
            renderAll();
    
        }, { once: true }); // { once: true } 确保此事件只触发一次
    }

    function deleteItem(sourceKey, itemIndex, itemElement) {
        // 1. 触发最终的消除动画 (我们可以复用 is-disappearing)
        itemElement.classList.add('is-disappearing');
    
        // 2. 监听动画结束
        itemElement.addEventListener('animationend', () => {
            // a. 数据操作：从 appData 对应的数组中移除
            appData[sourceKey].splice(itemIndex, 1);
            
            // b. 持久化
            saveData();
    
            // c. 重新渲染所有象限来更新UI和索引
            renderAll();
            
        }, { once: true });
    }
});