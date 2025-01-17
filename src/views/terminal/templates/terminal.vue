<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css'; // 引入xterm样式
import { EnumCommand } from "@/enums/EnumCommand";
import CommandInfo from '@/interfaces/CommandInfo';
const terminalContainer = ref<HTMLDivElement | null>(null);
const term = ref<Terminal | null>(null);
const socket = ref<WebSocket | null>(null);
let inputBuffer = ''; // 用于存储输入的数据
let cursorPosition = 0; // 光标位置

function calculateTerminalSize(container: HTMLElement, fontSize: number): { cols: number; rows: number } {
    // 假设单个字符的宽度为 fontSize * 0.6，高度为 fontSize * 1.2
    const charWidth = fontSize * 0.6;
    const charHeight = fontSize * 1.21;

    // 获取容器宽高
    let containerWidth = container.offsetWidth;
    let containerHeight = container.offsetHeight;

    // 计算列数和行数
    const cols = Math.floor(containerWidth / charWidth);
    const rows = Math.floor(containerHeight / charHeight);

    return { cols, rows };
}
// 调整终端大小
const resizeTerminal = () => {
    console.log("开始执行");

    if (term.value && terminalContainer.value) {
        const { cols, rows } = calculateTerminalSize(terminalContainer.value, 16); // 16为字体大小
        term.value.resize(cols, rows); // 设置终端列数和行数
    }
};

// 监听窗口大小变化
window.addEventListener('resize', resizeTerminal);

// 清理监听器
onUnmounted(() => {
    window.removeEventListener('resize', resizeTerminal);
    socket.value?.close();
});
// 初始化 xterm
onMounted(() => {
    if (terminalContainer.value) {
        // 创建 xterm 实例
        term.value = new Terminal({
            cursorBlink: true, // 开启光标闪烁
            cursorStyle: 'block', // 'block'（方块光标）、'underline'（下划线光标）或 'bar'（竖条光标）
            fontFamily: "Monaco, Menlo, Consolas, 'Courier New', monospace",
            fontSize: 16, // 设置字体大小为16px
            theme: {
                background: '#1e1e1e', // 背景色
                foreground: '#f8f8f8', // 前景色
                cursor: '#f8f8f8' // 光标颜色
            },
        });
        term.value.open(terminalContainer.value);
        //初始化终端大小
        resizeTerminal()

        // 连接 WebSocket
        console.log("开始连接服务端");
        socket.value = new WebSocket('ws://localhost:9001');
        socket.value.onopen = () => {
            console.log('WebSocket connected');
            const commandInfo: CommandInfo = {
                message_type: EnumCommand.CONNECT,
                message_info: "LOCAL"
            }
            socket.value?.send(JSON.stringify(commandInfo)); // 发送连接命令
        };

        // 从 WebSocket 接收数据并显示在终端
        socket.value.onmessage = (event) => {
            if (term.value) {
                // 判断数据是否为错误信息
                if (event.data.startsWith("[ERROR]")) {
                    const errorMsg = event.data.replace("[ERROR]", "");
                    term.value.writeln('\x1b[38;5;210m' + errorMsg + '\x1b[39m'); // 红色显示错误信息
                } else {
                    term.value.writeln(event.data); // 正常显示数据
                }
            }
        };

        // 终端输入逻辑
        term.value.onData((data) => {
            console.log("输入：" + data);
            switch (data) {
                case '\x1b[A': // 上箭头
                    break;
                case '\x1b[B': // 下箭头
                    break;
                case '\x1b[C': // 右箭头
                    if (cursorPosition < inputBuffer.length) {
                        cursorPosition++;    // 光标位置移动
                        term.value?.write('\x1b[C'); // 显示输入的字符
                    }
                    break;
                case '\x1b[D': // 左箭头
                    if (cursorPosition > 0) {
                        cursorPosition--;    // 光标位置移动
                        term.value?.write('\x1b[D'); // 显示输入的字符
                    }
                    break;
                case '\r':   // 回车
                    const commandInfo: CommandInfo = {
                        message_type: EnumCommand.CHAT,
                        message_info: ""
                    }
                    if (inputBuffer.trim()) {
                        commandInfo.message_info = inputBuffer;
                        inputBuffer = ''; // 清空输入缓冲区
                        cursorPosition = 0; // 光标位置归零
                    }
                    socket.value?.send(JSON.stringify(commandInfo)); // 发送输入缓冲区的内容
                    term.value?.write('\r\n'); // 换行
                    break;
                case '\u007f': // 退格
                    inputBuffer = inputBuffer.slice(0, -1); // 删除缓冲区中的最后一个字符
                    term.value?.write('\b\b'); // 显示退格效果
                    break;
                default:
                    inputBuffer += data; // 添加输入到缓冲区
                    cursorPosition += data.length; // 光标位置移动
                    term.value?.write(data); // 显示输入的字符
                    break;
            }
        });

        // 设置快捷键
        term.value.onKey((event) => {
            const char = event.key;
            console.log("按下：" + char);
        });
    }
});
</script>

<template>
    <div ref="terminalContainer" class="terminalStyle"></div>
</template>

<style lang="scss" scoped>
.terminalStyle {
    width: 100%;
    height: 100%;
    padding: 5px;
    box-sizing: border-box;
    overflow: auto;
}
</style>
