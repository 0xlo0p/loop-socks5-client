const net = require('net')
const dns = require('dns')
const ByteBuffer = require('./ByteBuffer.js')
const AUTHMETHODS = { //只支持这两种方法认证
    NOAUTH: 0,
    USERPASS: 2
}
const STEP = {
    SELECT_AUTH_METHOD:0,
    SEND_AUTH:1,
    AUTHED:2,
    FAIL:3,
    CONNECTED:4
}
function PACK_AUTH(u,p){
    let buffer = new ByteBuffer(1024)
    buffer.putByte(1)
    buffer.putByte(u.length)
    buffer.putString(u)
    buffer.putByte(p.length)
    buffer.putString(p)
    return buffer.getBuffer()
}
function PACK_CONNECT(domain,port){
    let buffer = new ByteBuffer(1024)
    buffer.putByte(5)
    buffer.putByte(1)//1 connect 2 bind 3 UDP
    buffer.putByte(1)//RSV
    buffer.putByte(3)//1 ipv4  3 domain 4 ipv6
    buffer.putByte(domain.length)
    buffer.putString(domain)
    buffer.putShort(port)
    return buffer.getBuffer()
}
class loopSocsk5 {
    constructor(on_connect,on_msg,on_error,on_disconnect) {
        this.on_connect = on_connect
        this.on_msg = on_msg
        this.on_error = on_error
        this.on_disconnect = on_disconnect
        this.step = STEP.SELECT_AUTH_METHOD
    }

    createConnection(option){
        this.client = new net.Socket()
        this.client.on('error',(err)=>{
            console.error(err)
            this.on_error(err)
        })
        this.client.on('close',(had_error)=>{
            console.log("is error: %j",had_error)
            this.on_disconnect(had_error)
        })
        this.client.on('data',(data)=>{
            if(this.step === STEP.CONNECTED){
                this.on_msg(data)
                return
            }
            console.log('socks5 receive: %s',data.toString('hex'))
            let buffer = new ByteBuffer()
            buffer.wrap(data)
            const version = buffer.getByte()
            if(this.step === STEP.SELECT_AUTH_METHOD){
                const METHOD = buffer.getByte()
                console.log('[socks5] SELECT_AUTH_METHOD: %j',METHOD)
                this.client.write(PACK_AUTH(option.proxy_user,option.proxy_pwd))
                this.step = STEP.SEND_AUTH
            }else if(this.step === STEP.SEND_AUTH){
                const AUTH_RESULT = buffer.getByte()
                console.log('[socks5] AUTH_RESULT: %j',AUTH_RESULT)
                if(AUTH_RESULT === 0) {
                    this.step = STEP.AUTHED
                    this.client.write(PACK_CONNECT(option.target_domain,option.target_port))
                }
                else{
                    this.on_error('socks5 auth fail')
                    this.client.destroy()
                }
            }else if(this.step === STEP.AUTHED){
                const RESPONSE = buffer.getByte()
                if(RESPONSE !== 0){
                    let detail = ''
                    switch (RESPONSE) {
                        case 1:
                            detail = '代理服务器故障'
                            break
                        case 2:
                            detail = '代理服务器规则集不允许连接'
                            break
                        case 3:
                            detail = '网络无法访问'
                            break
                        case 4:
                            detail = '目标服务器无法访问（主机名无效）'
                            break
                        case 5:
                            detail = '连接目标服务器被拒绝'
                            break
                        case 6:
                            detail = 'TTL已过期'
                            break
                        case 7:
                            detail = '不支持的命令'
                            break
                        case 8:
                            detail = '不支持的目标服务器地址类型'
                            break
                        default:
                            detail = 'unknown: '+RESPONSE
                    }
                    this.on_error(detail)
                    this.on_disconnect(true)
                    this.client.destroy()
                }
                const RSV = buffer.getByte()
                const ADDR_TYPE = buffer.getByte()
                const ADDR = [buffer.getByte(),buffer.getByte(),buffer.getByte(),buffer.getByte()].join('.')
                const PORT = buffer.getShort()
                console.log('[socks5] RESPONSE:%j ADDR_TYPE:%j ADDR:%s PORT:%j',RESPONSE,ADDR_TYPE,ADDR,PORT)
                this.step = STEP.CONNECTED
                this.on_connect()
            }
        })
        this.client.connect(option.proxy_port,option.proxy_host,()=>{
            let buffer = new ByteBuffer(1024)
            buffer.putByte(5)
            buffer.putByte(1)
            buffer.putByte(2)
            this.client.write(buffer.getBuffer())
        })

    }
    write(data){
        if(this.step === STEP.CONNECTED)
            this.client.write(data)
    }
}

module.exports = loopSocsk5
