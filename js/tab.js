// 抽取对象：Tab对象，该对象具有切换功能、添加功能、删除功能、修改功能
var that;
class Tab {
    constructor(id) {
        // 获取元素
        that = this;
        this.main = document.querySelector(id);
        
        this.add = this.main.querySelector(".tabAdd");
        // 获取li的父元素
        this.ul = this.main.querySelector(".firstnav ul:first-child");
        // section 的父元素
        this.fsection = this.main.querySelector(".tabContent");
        this.init(); // new以后就调用
    }
    // 事件绑定
    init() {
        this.updateNode(); // 获取所有的 li和 section
        // init 初始化操作，让相关的元素绑定事件
        this.add.onclick = this.addTab;
        for (var i = 0; i < this.lis.length; i++) {
            this.lis[i].index = i;
            this.lis[i].onclick = this.toggleTab; // 不加小括号，不然页面一加载就直接调用，需要点击才调用
            this.remove[i].onclick = this.removeTab;
            // 双击事件
            this.spans[i].ondblclick = this.editTab;
            this.sections[i].ondblclick = this.editTab;
        }
    }
    // 因为动态添加元素需要获取对应的元素，所以该方法用于获取所有更新后的元素
    updateNode() {
        this.lis = this.main.querySelectorAll("li");
        this.sections = this.main.querySelectorAll("section");
        this.remove = this.main.querySelectorAll(".fa-window-close");
        // 获取所有li的第一个span
        this.spans = this.main.querySelectorAll(".firstnav li span:first-child");
    }

    // 1. 切换功能
    toggleTab() {
        // console.log(this.index);
        that.clearClass();
        this.className = "liActive"; 
        // 需要constrctor里的this
        that.sections[this.index].className = "conActive";
        
    }
    // 移除所有class
    clearClass() {
        for (var i = 0; i < this.lis.length; i++) {
            this.lis[i].className = "";
            this.sections[i].className = "";
        }
    }
    // 2. 添加功能
    addTab() {
        that.clearClass();
        // （1） 创建li元素和section元素
        var random = Math.random();
        var li = '<li class="liActive"><span>新选项卡</span><span class="fa fa-window-close"></span></li>';
        var section = '<section class="conActive">测试' + random + '</section>';
        // （2） 把这两个元素追加到对应到父元素中,高级做法：insertAdjacentHTML()可以直接把字符串格式元素添加到父元素中
        // appendChild不支持追加字符串的子元素，insertAdjacentHTML支持追加字符串的元素
        that.ul.insertAdjacentHTML("beforeend", li);
        that.fsection.insertAdjacentHTML("beforeend", section);
        that.init(); // 获取最新所有的元素
    }
    // 3. 删除功能
    removeTab(ev) {
        // 阻止冒泡，防止触发li的切换点击事件 
        ev.stopPropagation();
        // 点击"x"号可以删除这个索引号对应的 li和 section
        var index = this.parentNode.index;
        console.log(index);
        // 根据索引号删除对应的 li和 section
        that.lis[index].remove();
        that.sections[index].remove();
        that.init();
        // 当删除的不是选定状态的li时，使那个li保持原有状态
        if (document.querySelector(".liActive")) return;
        // 当删除了选中状态的li时，让它的前一个li处于选定状态
        index--;
        // 自动调用点击事件，不需要鼠标触发；&&前面为真，则执行后面（判断index是否存在）
        that.lis[index] && that.lis[index].click();
    }
    // 4. 修改功能
    editTab() {
        var str = this.innerHTML;
        // 浏览器的默认样式：双击会默认选定文字，此时需要双击禁止选中文字
        window.getSelection ? window.getSelection().removeAllRanges() : document.getSelection.empty();
        // 双击时，生成文本框
        this.innerHTML = '<input type = "text" />';
        var input = this.children[0];
        input.value = str;
        input.select(); // 文本框里的文字处于选中状态
        // 当离开文本框，就把文本框的值给span
        input.onblur = function() {
            this.parentNode.innerHTML = this.value;
        }
        // 按下回车也可以把文本框里面的值给span
        input.onkeyup = function(ev) {
            if (ev.keyCode == 13) {
                this.blur(); // 自动调用失去焦点事件，不需要鼠标离开操作
            }
        }
    }
}
var tab = new Tab('#tab');
