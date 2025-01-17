const socketClient = new WebSocket('ws://127.0.0.1:9001');
socketClient.onopen = () => {
    console.log('连接服务端成功');
    const messageObject = {
        message_type: 'CONNECT',
        message_info: 'SSH'
    };
    console.log('发送数据：', messageObject);

    socketClient.send(JSON.stringify(messageObject));
}
socketClient.onmessage = (event) => {
    console.log(event.data);
    // if (event.data === 'true') {
    //     setTimeout(() => {
    //         const messageObject = {
    //             message_type: 'CHAT',
    //             message_info: 'pwd'
    //         };
    //         socketClient.send(JSON.stringify(messageObject))
    //     }, 3000)

    // }
}