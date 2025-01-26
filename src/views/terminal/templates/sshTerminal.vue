<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css'; // 引入xterm样式
import { EnumCommand } from "@/enums/EnumCommand";
import CommandInfo from '@/interfaces/CommandInfo';
import TerminalInfo from '@/interfaces/TerminalInfo';

// 接收父组件传来的数据
const props = defineProps<{
    connectInfo: TerminalInfo;
}>();
const { connectInfo } = props;

const terminalContainer = ref<HTMLDivElement | null>(null);
const term = ref<Terminal | null>(null);
const socket = ref<WebSocket | null>(null);
let inputBuffer = '';       // 用于存储输入的数据
let cursorPosition = 0;     // 光标位置
let lastMessage = '';       // 用于判断是否重复显示数据
let commandMode = '';       // 当前的命令模式(vim/less/tail)
let modeIsStarted = false;  // 命令模式是否开始
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
        let data = `开始连接服务器: ${connectInfo.terminalIp}:${connectInfo.terminalPort}`;
        term.value.writeln(data)
        socket.value = new WebSocket(`ws://${connectInfo.terminalIp}:${connectInfo.terminalPort}`);
        socket.value = new WebSocket('ws://localhost:9001');
        socket.value.onopen = () => {
            console.log('WebSocket connected');
            const commandInfo: CommandInfo = {
                message_type: EnumCommand.CONNECT,
                message_info: "SSH",
                connect_info: {
                    ip: connectInfo.terminalIp,
                    port: connectInfo.terminalPort,
                    username: connectInfo.terminalUserName,
                    password: connectInfo.terminalPassword,
                    connect_type: connectInfo.terminalType
                }
            }
            socket.value?.send(JSON.stringify(commandInfo)); // 发送连接命令
        };

        // 从 WebSocket 接收数据并显示在终端
        socket.value.onmessage = (event) => {
            if (term.value) {
                if (event.data === "SUCCESS") {
                    term.value.writeln("连接成功"); // 正常显示数据
                    return
                }
                let backDate = event.data;
                // 判断返回数据是否重复
                if (lastMessage === event.data.slice(0, lastMessage.length)) {
                    backDate = event.data.slice(lastMessage.length)
                }
                if (lastMessage !== backDate) {
                    checkMode(backDate);
                    term.value.write(backDate); // 正常显示数据
                }
            }
        };

        // 终端输入逻辑  
        term.value.onData((data) => {
            const commandInfo: CommandInfo = {
                message_type: EnumCommand.CHAT,
                message_info: "",
                connect_info: null
            }
            if(modeIsStarted){
                handleModeInput(data);
            }
            // 处理输入
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
                        term.value?.write('\x1b[1D'); // 显示输入的字符
                    }
                    break;
                case '\r':   // 回车
                    commandInfo.message_info = inputBuffer;
                    lastMessage = inputBuffer
                    inputBuffer = ''; // 清空输入缓冲区
                    cursorPosition = 0; // 光标位置归零
                    estimateMode(inputBuffer); // 判断命令模式
                    socket.value?.send(JSON.stringify(commandInfo)); // 发送输入缓冲区的内容
                    break;
                case '\u007f': // 退格
                    if (cursorPosition > 0) {
                        // 当前字符长度
                        let currentChar = inputBuffer.length;
                        let inputDate = updateInputDate(inputBuffer, cursorPosition);
                        console.log(`更新前的字符串：${inputBuffer},更新后的字符串：${inputDate}, 光标位置:${cursorPosition}`);
                        // 光标向左移动 n 格
                        term.value?.write(`\x1b[${cursorPosition}D`);
                        // 输出 n 个空格，覆盖目标字符
                        term.value?.write(' '.repeat(currentChar));
                        // 光标再向左移动 n 格，回到原始位置
                        term.value?.write(`\x1b[${currentChar}D`);
                        // 写入数据
                        term.value?.write(inputDate);
                        // 光标再向左移动 n 格，回到原始位置
                        console.log("光标左移动：", currentChar - cursorPosition);
                        if (currentChar - cursorPosition > 0) {
                            term.value?.write(`\x1b[${currentChar - cursorPosition}D`);
                        }
                        inputBuffer = inputDate
                        cursorPosition--; // 光标位置移动
                    }
                    break;
                case '\x03': // Ctrl + C
                    console.log("检测到 Ctrl + C");
                    commandInfo.message_info = data
                    socket.value?.send(JSON.stringify(commandInfo)); // 发送输入缓冲区的内容
                    break;
                default:
                    // 当前字符长度
                    let currentChar = inputBuffer.length;
                    let inputDate = addInputDate(inputBuffer, data, cursorPosition);
                    console.log(`更新前的字符串：${inputBuffer},更新后的字符串：${inputDate}, 光标位置:${cursorPosition}`);
                    // 光标向左移动 n 格
                    if (cursorPosition > 0) {
                        term.value?.write(`\x1b[${cursorPosition}D`);
                        // 输出 n 个空格，覆盖目标字符
                        term.value?.write(' '.repeat(currentChar));
                        // 光标再向左移动 n 格，回到原始位置
                        term.value?.write(`\x1b[${currentChar}D`);
                    }
                    // 写入数据
                    term.value?.write(inputDate);
                    // 光标再向左移动 n 格，回到原始位置
                    console.log("光标左移动：", currentChar - cursorPosition);
                    if (currentChar - cursorPosition > 0) {
                        term.value?.write(`\x1b[${currentChar - cursorPosition}D`);
                    }
                    inputBuffer = inputDate
                    cursorPosition += data.length; // 光标位置移动
                    break;
            }
        });

        // 快捷键
        term.value.onKey((event) => {
            console.log(event);

        });
    }
});
// 删除指定位置的字符
function updateInputDate(inputBuffer: string, index: number): string {
    console.log(index);
    console.log(inputBuffer.length);

    // 确保 index 在合理范围内
    if (index < 0 || index > inputBuffer.length) {
        // 如果 index 无效，返回原始字符串
        return inputBuffer;
    }
    // 使用 slice 来删除指定位置的字符
    const inputFront = inputBuffer.slice(0, index - 1);
    const inputEnd = inputBuffer.slice(index);
    console.log(`更新前的字符串：${inputBuffer},更新前的前半部分：${inputFront},更新前的后半部分：${inputEnd}`);

    // 合并字符串
    const updatedBuffer = inputBuffer.slice(0, index - 1) + inputBuffer.slice(index);
    // 返回更新后的字符串
    return updatedBuffer;
}
// 添加字符
function addInputDate(inputBuffer: string, addDate: string, index: number): string {
    // 使用 slice 来删除指定位置的字符
    const inputFront = inputBuffer.slice(0, index);
    const inputEnd = inputBuffer.slice(index);
    // 合并字符串
    const updatedBuffer = inputFront + addDate + inputEnd
    // 返回更新后的字符串
    return updatedBuffer;
}

// 判断命令模式
function estimateMode(input: string): void {
    if (input.startsWith('vim')) {
        commandMode = 'vim';
        modeIsStarted = true;
    } else if (input.startsWith('less')) {
        commandMode = 'less';
        modeIsStarted = true;
    } else if (input.startsWith('tail')) {
        commandMode = 'tail';
        modeIsStarted = true;
    } else {
        commandMode = '';
    }
}
// 校验命令模式
function checkMode(output: string): void {
    if (!modeIsStarted) {
        return;
    }
    if (commandMode === 'less') {
        const result = lastMessage.split('less')[1].trim();
        if (output.trim() === (result + ': No such file or directory')) {
            commandMode = '';
            modeIsStarted = false;
        }
    }
}
// 处理模式的输入'
function handleModeInput(input: string): void {
    
}
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
