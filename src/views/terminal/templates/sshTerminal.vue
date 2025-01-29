<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css'; // 引入xterm样式
import { EnumCommand } from "@/enums/EnumCommand";
import CommandInfo from '@/interfaces/CommandInfo';
import TerminalInfo from '@/interfaces/TerminalInfo';
import SftpTerminal from '@/views/terminal/templates/sftpTerminal.vue'
// 接收父组件传来的数据
const props = defineProps<{
    connectInfo: TerminalInfo;
}>();
const { connectInfo } = props;

const terminalContainer = ref<HTMLDivElement | null>(null);
const term = ref<Terminal | null>(null);
const fitAddon = ref(new FitAddon());
const socket = ref<WebSocket | null>(null);
const resizeObserver = ref<ResizeObserver | null>(null);
let inputBuffer = '';       // 用于存储输入的数据
let cursorPosition = 0;     // 光标位置
let lastMessage = '';       // 用于判断是否重复显示数据
let commandMode = '';       // 当前的命令模式(vim/less/tail)
let modeIsStarted = false;  // 命令模式是否开始
let isOnDate = false;       // 是否处于输入状态


// 清理监听器
onUnmounted(() => {
    resizeObserver.value?.disconnect();
    socket.value?.close();
});
const commandInfo: CommandInfo = {
    message_type: EnumCommand.CHAT,
    message_info: "",
    connect_info: null
}
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
        term.value.loadAddon(fitAddon.value);
        term.value.open(terminalContainer.value);
        fitAddon.value.fit();
        resizeObserver.value = new ResizeObserver(() => {
            if (fitAddon.value) {
                fitAddon.value.fit();
            }
        });

        resizeObserver.value.observe(terminalContainer.value);
        // 连接 WebSocket
        term.value.writeln(`开始连接服务器: ${connectInfo.terminalIp}:${connectInfo.terminalPort}`)
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
                    console.log(`接收到数据：${backDate}`);
                    term.value.write(backDate); // 正常显示数据
                }
            }
        };

        // 终端输入逻辑  
        term.value.onData((data) => {
            if (!isOnDate) {
                return
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
                    lastMessage = inputBuffer;
                    if (!modeIsStarted) {
                        estimateMode(inputBuffer); // 判断命令模式
                    }
                    inputBuffer = ''; // 清空输入缓冲区
                    cursorPosition = 0; // 光标位置归零
                    socket.value?.send(JSON.stringify(commandInfo)); // 发送输入缓冲区的内容
                    isOnDate = false;
                    break;
                case '\u007f': // 退格
                    if (cursorPosition > 0) {
                        // 当前字符长度
                        let currentChar = inputBuffer.length;
                        let inputDate = updateInputDate(inputBuffer, cursorPosition);
                        // 光标向左移动 n 格
                        term.value?.write(`\x1b[${cursorPosition}D`);
                        // 输出 n 个空格，覆盖目标字符
                        term.value?.write(' '.repeat(currentChar));
                        // 光标再向左移动 n 格，回到原始位置
                        term.value?.write(`\x1b[${currentChar}D`);
                        // 写入数据
                        term.value?.write(inputDate);
                        // 光标再向左移动 n 格，回到原始位置
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
                    if (currentChar - cursorPosition > 0) {
                        term.value?.write(`\x1b[${currentChar - cursorPosition}D`);
                    }
                    inputBuffer = inputDate
                    cursorPosition += data.length; // 光标位置移动
                    isOnDate = false;
                    break;
            }
        });

        // 快捷键
        term.value.onKey((event) => {
            if (modeIsStarted) {
                handleModeInput(event.key, commandMode)
            } else {
                isOnDate = true;
            }
        });
    }
});
// 删除指定位置的字符
function updateInputDate(inputBuffer: string, index: number): string {
    // 确保 index 在合理范围内
    if (index < 0 || index > inputBuffer.length) {
        // 如果 index 无效，返回原始字符串
        return inputBuffer;
    }
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
        console.log(`命令模式：${commandMode}`);
    } else if (input.startsWith('less')) {
        commandMode = 'less';
        modeIsStarted = true;
        console.log(`命令模式：${commandMode}`);
    } else if (input.startsWith('tail')) {
        commandMode = 'tail';
        modeIsStarted = true;
        console.log(`命令模式：${commandMode}`);
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
        try {
            const result = lastMessage.split('less')[1].trim();
            if (output.trim() === (result + ': No such file or directory')) {
                commandMode = '';
                modeIsStarted = false;
            }
        } catch (e) {
        }
    }
}
// 处理模式的输入'
function handleModeInput(input: string, mode: string): void {
    console.log(`处理模式输入：${input} ${mode}`);
    if (mode === 'vim') {
        commandInfo.message_info = input;
        socket.value?.send(JSON.stringify(commandInfo)); // 发送输入缓冲区的内容
        isOnDate = false;
        return;
    }
    if (mode === 'less') {
        if (lastMessage.startsWith('/')) {
            if (input === 'n' || input === 'N') {
                commandInfo.message_info = input;
                socket.value?.send(JSON.stringify(commandInfo)); // 发送输入缓冲区的内容
                isOnDate = false;
                return;
            }
        }
    }
    isOnDate = true;
}
const sftpHeight = ref(600); // 默认 400px
// 计算容器高度
const containerHeight = computed(() => {
    console.log("是否显示sftp：", connectInfo.terminalIsSftp);

    if (connectInfo.terminalIsSftp === true) {
        console.log(100 - 50);
        fitAddon.value.fit();
        return `calc(100% - ${sftpHeight.value}px)`;
    }
    console.log(100);
    fitAddon.value.fit();
    return `calc(100%)`;

});
</script>

<template>
    <div id="sshTerminal">
        <div ref="terminalContainer" class="terminalStyle" :style="{ height: containerHeight }"></div>
        <div class="terminal-sftp" :style="{ height: sftpHeight + 'px' }" v-if="connectInfo.terminalIsSftp === true">
            <div class="control-panel"></div>
            <SftpTerminal />
        </div>
    </div>

</template>

<style lang="scss" scoped>
#sshTerminal {
    width: 100%;
    height: 100%;
}



.terminalStyle {
    width: 100%;
}

.terminal-sftp {
    width: 100%;
    background-color: rgb(91, 90, 89);

    .control-panel {
        width: 100%;
        height: 3px;

        &:hover {
            background-color: rgb(181, 183, 182);
            cursor: ns-resize;
        }
    }
}
</style>
